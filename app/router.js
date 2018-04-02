import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';

import { Provider } from 'react-redux';
import store from './store';
import FullLayout from './layout/fullLayout';
import SiderLayout from './layout/siderLayout';
import UserLayout from './layout/userLayout';
import history from './history';

export default () => {
    return (
        <Provider store={store}>
            <Router history={history} >
                <Switch>
                    <Route path="/login" component={UserLayout} />
                    <Route path="/user" component={FullLayout} />
                    <Route path="/" component={SiderLayout} />
                    <Redirect to="/user/login" />
                </Switch>
            </Router>
        </Provider>
    );
};
