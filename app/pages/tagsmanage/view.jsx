import React from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Col, Form ,Input} from 'antd';
import { actions } from './models';
import { formatViewData} from './utils';
import styles from './view.css';
const FormItem = Form.Item;
const formItemLayout  ={
    labelCol: { span: 10, offset: 2 },
    wrapperCol: { span: 12 },
}
class View extends React.Component {
    handleCancel = () => {
        this.props.viewHide();
    };
    render() {
        const { isViewShow, UserDetail } = this.props;
        return (
            <Modal title="查看详情" width={600} visible={isViewShow} onCancel={this.handleCancel} footer={null}>
                <div className={styles.person_detail}>
                    <div className={styles.detail_hearder}>
                        <img src={UserDetail.avatar} alt="" className={styles.userlogo} />
                        <div className={styles.userInfo}>
                            <p className={styles.nickname}>{UserDetail.name}</p>
                        </div>
                    </div>
                    <div className={styles.detail_body}>
                        <Row className={styles.detailRow}>
                            <FormItem {...formItemLayout} label="年龄:" style={{marginBottom:0}}>
                                {UserDetail.age}
                            </FormItem>
                            <FormItem {...formItemLayout} label="性别:" style={{ marginBottom: 0 }}>
                                <span>{formatViewData('sex', UserDetail.sex)}</span>
                            </FormItem>
                            <FormItem {...formItemLayout} label="邮箱:" style={{ marginBottom: 0 }}>
                                <span>{UserDetail.email}</span>
                            </FormItem>
                            <FormItem {...formItemLayout} label="家庭住址:" style={{ marginBottom: 0}}>
                                {UserDetail.familyAddress}
                            </FormItem>
                            <FormItem {...formItemLayout} label="房间号:" style={{ marginBottom: 0 }}>
                                <span>{UserDetail.roomOrder}</span>
                            </FormItem>
                            <FormItem {...formItemLayout} label="床位号:" style={{ marginBottom: 0 }}>
                                <span>{UserDetail.bedId}</span>
                            </FormItem>
                            <FormItem {...formItemLayout} label="入住时间:" style={{ marginBottom: 0 }}>
                                <span>{formatViewData('checkInTime', UserDetail.checkInTime)}</span>
                            </FormItem>
                            <FormItem {...formItemLayout} label="注册时间:" style={{ marginBottom: 0 }}>
                                <span>{formatViewData('registerTime', UserDetail.registerTime)}</span>
                            </FormItem>
                            <FormItem {...formItemLayout} label="家属姓名:" style={{ marginBottom: 0 }}>
                                <span>{UserDetail.familyName}</span>
                            </FormItem>
                            <FormItem {...formItemLayout} label="家属联系方式:" style={{ marginBottom: 0 }}>
                                <span>{UserDetail.familyPhone}</span>
                            </FormItem>
                           

                            { /*<Col span={24} className={styles.detailCol}>
                                <span>年龄：</span> <span>{UserDetail.age}</span>
                            </Col>
                            <Col span={24} className={styles.detailCol}>
                                <span>性别：</span>
                                <span>{formatViewData('sex', UserDetail.sex)}</span>
                            </Col>
                            <Col span={24} className={styles.detailCol}>
                                <span>家庭住址：</span>
                                <span>{UserDetail.familyAddress}</span>
                            </Col>
                            <Col span={24} className={styles.detailCol}>
                                <span>房间号：</span>
                                <span>{UserDetail.roomOrder}</span>
                            </Col>
                            <Col span={24} className={styles.detailCol}>
                                <span>床位号：</span>
                                <span>{UserDetail.bedId}</span>
                            </Col>
                            <Col span={24} className={styles.detailCol}>
                                <span>入住时间：</span>
                                <span>{formatViewData('checkInTime', UserDetail.checkInTime)}</span>
                            </Col>
                            <Col span={24} className={styles.detailCol}>
                                <span>注册时间：</span>
                                <span>{formatViewData('registerTime', UserDetail.registerTime)}</span>
                            </Col>
                            <Col span={24} className={styles.detailCol}>
                                <span>家属姓名：</span>
                                <span>{UserDetail.familyName}</span>
                            </Col>
                            <Col span={24} className={styles.detailCol}>
                                <span>家属联系方式：</span>
                                <span>{UserDetail.familyPhone}</span>
                            </Col>
                            <Col span={24} className={styles.detailCol}>
                                <span>邮箱：</span>
                                <span>{UserDetail.email}</span>
                            </Col>
        */ }
                        </Row>
                    </div>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    isViewShow: state.tagsmanage.uiStatus.isViewShow,
    UserDetail: state.tagsmanage.userDetail,
});

const mapDispatchToProps = dispatch => ({
    viewHide: () => dispatch(actions.changeUiStatus({ isViewShow: false })),
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
