import { createReducers, createActions, request, sleep } from '../../utils/';
import { combineReducers } from 'redux';
import { APIHOST } from '../../config';

const urls = {
    get: APIHOST + 'room/queryRoomInfo',
    del: APIHOST + '',
    update: APIHOST + 'room/updateStatus',
    add: APIHOST + '',
};

const path = name => `app/pages/roommanage/${name}`;

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
                return state.map(item => (item.roomOrder === action.payload.roomOrder ? action.payload : item));
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
    searchValues: {
        data: {},
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
    currentRoomDetail: {
        data: {},
        handlers: {
            getcurrentRoomDetail(state, action) {
                return action.payload;
            }
        }
    }
};

export const actions = createActions(models, path);

export default combineReducers(createReducers(models, path));

const formatGetParams = getState => {
    const state = getState().roommanage;
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
    return async (dispatch, getState) => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            // 下面的请求和结果返回需要根据接口来实现
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

// 修改房间状态
export const asyncUpdate = content => {
    console.log(content)
    return async dispatch => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            // 下面的请求和结果返回需要根据接口来实现
            let result = await request(
                urls.update +
                '?body=' +
                encodeURIComponent(
                    JSON.stringify({
                        roomOrder: content.roomOrder,
                        status: content.status,
                    }),
                ),
            );
            console.log(result)
            dispatch(actions.update(result.dbResult.changeNewRoom[0]));
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
