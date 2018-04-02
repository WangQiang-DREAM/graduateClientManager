import React from 'react';
import { connect } from 'react-redux';
import { Table, Spin, Button } from 'antd';
const { Column } = Table;
import { actions, asyncGet } from './models';
import { formatViewData } from './utils';

class List extends React.Component {
    componentDidMount() {
        this.props.asyncGet();
    }
    viewHandler = src => {
        this.props.viewShow();
        this.props.changeVideoSrc(src);
    };
    editHandler = (name, vid, url, creator, modifier ) => {
        let data = {
            name: name,
            vid: vid,
            url: url,
            creator: creator,
            modifier: modifier,
        }
        this.props.editShow();
        this.props.changetag(data);
    };
    changeHandle = (pagination, filters, sorter) => {
        // 如果是页数不变，则是排序触发，页数重置为1
        let current = this.props.pagination.current === pagination.current ? 1 : pagination.current;
        // 如果排序字段没有，则排序为空
        this.props.changeSort({
            key: sorter.field,
            order: sorter.order,
        });
        this.props.changePagination(current);
        this.props.asyncGet();
    };

    renderAction = (text, record) => {

        return (
            <span>
                <Button
                    type="primary"
                    href="#"
                    onClick={() => {
                        this.viewHandler(record.videoPlayUrl);
                    }}>
                    播放
                </Button>

                <span className="ant-divider" />
                <Button
                    onClick={() => {
                        this.editHandler(record.tags, record.guid, record.videoPlayUrl, record.creator, record.modifier);
                    }}>
                    修改标签
                </Button>
            </span>
        );
    };
    render() {
        const { isLoading, list, pagination } = this.props;
        return (
            <Spin spinning={isLoading} tip="加载中...">
                <Table
                    expandedRowRender={ record => <p style={{ margin: 0 }}>视频地址：{record.videoPlayUrl}</p>}
                    dataSource={list}
                    pagination={{
                        ...pagination,
                    }}
                    bordered
                    onChange={this.changeHandle}>

                    <Column
                        title="视频来源"
                        dataIndex="creator"
                        key="creator"
                        sorter={false}
                        render={text => {
                            return formatViewData('creator', text);
                        }}
                    />
                    <Column
                        title="视频原标签"
                        dataIndex="tags"
                        key="tags"
                        sorter={false}
                        render={text => {
                            return formatViewData('tags', text);
                        }}
                    />
                    <Column
                        title="审核标签"
                        dataIndex="newtags"
                        key="newtags"
                        sorter={false}
                        render={text => {
                            return formatViewData('newtags', text);
                        }}
                    />
                    <Column
                        title="操作人"
                        dataIndex="modifier"
                        key="modifier"
                        sorter={false}
                        render={text => {
                            return formatViewData('modifier', text);
                        }}
                    />
                    <Column
                        title="操作时间"
                        dataIndex="modifyTime"
                        key="modifyTime"
                        sorter={true}
                        render={text => {
                            return formatViewData('modifyTime', text);
                        }}
                    />
                    <Column title="操作" key="action" render={this.renderAction} />
                </Table>
            </Spin>
        );
    }
}

const mapStateToProps = state => ({
    list: state.videomanage.list,
    isLoading: state.videomanage.uiStatus.isLoading,
    pagination: state.videomanage.pagination,
    playVideo: state.videomanage.playVideo,
});

const mapDispatchToProps = dispatch => ({
    asyncGet: () => dispatch(asyncGet()),
    changeVideoSrc: url => dispatch(actions.getVideo(url)),
    changetag: data => dispatch(actions.getTag(data)),
    changeChallengeVid: vid => dispatch(actions.getChallengeVid(vid)),
    viewShow: () => dispatch(actions.changeUiStatus({ isViewShow: true })),
    addShow: () => dispatch(actions.changeUiStatus({ isAddShow: true })),
    editShow: () => dispatch(actions.changeUiStatus({ isUpdateShow: true })),
    changeCurrentSelectId: id => dispatch(actions.changeCurrentSelectId(id)),
    changePagination: currentPage => dispatch(actions.changePagination({ current: currentPage })),
    changeSort: data => dispatch(actions.changeSort(data)),
    changeStatus: (vid, status) => dispatch(asynchangeVideoStatus(vid, status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
