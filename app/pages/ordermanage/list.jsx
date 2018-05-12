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
            for (let i = 0, item; item = manager[i++];) {
                if (item.name === e) {
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
            for (let i = 0, item; item = manager[i++];) {
                if (item.name === e) {
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
    buttonView = item => {
        if (item.status === '0') {
            return [
                <Button type='primary' onClick={() => {
                    this.receiveAppo(item)
                }}>接受</Button>,
                <Popconfirm
                    title="确定要拒绝预约吗？"
                    okText="确定"
                    cancelText="取消"
                    onConfirm={() => {
                        this.rejectAppo(item)
                    }}>
                    <Button type="danger" >拒绝</Button>
                </Popconfirm> ]
        } else if (item.status === '1') {
            return [ <Button type='primary' onClick={() => {
                this.checkIn(item)
            }}>入住</Button>, <Popconfirm
                            title="确定要放弃入住吗？"
                            okText="确定"
                            cancelText="取消"
                            onConfirm={ () => {
                                this.cancelEnter(item)
                            }}>
                            <Button type="danger" >取消</Button>
                        </Popconfirm>
                   ]
        } else {
            return [<a></a>]
        }
    }
    // 取消
    cancelEnter = item => {
        let param = {
            appoId: item.appoId,
            email: item.email,
            phone: item.contactWay,
            status: '2',
            emailStatus: 'nocheckin',
        };
        let logs = {
            name: item.name,
            uid: item.uid,
            status: '4',
            operator: this.props.username,
            operatorAvatar: this.props.useravatar,
        };
        this.props.updateAppoStatus(param, logs);
        this.props.getAppoNum();
    }
    // 拒绝
    rejectAppo = item => {
        let param = {
            appoId: appoId,
            email: email,
            status: '2',
            emailStatus: 'reject',
            phone: item.contactWay,
        };
        let logs = {
            name: item.name,
            uid: item.uid,
            status: '2',
            operator: this.props.username,
            operatorAvatar: this.props.useravatar,
        };
        this.props.updateAppoStatus(param, logs);
        this.props.getAppoNum();
    }

    // 接受
    receiveAppo = item => {
        let param = {
            appoId: item.appoId,
            email: item.email,
            status: '1',
            phone: item.contactWay,
            emailStatus: 'receive',
        };
        let logs = {
            name: item.name,
            uid: item.uid,
            status: '1',
            operator: this.props.username,
            operatorAvatar: this.props.useravatar,
        }
        this.props.updateAppoStatus(param, logs);
        this.props.getAppoNum();
    }
    // 入住
    checkIn = item => {
        let param = {
            appoId: item.appoId,
            email: item.email,
            status: '2',
            phone: item.contactWay,
            emailStatus: 'checkin',
            uid: item.uid,
        };
        let logs = {
            name: item.name,
            uid: item.uid,
            status: '3',
            operator: this.props.username,
            operatorAvatar: this.props.useravatar,
        }
        this.props.setCurrentAppo(param); 
        this.props.editShow();
        this.props.getAppoNum();
        let a = '1';
        this.props.updateAppoStatus(a, logs);
    }
    
    render() {
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
        const ListContent = ({ data: { roomOrder, appoTime, status} }) => (
            <div className={styles.listContent}>
                <div className={styles.listContentItem}>
                    <span>预约房间</span>
                    <p style={{color: '#222'}}>{roomOrder}</p>
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
                                <Info title="正在进行" value={AppoNum.currentAppo.length + '个预约'} bordered />
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
                                    actions={this.buttonView(item)}
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
    useravatar: state.user.info.photo,
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
    updateAppoStatus: (param,logs) => dispatch(asyncUpdateAppoStatus(param,logs)),
    getRoom: () => dispatch(asyncGetRoom()),
    setCurrentAppo: param => dispatch(actions.changeCurrentAppo(param)),
    getAppoNum: () => dispatch(asyncGetAppoNum())
});

export default connect(mapStateToProps, mapDispatchToProps)(MList);
