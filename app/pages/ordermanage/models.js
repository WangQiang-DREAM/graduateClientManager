import { createReducers, createActions, request, sleep } from '../../utils/';
import { combineReducers } from 'redux';
import { APIHOST } from '../../config';
import {
    notification,
    message
} from 'antd';
const urls = {
    get: APIHOST + 'appo/queryAppoInfo',
    getRoom: APIHOST + 'room/queryRoomInfo',
    getManager: APIHOST + 'user/queryAllManager',
    changeAppoStatus: APIHOST + 'appo/changeAppoStatus',
    changeRoomUserNum: APIHOST + 'room/changeRoomUserNum',
    del: APIHOST + 'booksdel',
    update: APIHOST + 'user/updateUserInfo',
    add: APIHOST + 'booksadd',
};

const path = name => `app/pages/ordermanage/${name}`;
const successError = (type, msg) => {
    notification[type]({
        message: msg
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
                return state.map(item => (item.appoId === action.payload.appoId ? action.payload : item));
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
        data: {
            
        },
        handlers: {
            changeSearchValues(state, action) {
                return action.payload;
            },
        },
    },
    sortValues: {
        data: { 'key': 'appoTime', 'order': 'descend' },
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
    manager: {
        data: [],
        handlers: {
            getManager(state, action) {
                return action.payload;
            },
        },
    },
    roomNum: {
        data: [],
        handlers: {
            getroomNum(state, action) {
                return action.payload;
            },
        },
    },
    currentAppo: {
        data: {},
        handlers: {
            changeCurrentAppo(state, action) {
                return action.payload;
            },
        },
    },
    AppoNum: {
        data: {
            waitAppo: [],
            currentAppo: [],
            readyAppo: [],
        },
        handlers: {
            getAppoNum(state, action) {
                return action.payload;
            },
        },
    },
};

export const actions = createActions(models, path);

export default combineReducers(createReducers(models, path));

const formatGetParams = getState => {
    const state = getState().ordermanage;
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
            // const allAppo = result.docs;
            // const waitAppo = allAppo.filter(elem => {
            //     if (elem.status === '0' && elem.receptionist === getState().user.info.name) {
            //         return elem;
            //     }
            // });
            // const currentAppo = allAppo.filter(elem => {
            //     if (elem.status === '1' && elem.receptionist === getState().user.info.name) {
            //         return elem;
            //     }
            // });
            // const readyAppo = allAppo.filter(elem => {
            //     if (elem.status === '2' && elem.receptionist === getState().user.info.name) {
            //         return elem;
            //     }
            // });
            // const appoNum = {
            //     waitAppo: waitAppo,
            //     currentAppo: currentAppo,
            //     readyAppo: readyAppo,
            // };
            // dispatch(actions.getAppoNum(appoNum));
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};

export const asyncGetAppoNum = () => {
    return async (dispatch, getState) => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            // 下面的请求和结果返回需要根据接口来实现
            let result = await request(
                urls.get +
                '?body=' +
                encodeURIComponent(
                    JSON.stringify({
                        querys: {
                            receptionist: getState().user.info.name,
                        },
                        sort: {
                            
                        },
                        pagination: { current: 1, pageSize: 100 },
                    }),
                ),
            );
            const allAppo = result.docs;
            const waitAppo = allAppo.filter(elem => {
                if (elem.status === '0' && elem.receptionist === getState().user.info.name) {
                    return elem;
                }
            });
            const currentAppo = allAppo.filter(elem => {
                if (elem.status === '1' && elem.receptionist === getState().user.info.name) {
                    return elem;
                }
            });
            const readyAppo = allAppo.filter(elem => {
                if (elem.status === '2' && elem.receptionist === getState().user.info.name) {
                    return elem;
                }
            });
            const appoNum = {
                waitAppo: waitAppo,
                currentAppo: currentAppo,
                readyAppo: readyAppo,
            };
            dispatch(actions.getAppoNum(appoNum));
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
    return async (dispatch, getState) => {
        try {
            let appoInfo = getState().ordermanage.currentAppo;
            let familyAddress = (content.familyAddress).join('');
            let roomOrder = content.roombed[0];
            let bedId = content.roombed[1];
            dispatch(actions.changeUiStatus({ isLoading: true }));
            let result = await request(urls.update + '?body=' + encodeURIComponent(JSON.stringify({ 
                uid: appoInfo.uid,
                name: content.name,
                userType: '2',
                age: content.age,
                sex: parseInt(content.sex),
                roomOrder: roomOrder,
                bedId: bedId,
                familyName: content.familyName,
                familyAddress: familyAddress,
                familyPhone: content.familyPhone,
                idCardNum: content.idCardNum,
            })));
            if (result.ok == 1) {
                let roomres = await request(urls.changeRoomUserNum + '?body=' + encodeURIComponent(JSON.stringify({ roomOrder: roomOrder, inc: 1 }))); 
                if (roomres.ok == 1) {
                    let appores = await request(urls.changeAppoStatus + '?body=' + encodeURIComponent(JSON.stringify({
                        appoId: appoInfo.appoId,
                        email: appoInfo.email,
                        status: appoInfo.status,
                        emailStatus: appoInfo.emailStatus,
                        bedId: bedId,
                        roomOrder: roomOrder,
                    })));
                    dispatch(actions.update(appores.dbResult));
                    successError('success', '操作已成功！');
                } else {

                }
            } else {

            }
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};

export const asyncAdd = (contents, appoInfo) => {
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

// 查询管理员
export const asyncGetManager = () => {
    return async (dispatch, getState) => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            // 下面的请求和结果返回需要根据接口来实现
            let result = await request(
                urls.getManager +
                    '?body=' +
                    encodeURIComponent(
                        JSON.stringify({
                            querys: {},
                            sort: {},
                            pagination: { current: 1, pageSize: 100 },
                        }),
                    ),
            );
            dispatch(actions.getManager(result.docs));
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};

export const asyncUpdateAppoStatus = param => {
    return async dispatch => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            // 下面的请求和结果返回需要根据接口来实现
            let result = await request(urls.changeAppoStatus + '?body=' + encodeURIComponent(JSON.stringify({
                appoId: param.appoId,
                email: param.email,
                status: param.status,
                emailStatus: param.emailStatus })));
            dispatch(actions.update(result.dbResult));
            successError('success', '操作已成功！');
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};

// 房间
export const asyncGetRoom = () => {
    return async (dispatch, getState) => {
        try {
            dispatch(actions.changeUiStatus({ isLoading: true }));
            // 下面的请求和结果返回需要根据接口来实现
            let result = await request(
                urls.getRoom +
                '?body=' +
                encodeURIComponent(
                    JSON.stringify({
                        querys: {},
                        sort: {},
                        pagination: { current: 1, pageSize: 100 },
                    }),
                ),
            );
            let currentRoom = result.docs;
            let room = [];
            let roomitem = {};
            for (let i = 0; i < currentRoom.length; i++) {
                roomitem = {
                    value: currentRoom[i].roomOrder,
                    label: currentRoom[i].roomOrder,
                    children: [],
                };
                let totalItem = {};
                for (let j = 1; j < currentRoom[i].totalNum + 1; j++) {
                    totalItem = {
                        value: j,
                        label: j + '号床',
                    };
                    roomitem.children.push(totalItem)
                }
                room.push(roomitem)
            }
            
            dispatch(actions.getroomNum(room));
        } catch (e) {
            throw e;
        } finally {
            dispatch(actions.changeUiStatus({ isLoading: false }));
        }
    };
};