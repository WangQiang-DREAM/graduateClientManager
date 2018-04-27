import React from 'react';
import { connect } from 'react-redux';
import { Spin, Popconfirm ,List, Card, Row, Col, Radio, Input, Button, Icon, Dropdown, Menu, Avatar } from 'antd';
import { actions, asyncGet, asyncDel, asyncGetManager, asyncUpdateAppoStatus, asyncGetRoom, asyncGetAppoNum } from './models';
import { formatViewData } from './utils';
import styles from './list.css'
import moment from 'moment';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;
class MList extends React.Component {
    componentDidMount() {
        let values = {
            receptionist: this.props.username,
        };
        this.props.changeSearchValues(values);
        this.props.asyncGet();
        this.props.getAppoNum();
        this.props.getManager();
        this.props.getRoom()
    }
    viewStatusChange = e => {
        let currentSearch = this.props.searchValue;
        let values = {};
        if (currentSearch.name !== undefined ) { 
            if (e.target.value === 'all') {
                values = { 
                    name: currentSearch.name,
                    receptionist: this.props.username,
                };
            } else {
                values = {
                    status: e.target.value,
                    name: currentSearch.name,
                    receptionist: this.props.username,
                }; 
            }
        } else {
            if (e.target.value === 'all') {
                values = {
                    receptionist: this.props.username,
                };
            } else {
                values = {
                    status: e.target.value,
                    receptionist: this.props.username,
                };
            }
        }
        this.props.changeSearchValues(values);
        this.props.resetPagination();
        this.props.asyncGet();
    };
    onSearch = e => {
        let currentSearch = this.props.searchValue;
        let manager = this.props.manager;
        let values = {};
        if (currentSearch.status !== undefined) { 
            for (let i = 0; i < manager.length; i++) {
                if (manager[i].name === e) {
                    values = {
                        receptionist: e,
                        status: currentSearch.status,
                    };
                    break;
                } else {
                    values = {
                        name: e,
                    };
                }
            }
        } else {
            for (let i = 0; i < manager.length; i++) {
                if (manager[i].name === e) {
                    values = {
                        receptionist: e,
                    };
                    break;
                } else {
                    values = {
                        name: e,
                    };
                }
            }
        }
        this.props.changeSearchValues(values);
        this.props.resetPagination();
        this.props.asyncGet();
    }
    editHandler = id => {
        this.props.editShow();
        this.props.changeCurrentSelectId(id);
    };
    changeHandle = page => {
        let pagination = { current: page, pageSize: 10 }
        this.props.changePagination(pagination);
        this.props.asyncGet();
    };
    viewStatus = status => {
        if (status === '0') {
            return (
                <span style={{ color: 'red' }}>{formatViewData('status', status)}</span>
            )
        }
        if (status === '1') {
            return (
                <span style={{ color: 'blue' }}>{formatViewData('status', status)}</span>
            )
        } else {
            return (
                <span style={{ color: '#00AA00' }}>{formatViewData('status', status)}</span>
            )
        }
    }
    buttonView = (appoId, status, email, uid) => {
        if (status == '0') {
            return [
                <Button type='primary' onClick={() => {
                    this.receiveAppo(appoId, email)
                }}>接受</Button>,
                <Popconfirm
                    title="确定要拒绝预约吗？"
                    okText="确定"
                    cancelText="取消"
                    onConfirm={() => {
                        this.rejectAppo(appoId, email)
                    }}>
                    <Button type="danger" >拒绝</Button>
                </Popconfirm> ]
        } else if (status == '1') {
            return [ <Button type='primary' onClick={() => {
                this.checkIn(appoId, email, uid)
            }}>入住</Button>, <Popconfirm
                            title="确定要放弃入住吗？"
                            okText="确定"
                            cancelText="取消"
                            onConfirm={ () => {
                                this.cancelEnter(appoId, email)
                            }}>
                            <Button type="danger" >取消</Button>
                        </Popconfirm>
                   ]
        } else {
            return [<a></a>]
        }
    }
    // 不入住
    cancelEnter = (appoId, email) => {
        let param = {
            appoId: appoId,
            email: email,
            status: '2',
            emailStatus: 'nocheckin',
        };
        this.props.updateAppoStatus(param);
        this.props.getAppoNum();
    }
    // 拒绝
    rejectAppo = (appoId, email) => {
        let param = {
            appoId: appoId,
            email: email,
            status: '2',
            emailStatus: 'reject',
        };
        this.props.updateAppoStatus(param);
        this.props.getAppoNum();
    }

    // 接受
    receiveAppo = (appoId, email) => {
        let param = {
            appoId: appoId,
            email: email,
            status: '1',
            emailStatus: 'receive',
        };
        this.props.updateAppoStatus(param);
        this.props.getAppoNum();
    }
    // 入住
    checkIn = (appoId, email, uid) => {
        let param = {
            appoId: appoId,
            email: email,
            status: '2',
            emailStatus: 'checkin',
            uid: uid,
        };
        this.props.setCurrentAppo(param);
        this.props.editShow();
        this.props.getAppoNum();
    }
    
    render() {
        // const list = [
        //     {
        //         id: "fake-list-0",
        //         owner: "付小小",
        //         title: "Alipay",
        //         avatar: "https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png",
        //         cover: "https://gw.alipayobjects.com/zos/rmsportal/uMfMFlvUuceEyPpotzlq.png",
        //         status: "active",
        //         percent: 99,
        //         logo: "https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png",
        //         href: "https://ant.design",
        //         updatedAt: "2018-04-19T02:14:27.425Z",
        //         createdAt: "2018-04-19T02:14:27.425Z",
        //         subDescription: "那是一种内在的东西， 他们到达不了，也无法触及的",
        //         description: "在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。",
        //         activeUser: 194418,
        //         newUser: 1251,
        //         star: 174,
        //         like: 158,
        //         message: 13
        //     }
        // ]
        const { isLoading, pagination, list, AppoNum} = this.props;
        const paginationProps = {
            total: pagination.total,
            pageSize: pagination.pageSize,
            current: pagination.current,
            onChange: this.changeHandle,
        };
        const Info = ({ title, value, bordered }) => (
            <div className={styles.headerInfo}>
                <span>{title}</span>
                <p>{value}</p>
                {bordered && <em />}
            </div>
        );

        const extraContent = (
            <div className={styles.extraContent}>
                <RadioGroup defaultValue="all" onChange={this.viewStatusChange}>
                    <RadioButton value="all">全部</RadioButton>
                    <RadioButton value="0">待处理</RadioButton>
                    <RadioButton value="1">进行中</RadioButton>
                    <RadioButton value="2">已处理</RadioButton>
                </RadioGroup>
                <Search
                    className={styles.extraContentSearch}
                    placeholder="输入预约人或接待人姓名/按回车搜索"
                    onSearch={value => {
                        this.onSearch(value);
                    }}
                />
            </div>
        );
        const ListContent = ({ data: { receptionist, appoTime, status} }) => (
            <div className={styles.listContent}>
                <div className={styles.listContentItem}>
                    <span>接待人</span>
                    <p style={{color: '#222'}}>{receptionist}</p>
                </div>
                <div className={styles.listContentItem}>
                    <span>预约时间</span>
                    <p style={{color: '#222'}}>{moment(appoTime).format('YYYY-MM-DD HH:mm')}</p>
                </div>
                <div className={styles.listContentItem}>
                    <span>预约状态</span>
                    <p>{this.viewStatus(status)}</p>
                </div>
            </div>
        );
        return (
            <Spin spinning={isLoading} tip="加载中...">
                <div className={styles.standardList}>
                    <Card bordered={false}>
                        <Row>
                            <Col sm={8} xs={24}>
                                <Info title="我的待办" value={AppoNum.waitAppo.length + '个预约'} bordered />
                            </Col>
                            <Col sm={8} xs={24}>
                                <Info title="正在进行中" value={AppoNum.currentAppo.length + '个预约'} bordered />
                            </Col>
                            <Col sm={8} xs={24}>
                                <Info title="已结束" value={AppoNum.readyAppo.length + '个预约'} />
                            </Col>
                        </Row>
                    </Card>

                    <Card
                        className={styles.listCard}
                        bordered={false}
                        title="预约列表"
                        style={{ marginTop: 24 }}
                        bodyStyle={{ padding: '0 32px 40px 32px' }}
                        extra={extraContent}
                    >
                        <List
                            size="large"
                            rowKey="id"
                            pagination={paginationProps}
                            dataSource={list}
                            renderItem={item => (
                                <List.Item
                                    actions={this.buttonView(item.appoId, item.status, item.email, item.uid)}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.avatar} shape="square" size="large" />}
                                        title={<a>预约人姓名</a>}
                                        description={item.name}
                                    />
                                    <ListContent data={item} />
                                </List.Item>
                            )}
                        />
                    </Card>
                </div>
            </Spin>
        );
    }
}

const mapStateToProps = state => ({
    list: state.ordermanage.list,
    isLoading: state.ordermanage.uiStatus.isLoading,
    pagination: state.ordermanage.pagination,
    manager: state.ordermanage.manager,
    searchValue: state.ordermanage.searchValues,
    AppoNum: state.ordermanage.AppoNum,
    username: state.user.info.name,
});

const mapDispatchToProps = dispatch => ({
    asyncGet: () => dispatch(asyncGet()),
    asyncDel: id => dispatch(asyncDel(id)),
    viewShow: () => dispatch(actions.changeUiStatus({ isViewShow: true })),
    addShow: () => dispatch(actions.changeUiStatus({ isAddShow: true })),
    editShow: () => dispatch(actions.changeUiStatus({ isUpdateShow: true })),
    changeCurrentSelectId: id => dispatch(actions.changeCurrentSelectId(id)),
    changePagination: pagination => dispatch(actions.changePagination(pagination)),
    changeSort: data => dispatch(actions.changeSort(data)),
    changeSearchValues: params => dispatch(actions.changeSearchValues(params)),
    resetPagination: () => dispatch(actions.changePagination({ current: 1, pageSize: 10 })),
    getManager: () =>dispatch(asyncGetManager()),
    updateAppoStatus: param => dispatch(asyncUpdateAppoStatus(param)),
    getRoom: () => dispatch(asyncGetRoom()),
    setCurrentAppo: param => dispatch(actions.changeCurrentAppo(param)),
    getAppoNum: () => dispatch(asyncGetAppoNum())
});

export default connect(mapStateToProps, mapDispatchToProps)(MList);
