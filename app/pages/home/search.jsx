import React from 'react';
import { connect } from 'react-redux';
import {
    List,
    Spin,
    Card,
    Col,
    Row,
    Avatar
} from 'antd';
import { actions, asyncGet, asyncDel } from './models';
import styles from './main.css';
import moment from 'moment';
import { Link } from 'react-router-dom';

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
            .changeSort({ key: sorter.field, order: sorter.order });
        this
            .props
            .asyncGet();
    };

    renderActivities = () => {
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
        const { isLoading, list, pagination } = this.props;
        let h = parseInt(new Date().getHours());
        let regard = '';
        if (h < 11) {
            regard = '早安'
        } else if (h > 13) {
            regard = '下午好'
        } else {
            regard = '午安'
        }
        const notice = [
            {
                id: 'xxx1',
                title: 'Alipay',
                logo: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
                description: '那是一种内在的东西，他们到达不了，也无法触及的一切',
                updatedAt: '2018-03-28T10:44:46.073Z',
                member: '科学搬砖组',
                href: '',
                memberLink: ''
            }, {
                id: 'xxx2',
                title: 'Angular',
                logo: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
                description: '希望是一个好东西，也许是最好的，好东西是不会消亡的',
                updatedAt: '2017-07-24T00:00:00.000Z',
                member: '全组都是吴彦祖',
                href: '',
                memberLink: ''
            }, {
                id: 'xxx3',
                title: 'Ant Design',
                logo: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
                description: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
                updatedAt: '2018-03-28T10:44:46.073Z',
                member: '中二少女团',
                href: '',
                memberLink: ''
            }, {
                id: 'xxx4',
                title: 'Ant Design Pro',
                logo: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
                description: '那时候我只会想自己想要什么，从不想自己拥有什么',
                updatedAt: '2017-07-23T00:00:00.000Z',
                member: '程序员日常',
                href: '',
                memberLink: ''
            }, {
                id: 'xxx5',
                title: 'Bootstrap',
                logo: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
                description: '凛冬将至，让我们来猎杀那些陷入黑暗中的敌人吧',
                updatedAt: '2017-07-23T00:00:00.000Z',
                member: '高逼格设计天团',
                href: '',
                memberLink: ''
            }, {
                id: 'xxx6',
                title: 'React',
                logo: 'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png',
                description: '生命就像一盒巧克力，结果往往出人意料',
                updatedAt: '2017-07-23T00:00:00.000Z',
                member: '骗你来学计算机',
                href: '',
                memberLink: ''
            }
        ];

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
                                    <img className={styles.big_avatar} src={this.props.manager.photo} />
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
                                        <p>管理员 | xxxx－某某某事业群－某某平台部－某某技术部－CEO</p>
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
                            <Card
                                className={styles.projectList}
                                style={{
                                    marginBottom: 24
                                }}
                                title="进行中的项目"
                                bordered={false}
                                bodyStyle={{
                                    padding: 0
                                }}>
                                {notice.map(item => (
                                    <Card.Grid className={styles.projectGrid} key={item.id}>
                                        <Card
                                            bodyStyle={{
                                                padding: 0
                                            }}
                                            bordered={false}>
                                            <Card.Meta
                                                title={(
                                                    <div className={styles.cardTitle}>
                                                        <Avatar size="small" src={item.logo} />
                                                        <Link to={item.href}>{item.title}</Link>
                                                    </div>
                                                )}
                                                description={item.description} />
                                            <div className={styles.projectItemContent}>
                                                <Link to={item.memberLink}>{item.member || ''}</Link>
                                                {item.updatedAt && (
                                                    <span className={styles.datetime} title={item.updatedAt}>
                                                        {moment(item.updatedAt).fromNow()}
                                                    </span>
                                                )}
                                            </div>
                                        </Card>
                                    </Card.Grid>
                                ))
                                }
                            </Card>
                            <Card
                                bodyStyle={{
                                    padding: 0
                                }}
                                bordered={false}
                                className={styles.activeCard}
                                title="动态">
                                <List size="large">
                                    <div className={styles.activitiesList}>
                                        {this.renderActivities()}
                                    </div>
                                </List>
                            </Card>
                        </Col>
                        <Col xl={8} lg={24} md={24} sm={24} xs={24}>
                            <Card
                                style={{
                                    marginBottom: 24
                                }}
                                title="待办事项"
                                bordered={false}
                                bodyStyle={{
                                    padding: 0
                                }}>
                                <div></div>
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

const mapStateToProps = state => ({ list: state.home.list, isLoading: state.home.uiStatus.isLoading, pagination: state.home.pagination, manager: state.user.info });

const mapDispatchToProps = dispatch => ({
    asyncGet: () => dispatch(asyncGet()),
    asyncDel: id => dispatch(asyncDel(id)),
    viewShow: () => dispatch(actions.changeUiStatus({ isViewShow: true })),
    addShow: () => dispatch(actions.changeUiStatus({ isAddShow: true })),
    editShow: () => dispatch(actions.changeUiStatus({ isUpdateShow: true })),
    changeCurrentSelectId: id => dispatch(actions.changeCurrentSelectId(id)),
    changePagination: pagination => dispatch(actions.changePagination(pagination)),
    changeSort: data => dispatch(actions.changeSort(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
