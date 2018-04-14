import { createReducers, createActions, request, sleep } from '../../utils/';
import { combineReducers } from 'redux';
import { notification } from 'antd';
import { APIHOST } from '../../config';

const urls = {
    get: APIHOST + 'user/queryAllManager',
    del: APIHOST + 'user/delManager',
    update: APIHOST + '',
    add: APIHOST + 'user/addManager',
};

const path = name => `app/pages/usermanage/${name}`;

const addNotification = (type, msg) => {
    notification[type]({
        message: msg,
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
                return [action.payload, ...state];
            },
            del(state, action) {
                return state.filter(item => item.uid !== action.payload);
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
};

export const actions = createActions(models, path);

export default combineReducers(createReducers(models, path));

const formatGetParams = getState => {
    const state = getState().usermanage;
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

export const asyncDel = uid => {
    return async dispatch => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            // 下面的请求和结果返回需要根据接口来实现
            let result = await request(urls.del + '?body=' + encodeURIComponent(JSON.stringify({ 'uid': uid })));
            if (result.ok === 1) {
                addNotification('success', '删除用户成功');
                dispatch(actions.del(uid));
            } else {
                addNotification('error', '删除用户失败, 请重试!');
            }
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
            let newContents = await request(
                urls.add + '?body={"name":"' + contents[0].name + '","username":"' + contents[0].username + '","roles":"' + contents[0].roles + '"}',
            );
            if (newContents.code === 0) {
                addNotification('success', '添加管理员成功');
                dispatch(actions.add(newContents.addNew));
            } else if (newContents.code === 1) {
                addNotification('warning', '管理员已存在，不需要重复添加');
            } else if (newContents.code === 500) {
                addNotification('error', '添加管理员失败，请重试!');
            }
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};
