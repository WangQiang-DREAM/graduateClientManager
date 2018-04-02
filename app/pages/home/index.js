// import React from 'react';
// import { Carousel } from 'antd';
// const Comp = () => {
//     return (
//         <div><h2>欢迎你来到视频标签管理中心！！</h2>
//         </div>
//     );
// };

// export default Comp;



import React from 'react';
import styles from './main.css';
import Main from './main.jsx';
class Container extends React.Component {
    render() {
        return (
            <div>
                <Main/>
            </div>
        );
    }
};

export default Container;
