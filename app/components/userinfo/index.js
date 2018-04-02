import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {asyncLogout} from '../../common/models/user';
import {afterLogout} from 'utils';
import {checkLogin} from '../../utils/';
import {Button, Menu, Dropdown, Icon} from 'antd';
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
        console.log('click ', e);
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
                    >
                        <SubMenu title={<span> <span className={styles.remark}>
                            <Badge count={5} style={{paddingRight: '10px'}}>
                                <a href="" className={styles.head}>
                                    <img src={props.photo} className={styles.avatar} />
                                </a>
                            </Badge>
                        </span> {props.user_name}</span>}>
                            <Menu.Item key="setting:3"><Icon type="user" />个人中心</Menu.Item>
                            <Menu.Item key="setting:4"><Icon type="setting" />设置</Menu.Item>
                            <Menu.Item>
                                <a onClick={this.logOut}>
                                    <Icon type="logout" />退出登录
                                </a>
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
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Comp));
