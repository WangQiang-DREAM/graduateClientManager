import React from 'react';
import {connect} from 'react-redux';
import {
    List,
    Spin,
    Card,
    Col,
    Row,
    Avatar,
    Tooltip,
} from 'antd';
import {actions, asyncGet, asyncDel} from './models';
import styles from './main.css';
import moment from 'moment';
import {Link} from 'react-router-dom';
import NumberInfo from 'ant-design-pro/lib/NumberInfo';
import numeral from 'numeral';

class Main extends React.Component {
    componentDidMount() {
        this
            .props
            .asyncGet();
    }
    viewHandler = id => {
        this
            .props
            .viewShow();
        this
            .props
            .changeCurrentSelectId(id);
    };
    editHandler = id => {
        this
            .props
            .editShow();
        this
            .props
            .changeCurrentSelectId(id);
    };
    changeHandle = (pagination, filters, sorter) => {
        this
            .props
            .changePagination(pagination);
        this
            .props
            .changeSort({key: sorter.field, order: sorter.order});
        this
            .props
            .asyncGet();
    };

    renderActivities = ()=> {
        const list = [{
                        id: 'trend-1',
                        updatedAt: '2018-03-30T02:30:21.416Z',
                        user: {
                            name: '曲丽丽',
                            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
                        },
                        group: {
                            name: '高逼格设计天团',
                            link: 'http://github.com/'
                        },
                        project: {
                            name: '六月迭代',
                            link: 'http://github.com/'
                        },
                        template: '在 @{group} 新建项目 @{project}'
                    },
                    {
                        id: 'trend-2',
                        updatedAt: '2018-03-30T02:30:21.416Z',
                        user: {
                            name: '付小小',
                            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png'
                        },
                        group: {
                            name: '高逼格设计天团',
                            link: 'http://github.com/'
                        },
                        project: {
                            name: '六月迭代',
                            link: 'http://github.com/'
                        },
                        template: '在 @{group} 新建项目 @{project}'
                    },
                    {
                        id: 'trend-3',
                        updatedAt: '2018-03-30T02:30:21.416Z',
                        user: {
                            name: '林东东',
                            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png'
                        },
                        group: {
                            name: '中二少女团',
                            link: 'http://github.com/'
                        },
                        project: {
                            name: '六月迭代',
                            link: 'http://github.com/'
                        },
                        template: '在 @{group} 新建项目 @{project}'
                    },
                    {
                        id: 'trend-4',
                        updatedAt: '2018-03-30T02:30:21.416Z',
                        user: {
                            name: '周星星',
                            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png'
                        },
                        project: {
                            name: '5 月日常迭代',
                            link: 'http://github.com/'
                        },
                        template: '将 @{project} 更新至已发布状态'
                    },
                    {
                        id: 'trend-5',
                        updatedAt: '2018-03-30T02:30:21.416Z',
                        user: {
                            name: '朱偏右',
                            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png'
                        },
                        project: {
                            name: '工程效能',
                            link: 'http://github.com/'
                        },
                        comment: {
                            name: '留言',
                            link: 'http://github.com/'
                        },
                        template: '在 @{project} 发布了 @{comment}'
                    },
                    {
                        id: 'trend-6',
                        updatedAt: '2018-03-30T02:30:21.416Z',
                        user: {
                            name: '乐哥',
                            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png'
                        },
                        group: {
                            name: '程序员日常',
                            link: 'http://github.com/'
                        },
                        project: {
                            name: '品牌迭代',
                            link: 'http://github.com/'
                        },
                        template: '在 @{group} 新建项目 @{project}'
                    }
                ];

        return list.map((item) => {
        const events = item.template.split(/@\{([^{}]*)\}/gi).map((key) => {
            if (item[key]) {
            return <a href={item[key].link} key={item[key].name}>{item[key].name}</a>;
            }
            return key;
        });
        return (
            <List.Item key={item.id}>
            <List.Item.Meta
                avatar={<Avatar src={item.user.avatar} />}
                title={
                <span>
                    <a className={styles.username}>{item.user.name}</a>
                    &nbsp;
                    <span className={styles.event}>{events}</span>
                </span>
                }
                description={
                <span className={styles.datetime} title={item.updatedAt}>
                    {moment(item.updatedAt).fromNow()}
                </span>
                }
            />
            </List.Item>
        );
        });
  }




    render() {
        const {isLoading, list, pagination} = this.props;
        let h = parseInt(new Date().getHours());
        let regard = '';
        if (h < 11) {
            regard = '早安'
        } else if (h > 13) {
            regard = '下午好'
        } else {
            regard = '午安'
        }

        return (
            <div className={styles.mainBox}>
                <div className={styles.personInfo}>
                    <Row style={{
                        height: '100%'
                    }}>
                        <Col
                            span="17"
                            style={{
                                height: '100%'
                            }}>
                            <Row
                                style={{
                                    height: '100%'
                                }}>
                                <div
                                    style={{
                                        height: '100%',
                                        float: 'left'
                                    }}>
                                    <img className={styles.big_avatar} src={this.props.manager.photo}/>
                                </div>
                                <div
                                    style={{
                                        height: '100%',
                                        float: 'left',
                                        display: 'table',
                                        marginLeft: '20px'
                                    }}>
                                    <div className={styles.perCol}>
                                        <p className={styles.info}>{regard}，{this.props.manager.name}，祝你开心每一天！</p>
                                        <p>托老所管理系统 | 管理员</p>
                                    </div>
                                </div>
                            </Row>
                        </Col>
                        <Col
                            span="7"
                            style={{
                                height: '100%'
                            }}>
                            <div className={styles.perCont}>
                                <div className={styles.perColRight}>
                                    <div className={styles.statItem}>
                                        <p>项目数</p>
                                        <p>56</p>
                                    </div>
                                    <div className={styles.statItem}>
                                        <p>团队内排名</p>
                                        <p>8<span>
                                                / 24</span>
                                        </p>
                                    </div>
                                    <div className={styles.statItem}>
                                        <p>项目访问</p>
                                        <p>2,223</p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div
                    style={{
                        background: '#f0f2f5',
                        padding: '25px'
                    }}>
                    <Row gutter={24}>
                        <Col xl={16} lg={24} md={24} sm={24} xs={24}>
                            <Card title="最新情况" bordered={false}
                                style={{marginBottom:'24px'}}
                            >
                                <Row>
                                    <Col md={6} sm={12} xs={24}>
                                        <NumberInfo
                                            subTitle="今日交易总额"
                                            suffix="元"
                                            total={numeral(124543233).format('0,0')}
                                        />
                                    </Col>
                                    <Col md={6} sm={12} xs={24}>
                                        <NumberInfo subTitle="销售目标完成率" total="92%" />
                                    </Col>
                                    <Col md={6} sm={12} xs={24}>
                                        <NumberInfo subTitle="活动剩余时间"/>
                                    </Col>
                                    <Col md={6} sm={12} xs={24}>
                                        <NumberInfo
                                            subTitle="每秒交易总额"
                                            suffix="元"
                                            total={numeral(234).format('0,0')}
                                        />
                                    </Col>
                                </Row>
                                <div className={styles.mapChart}>
                                    <Tooltip title="等待后期实现">
                                        <img
                                            src="https://gw.alipayobjects.com/zos/rmsportal/HBWnDEUXCnGnGrRfrpKa.png"
                                            alt="map"
                                        />
                                    </Tooltip>
                                </div>
                            </Card>
                            <Card
                                bodyStyle={{
                                    padding: 0
                                }}
                                bordered={false}
                                className={styles.activeCard}
                                title="动态">

                            </Card>
                        </Col>
                        <Col xl={8} lg={24} md={24} sm={24} xs={24}>
                            <Card
                                style={{
                                    marginBottom: 24
                                }}
                                title="动态"
                                bordered={false}
                                bodyStyle={{
                                    padding: 0
                                }}>
                                <List size="large">
                                    <div className={styles.activitiesList}>
                                        {this.renderActivities()}
                                    </div>
                                </List>                         
                            </Card>
                            <Card
                                style={{
                                    marginBottom: 24
                                }}
                                bordered={false}
                                title="XX 指数">
                                <div className={styles.chart}></div>
                            </Card>
                            <Card
                                bodyStyle={{
                                    paddingTop: 12,
                                    paddingBottom: 12
                                }}
                                bordered={false}
                                title="团队">
                                <div className={styles.members}></div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({list: state.home.list, isLoading: state.home.uiStatus.isLoading, pagination: state.home.pagination, manager: state.user.info});

const mapDispatchToProps = dispatch => ({
    asyncGet: () => dispatch(asyncGet()),
    asyncDel: id => dispatch(asyncDel(id)),
    viewShow: () => dispatch(actions.changeUiStatus({isViewShow: true})),
    addShow: () => dispatch(actions.changeUiStatus({isAddShow: true})),
    editShow: () => dispatch(actions.changeUiStatus({isUpdateShow: true})),
    changeCurrentSelectId: id => dispatch(actions.changeCurrentSelectId(id)),
    changePagination: pagination => dispatch(actions.changePagination(pagination)),
    changeSort: data => dispatch(actions.changeSort(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
