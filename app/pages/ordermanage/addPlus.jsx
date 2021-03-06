import React from 'react';
import { connect } from 'react-redux';
import { Modal, Spin, Table, Form, Button } from 'antd';

import { InputNumber, Input, DatePicker } from 'antd';

import moment from 'moment';

import styles from './addPlus.css';
import { actions, asyncAdd } from './models';
const FormItem = Form.Item;
const { Column } = Table;

const initData = {
    orderNumber: '',
    id: '',
    nickName: '',
    followNum: '',
    fansNum: '',
    likeNum: '',
    producedVideoNum: '',
    registerTime: '2018-04-04T08:18:35.406Z',
    operation: '',
};

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
                        title="序号"
                        key="orderNumber"
                        render={(text, item, index) => {
                            const id = 'orderNumber_' + index;
                            return (
                                <FormItem>
                                    {getFieldDecorator(id, {
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
                                    })(
                                        <InputNumber
                                            placeholder="请填写"
                                            style={{ width: '100%' }}
                                            onChange={value => {
                                                this.update(value, 'orderNumber', index);
                                            }}
                                        />,
                                    )}
                                </FormItem>
                            );
                        }}
                    />

                    <Column
                        title="ID"
                        key="id"
                        render={(text, item, index) => {
                            const id = 'id_' + index;
                            return (
                                <FormItem>
                                    {getFieldDecorator(id, {
                                        initialValue: item.id,

                                        rules: [
                                            {
                                                type: 'integer',
                                                message: 'ID为整数',
                                            },
                                        ],
                                    })(
                                        <InputNumber
                                            placeholder="请填写"
                                            style={{ width: '100%' }}
                                            onChange={value => {
                                                this.update(value, 'id', index);
                                            }}
                                        />,
                                    )}
                                </FormItem>
                            );
                        }}
                    />

                    <Column
                        title="昵称"
                        key="nickName"
                        render={(text, item, index) => {
                            const id = 'nickName_' + index;
                            return (
                                <FormItem>
                                    {getFieldDecorator(id, {
                                        initialValue: item.nickName,

                                        rules: [],
                                    })(
                                        <Input
                                            placeholder="请填写"
                                            onChange={e => {
                                                this.update(e.target.value, 'nickName', index);
                                            }}
                                        />,
                                    )}
                                </FormItem>
                            );
                        }}
                    />

                    <Column
                        title="关注数"
                        key="followNum"
                        render={(text, item, index) => {
                            const id = 'followNum_' + index;
                            return (
                                <FormItem>
                                    {getFieldDecorator(id, {
                                        initialValue: item.followNum,

                                        rules: [
                                            {
                                                type: 'integer',
                                                message: '关注数为整数',
                                            },
                                        ],
                                    })(
                                        <InputNumber
                                            placeholder="请填写"
                                            style={{ width: '100%' }}
                                            onChange={value => {
                                                this.update(value, 'followNum', index);
                                            }}
                                        />,
                                    )}
                                </FormItem>
                            );
                        }}
                    />

                    <Column
                        title="粉丝数"
                        key="fansNum"
                        render={(text, item, index) => {
                            const id = 'fansNum_' + index;
                            return (
                                <FormItem>
                                    {getFieldDecorator(id, {
                                        initialValue: item.fansNum,

                                        rules: [
                                            {
                                                type: 'integer',
                                                message: '粉丝数为整数',
                                            },
                                        ],
                                    })(
                                        <InputNumber
                                            placeholder="请填写"
                                            style={{ width: '100%' }}
                                            onChange={value => {
                                                this.update(value, 'fansNum', index);
                                            }}
                                        />,
                                    )}
                                </FormItem>
                            );
                        }}
                    />

                    <Column
                        title="获赞数"
                        key="likeNum"
                        render={(text, item, index) => {
                            const id = 'likeNum_' + index;
                            return (
                                <FormItem>
                                    {getFieldDecorator(id, {
                                        initialValue: item.likeNum,

                                        rules: [
                                            {
                                                type: 'integer',
                                                message: '获赞数为整数',
                                            },
                                        ],
                                    })(
                                        <InputNumber
                                            placeholder="请填写"
                                            style={{ width: '100%' }}
                                            onChange={value => {
                                                this.update(value, 'likeNum', index);
                                            }}
                                        />,
                                    )}
                                </FormItem>
                            );
                        }}
                    />

                    <Column
                        title="作品数"
                        key="producedVideoNum"
                        render={(text, item, index) => {
                            const id = 'producedVideoNum_' + index;
                            return (
                                <FormItem>
                                    {getFieldDecorator(id, {
                                        initialValue: item.producedVideoNum,

                                        rules: [
                                            {
                                                type: 'integer',
                                                message: '作品数为整数',
                                            },
                                        ],
                                    })(
                                        <InputNumber
                                            placeholder="请填写"
                                            style={{ width: '100%' }}
                                            onChange={value => {
                                                this.update(value, 'producedVideoNum', index);
                                            }}
                                        />,
                                    )}
                                </FormItem>
                            );
                        }}
                    />

                    <Column
                        title="注册时间"
                        key="registerTime"
                        render={(text, item, index) => {
                            const id = 'registerTime_' + index;
                            return (
                                <FormItem>
                                    {getFieldDecorator(id, {
                                        initialValue: moment(item.registerTime),

                                        rules: [],
                                    })(
                                        <DatePicker
                                            style={{ width: '100%' }}
                                            placeholder="请选择"
                                            onChange={value => {
                                                this.update(value, 'registerTime', index);
                                            }}
                                        />,
                                    )}
                                </FormItem>
                            );
                        }}
                    />

                    <Column
                        title="操作"
                        key="operation"
                        render={(text, item, index) => {
                            const id = 'operation_' + index;
                            return (
                                <FormItem>
                                    {getFieldDecorator(id, {
                                        initialValue: item.operation,

                                        rules: [],
                                    })(
                                        <Input
                                            placeholder="请填写"
                                            onChange={e => {
                                                this.update(e.target.value, 'operation', index);
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
    isModalShow: state.ordermanage.uiStatus.isAddPlusShow,
    isLoading: state.ordermanage.uiStatus.isLoading,
});

const mapDispatchToProps = dispatch => ({
    modalHide: () => dispatch(actions.changeUiStatus({ isAddPlusShow: false })),
    modalShow: () => dispatch(actions.changeUiStatus({ isAddPlusShow: true })),
    asyncAdd: contents => dispatch(asyncAdd(contents)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ADD));
