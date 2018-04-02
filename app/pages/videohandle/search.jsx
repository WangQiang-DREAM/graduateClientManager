import React from 'react';
import styles from './search.css';
import { connect } from 'react-redux';
import { Row, Col, Button, Form, DatePicker, InputNumber, Input, Select } from 'antd';
import moment from 'moment';
import { actions, asyncGet, asyncGetTotalData, asyncGetWeekData } from './models';
import { formItemLayout, formatFormData } from './utils';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
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
        this.props.asyncGetTotalData();
        this.props.asyncGetWeekData();
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const child = [<Select.Option value={''}>不限</Select.Option>, <Select.Option value={'标签审核小助手'}>标签审核小助手</Select.Option>];
        for (let i = 0; i < this.props.modifierInfo.length; i++) {
            child.push(
                <Select.Option value={this.props.modifierInfo[i].username}>{this.props.modifierInfo[i].username}</Select.Option>,
            );
        }
        return (
            <Form onSubmit={this.handleSearch}>
                <Row className={styles.c_searchBox}>
                    <Col span={6}>
                        <FormItem {...formItemLayout} label="操作时间">
                            {getFieldDecorator('modifyTime', {
                            })(
                                <DatePicker 
                                    defaultValue={moment(new Date, 'YYYY/MM/DD')}
                                />
                            )}
                        </FormItem>
                    </Col> 
                    <Col span={6}>
                        <FormItem {...formItemLayout} label="操作人">
                            {getFieldDecorator('modifier', {
                                initialValue: this.props.name,
                            })(
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="请选择操作人"
                                    showSearch
                                    optionFilterProp="child">
                                    {child}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>     
                    <Col span={6} className={styles.m_tools}>
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
const mapStateToProps = state => ({
    modifierInfo: state.videohandle.modifierInfo,
    name: state.user.info.name,
});
const mapDispatchToProps = dispatch => ({
    asyncGet: () => dispatch(asyncGet()),
    asyncGetTotalData: () => dispatch(asyncGetTotalData()),
    asyncGetWeekData: () => dispatch(asyncGetWeekData()),
    changeSearchValues: params => dispatch(actions.changeSearchValues(params)),
    resetPagination: () => dispatch(actions.changePagination({ current: 1 })),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Search));
