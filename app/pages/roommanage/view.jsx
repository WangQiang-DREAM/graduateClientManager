import React from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Col, Table, Card, Spin, Upload, Icon, Avatar, Button, List, Rate} from 'antd';
import { actions, asyncGetRoomImg, asyncDelRoomPhoto} from './models';
import { formatViewData } from './utils';
const { Column } = Table;
import styles from './view.css';
import moment from 'moment';

class View extends React.Component {
    handleCan = () => {
        this.props.viewHide();
    };
    getInitialState() {
        return {
            priviewVisible: false,
            priviewImage: '',
        };
    }
    handleCancel() {
        this.setState({
            priviewVisible: false,
        });
    }
    handleUpload = info => {
        if (info.file.status == 'uploading') {
            let roomOrder = this.props.roomDetail.roomOrder;
            this.props.getRoomImg(roomOrder);
        };  
    }
    removeByValue(arr, val) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == val) {
                arr.splice(i, 1);
                break;
            }
        }
        return arr; 
    }
    removeImg = file => {
        let oldimgurl = this.props.roomDetail.image;
        let newurl = this.removeByValue(oldimgurl, file.url);
        let roomOrder = this.props.roomDetail.roomOrder;
        this.props.asyncDelRoomPhoto(newurl, roomOrder);
    }
    renderActivities = () => {
        const list = this.props.roomComments;
        return list.map(item => {
            return (
                <List.Item key={item.commentId}>
                    <List.Item.Meta
                        avatar={<Avatar src={'http:////123.207.163.226:3300/img/user/default.jpg'} />}
                        title={
                            <div>
                                <span>
                                    <a className={styles.username}>{item.user.name}</a>
                                </span>
                                <span style={{marginLeft: 15}}>
                                    <Rate disabled defaultValue={4} style={{fontSize: 12}}/>
                                </span>
                                <span className={styles.datetime} title={item.createTime}>
                                    {formatViewData('createTime', item.createTime)}
                                </span>
                            </div>
                        }
                        description={
                            <div>
                                <span className={styles.comments}>
                                    {item.content}
                                </span> 
                            </div>
                        }
                    />
                </List.Item>
            );
        });
    }
    render() {
        const { isViewShow, isLoading, list, roomDetail} = this.props;
        let imgList = [];
        let roomimg = [];
        if (roomDetail.image !== null) {
            roomimg = roomDetail.image;
            let imgItem = {};
            for (let i = 0, item; item = roomimg[i++];) {
                imgItem = {
                    uid: -i,
                    name: i + '.png',
                    status: 'done',
                    url: item,
                };
                imgList.push(imgItem);
            }
        }; 
        const props = {
            action: 'http://123.207.164.37:3300/room/upload',
            listType: 'picture-card',
            fileList: imgList,
            data: {
                roomOrder: parseInt(roomDetail.roomOrder),
                image: roomimg,
            },
            onChange: this.handleUpload,
            onRemove: this.removeImg,
        };
        let photonum = roomDetail.image.length;
        let coommentnum = this.props.roomComments.length;
        return (
            <Modal className={styles.modal} title="查看房间详情" width={'66%'} visible={isViewShow} onCancel={this.handleCan} footer={null}>
                <Spin spinning={isLoading} tip="请稍等...">
                    <Table size="small" bordered dataSource={list} pagination={false} style={{
                        marginBottom: 15,
                        background: '#fff',
                        padding: '10px'
                    }}>
                        <Column
                            title="床位号"
                            dataIndex="bedId"
                            key="bedId"
                            render={text => {
                                return formatViewData('bedId', text);
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
                            title="家属姓名"
                            dataIndex="familyName"
                            key="familyName"
                            render={text => {
                                return formatViewData('familyName', text);
                            }}
                        />
                        <Column
                            title="家属联系方式"
                            dataIndex="familyPhone"
                            key="familyNamePhone"
                            render={text => {
                                return formatViewData('familyPhone', text);
                            }}
                        />
                    </Table> 
                    <Card style={{ width: '100%', marginBottom: 15 }} bodyStyle={{ padding: 10 }} bordered={false}>
                        <div style={{ padding: '0 0 5px 10px', borderBottom: '1px solid #dcdcdc', marginBottom: '10px', color: '#000' }}> 房间图片({photonum})</div>
                        <div style={{ display: 'block' }} className={styles.imgbox}>
                            <div className={styles.upload}>
                                <Upload {...props}>
                                    <Icon type="plus" />
                                    <div className={styles.ant_upload_text}>上传照片</div>
                                </Upload>
                            </div>
                        </div>
                    </Card>
                    <Card
                        bordered={false}
                        bodyStyle={{
                            padding: 10
                        }}>
                        <div style={{ padding: '0 0 5px 10px', borderBottom: '1px solid #dcdcdc', marginBottom: '10px', color: '#000' }}> 评价({coommentnum})</div>
                        <List size="small">
                            <div className={styles.activitiesList}>
                                {this.renderActivities()}
                            </div>
                        </List>
                    </Card>
                </Spin>    
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    item: state.roommanage.list.reduce((a, b) => (b.id === state.roommanage.currentSelectId ? b : a), {}),
    isViewShow: state.roommanage.uiStatus.isViewShow,
    roomDetail: state.roommanage.roomImgDetail,
    list: state.roommanage.roomDetail,
    isLoading: state.roommanage.uiStatus.isLoading,
    roomComments: state.roommanage.roomComments,
});

const mapDispatchToProps = dispatch => ({
    viewHide: () => dispatch(actions.changeUiStatus({ isViewShow: false })),
    getRoomImg: roomOrder => dispatch(asyncGetRoomImg(roomOrder)),
    asyncDelRoomPhoto: (newurl, roomOrder) => dispatch(asyncDelRoomPhoto(newurl, roomOrder))
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
