import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Form, Select, Input } from 'antd';
import styles from './search.css';
import { actions, asyncGetVIdeo, asyncVagueGetTag, asyncgetChangedTagsTotal } from './models';
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
        this.props.asyncGetVideo();
        this.props.ChangedTagsTotal();
    };
    vagueSearchTags = value => {
        this.props.sendTags(value);
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const creators = this.props.oldvideotags;
        const children = [<Select.Option value={''}>不限</Select.Option>, <Select.Option value={'空标签'}>空标签</Select.Option>];
        for (let i = 0; i < creators.length; i++) {
            children.push(<Select.Option value={creators[i].title}>{creators[i].title}</Select.Option>);
        }
        const child = [<Select.Option value={''}>不限</Select.Option>, <Select.Option value={'标签审核小助手'}>标签审核小助手</Select.Option>];
        for (let i = 0; i < this.props.modifierInfo.length; i++) {
            child.push(
                <Select.Option value={this.props.modifierInfo[i].username}>{this.props.modifierInfo[i].username}</Select.Option>,
            );
        }
        const children2 = [<Select.Option value={'暂不处理'}>暂不处理</Select.Option>];
        for (let i = 0; i < creators.length; i++) {
            children2.push(<Select.Option value={creators[i].title}>{creators[i].title}</Select.Option>);
        }
        return (
            <Form onSubmit={this.handleSearch}>
                <Row className={styles.c_searchBox}>
                    <Col span={6}>
                        <FormItem {...formItemLayout} label="视频原标签">
                            {getFieldDecorator('tags', {})(
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="请选择原标签"
                                    showSearch
                                    optionFilterProp="children"
                                    onSearch={value => {
                                        this.vagueSearchTags(value);
                                    }}>
                                    {children}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem {...formItemLayout} label="操作人">
                            {getFieldDecorator('modifier', {
                                initialValue: '标签审核小助手',
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
                    <Col span={6}>
                        <FormItem {...formItemLayout} label="审核标签">
                            {getFieldDecorator('newtags', {})(
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="请输入审核标签"
                                    showSearch
                                    optionFilterProp="children"
                                    onSearch={value => {
                                        this.vagueSearchTags(value);
                                    }}>
                                    {children2}
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem {...formItemLayout} label="背景音乐">
                            {getFieldDecorator('musicInfo', {})(
                                <Input
                                    style={{ width: '100%' }}
                                    placeholder="背景音乐"
                                    showSearch
                                    optionFilterProp="children"
                                />,
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
    oldvideotags: state.videotag.oldvideoTags,
    modifierInfo: state.videotag.modifierInfo,
    checkTags: state.videotag.checkTags,
});
const mapDispatchToProps = dispatch => ({
    asyncGetVideo: () => dispatch(asyncGetVIdeo()),
    changeSearchValues: params => dispatch(actions.changeSearchValues(params)),
    resetPagination: () => dispatch(actions.changePagination({ current: 1 })),
    sendTags: value => dispatch(asyncVagueGetTag(value)),
    ChangedTagsTotal: ()=> dispatch(asyncgetChangedTagsTotal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Search));
