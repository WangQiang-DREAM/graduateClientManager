import React from 'react';
import { connect } from 'react-redux';
import { asyncLogin } from '../../common/models/user';
import { actions } from './models';
import { Icon, Button, Spin, Input, Form } from 'antd';
const FormItem = Form.Item;
import { afterLogin } from 'utils';
import styles from './login.css';
class Comp extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                this.props.changeUiStatus({ isLoading: true });
                await this.props.asyncLogin(values.userName, values.password);
                this.props.changeUiStatus({ isLoading: false });
                afterLogin();
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { isLoading } = this.props;
        return (
              <div className={styles.main}>
            <Spin spinning={isLoading} tip="登录中...">
                    <div className={styles.box} style={{ margin: '100px auto', width: '300px', 'textAlign': 'center' }}>
                        <div style={{ 'marginBottom': '20px' }}>请输入用户名和密码</div>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <FormItem>
                                {getFieldDecorator('userName', {
                                    rules: [{ required: true, message: '请输入域账户用户名!' }],
                                })(<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />)}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: '请输入密码!' }],
                                })(
                                    <Input
                                        prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                                        type="password"
                                        placeholder="密码"
                                    />,
                                )}
                            </FormItem>
                            <FormItem>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    登录
                                </Button>
                            </FormItem>
                        </Form>
                    </div>
                
            </Spin>
            </div>
        );
    }
}

const mapStateToProps = state => ({ ...state.user.info, ...state.login.uiStatus });

const mapDispatchToProps = dispatch => ({
    asyncLogin: (name, password) => dispatch(asyncLogin(name, password)),
    changeUiStatus: status => dispatch(actions.changeUiStatus(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Comp));
