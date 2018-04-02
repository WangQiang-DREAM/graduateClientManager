import { createReducers, createActions, request, sleep } from '../../utils/';
import { combineReducers } from 'redux';
import { APIHOST } from '../../config';
import { Select } from 'antd';
import { notification } from 'antd';

const urls = {
    get: APIHOST + 'videoTag/queryVideoInfo',
    searchVideo: APIHOST + 'videoTag/queryVideoInfo',
    update: APIHOST + 'videoTag/changeTags',
    returnAlltags: APIHOST + 'videoTag/returnAlltags',
    downLoad: APIHOST + 'videoTag/downLoad',
    queryModifierNewtags: APIHOST + 'videoTag/queryModifierNewtags',
};

const path = name => `app/pages/videomanage/${name}`;

const openNotificationWithSuccess = type => {
    notification[type]({
        message: '成功',
        description: '操作已成功！',
    });
};
const openNotificationWithFail = type => {
    notification[type]({
        message: '失败',
        description: '操作失败！',
    });
};
const downloadError = (type, msg, desc) => {
    notification[type]({
        message: msg,
        description: desc,
    });
};
const models = {
    list: {
        data: [],
        handlers: {
            get(state, action) {
                return action.payload;
            },
            add(state, action) {
                return [...action.payload, ...state];
            },
            del(state, action) {
                return state.filter(item => item.id !== action.payload);
            },
            update(state, action) {
                return state.map(item => (item.guid === action.payload.guid ? action.payload : item));
            },
        },
    },
    pagination: {
        data: {
            current: 1,
            total: 0,
            pageSize: 10,
        },
        handlers: {
            changePagination(state, action) {
                return { ...state, ...action.payload };
            },
        },
    },
    playVideo: {
        data: '',
        handlers: {
            getVideo(state, action) {
                return action.payload;
            },
        },
    },
    challengeName: {
        data: '',
        handlers: {
            getChallengeName(state, action) {
                return action.payload;
            },
        },
    },
    updateTag: {
        data: '',
        handlers: {
            getTag(state, action) {
                return action.payload;
            },
        },
    },
    updateChallengeVid: {
        data: '',
        handlers: {
            getChallengeVid(state, action) {
                return action.payload;
            },
        },
    },
    searchValues: {
        data: {},
        handlers: {
            changeSearchValues(state, action) {
                return action.payload;
            },
        },
    },
    checkTags: {
        data: [],
        handlers: {
            getGheckTags(state, action) {
                return action.payload;
            },
        },
    },
    getUid: {
        data: {},
        handlers: {
            getSearchUid(state, action) {
                return action.payload;
            },
        },
    },
    oldvideoTags: {
        data: [],
        handlers: {
            getoldVideoTags(state, action) {
                return action.payload;
            },
        },
    },
    sortValues: {
        data: {},
        handlers: {
            changeSort(state, action) {
                return action.payload;
            },
        },
    },
    uiStatus: {
        data: {
            isLoading: false,
            isViewShow: false,
            isAddShow: false,
            isAddPlusShow: false,
            isUpdateShow: false,
        },
        handlers: {
            changeUiStatus(state, action) {
                return { ...state, ...action.payload };
            },
        },
    },
    currentSelectId: {
        data: '',
        handlers: {
            changeCurrentSelectId(state, action) {
                return action.payload;
            },
        },
    },
};

export const actions = createActions(models, path);

export default combineReducers(createReducers(models, path));

const formatGetParams = getState => {
    const state = getState().videomanage;
    const params = {
        querys: {
            ...state.searchValues,
        },
        sort: {
            ...state.sortValues,
        },
        pagination: {
            current: state.pagination.current,
            pageSize: state.pagination.pageSize,
        },
    };
    return '?body=' + encodeURIComponent(JSON.stringify(params));
};

// 页面渲染方法
export const asyncGet = () => {
    return async (dispatch, getState) => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            let result = await request(urls.get + formatGetParams(getState));
            dispatch(actions.get(result.docs));
            dispatch(actions.changePagination(result.pagination));
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};

export const asyncSearchVideo = () => {
    return async (dispatch, getState) => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            // 下面的请求和结果返回需要根据接口来实现
            let result = await request(urls.searchVideo + formatGetParams(getState));
            dispatch(actions.get(result.docs));
            dispatch(actions.changePagination(result.pagination));
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};

// 修改挑战
export const asyncUpdate = content => {
    return async (dispatch, getState) => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            // 下面的请求和结果返回需要根据接口来实现
            let result = await request(
                urls.update +
                    '?body=' +
                    encodeURIComponent(
                        JSON.stringify({
                            guid: content.guid,
                            newtags: content.newtags,
                            modifier: getState().user.info.name,
                        }),
                    ),
            );
            if (result.ok === 1) {
                content.modifier = getState().user.info.name;
                openNotificationWithSuccess('success');
                dispatch(actions.update(content));
            }
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};

export const asyncVagueGetTag = value => {
    return async dispatch => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            let result = await request(
                urls.returnAlltags +
                    '?body=' +
                    encodeURIComponent(
                        JSON.stringify({
                            querys: { title: value },
                            sort: {},
                            pagination: { current: 1, pageSize: 300 },
                        }),
                    ),
            );
            dispatch(actions.getoldVideoTags(result.docs));
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};
export const asyncqueryModifierNewtags = value => {
    return async dispatch => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            let result = await request(
                urls.queryModifierNewtags + '?body=' + encodeURIComponent(JSON.stringify({ modifier: value.modifier })),
            );
            if (result.data.length > 0) {
                let tagData = [];
                for (let i = 0; i < result.data.length; i++) {
                    let queryParms = ['modifyTime'];
                    let queryRules = {
                        newtags: result.data[i],
                        modifier: value.modifier,
                    };
                    queryParms
                        .map(param => {
                            if (value[param]) {
                                return {
                                    key: param,
                                    value: value[param],
                                };
                            } else {
                                return null;
                            }
                        })
                        .forEach(data => {
                            if (data) {
                                queryRules[data.key] = data.value;
                            }
                        });
                    let total = await request(
                        urls.get +
                            '?body=' +
                            encodeURIComponent(
                                JSON.stringify({
                                    querys: queryRules,
                                    sort: {},
                                    pagination: { current: 1, pageSize: 300 },
                                }),
                            ),
                    );
                    let data = {
                        key: result.data[i],
                        title: result.data[i],
                        description: total.pagination.total,
                        disabled: !total.pagination.total,
                    };
                    tagData.push(data);
                }
                dispatch(actions.getGheckTags(tagData));
            }
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};

export const asyncDownLoad = (value, targetData, modifyTime) => {
    return async dispatch => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            for (let i = 0; i < targetData.length; i++) {
                let result = await request(
                    urls.downLoad +
                        '?body=' +
                        encodeURIComponent(
                            JSON.stringify({
                                modifier: value.modifier,
                                newtags: targetData[i],
                                modifyTime: modifyTime,
                            }),
                        ),
                );
                if (result.code === 0) {
                    download(result.data);
                } else {
                    downloadError('error', '下载数据失败', '请确保已经选择数据日期范围以及标签!');
                }
            }
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};
function download(result) {
    let getDate = new Date();
    let currentDate = `${getDate.getFullYear()}0${getDate.getMonth() + 1}${getDate.getDate()}`;
    JSonToCSV.setDataConver({
        data: result,
        fileName: result[0].newtags + '-' + currentDate,
        columns: {
            title: ['videoPlayUrl'],
            key: ['videoPlayUrl'],
            formatter: function(n, v) {
                if (n === 'amont' && !isNaN(Number(v))) {
                    v = v + '';
                    v = v.split('.');
                    v[0] = v[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); // 千分位的设置
                    return v.join('.');
                }
                if (n === 'proportion') return v + '%';
            },
        },
    });
}
export const JSonToCSV = {
    /*
          * obj是一个对象，其中包含有：
          * ## data 是导出的具体数据
          * ## fileName 是导出时保存的文件名称 是string格式
          * ## showLabel 表示是否显示表头 默认显示 是布尔格式
          * ## columns 是表头对象，且title和key必须一一对应，包含有
              title:[], // 表头展示的文字
              key:[], // 获取数据的Key
              formatter: function() // 自定义设置当前数据的 传入(key, value)
          */
    setDataConver: function(obj) {
        var data = obj['data'],
            ShowLabel = typeof obj['showLabel'] === 'undefined' ? true : obj['showLabel'],
            fileName = (obj['fileName'] || 'UserExport') + '.csv',
            columns = obj['columns'] || {
                title: [],
                key: [],
                formatter: undefined,
            };
        var ShowLabel = typeof ShowLabel === 'undefined' ? true : ShowLabel;
        var row = '',
            CSV = '',
            key;
        // 如果要现实表头文字
        if (ShowLabel) {
            // 如果有传入自定义的表头文字
            if (columns.title.length) {
                columns.title.map(function(n) {
                    row += n + ',';
                });
            } else {
                // 如果没有，就直接取数据第一条的对象的属性
                for (key in data[0]) row += key + ',';
            }
            row = row.slice(0, -1); // 删除最后一个,号，即a,b, => a,b
            CSV += row + '\r\n'; // 添加换行符号
        }
        // 具体的数据处理
        data.map(function(n) {
            row = '';
            // 如果存在自定义key值
            if (columns.key.length) {
                columns.key.map(function(m) {
                    row +=
                        '"' +
                        (typeof columns.formatter === 'function' ? columns.formatter(m, n[m]) || n[m] : n[m]) +
                        '",';
                });
            } else {
                for (key in n) {
                    row +=
                        '"' +
                        (typeof columns.formatter === 'function' ? columns.formatter(key, n[key]) || n[key] : n[key]) +
                        '",';
                }
            }
            row.slice(0, row.length - 1); // 删除最后一个,
            CSV += row + '\r\n'; // 添加换行符号
        });
        if (!CSV) return;
        this.SaveAs(fileName, CSV);
    },
    SaveAs: function(fileName, csvData) {
        var bw = this.browser();
        if (!bw['edge'] || !bw['ie']) {
            var alink = document.createElement('a');
            alink.id = 'linkDwnldLink';
            alink.href = this.getDownloadUrl(csvData);
            document.body.appendChild(alink);
            var linkDom = document.getElementById('linkDwnldLink');
            linkDom.setAttribute('download', fileName);
            linkDom.click();
            document.body.removeChild(linkDom);
        }
    },
    getDownloadUrl: function(csvData) {
        var _utf = '\uFEFF'; // 为了使Excel以utf-8的编码模式，同时也是解决中文乱码的问题
        if (window.Blob && window.URL && window.URL.createObjectURL) {
            var csvData = new Blob([_utf + csvData], {
                type: 'text/csv',
            });
            return URL.createObjectURL(csvData);
        }
        // return 'data:attachment/csv;charset=utf-8,' + _utf + encodeURIComponent(csvData);
    },
    browser: function() {
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.indexOf('edge') !== -1 ? (Sys.edge = 'edge') : ua.match(/rv:([\d.]+)\) like gecko/))
            ? (Sys.ie = s[1])
            : (s = ua.match(/msie ([\d.]+)/))
              ? (Sys.ie = s[1])
              : (s = ua.match(/firefox\/([\d.]+)/))
                ? (Sys.firefox = s[1])
                : (s = ua.match(/chrome\/([\d.]+)/))
                  ? (Sys.chrome = s[1])
                  : (s = ua.match(/opera.([\d.]+)/))
                    ? (Sys.opera = s[1])
                    : (s = ua.match(/version\/([\d.]+).*safari/)) ? (Sys.safari = s[1]) : 0;
        return Sys;
    },
};
