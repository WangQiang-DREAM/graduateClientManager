import { createReducers, createActions, request, sleep } from '../../utils/';
import { combineReducers } from 'redux';
import { APIHOST } from '../../config';
import moment from 'moment';
const urls = {
    get: APIHOST + 'videoTag/queryVideoInfo',
    del: APIHOST + 'booksdel',
    update: APIHOST + 'booksupdate',
    add: APIHOST + 'booksadd',
    queryUser: APIHOST + 'user/queryUserName',
};

const path = name => `app/pages/videohandle/${name}`;

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
            pageSize: 20,
        },
        handlers: {
            changePagination(state, action) {
                return { ...state, ...action.payload };
            },
        },
    },
    searchValues: {
        data: {
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
    modifierInfo: {
        data: [],
        handlers: {
            getModifierInfo(state, action) {
                return action.payload;
            },
        },
    },
    perData: {
        data: [],
        handlers: {
            getPerData(state, action) {
                return action.payload;
            },
        },
    },
    totalData: {
        data: [],
        handlers: {
            getTotalData(state, action) {
                return action.payload;
            },
        },
    },
    weekData: {
        data: [],
        handlers: {
            getWeekData(state, action) {
                return action.payload;
            },
        },
    }
};

export const actions = createActions(models, path);

export default combineReducers(createReducers(models, path));

const formatGetParams = getState => {
    const state = getState().videohandle;
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

export const asyncGet = () => {
    return async (dispatch, getState ) => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            let modifystartTime =  getState().videohandle.searchValues.modifyTime ? Date.parse(moment( getState().videohandle.searchValues.modifyTime ).format('YYYY-MM-DD')) + 60 * 60 * 1000 : new Date().setHours(9, 0, 0, 0);
            let modifier =  getState().videohandle.searchValues.modifier ? getState().videohandle.searchValues.modifier :  getState().user.info.name;  
            let perdata = [];  
            for (let i = 1; i < 13; i++) {
                let modifyTime = [ modifystartTime + 60 * 60 * 1000 * ( i - 1 ), modifystartTime + 60 * 60 * 1000 * i ];
                let result = await request(
                    urls.get +
                        '?body=' +
                        encodeURIComponent(
                            JSON.stringify({
                                querys: { modifier: modifier, modifyTime: modifyTime},
                                sort: {},
                                pagination: { current: 1, pageSize: 1 },
                            }),
                        ),
                );
                perdata.push(result.pagination.total);
            }
            dispatch(actions.getPerData(perdata));
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};
export const asyncGetTotalData = () => {
    return async (dispatch, getState ) => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            // 下面的请求和结果返回需要根据接口来实现
            let totalmodifystartTime =  getState().videohandle.searchValues.modifyTime ? Date.parse(moment( getState().videohandle.searchValues.modifyTime ).format('YYYY-MM-DD')) - 8 * 60 * 60 * 1000 : new Date().setHours(0, 0, 0, 0);
            let totalmodifyendTime = totalmodifystartTime + 60 * 60 * 1000 * 24;
            let totalModifytime = [totalmodifystartTime, totalmodifyendTime]
            let totaldata = [];
            let modifierData =  getState().videohandle.modifierInfo;
            for (let i = 0; i < modifierData.length; i++) {
                let work = {};
                let result1 = await request(
                    urls.get +
                        '?body=' +
                        encodeURIComponent(
                            JSON.stringify({
                                querys: { modifier: modifierData[i].username, modifyTime: totalModifytime},
                                sort: {},
                                pagination: { current: 1, pageSize: 1 },
                            }),
                        ),
                );
                work = {
                    x: modifierData[i].username,
                    y: result1.pagination.total,
                };
                totaldata.push(work);
            }
            dispatch(actions.getTotalData(totaldata));
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};
export const asyncGetWeekData = () => {
    return async (dispatch, getState ) => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            // 下面的请求和结果返回需要根据接口来实现
            const modifier =  getState().videohandle.searchValues.modifier ? getState().videohandle.searchValues.modifier : getState().user.info.name; 
            let weekData = [];
            let date = new Date().setHours(6, 0, 0, 0);
            const weekDay = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];  
            let dateStr = '';  
            for (let i = 0; i < 5; i++) { 
                date = date -  60 * 60 * 1000 * 24; 
                let currentday = moment(date).format('YYYY-MM-DD');
                dateStr = ( new Date(Date.parse(currentday.replace(/-/g, '/')))).getDay();
                if (dateStr == 0) {
                    date = date - 60 * 60 * 1000 * 24 * 2;
                } else if (dateStr == 6) {
                    date = date - 60 * 60 * 1000 * 24;
                } else {
                    date = date;
                };
                let weekmodifyTime = [date, date + 60 * 60 * 1000 * 16]
                let result2 = await request(
                    urls.get +
                        '?body=' +
                        encodeURIComponent(
                            JSON.stringify({
                                querys: { modifier: modifier, modifyTime: weekmodifyTime},
                                sort: {},
                                pagination: { current: 1, pageSize: 1 },
                            }),
                        ),
                );
                let xcoo = moment(date).format('YYYY-MM-DD');
                let weekdata = {
                    x: xcoo + '' + (weekDay[( new Date(Date.parse(xcoo.replace(/-/g, '/')))).getDay()]),
                    y: result2.pagination.total,
                };
                weekData.push(weekdata);   
            }
            dispatch(actions.getWeekData(weekData));
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};
export const asyncDel = id => {
    return async dispatch => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            // 下面的请求和结果返回需要根据接口来实现
            let result = await request(urls.del + '?body=' + encodeURIComponent(JSON.stringify({ id: id })));
            dispatch(actions.del(result.id));
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};

export const asyncUpdate = content => {
    return async dispatch => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            // 下面的请求和结果返回需要根据接口来实现
            let updateContent = await request(urls.update, 'POST', content);
            await sleep(1000);
            dispatch(actions.update(updateContent));
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
            let newContents = await request(urls.add, 'POST', contents);
            await sleep(1000);
            dispatch(actions.add(newContents));
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};

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