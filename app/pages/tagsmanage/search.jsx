import React from 'react';
import styles from './search.css';
import { connect } from 'react-redux';
import { Row, Col, Button, Form, Select, InputNumber, Input, DatePicker } from 'antd';
const RangePicker = DatePicker.RangePicker;
import moment from 'moment';

import { actions, asyncGet } from './models';
import { formItemLayout, formatFormData } from './utils';
const FormItem = Form.Item;

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
                        <FormItem {...formItemLayout} label="姓名">
                            {getFieldDecorator('name', {})(
                                <Input placeholder="请填写/支持模糊搜索" style={{ width: '100%' }} />,
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem {...formItemLayout} label="用户ID">
                            {getFieldDecorator('uid', {})(
                                <Input placeholder="请填写" style={{ width: '100%' }} />,
                            )}
                        </FormItem>
                    </Col>
                    <Col span={10}>
                        <FormItem {...formItemLayout} label="入住时间">
                            {getFieldDecorator('checkInTime', {})(
                                <RangePicker
                                    ranges={{ 今天: [moment(), moment()], '本月': [moment(), moment().endOf('month')] }}
                                    showTime
                                    format="YYYY/MM/DD"
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem {...formItemLayout} label="房间号">
                            {getFieldDecorator('roomOrder', {})(
                                <Input placeholder="请填写" style={{ width: '100%' }} />,
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem {...formItemLayout} label="用户类型">
                            {getFieldDecorator('userType', {})(
                                <Select style={{ width: '100%' }} placeholder="请选择">
                                    <Option value={'1'}>未入住</Option>
                                    <Option value={'2'}>已入住</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    
                    <Col span={12} className={styles.m_tools}>
                        <Button onClick={this.resetForm}>重置</Button>
                        <Button type="primary" htmlType="submit">
                            搜索
                        </Button>
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
});

export default connect(null, mapDispatchToProps)(Form.create()(Search));
