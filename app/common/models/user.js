import {createReducers, createActions, request, sleep} from '../../utils/';
import {combineReducers} from 'redux';
import {APIHOST} from '../../config';
import {notification} from 'antd';

const urls = {
    login: APIHOST + 'user/login',
    logout: APIHOST + 'logout'
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
    }
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
            let result = await request(urls.login + `?body={"username":"${username}","password":"${password}"}`);
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
