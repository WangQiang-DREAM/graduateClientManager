import React from 'react';
import { connect } from 'react-redux';
import { Table, Spin, Button, Popconfirm } from 'antd';
const { Column } = Table;
import { actions, asyncGet, asyncDel } from './models';
import { formatViewData } from './utils';

class List extends React.Component {
    componentDidMount() {
        this.props.asyncGet();
    }

    changeHandle = (pagination, filters, sorter) => {
        this.props.changePagination(pagination);
        this.props.changeSort({ key: sorter.field, order: sorter.order });
        this.props.asyncGet();
    };

    removeManager = uid => {
        this.props.asyncDel(uid);
    };

    renderAction = (text, record) => {
        return (
            <Popconfirm
                title="确定删除？"
                okText="确定"
                cancelText="取消"
                onConfirm={()=>{
                    this.removeManager(record.uid);
                }}
            >
                <Button type='danger'>删除</Button>
            </Popconfirm>
        )
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
                        width={'25%'}
                        title="管理员用户名"
                        dataIndex="username"
                        key="username"
                        sorter={false}
                        render={text => {
                            return formatViewData('username', text);
                        }}
                    />
                    <Column
                        width={'25%'}
                        title="管理员名称"
                        dataIndex="name"
                        key="name"
                        sorter={false}
                        render={text => {
                            return formatViewData('name', text);
                        }}
                    />
                    <Column
                        width={'25%'}
                        title="访问权限"
                        dataIndex="roles"
                        key="roles"
                        render={text => {
                            if (text[0] === 1) {
                                return <span style={{ color: '#00AA00' }}>{formatViewData('roles', text)}</span>;
                            } else {
                                return <span style={{ color: 'red' }}>{formatViewData('roles', text)}</span>;
                            }
                        }}
                    />

                    <Column
                        width={'25%'}
                        title="操作"
                        key="action"
                        render={this.renderAction}
                    />
                </Table>
            </Spin>
        );
    }
}

const mapStateToProps = state => ({
    list: state.usermanage.list,
    isLoading: state.usermanage.uiStatus.isLoading,
    pagination: state.usermanage.pagination,
});

const mapDispatchToProps = dispatch => ({
    asyncGet: () => dispatch(asyncGet()),
    asyncDel: uid => dispatch(asyncDel(uid)),
    viewShow: () => dispatch(actions.changeUiStatus({ isViewShow: true })),
    addShow: () => dispatch(actions.changeUiStatus({ isAddShow: true })),
    editShow: () => dispatch(actions.changeUiStatus({ isUpdateShow: true })),
    changeCurrentSelectId: id => dispatch(actions.changeCurrentSelectId(id)),
    changePagination: pagination => dispatch(actions.changePagination(pagination)),
    changeSort: data => dispatch(actions.changeSort(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
