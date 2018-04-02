import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import user from './common/models/user';
import login from './pages/login/models';
import videotag from './pages/videotag/models';
import videomanage from './pages/videomanage/models';
import tagsmanage from './pages/tagsmanage/models';
import videohandle from './pages/videohandle/models';
import usermanage from './pages/usermanage/models';
import roommanage from './pages/roommanage/models';
import home from './pages/home/models';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
    combineReducers({
        user,
        login,
        videotag,
        videomanage,
        tagsmanage,
        videohandle,
        usermanage,
        roommanage,
        home,
    }),
    composeEnhancers(applyMiddleware(thunk)),
);
