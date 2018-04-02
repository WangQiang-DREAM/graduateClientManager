import React from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Col, Spin, Form } from 'antd';

import { InputNumber, Input } from 'antd';

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
                        <FormItem {...formItemLayout} label="序号">
                            {getFieldDecorator('orderNumber', {
                                initialValue: item.orderNumber,

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
                                initialValue: item.id,

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
                                initialValue: item.nickName,

                                rules: [],
                            })(<Input placeholder="请填写" />)}
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
    item: state.videohandle.list.reduce((a, b) => (b.id === state.videohandle.currentSelectId ? b : a), {}),
    isModalShow: state.videohandle.uiStatus.isUpdateShow,
    isLoading: state.videohandle.uiStatus.isLoading,
});

const mapDispatchToProps = dispatch => ({
    modalHide: () => dispatch(actions.changeUiStatus({ isUpdateShow: false })),
    asyncUpdate: contents => dispatch(asyncUpdate(contents)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Edit));
