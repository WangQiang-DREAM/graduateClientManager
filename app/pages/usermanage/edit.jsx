import React from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Col, Spin, Form } from 'antd';

import { Input, InputNumber } from 'antd';

import { actions, asyncUpdate } from './models';
import { formItemLayout, formatFormData } from './utils';
const FormItem = Form.Item;

class Edit extends React.Component {
    handleCancel = () => {
        this.props.form.resetFields();
        this.props.modalHide();
    };
    handleOk = () => {
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                await this.props.asyncUpdate(formatFormData(values));
                this.props.form.resetFields();
                this.props.modalHide();
            }
        });
    };
    render() {
        const { isModalShow, isLoading, item } = this.props;
        const { getFieldDecorator } = this.props.form;
        const form = (
            <Form>
                <Row>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="用户名">
                            {getFieldDecorator('username', {
                                initialValue: item.username,

                                rules: [
                                    {
                                        required: true,
                                        message: '请填写用户名',
                                    },
                                ],
                            })(<Input placeholder="请填写" />)}
                        </FormItem>
                    </Col>

                    <Col span={24}>
                        <FormItem {...formItemLayout} label="访问统计权限">
                            {getFieldDecorator('roles', {
                                initialValue: item.roles,

                                rules: [
                                    {
                                        required: true,
                                        message: '请填写访问统计权限',
                                    },

                                    {
                                        type: 'integer',
                                        message: '访问统计权限为整数',
                                    },
                                ],
                            })(<InputNumber placeholder="请填写" style={{ width: '100%' }} />)}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
        return (
            <Modal
                title="查看详情"
                visible={isModalShow}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                confirmLoading={isLoading}
                maskClosable={false}>
                <Spin spinning={isLoading} tip="保存中...">
                    {form}
                </Spin>
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    item: state.usermanage.list.reduce((a, b) => (b.id === state.usermanage.currentSelectId ? b : a), {}),
    isModalShow: state.usermanage.uiStatus.isUpdateShow,
    isLoading: state.usermanage.uiStatus.isLoading,
});

const mapDispatchToProps = dispatch => ({
    modalHide: () => dispatch(actions.changeUiStatus({ isUpdateShow: false })),
    asyncUpdate: contents => dispatch(asyncUpdate(contents)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Edit));
