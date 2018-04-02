import { createReducers, createActions, request } from '../../utils/';
import { combineReducers } from 'redux';
import { APIHOST } from '../../config';
import { notification } from 'antd';
import user from '../../common/models/user';
const urls = {
    get: APIHOST + 'videoTag/queryVideoInfo',
    returnAlltags: APIHOST + 'videoTag/returnAlltags',
    update: APIHOST + 'videoTag/changeTags',
    add: APIHOST + 'videoTag/addTag',
    queryUser: APIHOST + 'user/queryUserName',
};

const path = name => `app/pages/videotag/${name}`;

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
                return state.map(item => (item.id === action.payload.id ? action.payload : item));
            },
        },
    },
    pagination: {
        data: {
            current: 1,
            total: 0,
            pageSize: 1,
        },
        handlers: {
            changePagination(state, action) {
                return { ...state, ...action.payload };
            },
        },
    },
    searchValues: {
        data: {
            modifier: '标签审核小助手',
        },
        handlers: {
            changeSearchValues(state, action) {
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
    videoData: {
        data: {
            tags: [],
        },
        handlers: {
            getVideoData(state, action) {
                return action.payload;
            },
        },
    },
    videoTags: {
        data: {},
        handlers: {
            getVideoTags(state, action) {
                return action.payload;
            },
        },
    },
    videoTagsPagination: {
        data: {},
        handlers: {
            getVideoTagsPagination(state, action) {
                return action.payload;
            },
        },
    },
    oldvideoTags: {
        data: {},
        handlers: {
            getoldVideoTags(state, action) {
                return action.payload;
            },
        },
    },
    selectVideoTags: {
        data: [
            {
                tag: '暂不处理',
                select: false,
            },
        ],
        handlers: {
            getSelectVideoTags(state, action) {
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
    checkTags: {
        data: {},
        handlers: {
            getCheckTags(state, action) {
                return action.payload;
            },
        },
    },
    modifierInfo: {
        data: [],
        handlers: {
            getModifierInfo(state, action) {
                return action.payload;
            },
        },
    },
    changedTagsTotal: {
        data: {
            todayTotal: 0,
            total: 0,
        },
        handlers: {
            getChangedTagsTotal(state, action) {
                return action.payload;
            },
        },
    },
};

export const actions = createActions(models, path);

export default combineReducers(createReducers(models, path));
const openNotificationWithIcon = type => {
    notification[type]({
        message: '成功',
        description: '修改成功！',
    });
};
const openNotificationWithadd = type => {
    notification[type]({
        message: '成功',
        description: '添加成功！',
    });
};
const receiveError = type => {
    notification[type]({
        message: '失败',
        description: '暂无数据！',
    });
};
const formatGetParams = getState => {
    const state = getState().videotag;
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
const getVideoInfo = (getState, newtags) => {
    const state = getState().videotag;
    const params = {
        guid: state.videoData.guid,
        creator: state.videoData.creator,
        modifier: state.videoData.modifier,
        newtags: [newtags],
        videoPlayUrl: state.videoData.videoPlayUrl,
        _id: state.videoData._id,
    };
    return params;
};

export const asyncGet = value => {
    return async dispatch => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            let result = await request(
                urls.returnAlltags +
                    '?body=' +
                    encodeURIComponent(
                        JSON.stringify({
                            querys: { 'title': value },
                            sort: {},
                            pagination: { 'current': 1, 'pageSize': 100 },
                        }),
                    ),
            );
            dispatch(actions.getVideoTags(result.docs));
            dispatch(actions.getVideoTagsPagination(result.pagination));
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
export const asyncGetVIdeo = () => {
    return async (dispatch, getState) => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            // 下面的请求和结果返回需要根据接口来实
            let result = await request(urls.get + formatGetParams(getState));
            if (result.docs.length === 0) {
                receiveError('warning');
            } else {
                dispatch(actions.getVideoData(result.docs[0]));
                dispatch(actions.getCheckTags(result.docs[0]));
                dispatch(actions.changePagination(result.pagination));
            }
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};

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
                let video = getVideoInfo(getState, content.newtags);
                dispatch(actions.getCheckTags(video));
                openNotificationWithIcon('success');
            }
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};

export const asyncAdd = contents => {
    return async dispatch => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            // 下面的请求和结果返回需要根据接口来实现
            let result = await request(
                urls.add + '?body=' + encodeURIComponent(JSON.stringify({ title: contents[0].title })),
            );
            console.log(result);
            openNotificationWithadd('success');
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};

// 查询操作人
export const asyncQueryUser = () => {
    return async dispatch => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            // 下面的请求和结果返回需要根据接口来实现
            let result = await request(urls.queryUser);
            dispatch(actions.getModifierInfo(result));
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};

export const asyncgetChangedTagsTotal = () => {
    return async (dispatch, getState) => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            let modifier =  getState().videotag.searchValues.modifier;
            if (modifier === '标签审核小助手' || modifier === '') {
                modifier = getState().user.info.name;
            }
            // 下面的请求和结果返回需要根据接口来实现
            let result = await request(
                urls.get +
                    '?body=' +
                    encodeURIComponent(
                        JSON.stringify({
                            querys: { modifier: modifier },
                            sort: {},
                            pagination: { current: 1, pageSize: 1 },
                        }),
                    ),
            );
            let todaystartTime = new Date().setHours(0, 0, 0, 0);
            let todayendTime = todaystartTime + 86400000;
            let todaymodifyTime = [ todaystartTime, todayendTime ];
            let result1 = await request(
                urls.get +
                    '?body=' +
                    encodeURIComponent(
                        JSON.stringify({
                            querys: { modifier: modifier, modifyTime: todaymodifyTime},
                            sort: {},
                            pagination: { current: 1, pageSize: 1 },
                        }),
                    ),
            );
            if (result.pagination.total !== '' && result1.pagination.total !== '' ) {
                let total  = {
                    todayTotal: result1.pagination.total,
                    total: result.pagination.total,
                }
                dispatch(actions.getChangedTagsTotal(total));
            }


        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};
