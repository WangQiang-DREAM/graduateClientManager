import React from 'react';
import styles from './search.css';
import { connect } from 'react-redux';
import { Row, Col, Button, Form } from 'antd';

import { Input, Select } from 'antd';

import { actions, asyncGet } from './models';
import { formItemLayout, formatFormData } from './utils';
const FormItem = Form.Item;
const Option = Select.Option;

class Search extends React.Component {
    resetForm = () => {
        this.props.form.resetFields();
        this.props.changeSearchValues({});
    };
    handleSearch = e => {
        e.preventDefault();
        const values = formatFormData(this.props.form.getFieldsValue());
        this.props.changeSearchValues(values);
        this.props.resetPagination();
        this.props.asyncGet();
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch}>
                <Row className={styles.c_searchBox}>
                    <Col span={6}>
                        <FormItem {...formItemLayout} label="用户名">
                            {getFieldDecorator('username', {})(<Input placeholder="请填写" />)}
                        </FormItem>
                    </Col>

                    <Col span={6}>
                        <FormItem {...formItemLayout} label="访问权限">
                            {getFieldDecorator('roles', {})(
                                <Select defaultValue="1" style={{ width: '100%' }}>
                                    <Option value="1">普通管理员</Option>
                                    <Option value="2">超级管理员</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={6} className={styles.m_tools}>
                        <Button onClick={this.resetForm}>重置</Button>
                        <Button type="primary" htmlType="submit">
                            搜索
                        </Button>
                       
                    </Col>
                    <Col span={6} className={styles.m_tools}>
                        <Button onClick={this.props.modalShow}>添加管理员</Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    asyncGet: () => dispatch(asyncGet()),
    changeSearchValues: params => dispatch(actions.changeSearchValues(params)),
    resetPagination: () => dispatch(actions.changePagination({ current: 1 })),
    modalShow: () => dispatch(actions.changeUiStatus({ isAddShow: true })),
});

export default connect(null, mapDispatchToProps)(Form.create()(Search));
