import Videotag from './pages/videotag/';
import Tagsmanage from './pages/tagsmanage/';
import Home from './pages/home/';
import Login from './pages/login/';
import Usermanage from './pages/usermanage/';
import Videohandle from './pages/videohandle/';
import Roommanage from './pages/roommanage/';
import Ordermanage from './pages/ordermanage/';

/**
 * 计算当前目录的权限，当前目录的权限包括当前目录下面children及其以下的目录的权限。
 * @param {Object} flod 一个routerTree的片段。
 * @param {Array} roles 记录权限集合。
 * @return {Array} 返回 roles
 */
const calcFlodRoles = (flod, roles = []) => {
    for (let item of flod.children) {
        if (item.type === 'leaf') {
            for (let role of item.roles) {
                if (!roles.includes(role)) {
                    roles.push(role);
                }
            }
        } else {
            calcFlodRoles(item, roles);
        }
    }
    return roles;
};

/**
 * 对routerTree进行格式化，为每个flod增加roles。
 * @param {Object} items routerTree 或者 routerTree中的一个children对象
 * @return {Object} 返回 items
 */
const formatRouteTreeByRoles = items => {
    for (let item of items) {
        if (item.type === 'layout') {
            formatRouteTreeByRoles(item.children);
        } else if (item.type === 'flod') {
            item.roles = calcFlodRoles(item);
            formatRouteTreeByRoles(item.children);
        }
    }
    return items;
};

/**
 * 从routerTree中获取所有type为leaf的对象组成数组
 * @param {Object} routers routerTree 或者 routerTree中的一个children对象
 * @param {Array} result 路由的集合
 * @return {Array} 返回 result
 */
const getCompFromRouterTree = (routers, result = []) => {
    for (let router of routers) {
        if (router.type === 'leaf') {
            result.push(router);
        } else {
            if (router.comp && router.type === 'flod') {
                result.push(router);
            }
            getCompFromRouterTree(router.children, result);
        }
    }
    return result;
};

/**
 * 对路由树中type为flod的节点进行roles进行计算，
 */
export const routerTree = formatRouteTreeByRoles([
    {
        layout: 'userLayout',
        value: '登录',
        type: 'layout',
        path: '/user/login',
        children: [
            {
                path: '/user/login',
                comp: Login,
                exact: true,
                value: '登录页',
                isDisplay: false,
                type: 'leaf',
                roles: [1, 2],
            },
        ],
    },
    {
        layout: 'siderLayout',
        value: '首页',
        type: 'layout',
        path: '/',
        children: [
            {
                path: '/',
                comp: Home,
                exact: true,
                value: '首页',
                isDisplay: true,
                type: 'leaf',
                iconType: 'home',
                roles: [1, 2],
            },
            {
                path: '/ordermanage',
                comp: Ordermanage,
                exact: true,
                value: '预约管理',
                isDisplay: true,
                type: 'leaf',
                iconType: 'tags-o',
                roles: [1, 2],
            },
            {
                path: '/roommanage',
                comp: Roommanage,
                exact: true,
                value: '房间管理',
                isDisplay: true,
                type: 'leaf',
                iconType: 'appstore-o',
                roles: [2],
            },
            
            {
                path: '/tagsmanage',
                comp: Tagsmanage,
                exact: true,
                value: '用户管理',
                isDisplay: true,
                type: 'leaf',
                iconType: 'user',
                roles: [1, 2],
            },
            {
                path: '/usermanage',
                comp: Usermanage,
                exact: true,
                value: '权限管理',
                isDisplay: true,
                type: 'leaf',
                iconType: 'team',
                roles: [2],
            },
        ],
    },
]);

/**
 * 这里采用深度优先的原则进行遍历，所以拿到的路由列表跟routerTree里面的顺序是一样的。
 * 这里需要注意的是，主区域的路由是switch模式（只匹配能匹配到的第一个），
 * 所以这里顺序很重要，更改后需要及时验证
 */
export const routerList = getCompFromRouterTree(routerTree);
