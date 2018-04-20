import React from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Spin, Form, InputNumber, Input, Divider, Radio, Select, Col, Cascader} from 'antd';

import moment from 'moment';

import { actions, asyncUpdate } from './models';
import { formItemLayout, formatFormData } from './utils';
const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const areaData = [{
    value: 'zhejiang',
    label: '浙江',
    children: [{
        value: 'hangzhou',
        label: '杭州',
        children: [{
            value: 'xihu',
            label: '西湖',
        }],
    }],
}, {
    value: 'jiangsu',
    label: '江苏',
    children: [{
        value: 'nanjing',
        label: '南京',
        children: [{
            value: 'zhonghuamen',
            label: '中华门',
        }],
    }],
}];
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
        const { getFieldProps } = this.props.form;
        const form = (
            <Form>
                <FormItem {...formItemLayout} hasFeedback label="姓名">
                    {getFieldDecorator('name', {
                        rules: [
                            {
                                required: true,
                                message: '请填写姓名',
                            }
                        ],
                    })(<Input placeholder="请填写" style={{ width: '120px' }} />)}
                </FormItem>
                <Row>
                    <Col span={24}>
                        <FormItem
                            label="身份证"
                            {...formItemLayout}
                            hasFeedback
                        > 
                            {getFieldDecorator('idCardNum', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写身份证号码',
                                    },
                                    {
                                        min: 18, 
                                        max: 18,
                                        message: '身份证号码为 18位'
                                    }
                                ],
                            })(<Input placeholder="请填写" style={{ width: '260px' }} />)}
                        </FormItem>
                    </Col>
                </Row>
                <FormItem {...formItemLayout} hasFeedback label="年龄">
                    {getFieldDecorator('age', {
                        rules: [
                            {
                                required: true,
                                message: '请填写年龄',
                            },
                            {
                                type: 'integer',
                                message: '年龄为整数',
                            }
                        ],
                    })(<InputNumber placeholder="请填写" style={{ width: '120px' }} />)}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="性别"
                    required
                    hasFeedback
                >
                    {getFieldDecorator('sex', {
                        rules: [
                            {
                                required: true,
                                message: '请填写性别',
                            }
                        ],
                    })(
                        <RadioGroup>
                            <Radio value={0}>男</Radio>
                            <Radio value={1}>女</Radio>
                        </RadioGroup>)}
                </FormItem>
                
                <FormItem
                    label="家庭住址"
                    {...formItemLayout}
                    required
                    hasFeedback
                >
                    {getFieldDecorator('familyAddress', {
                        rules: [
                            {
                                required: true,
                                message: '请填写住址',
                            }
                        ],
                    })(<Cascader style={{ width: 250 }} options={areaData} />
                    )}     
                </FormItem>
                <FormItem hasFeedback {...formItemLayout} label="家属姓名">
                    {getFieldDecorator('familyName', {
                        rules: [
                            {
                                required: true,
                                message: '请填写家属姓名',
                            }
                        ],
                    })(<Input style={{width: 150}} placeholder="请填写" />)}
                </FormItem>     
                <FormItem
                    label="家属联系方式"
                    {...formItemLayout}
                    hasFeedback
                >
                    {getFieldDecorator('familyPhone', {
                        rules: [
                            {
                                required: true,
                                message: '请填写家属联系方式',
                            },
                            {
                                type: 'integer',
                                message: '联系方式为整数',
                            },
                        ],
                    })(<InputNumber placeholder="请填写" style={{ width: '180px' }} />)}
                   
                </FormItem>
                <Divider style={{ margin: '40px 0 24px' }} />
                <FormItem
                    label="房间床位选择"
                    {...formItemLayout}
                    required
                    hasFeedback
                >
                    {getFieldDecorator('roombed', {
                        rules: [
                            {
                                required: true,
                                message: '请填写',
                            }
                        ],
                    })(<Cascader style={{ width: 250 }} options={this.props.roomnum} />
                    )}
                </FormItem>
            </Form>
        );
        return (
            <Modal
                title="入住办理"
                visible={isModalShow}
                onOk={this.handleOk}
                okText='提交'
                cancelText='取消'
                width={835}
                onCancel={this.handleCancel}
                confirmLoading={isLoading}
                maskClosable={false}>
                <Spin spinning={isLoading} tip="保存中...">
                    <div style={{padding: '10px 10px 10px 10px'}}> 
                        {form}
                    </div>
                </Spin>
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    item: state.ordermanage.list.reduce((a, b) => (b.id === state.ordermanage.currentSelectId ? b : a), {}),
    isModalShow: state.ordermanage.uiStatus.isUpdateShow,
    isLoading: state.ordermanage.uiStatus.isLoading,
    roomnum: state.ordermanage.roomNum,
    appoInfo: state.ordermanage.currentAppo,
});

const mapDispatchToProps = dispatch => ({
    modalHide: () => dispatch(actions.changeUiStatus({ isUpdateShow: false })),
    asyncUpdate: contents => dispatch(asyncUpdate(contents)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Edit));
