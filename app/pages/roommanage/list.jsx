import React from 'react';
import { connect } from 'react-redux';
import { Table, Spin, Popconfirm, Button} from 'antd';
const { Column } = Table;
import { actions, asyncGet, asyncUpdate, asyncGetRoomDetail, asyncGetRoomImgDetail, asyncGetRoomComments} from './models';
import { formatViewData } from './utils';
import styles from './list.css';
class List extends React.Component {
    componentDidMount() {
        this.props.asyncGet();
    }
    viewHandler = roomOrder => {
        this.props.getRoomUser(roomOrder);
        this.props.getRoomImg(roomOrder);
        this.props.viewShow();
        this.props.getRoomComments(roomOrder)
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
    offLine = roomOrder => {
        let content = {
            status: '1',
            roomOrder: roomOrder,
        };
        this.props.updateStatus(content)
    }
    onLine = roomOrder => {
        let content = {
            status: '0',
            roomOrder: roomOrder,
        };
        this.props.updateStatus(content);
    }
    renderAction = (text, record) => {
        if ( record.status == '0') {
            return (
                <span>
                    <Button
                        size="small"
                        onClick={() => {
                            this.viewHandler(record.roomOrder);
                        }}>
                        详情
                    </Button>
                    <span className="ant-divider" />
                    <Popconfirm
                        title="确定执行？"
                        okText="确定"
                        cancelText="取消"
                        onConfirm={() => {
                            this.offLine(record.roomOrder)
                        }}>
                        <Button type="danger" size="small" >下线</Button>
                    </Popconfirm>
                </span>
            );
        } else {
            return (
                <span>
                    <Button
                        size="small"
                        onClick={() => {
                            this.viewHandler(record.roomOrder);
                        }}>
                        详情
                    </Button>
                    <span className="ant-divider" />
                    <Popconfirm
                        title="确定执行？"
                        okText="确定"
                        cancelText="取消"
                        onConfirm={() => {
                            this.onLine(record.roomOrder)
                        }}>
                        <button className={styles.success}>上线</button>
                    </Popconfirm> 
                </span>
            );
        }
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
                    rowKey="roomOrder"
                    onChange={this.changeHandle}>
                    <Column
                        title="房间编号"
                        dataIndex="roomOrder"
                        key="roomOrder"
                        render={text => {
                            return formatViewData('roomOrder', text);
                        }}
                    />

                    <Column
                        title="窗户方位"
                        dataIndex="direction"
                        key="direction"
                        render={text => {
                            return formatViewData('direction', text);
                        }}
                    />
                    <Column
                        title="总床位数"
                        dataIndex="totalNum"
                        key="totalNum"
                        sorter={true}
                        render={text => {
                            return formatViewData('totalNum', text);
                        }}
                    />

                    <Column
                        title="已入住数"
                        dataIndex="userNum"
                        sorter={true}
                        key="userNum"
                        render={text => {
                            return formatViewData('userNum', text);
                        }}
                    />
                    <Column
                        title="评论数"
                        dataIndex="commentNum"
                        sorter={true}
                        key="commentNum"
                        render={text => {
                            return formatViewData('commentNum', text);
                        }}
                    />

                    <Column
                        title="负责人"
                        dataIndex="creator"
                        key="creator"
                        render={text => {
                            return formatViewData('creator', text);
                        }}
                    />

                    <Column
                        title="上传时间"
                        dataIndex="createTime"
                        key="createTime"
                        sorter={true}
                        render={text => {
                            return formatViewData('createTime', text);
                        }}
                    />
                    <Column
                        title="房间情况"
                        dataIndex="roomStatus"
                        key="roomStatus"
                        render={text => {
                            if (text == '0') {
                                return (
                                    <span style={{ color: '#00AA00' }}>
                                        {formatViewData('roomStatus', text)}
                                    </span>
                                );
                            } else {
                                return (
                                    <span style={{ color: 'red' }}>
                                        {formatViewData('roomStatus', text)}
                                    </span>
                                )
                            }
                        }}
                    />
                    <Column
                        title="房间状态"
                        dataIndex="status"
                        key="status"
                        render={text => {
                            if (text == '0') {
                                return (
                                    <span style={{ color: '#00AA00' }}>
                                        {formatViewData('status', text)}
                                    </span>
                                );
                            } else {
                                return (
                                    <span style={{ color: 'red' }}>
                                        {formatViewData('status', text)}
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
    changePagination: pagination => dispatch(actions.changePagination(pagination)),
    changeSort: data => dispatch(actions.changeSort(data)),
    updateStatus: content => dispatch(asyncUpdate(content)),
    getRoomUser: roomOrder => dispatch(asyncGetRoomDetail(roomOrder)),
    getRoomImg: roomOrder => dispatch(asyncGetRoomImgDetail(roomOrder)),
    getRoomComments: roomOrder => dispatch(asyncGetRoomComments(roomOrder)),
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
