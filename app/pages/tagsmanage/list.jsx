import React from 'react';
import { connect } from 'react-redux';
import { Table, Spin, Popconfirm, Button} from 'antd';
const { Column } = Table;
import { actions, asyncGet, asyncDel, asyncUpdateUserType } from './models';
import { formatViewData } from './utils';
import styles from './list.css'
class List extends React.Component {
    componentDidMount() {
        this.props.asyncGet();
    }
    viewHandler = record => {
        this.props.viewShow();
        this.props.getUserDetail(record)
    };
    editHandler = (uid, roomOrder, email) => {
        // this.props.editShow();
        const content = {
            uid: uid,
            userType: '1',
            roomOrder: roomOrder,
            email: email,
        };
        this.props.updateUserType(content);
    };
    renderAction = (text, record) => {
        if (record.userType == '2') {
            return (
                <span>
                    <Button
                        size="small"
                        onClick={() => {
                            this.viewHandler(record);
                        }}>
                        详情
                    </Button>
                    <span className="ant-divider" />
                    <Popconfirm
                        title="确定要退订吗？"
                        okText="确定"
                        cancelText="取消"
                        onConfirm={() => {
                            this.editHandler(record.uid, record.roomOrder, record.email);
                        }}>
                        <Button type="danger" size="small" >退订</Button>
                    </Popconfirm>
                </span>
            );
        }
    }
    render() {
        const { isLoading, list, pagination } = this.props;
        
        return (
            <Spin spinning={isLoading} tip="加载中...">
                <Table
                    dataSource={list}
                    pagination={{
                        ...pagination,
                    }}
                    onChange={this.changeHandle}>

                    <Column
                        title="用户ID"
                        dataIndex="uid"
                        key="uid"
                        render={text => {
                            return formatViewData('uid', text);
                        }}
                    />

                    <Column
                        title="姓名"
                        dataIndex="name"
                        key="name"
                        render={text => {
                            return formatViewData('name', text);
                        }}
                    />
                    <Column
                        title="房间号"
                        dataIndex="roomOrder"
                        key="roomOrder"
                        render={text => {
                            if (text === null) {
                                return (<span style={{ color: 'red' }}>暂无</span>)
                            } else {
                                return formatViewData('roomOrder', text);
                            }
                        }}
                    />

                    <Column
                        title="性别"
                        dataIndex="sex"
                        key="sex"
                        render={text => {
                            return formatViewData('sex', text);
                        }}
                    />
                    <Column
                        title="入住时间"
                        dataIndex="checkInTime"
                        key="checkInTime"
                        sorter={true}
                        render={text => {
                            if (text !== null) {
                                return formatViewData('checkInTime', text);
                            } else {
                                return (<span style={{ color: 'red' }}>暂无</span>)
                            } 
                        }}
                    />

                    <Column
                        title="类型"
                        dataIndex="userType"
                        key="userType"
                        sorter={false}
                        render={text => {
                            if (text == '2') {
                                return (
                                    <span style={{ color: '#00AA00' }}>
                                        {formatViewData('userType', text)}
                                    </span>
                                );
                            } else {
                                return (
                                    <span style={{ color: 'red' }}>
                                        {formatViewData('userType', text)}
                                    </span>
                                )
                            }
                        }}
                    />
                    <Column title="操作" key="action" render={this.renderAction} />
                </Table>
            </Spin>
        );
    }
}

const mapStateToProps = state => ({
    list: state.tagsmanage.list,
    isLoading: state.tagsmanage.uiStatus.isLoading,
    pagination: state.tagsmanage.pagination,
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
    getUserDetail: record => dispatch(actions.getUserDetail(record)),
    updateUserType: content => dispatch(asyncUpdateUserType(content)),
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
