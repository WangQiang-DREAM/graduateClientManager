import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Menu, Dropdown, Icon, Modal, Form, Input,Spin,Row,Col } from 'antd';
import { changeUiStatus, actions, asyncheckUser, asynUpdateManagerPassword} from '../../common/models/user';
const createForm = Form.create;
const FormItem = Form.Item;
import styles from './index.css'

function noop() {
    return false;
}
class View extends React.Component {
    handleCancel = () => {
        this.props.viewHide();
    };
    state =  {
        passBarShow: false, // 是否显示密码强度提示条
        rePassBarShow: false,
        passStrength: 'L', // 密码强度
        rePassStrength: 'L',
        isLoading: false,
        
    }

    handleSubmit =() =>{
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            this.props.updatePassword(values.rePass);
            console.log('Submit!!!');
            console.log(values);
        });
    }
    checkPass =(rule, value, callback)=> {
        const form = this.props.form;
        if (form.getFieldValue('pass')) {
            form.validateFields(['rePass'], { force: true });
        }
        callback();
    }

    checkPass2 =(rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('pass')) {
            callback('两次输入密码不一致！');
        } else {
            callback();
        }
    }
    next = () => {
        this.props.form.validateFields(async (errors, values) => {
            this.props.changeUiStatus({ isLoading: true });
            await this.props.checkUser(values.userName, values.password);
            this.props.changeUiStatus({ isLoading: false });
        });
    }
    render() {
        const { getFieldProps } = this.props.form;
        const { getFieldDecorator } = this.props.form;
        const passProps = getFieldProps('pass', {
            rules: [
                { required: true, whitespace: true, message: '请填写密码' },
                { validator: this.checkPass },
            ],
            onChange: e => {
                console.log('你的密码就是这样被盗的：', e.target.value);
            },
        });
        const rePassProps = getFieldProps('rePass', {
            rules: [{
                required: true,
                whitespace: true,
                message: '请再次输入密码',
            }, {
                validator: this.checkPass2,
            }],
        });
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const form2 = (
            <Form style = {{display: this.props.form2loading}}>
                <Row>
                    <Col span="18">
                        <FormItem
                            {...formItemLayout}
                            label="新密码"
                        >
                            <Input {...passProps} type="password"
                                onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                                autoComplete="off" id="pass"
                            />
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span="18">
                        <FormItem
                            {...formItemLayout}
                            label="确认密码"
                        >
                            <Input {...rePassProps} type="password"
                                onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                                autoComplete="off" id="rePass"
                            />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <Button type="primary" onClick={this.handleSubmit} style={{ display: 'block', width: '100px', float: 'right' }}>确定</Button>
                    </Col>
                </Row>
            </Form>
        );
        const form1 = (
            <Form onSubmit={this.next} style={{ display: this.props.form1loading }}>
                <Row>
                    <Col span="18">
                        <FormItem
                            {...formItemLayout}
                            label="用户名"
                        >
                            {getFieldDecorator('userName', {
                                initialValue: this.props.userinfo.user_name,
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(<Input placeholder="用户名" />)}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="18">
                        <FormItem
                            {...formItemLayout}
                            label="原密码"
                        >
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入原密码!' }],
                            })(
                                <Input
                                    type="password"
                                    placeholder="请输入原密码"
                                />,
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <Button type="primary" onClick={this.next} style={{display:'block', width: '100px',float: 'right'}}>下一步</Button>
                    </Col>
                </Row>
            </Form>
        );
        return (
            <span>
                <Modal
                    width={600}
                    title="密码修改"
                    footer={false}
                    visible={this.props.ViewModal}
                    onCancel={this.handleCancel}
                    maskClosable={false}>
                    <Spin spinning={this.props.isLoading} tip="进行中...">
                        {form1}
                        {form2}
                    </Spin>
                </Modal>
            </span>
        );
    }
}

const mapStateToProps = state => ({
    userinfo: state.user.info,
    ViewModal: state.user.uiStatus.isViewShow,
    isLoading: state.user.uiStatus.isLoading,
    form2loading: state.user.uiStatus.form2loading,
    form1loading: state.user.uiStatus.form1loading,
});

const mapDispatchToProps = dispatch => ({
    asyncLogout: () => dispatch(asyncLogout()),
    viewHide: () => dispatch(actions.changeUiStatus({ isViewShow: false })),
    checkUser: (name, password) => dispatch(asyncheckUser(name, password)),
    changeUiStatus: status => dispatch(actions.changeUiStatus(status)),
    updatePassword: pass => dispatch(asynUpdateManagerPassword(pass))
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(View));
