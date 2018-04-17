import {createReducers, createActions, request, sleep} from '../../utils/';
import {combineReducers} from 'redux';
import {APIHOST} from '../../config';
import {notification} from 'antd';
const md5 = require('md5');
const urls = {
    login: APIHOST + 'user/login',
    logout: APIHOST + 'logout',
    updateManagerPassword: APIHOST + 'user/updateManagerPassword'
};

const path = name => `common:user:${name}`;

const guestInfo = {
    id: 'guest',
    user_name: 'guest',
    name: '游客',
    phone: '',
    email: '',
    token: '1',
    roles: [1]
};

const successError = (type, msg) => {
    notification[type]({message: msg});
};
const getUserFromSession = window.sessionStorage.__userInfo
    ? JSON.parse(window.sessionStorage.__userInfo)
    : guestInfo;

const models = {
    info: {
        data: getUserFromSession,
        handlers: {
            login(state, action) {
                sessionStorage.setItem('__userInfo', JSON.stringify(action.payload));
                return action.payload;
            },
            logout() {
                sessionStorage.removeItem('__userInfo');
                return {
                    ...guestInfo
                };
            }
        }
    },
    uiStatus: {
        data: {
            isLoading: false,
            isViewShow: false,
            form2loading: 'none',
            form1loading: 'block',
        },
        handlers: {
            changeUiStatus(state, action) {
                return { ...state, ...action.payload };
            },
        },
    },
};


// 进入页面动画
const enter = () => {
    let welDom = document.getElementById("welcome");
    if (window.location.hash == '') {
        welDom.style.display = 'flex';
    }
    // console.log(window.location.hash)
    setTimeout(function () {
        welDom.style.display = 'none';
    }, 3 * 1000);
}

export const actions = createActions(models, path);

export default combineReducers(createReducers(models, path));

export const asyncLogin = (username, password) => {
    return async dispatch => {
        try {
            // 下面的请求和结果返回需要根据接口来实现
            let result = await request(urls.login + `?body={"username":"${username}","password":"${md5(password)}"}`);
            if (result.code == 505) {
                successError('error', '密码错误，请重试！');
                return false;
            } else if (result.code == 405) {
                successError('error', '无此用户，请重试!');
                return false;
            } else if (result.code == 201) {
                let userInfo = {
                    id: result.data.uid,
                    user_name: result.data.username,
                    name: result.data.name,
                    photo: result.data.photo,
                    token: '2',
                    roles: result.data.roles
                };
                dispatch(actions.login(userInfo));
                enter();
            }
        } catch (e) {
            throw e;
        } finally {}
    };
};

export const asyncLogout = () => {
    return async dispatch => {
        try {
            // 下面的请求和结果返回需要根据接口来实现
            dispatch(actions.logout());
        } catch (e) {
            throw e;
        } finally {}
    };
};


export const asyncheckUser = (username, password) => {
    return async(dispatch, getState) => {
        try {
            // 下面的请求和结果返回需要根据接口来实现
            if (username && password) {
                if (username == getState().user.info.user_name) {
                    let result = await request(urls.login + `?body={"username":"${username}","password":"${md5(password)}"}`);
                    if (result.code == 505) {
                        successError('error', '密码错误，请重试！');
                        return false;
                    } else if (result.code == 405) {
                        successError('error', '用户名错误，请重试!');
                        return false;
                    } else if (result.code == 201) {
                        console.log(result)
                        dispatch(actions.changeUiStatus({ form1loading: 'none' }))
                        sleep(100)
                        dispatch(actions.changeUiStatus({ form2loading: 'block' }))

                    }
                } else {
                    successError('error', '用户名与登录用户名不匹配！');
                }
                
            } else {
                successError('error', '请填写完整');
            }
            
        } catch (e) {
            throw e;
        } finally { }
    };
};

export const asynUpdateManagerPassword = pass => {
    return async (dispatch, getState) => {
        try {
            let uid = getState().user.info.id
            // 下面的请求和结果返回需要根据接口来实现
            let result = await request(urls.updateManagerPassword + `?body={"uid":"${uid}","password":"${md5(pass)}"}`);         
            if (result.ok == 1) {
                dispatch(actions.logout());
                window.location.reload();
            }
        } catch (e) {
            throw e;
        } finally { }
    };
};