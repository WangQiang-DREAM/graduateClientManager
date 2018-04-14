import React from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Col, Spin, Form, Button } from 'antd';

import { Input, Select } from 'antd';

import { actions, asyncAdd } from './models';
import { formItemLayout, formatFormData } from './utils';
const FormItem = Form.Item;
const Option = Select.Option;

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
                        <FormItem {...formItemLayout} label="用户名">
                            {getFieldDecorator('username', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写用户名',
                                    },
                                ],
                            })(<Input style={{ width: 200 }} placeholder="请填写" />)}
                        </FormItem>
                    </Col>

                    <Col span={24}>
                        <FormItem {...formItemLayout} label="姓名">
                            {getFieldDecorator('name', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写姓名',
                                    },
                                ],
                            })(<Input style={{ width: 200 }} placeholder="请填写" />)}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="访问统计权限">
                            {getFieldDecorator('roles', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写访问统计权限',
                                    },
                                ],
                            })(
                                <Select style={{ width: 200 }}>
                                    <Option value="1">普通管理员</Option>
                                    <Option value="2">超级管理员</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
        return (
            <span>
                <Button onClick={modalShow}>添加管理员</Button>
                <Modal
                    title="添加管理员"
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
    isModalShow: state.usermanage.uiStatus.isAddShow,
    isLoading: state.usermanage.uiStatus.isLoading,
});

const mapDispatchToProps = dispatch => ({
    modalHide: () => dispatch(actions.changeUiStatus({ isAddShow: false })),
    modalShow: () => dispatch(actions.changeUiStatus({ isAddShow: true })),
    asyncAdd: contents => dispatch(asyncAdd(contents)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ADD));
