import React from 'react';
import { connect } from 'react-redux';
import { Table, Spin, Popconfirm } from 'antd';
const { Column } = Table;
import { actions, asyncGet, asyncDel } from './models';
import { formatViewData } from './utils';

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
    renderAction = (text, record) => (
        <span>
            <a
                href="#"
                onClick={() => {
                    this.viewHandler(record.id);
                }}>
                查看
            </a>
            <span className="ant-divider" />
            <a
                href="#"
                onClick={() => {
                    this.editHandler(record.id);
                }}>
                编辑
            </a>
            <span className="ant-divider" />
            <Popconfirm
                title="确定删除该条信息？"
                okText="确定删除"
                cancelText="取消删除"
                onConfirm={() => {
                    this.props.asyncDel(record.id);
                }}>
                <a href="#">删除</a>
            </Popconfirm>
        </span>
    );
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
                        title="序号"
                        dataIndex="orderNumber"
                        key="orderNumber"
                        sorter={true}
                        render={text => {
                            return formatViewData('orderNumber', text);
                        }}
                    />

                    <Column
                        title="ID"
                        dataIndex="id"
                        key="id"
                        sorter={false}
                        render={text => {
                            return formatViewData('id', text);
                        }}
                    />

                    <Column
                        title="昵称"
                        dataIndex="nickName"
                        key="nickName"
                        sorter={false}
                        render={text => {
                            return formatViewData('nickName', text);
                        }}
                    />

                    <Column
                        title="关注数"
                        dataIndex="followNum"
                        key="followNum"
                        sorter={true}
                        render={text => {
                            return formatViewData('followNum', text);
                        }}
                    />

                    <Column
                        title="粉丝数"
                        dataIndex="fansNum"
                        key="fansNum"
                        sorter={true}
                        render={text => {
                            return formatViewData('fansNum', text);
                        }}
                    />

                    <Column
                        title="获赞数"
                        dataIndex="likeNum"
                        key="likeNum"
                        sorter={true}
                        render={text => {
                            return formatViewData('likeNum', text);
                        }}
                    />

                    <Column
                        title="作品数"
                        dataIndex="producedVideoNum"
                        key="producedVideoNum"
                        sorter={true}
                        render={text => {
                            return formatViewData('producedVideoNum', text);
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
                        title="操作"
                        dataIndex="operation"
                        key="operation"
                        sorter={false}
                        render={text => {
                            return formatViewData('operation', text);
                        }}
                    />

                    <Column title="操作" key="action" render={this.renderAction} />
                </Table>
            </Spin>
        );
    }
}

const mapStateToProps = state => ({
    list: state.roommanage.list,
    isLoading: state.roommanage.uiStatus.isLoading,
    pagination: state.roommanage.pagination,
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
