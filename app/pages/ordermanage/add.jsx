import React from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Col, Spin, Form, Button } from 'antd';

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
                        <FormItem {...formItemLayout} label="序号">
                            {getFieldDecorator('orderNumber', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写序号',
                                    },

                                    {
                                        type: 'integer',
                                        message: '序号为整数',
                                    },
                                ],
                            })(<InputNumber placeholder="请填写" style={{ width: '100%' }} />)}
                        </FormItem>
                    </Col>

                    <Col span={24}>
                        <FormItem {...formItemLayout} label="ID">
                            {getFieldDecorator('id', {
                                rules: [
                                    {
                                        type: 'integer',
                                        message: 'ID为整数',
                                    },
                                ],
                            })(<InputNumber placeholder="请填写" style={{ width: '100%' }} />)}
                        </FormItem>
                    </Col>

                    <Col span={24}>
                        <FormItem {...formItemLayout} label="昵称">
                            {getFieldDecorator('nickName', {
                                rules: [],
                            })(<Input placeholder="请填写" />)}
                        </FormItem>
                    </Col>

                    <Col span={24}>
                        <FormItem {...formItemLayout} label="关注数">
                            {getFieldDecorator('followNum', {
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
                        <FormItem {...formItemLayout} label="粉丝数">
                            {getFieldDecorator('fansNum', {
                                rules: [
                                    {
                                        type: 'integer',
                                        message: '粉丝数为整数',
                                    },
                                ],
                            })(<InputNumber placeholder="请填写" style={{ width: '100%' }} />)}
                        </FormItem>
                    </Col>

                    <Col span={24}>
                        <FormItem {...formItemLayout} label="获赞数">
                            {getFieldDecorator('likeNum', {
                                rules: [
                                    {
                                        type: 'integer',
                                        message: '获赞数为整数',
                                    },
                                ],
                            })(<InputNumber placeholder="请填写" style={{ width: '100%' }} />)}
                        </FormItem>
                    </Col>

                    <Col span={24}>
                        <FormItem {...formItemLayout} label="作品数">
                            {getFieldDecorator('producedVideoNum', {
                                rules: [
                                    {
                                        type: 'integer',
                                        message: '作品数为整数',
                                    },
                                ],
                            })(<InputNumber placeholder="请填写" style={{ width: '100%' }} />)}
                        </FormItem>
                    </Col>

                    <Col span={24}>
                        <FormItem {...formItemLayout} label="注册时间">
                            {getFieldDecorator('registerTime', {
                                rules: [],
                            })(<DatePicker style={{ width: '100%' }} placeholder="请选择" />)}
                        </FormItem>
                    </Col>

                    <Col span={24}>
                        <FormItem {...formItemLayout} label="操作">
                            {getFieldDecorator('operation', {
                                rules: [],
                            })(<Input placeholder="请填写" />)}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
        return (
            <span>
                <Button onClick={modalShow}>添加一条</Button>
                <Modal
                    title="添加单条数据"
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
    isModalShow: state.ordermanage.uiStatus.isAddShow,
    isLoading: state.ordermanage.uiStatus.isLoading,
});

const mapDispatchToProps = dispatch => ({
    modalHide: () => dispatch(actions.changeUiStatus({ isAddShow: false })),
    modalShow: () => dispatch(actions.changeUiStatus({ isAddShow: true })),
    asyncAdd: contents => dispatch(asyncAdd(contents)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ADD));
