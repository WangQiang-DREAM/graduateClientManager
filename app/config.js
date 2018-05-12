// 这里主要是对host进行定义，
let localInterfaceHost;
if (process.env.NODE_ENV === 'development') {
    localInterfaceHost = 'http://' + LOCATIONIP + ':3005/';
}

localInterfaceHost = 'http://123.207.164.37:3300/';
// localInterfaceHost = 'http://localhost:3300/';
// localInterfaceHost = 'http://39.106.173.244:3300/';
// localInterfaceHost = 'http://api.videotags.ifengcloud.ifeng.com/';

export const APIHOST = localInterfaceHost;

