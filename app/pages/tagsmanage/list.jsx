import React from 'react';
import { connect } from 'react-redux';
import { Table, Spin, Popconfirm } from 'antd';
const { Column } = Table;
import { actions, asyncGet, asyncDel } from './models';
import { formatViewData } from './utils';
import styles from './list.css'
class List extends React.Component {
    componentDidMount() {
        this.props.asyncGet();
    }
    viewHandler = id => {
        this.props.viewShow();
        this.props.changeCurrentSelectId(id);
    };
    editHandler = id => {
        this.props.editShow();
        this.props.changeCurrentSelectId(id);
    };
    changeHandle = (pagination, filters, sorter) => {
        this.props.changePagination(pagination);
        this.props.changeSort({ key: sorter.field, order: sorter.order });
        this.props.asyncGet();
    };
    
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
                        title="头像"
                        dataIndex="avatar"
                        key="avatar"
                        render={text => {
                            return (
                                <div className={styles.avatar_div}>
                                    <img src={formatViewData('avatar', text)} className={styles.user_avatar} />
                                </div>
                            );
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
                        title="年龄"
                        dataIndex="age"
                        key="age"
                        sorter={true}
                        render={text => {
                            return formatViewData('age', text);
                        }}
                    />

                    <Column
                        title="房间号"
                        dataIndex="roomId"
                        key="roomId"
                        render={text => {
                            return formatViewData('roomId', text);
                        }}
                    />

                    <Column
                        title="注册时间"
                        dataIndex="registerTime"
                        key="registerTime"
                        sorter={true}
                        render={text => {
                            return formatViewData('registerTime', text);
                        }}
                    />

                    <Column
                        title="类型"
                        dataIndex="userType"
                        key="userType"
                        sorter={false}
                        render={text => {
                            return formatViewData('userType', text);
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
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
