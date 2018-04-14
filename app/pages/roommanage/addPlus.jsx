import React from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Col, Table, Card, Spin, Upload, Icon } from 'antd';


import moment from 'moment';

import styles from './addPlus.css';
import { actions, asyncGet } from './models';
const { Column } = Table;
  
class ADD extends React.Component {
    handleCan = () => {
        this.props.viewHide();
        this.props.get()
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

    render() {
        const { isViewShow, isLoading, list } = this.props;
        let img = [];
        let imgList = [];
        let roomimg = this.props.roomDetail;
        for (let i = 0; i < roomimg.length; i++) {
            img.push(<img src={formatViewData('image', roomimg[i])} className={styles.user_avatar} />)
        }
        let imgItem = {}
        for (let i = 0; i < roomimg.length; i++) {
            imgItem = {
                uid: -(i + 1),
                name: i + '.png',
                status: 'done',
                url: roomimg[i],
                thumbUrl: roomimg[i],
            }
            imgList.push(imgItem)
        }
        console.log(imgList)
        const props = {
            action: 'http://localhost:3000/room/upload',
            listType: 'picture-card',
            data: {
                roomOrder: 1104,
                image: [
                    "http://localhost:8080/house/house1.jpg",
                    "http://localhost:8080/house/house2.jpg",
                    "http://localhost:8080/house/house3.jpg"
                ]
            },
            defaultFileList: imgList

        };
        return (
            <Modal
                title="添加房间信息"
                width={660}
                visible={isViewShow}
                onCancel={this.handleCan}
                onOk={this.handleCan} >
                <Spin spinning={isLoading} tip="加载中...">
                    <Card style={{ width: '100%', marginBottom: 20 }} bodyStyle={{ padding: 10 }}>
                        <div style={{ padding: '0 0 5px', borderBottom: '1px solid #dcdcdc', marginBottom: '10px', color: '#000' }}> 房间图片</div>
                        <div style={{ display: 'block' }}>
                            <div>
                                <Upload {...props}>
                                    <Icon type="plus" />
                                    <div className={styles.uploadtext}>上传照片</div>
                                </Upload>
                            </div>
                        </div>
                    </Card>
                    <Table size="middle" dataSource={list}>
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
    isModalShow: state.usermanage.uiStatus.isAddPlusShow,    
    roomDetail: state.roommanage.currentRoomDetail,
    list: state.roommanage.roomDetail,
    isLoading: state.roommanage.uiStatus.isLoading,
});

const mapDispatchToProps = dispatch => ({
    viewHide: () => dispatch(actions.changeUiStatus({ isViewShow: false })),
    get: () => dispatch(asyncGet())
});

export default connect(mapStateToProps, mapDispatchToProps)(ADD);

