import React from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Col, Spin, Form, Button, Select, Upload, Icon} from 'antd';

import { InputNumber, Input, DatePicker } from 'antd';

import moment from 'moment';

import { actions, asyncAdd } from './models';
import { formItemLayout, formatFormData } from './utils';
const FormItem = Form.Item;

class ADD extends React.Component {
    handleCancel = () => {
        this.props.form.resetFields();
        this.props.modalHide();
    };
    handleOk = () => {
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                await this.props.asyncAdd([formatFormData(values)]);
                this.props.form.resetFields();
                this.props.modalHide();
            }
        });
    };
    render() { 
        const { isModalShow, isLoading, modalShow } = this.props;
        const { getFieldDecorator } = this.props.form;
        const form = (
            <Form>
                <Row>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="房间编号">
                            {getFieldDecorator('roomOrder', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写编号',
                                    },

                                    {
                                        type: 'integer',
                                        message: '编号为整数',
                                    },
                                ],
                            })(<InputNumber placeholder="请填写" style={{ width: '100%' }} />)}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="窗户防位">
                            {getFieldDecorator('direction', {
                                rules: [],
                            })(
                                <Select style={{ width: 200 }}>
                                    <Option value={'南'}>朝南</Option>
                                    <Option value={'北'}>朝北</Option>
                                    <Option value={'东'}>朝东</Option>
                                    <Option value={'西'}>朝西</Option>
                                </Select>

                            )}
                        </FormItem>
                    </Col>

                   
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="房间状态">
                            {getFieldDecorator('status', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写访问统计权限',
                                    },
                                ],
                            })(
                                <Select style={{ width: 200 }}>
                                    <Option value="0">在线</Option>
                                    <Option value="1">已下线</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={24}>
                        <FormItem {...formItemLayout} label="可入住人数">
                            {getFieldDecorator('totalNum', {
                                rules: [
                                    {
                                        type: 'integer',
                                        message: '关注数为整数',
                                    },
                                ],
                            })(<InputNumber placeholder="请填写" style={{ width: '100%' }} />)}
                        </FormItem>
                    </Col>

                    <Col span={24}>
                       
                    </Col>

                </Row>
            </Form>
        );
        return (
            <span>
                <Button onClick={modalShow}>添加房间信息</Button>
                <Modal
                    title="添加房间信息"
                    visible={isModalShow}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    confirmLoading={isLoading}
                    maskClosable={false}>
                    <Spin spinning={isLoading} tip="保存中...">
                        {form}
                    </Spin>
                </Modal>
            </span>
        );
    }
}

const mapStateToProps = state => ({
    isModalShow: state.roommanage.uiStatus.isAddShow,
    isLoading: state.roommanage.uiStatus.isLoading,
    roomDetail: state.roommanage.currentRoomDetail,
});

const mapDispatchToProps = dispatch => ({
    modalHide: () => dispatch(actions.changeUiStatus({ isAddShow: false })),
    modalShow: () => dispatch(actions.changeUiStatus({ isAddShow: true })),
    asyncAdd: contents => dispatch(asyncAdd(contents)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ADD));
