import {
    createReducers,
    createActions,
    request,
    sleep
} from '../../utils/';
import {
    combineReducers
} from 'redux';
import {
    APIHOST
} from '../../config';

const urls = {
    get: APIHOST + '',
    getLogs: APIHOST + 'user/queryOperateLogs',
    del: APIHOST + 'booksdel',
    update: APIHOST + 'booksupdate',
    add: APIHOST + 'booksadd'
};

const path = name => `app/pages/home/${name}`;

const models = {
    list: {
        data: [],
        handlers: {
            get(state, action) {
                return action.payload;
            },
            add(state, action) {
                return [
                    ...action.payload,
                    ...state
                ];
            },
            del(state, action) {
                return state.filter(item => item.id !== action.payload);
            },
            update(state, action) {
                return state.map(item => (item.id === action.payload.id ?
                    action.payload :
                    item));
            }
        }
    },
    pagination: {
        data: {
            current: 1,
            total: 0,
            pageSize: 20
        },
        handlers: {
            changePagination(state, action) {
                return {
                    ...state,
                    ...action.payload
                };
            }
        }
    },
    searchValues: {
        data: {},
        handlers: {
            changeSearchValues(state, action) {
                return action.payload;
            }
        }
    },
    sortValues: {
        data: {},
        handlers: {
            changeSort(state, action) {
                return action.payload;
            }
        }
    },
    uiStatus: {
        data: {
            isLoading: false,
            isViewShow: false,
            isAddShow: false,
            isAddPlusShow: false,
            isUpdateShow: false
        },
        handlers: {
            changeUiStatus(state, action) {
                return {
                    ...state,
                    ...action.payload
                };
            }
        }
    },
    currentSelectId: {
        data: '',
        handlers: {
            changeCurrentSelectId(state, action) {
                return action.payload;
            }
        }
    },
    logsData: {
        data: [],
        handlers: {
            getLogsData(state, action) {
                return action.payload;
            }
        }
    }
};

export const actions = createActions(models, path);

export default combineReducers(createReducers(models, path));

const formatGetParams = getState => {
    const state = getState().home;
    const params = {
        querys: {
            ...state.searchValues
        },
        sort: {
            ...state.sortValues
        },
        pagination: {
            current: state.pagination.current,
            pageSize: state.pagination.pageSize
        }
    };
    return '?body=' + encodeURIComponent(JSON.stringify(params));
};

export const asyncGet = () => {
    return async (dispatch, getState) => {
        try {
            dispatch(actions.changeUiStatus({
                isLoading: true
            }));
            // 下面的请求和结果返回需要根据接口来实现
            // let result = await request(urls.get + formatGetParams(getState));
            // dispatch(actions.get(result.docs));
            // dispatch(actions.changePagination(result.pagination));
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({
                isLoading: false
            }));
        }
    };
};

export const asyncGetLogs = () => {
    return async dispatch => {
        try {
            dispatch(actions.changeUiStatus({
                isLoading: true
            }));
            // 下面的请求和结果返回需要根据接口来实现
            let result = await request(urls.getLogs + '?body=' + encodeURIComponent(JSON.stringify({
                querys: {},
                sort: {
                    'key': 'operateTime',
                    'order': 'descend',
                },
                pagination: {
                    current: 1,
                    pageSize: 6
                },
            })));
            dispatch(actions.getLogsData(result.docs))
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({
                isLoading: false
            }));
        }
    };
};


export const asyncDel = id => {
    return async dispatch => {
        try {
            dispatch(actions.changeUiStatus({
                isLoading: true
            }));
            // 下面的请求和结果返回需要根据接口来实现
            let result = await request(urls.del + '?body=' + encodeURIComponent(JSON.stringify({

            })));
            dispatch(actions.del(result.id));
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({
                isLoading: false
            }));
        }
    };
};

export const asyncUpdate = content => {
    return async dispatch => {
        try {
            dispatch(actions.changeUiStatus({
                isLoading: true
            }));
            // 下面的请求和结果返回需要根据接口来实现
            let updateContent = await request(urls.update, 'POST', content);
            await sleep(1000);
            dispatch(actions.update(updateContent));
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({
                isLoading: false
            }));
        }
    };
};

export const asyncAdd = contents => {
    return async dispatch => {
        try {
            dispatch(actions.changeUiStatus({
                isLoading: true
            }));
            // 下面的请求和结果返回需要根据接口来实现
            let newContents = await request(urls.add, 'POST', contents);
            await sleep(1000);
            dispatch(actions.add(newContents));
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({
                isLoading: false
            }));
        }
    };
};