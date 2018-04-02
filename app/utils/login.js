import store from '../store';
import history from '../history';

let from = '/';

export const checkLogin = historyGo => {
    const token = store.getState().user.info.token;
    if (token === '1') {
        if (window.location.pathname !== '/user/login') {
            from = window.location.pathname;
            historyGo('/user/login');
        }
    }
};

export const afterLogin = () => {
    history.push(from);
    from = '/';
};

export const afterLogout = () => {
    if (window.location.pathname !== '/user/login') {
        from = window.location.pathname;
        history.push('/user/login');
    }
};
