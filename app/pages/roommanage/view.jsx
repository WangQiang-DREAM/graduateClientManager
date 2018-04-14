import React from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Col, Table, Card, Spin, Upload, Icon, message, Button} from 'antd';
import { actions, asyncGetRoomImg, asyncDelRoomPhoto} from './models';
import { formatViewData } from './utils';
const { Column } = Table;
import styles from './view.css';

const imgl = [{
    uid: -1,
    name: 'xxx.png',
    status: 'done',
    url: 'https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png',
    thumbUrl: 'https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png',
}, {
    uid: -2,
    name: 'yyy.png',
    status: 'done',
    url: 'https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png',
    thumbUrl: 'https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png',
}]
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
        }  
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
        console.log(newurl.length)
        let roomOrder = this.props.roomDetail.roomOrder;
        this.props.asyncDelRoomPhoto(newurl, roomOrder);
    }
    render() {
        const { isViewShow, isLoading, list, roomDetail} = this.props;
        let imgList = [];
        let roomimg = [];
        if (roomDetail.image !== null) {
            roomimg = roomDetail.image;
            let imgItem = {};
            for (let i = 0; i < roomimg.length; i++) {
                imgItem = {
                    uid: -(i + 1),
                    name: i + '.png',
                    status: 'done',
                    url: roomimg[i],
                };
                imgList.push(imgItem);
            }
        } 
        const props = {
            action: 'http://localhost:3300/room/upload',
            listType: 'picture-card',
            fileList: imgList,
            data: {
                roomOrder: parseInt(roomDetail.roomOrder),
                image: roomimg,
            },
            onChange: this.handleUpload,
            onRemove: this.removeImg,
        };
        return (
            <Modal title="查看详情" width={660} visible={isViewShow} onCancel={this.handleCan} footer={null}>
                <Spin spinning={isLoading} tip="请稍后...">
                    <Card style={{ width: '100%', marginBottom: 20 }} bodyStyle={{ padding: 10 }}>
                        <div style={{ padding: '0 0 5px', borderBottom: '1px solid #dcdcdc', marginBottom: '10px', color: '#000' }}> 房间图片</div>
                        <div style={{ display: 'block' }} className={styles.imgbox}>
                            <div className={styles.upload}>
                                <Upload {...props}>
                                    <Icon type="plus" />
                                    <div className={styles.ant_upload_text}>上传照片</div>
                                </Upload>
                            </div>
                        </div>
                    </Card>
                    <Table size="middle" dataSource={list} pagination={false}>
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
});

const mapDispatchToProps = dispatch => ({
    viewHide: () => dispatch(actions.changeUiStatus({ isViewShow: false })),
    getRoomImg: roomOrder => dispatch(asyncGetRoomImg(roomOrder)),
    asyncDelRoomPhoto: (newurl, roomOrder) => dispatch(asyncDelRoomPhoto(newurl, roomOrder))
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
