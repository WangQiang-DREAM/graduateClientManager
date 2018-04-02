import React from 'react';
import { connect } from 'react-redux';
import { Modal, Spin, Table, Form, Button } from 'antd';

import { Input, InputNumber } from 'antd';

import styles from './addPlus.css';
import { actions, asyncAdd } from './models';
const FormItem = Form.Item;
const { Column } = Table;

const initData = { username: '', roles: '' };

class ADD extends React.Component {
    state = {
        list: [{ ...initData }],
    };
    add = news => {
        this.setState({ list: [...this.state.list, ...news] });
    };
    del = delIndex => {
        this.setState({ list: this.state.list.filter((item, index) => index !== delIndex) });
    };
    clear = () => {
        this.setState({ list: [] });
    };
    update = (value, name, updateIndex) => {
        this.setState({
            list: this.state.list.map((item, index) => (updateIndex === index ? { ...item, [name]: value } : item)),
        });
    };
    handleCancel = () => {
        // this.props.form.resetFields();
        this.props.modalHide();
    };
    handleOk = () => {
        this.props.form.validateFields(async err => {
            if (!err) {
                await this.props.asyncAdd(this.state.list);
                this.props.form.resetFields();
                this.clear();
                this.add([{ ...initData }]);
                this.props.modalHide();
            }
        });
    };
    open = () => {
        this.props.modalShow();
    };
    render() {
        const { isModalShow, isLoading } = this.props;
        const { getFieldDecorator } = this.props.form;
        const table = (
            <Form layout="inline">
                <Table dataSource={this.state.list} pagination={false} rowClassName={() => styles.add_table}>
                    <Column
                        title="用户名"
                        key="username"
                        render={(text, item, index) => {
                            const id = 'username_' + index;
                            return (
                                <FormItem>
                                    {getFieldDecorator(id, {
                                        initialValue: item.username,

                                        rules: [
                                            {
                                                required: true,
                                                message: '请填写用户名',
                                            },
                                        ],
                                    })(
                                        <Input
                                            placeholder="请填写"
                                            onChange={e => {
                                                this.update(e.target.value, 'username', index);
                                            }}
                                        />,
                                    )}
                                </FormItem>
                            );
                        }}
                    />

                    <Column
                        title="访问统计权限"
                        key="roles"
                        render={(text, item, index) => {
                            const id = 'roles_' + index;
                            return (
                                <FormItem>
                                    {getFieldDecorator(id, {
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
                                    })(
                                        <InputNumber
                                            placeholder="请填写"
                                            style={{ width: '100%' }}
                                            onChange={value => {
                                                this.update(value, 'roles', index);
                                            }}
                                        />,
                                    )}
                                </FormItem>
                            );
                        }}
                    />
                </Table>
            </Form>
        );
        return (
            <span>
                <Button
                    onClick={() => {
                        this.open();
                    }}>
                    添加多条
                </Button>
                <Modal
                    width={800}
                    title="添加多条数据"
                    visible={isModalShow}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    confirmLoading={isLoading}
                    maskClosable={false}>
                    <Spin spinning={isLoading} tip="保存中...">
                        {table}
                    </Spin>
                    <div style={{ marginTop: 15 }}>
                        <Button
                            onClick={() => {
                                this.add([{ ...initData }]);
                            }}>
                            添加
                        </Button>
                    </div>
                </Modal>
            </span>
        );
    }
}

const mapStateToProps = state => ({
    isModalShow: state.usermanage.uiStatus.isAddPlusShow,
    isLoading: state.usermanage.uiStatus.isLoading,
});

const mapDispatchToProps = dispatch => ({
    modalHide: () => dispatch(actions.changeUiStatus({ isAddPlusShow: false })),
    modalShow: () => dispatch(actions.changeUiStatus({ isAddPlusShow: true })),
    asyncAdd: contents => dispatch(asyncAdd(contents)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ADD));
