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
import {
    notification,
    message
} from 'antd';
const urls = {
    get: APIHOST + 'room/queryRoomInfo',
    getRoomDetail: APIHOST + 'user/queryAllUsers',
    getRoomImgDetailL: APIHOST + 'room/queryRoomImgByRoomOrder',
    delRoomPhoto: APIHOST + 'room/deleteRoomPhoto',
    update: APIHOST + 'room/updateStatus',
    add: APIHOST + 'room/addRoomInfo',
    getRoomComments: APIHOST + 'user/queryComments',
};

const path = name => `app/pages/roommanage/${name}`;
const successError = (type, msg) => {
    notification[type]({
        message: msg
    });
};
const success = function () {
    message.success('操作成功！');
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
                return { ...state,
                    ...action.payload
                };
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
            isDetailShow: false,
        },
        handlers: {
            changeUiStatus(state, action) {
                return { ...state,
                    ...action.payload
                };
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
    roomDetail: {
        data: [],
        handlers: {
            getRoomDetail(state, action) {
                return action.payload;
            }
        }
    },
    roomImgDetail: {
        data: {
            image: [],
        },
        handlers: {
            getRoomImgDetail(state, action) {
                return action.payload;
            }
        }
    },
    roomComments: {
        data: [],
        handlers: {
            getRoomComments(state, action) {
                return action.payload;
            }
        }
    },
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
            dispatch(actions.changeUiStatus({
                isLoading: true
            }));
            // 下面的请求和结果返回需要根据接口来实现
            let result = await request(urls.get + formatGetParams(getState));
            dispatch(actions.get(result.docs));
            dispatch(actions.changePagination(result.pagination));
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({
                isLoading: false
            }));
        }
    };
};

// 修改房间状态
export const asyncUpdate = content => {
    return async dispatch => {
        try {
            dispatch(actions.changeUiStatus({
                isLoading: true
            }));
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
            if (result.ok == 1) {
                dispatch(actions.update(result.dbResult.changeNewRoom[0]));
                successError('success', '操作成功！');
            } else {
                successError('error', '操作失败，请重试！');
            }
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({
                isLoading: false
            }));
        }
    };
};

// 查询房间住户
export const asyncGetRoomDetail = roomOrder => {
    return async (dispatch, getState) => {
        try {
            // 下面的请求和结果返回需要根据接口来实现
            let result = await request(urls.getRoomDetail + '?body=' + encodeURIComponent(JSON.stringify({
                querys: {
                    roomOrder: roomOrder
                },
                sort: {
                    key: 'roomOrder',
                    order: 'ascend'
                },
                pagination: {
                    current: 1,
                    pageSize: 20
                }
            })));
            if (result.docs.length > 0) {
                dispatch(actions.getRoomDetail(result.docs));
            } else {
                dispatch(actions.getRoomDetail([]));
            }
            dispatch(actions.changeUiStatus({
                isLoading: true
            }));
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({
                isLoading: false
            }));
        }
    };
};

// 查询房间图片
export const asyncGetRoomImgDetail = roomOrder => {
    return async (dispatch, getState) => {
        try {
            // 下面的请求和结果返回需要根据接口来实现
            let result = await request(urls.getRoomImgDetailL + '?body=' + encodeURIComponent(JSON.stringify({
                roomOrder: roomOrder,
            })));
            if (result.docs.image != null) {
                dispatch(actions.getRoomImgDetail(result.docs));
            } else {
                let data = {
                    image: [],
                    roomOrder: result.docs.roomOrder,
                    roomId: result.docs.roomId,
                    commentNum: result.docs.commentNum,
                }
                dispatch(actions.getRoomImgDetail(data));
            }
            
            dispatch(actions.changeUiStatus({
                isLoading: true
            }));
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({
                isLoading: false
            }));
        }
    };
};

// 更改房间图片
export const asyncGetRoomImg = roomOrder => {
    return async (dispatch, getState) => {
        try {
            dispatch(actions.changeUiStatus({
                isLoading: true
            }));
            // 下面的请求和结果返回需要根据接口来实现
            await sleep(300)
            let result = await request(urls.getRoomImgDetailL + '?body=' + encodeURIComponent(JSON.stringify({
                roomOrder: roomOrder,
            })));
            dispatch(actions.getRoomImgDetail(result.docs));
            success();
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
                id: id
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


// 添加房间信息
export const asyncAdd = contents => {
    console.log(contents)
    return async( dispatch, getState)=> {
        try {
            dispatch(actions.changeUiStatus({
                isLoading: true
            }));
            // 下面的请求和结果返回需要根据接口来实现
            let result = await request(urls.add + '?body=' + encodeURIComponent(JSON.stringify({
                roomOrder: contents[0].roomOrder,
                direction: contents[0].direction,
                status: contents[0].status,
                totalNum: contents[0].totalNum,
                creator: getState().user.info.name,
            })));
            if ( result.code == 0) {
                dispatch(actions.add(result.addNew));
                successError('success', '添加成功！');
            } else {
                successError('error', result.msg);
            }      
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({
                isLoading: false
            }));
        }
    };
};


// 删除房间图片
export const asyncDelRoomPhoto = (newurl, roomOrder) => {
    return async dispatch => {
        try {
            dispatch(actions.changeUiStatus({
                isLoading: true
            }));
            // 下面的请求和结果返回需要根据接口来实现
            let newurlStr = ''
            if (newurl.length > 0 ) {
                newurlStr = newurl.join();
            } else {
                newurlStr = null;
            }
             
            let result = await request(urls.delRoomPhoto + '?body=' + encodeURIComponent(JSON.stringify({
                image: newurlStr,
                roomOrder: roomOrder,
            })));
            if (result.status == '删除成功') {
                success();
            }
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({
                isLoading: false
            }));
        }
    };
};

// 查询房间评论
export const asyncGetRoomComments = roomOrder => {
    return async dispatch => {
        try {
            dispatch(actions.getRoomComments([]));
            dispatch(actions.changeUiStatus({ isLoading: true }));
            let result = await request(
                urls.getRoomComments +
                '?body=' +
                encodeURIComponent(
                    JSON.stringify({
                        querys: { 'roomOrder': roomOrder },
                        sort: {},
                        pagination: { 'current': 1, 'pageSize': 10 },
                    }),
                ),
            );
            console.log(result);
            if (result.docs) {
                dispatch(actions.getRoomComments(result.docs));
            } else {
                dispatch(actions.getRoomComments([]));
            }
           
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};