// 这里主要是对host进行定义，
let localInterfaceHost;
if (process.env.NODE_ENV === 'development') {
    localInterfaceHost = 'http://' + LOCATIONIP + ':3005/';
}
localInterfaceHost = 'http://localhost:3000/';
// localInterfaceHost = 'http://172.30.157.66:3000/';
// localInterfaceHost = 'http://api.videotags.ifengcloud.ifeng.com/';

export const APIHOST = localInterfaceHost;

