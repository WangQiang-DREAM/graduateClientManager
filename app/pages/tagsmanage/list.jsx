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
                        title="标签ID"
                        dataIndex="key"
                        key="key"
                        sorter={false}
                        render={text => {
                            return formatViewData('key', text);
                        }}
                    />
                    <Column
                        title="标签名称"
                        dataIndex="title"
                        key="title"
                        sorter={false}
                        render={text => {
                            return formatViewData('title', text);
                        }}
                    />


                   
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