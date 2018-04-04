import React from 'react';
import styles from './search.css';
import { connect } from 'react-redux';
import { Row, Col, Button, Form ,Select} from 'antd';

import { InputNumber, Input, DatePicker } from 'antd';

import moment from 'moment';
const RangePicker = DatePicker.RangePicker;
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
                        <FormItem {...formItemLayout} label="房间编号">
                            {getFieldDecorator('roomOrder', {})(<InputNumber placeholder="请填写" style={{ width: '100%' }} />)}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem {...formItemLayout} label="窗户方位">
                            {getFieldDecorator('direction', {
                            })(
                                <Select style={{ width: '100%' }} placeholder="请选择">
                                    <Option value={'南'}>朝南</Option>
                                    <Option value={'北'}>朝北</Option>
                                    <Option value={'东'}>朝东</Option>
                                    <Option value={'西'}>朝西</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={10}>
                        <FormItem {...formItemLayout} label="添加时间">
                            {getFieldDecorator('insertTime', {})(
                                <RangePicker
                                    ranges={{ 今天: [moment(), moment()], '本月': [moment(), moment().endOf('month')] }}
                                    showTime
                                    format="YYYY/MM/DD"
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem {...formItemLayout} label="房间情况">
                            {getFieldDecorator('roomStatus', {
                            })(
                                <Select style={{ width: '100%' }} placeholder="请选择">
                                    <Option value={'0'}>可入住</Option>
                                    <Option value={'1'}>已住满</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem {...formItemLayout} label="房间状态">
                            {getFieldDecorator('status', {
                            })(
                                <Select style={{ width: '100%' }} placeholder="请选择">
                                    <Option value={'0'}>在线</Option>
                                    <Option value={'1'}>已下线</Option>
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
