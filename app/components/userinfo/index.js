import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import { asyncLogout, actions} from '../../common/models/user';
import {afterLogout} from 'utils';
import {checkLogin} from '../../utils/';
import { Button, Menu, Dropdown, Icon, Popconfirm} from 'antd';
import {Badge} from 'antd';
import styles from './index.css';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Comp extends React.Component {
    // logout = async () => {     await this.props.asyncLogout();     afterLogout();
    // };

    historyGo = key => {
        this
            .props
            .history
            .push(key);
    };
    logOut = () => {
        this
            .props
            .asyncLogout();
        afterLogout();
    }
    componentWillMount() {
        checkLogin(this.historyGo);
    }
    getInitialState=()=> {
        return {
            current: 'mail',
        };
    }
    handleClick= e => {
        if (e.key == 'setting') {
            this.props.viewShow();
        } 
        this.setState({
            current: e.key,
        });
    }
    render() {
        const props = this.props;
        return props.token
            ? (
                <div style={{
                    textAlign: 'right', marginRight: '20px',width:'100px',float:'right',marginTop:'17px'
                }}>
                    <Menu
                        mode="horizontal"
                        onClick={this.handleClick}
                    >
                        <SubMenu title={<span> <span className={styles.remark}>
                            <Badge count={0} style={{paddingRight: '10px'}}>
                                <a href="" className={styles.head}>
                                    <img src={props.photo} className={styles.avatar} />
                                </a>
                            </Badge>
                        </span> {props.user_name}</span>}>
                            <Menu.Item key="setting"><Icon type="user" />密码修改</Menu.Item>
                            <Menu.Item>
                                <Popconfirm
                                    title="确定要退出？"
                                    okText="确定"
                                    cancelText="取消"
                                    onConfirm={() => {
                                        this.logOut()
                                    }}>
                                    <a><Icon type="logout" />退出登录</a>
                                </Popconfirm>
                            </Menu.Item>
                        </SubMenu>
                    </Menu>                      
                </div>
            )
            : (

                <div style={{
                    textAlign: 'right'
                }}>
                    {props.name}</div>
            );
    }
}

const mapStateToProps = state => ({
    ...state.user.info
});

const mapDispatchToProps = dispatch => ({
    asyncLogout: () => dispatch(asyncLogout()),
    viewShow: () => dispatch(actions.changeUiStatus({ isViewShow: true })),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Comp));
