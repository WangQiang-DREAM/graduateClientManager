import React from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Col, Spin, Form } from 'antd';

import { Input, Select } from 'antd';

const Option = Select.Option;

import { actions, asyncUpdate, asyncVagueGetTag} from './models';
import { formItemLayout, formatFormData } from './utils';
const FormItem = Form.Item;

class Edit extends React.Component {
    componentDidMount() {
        // this.props.GetchallengeName();
    }
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
    sendTag = value => {
        this.props.sendTags(value)
    }
    render() {
        const { isModalShow, isLoading } = this.props;
        const { getFieldDecorator } = this.props.form;
        const children = [ <Option value={'空标签'}>空标签</Option>];
        for (let i = 0; i < this.props.getvideoTags.length; i++) {
            children.push(<Option value={this.props.getvideoTags[i].title}>{this.props.getvideoTags[i].title}</Option>);
        }
        const form = (
            <Form>
                <Row>
                    <Col span={24}>
                        <FormItem {...formItemLayout} label="原标签">
                            {getFieldDecorator('tags', {
                                initialValue: this.props.getTag.name,
                                rules: [],
                            })(
                                <Input Disabled />
                            )}
                        </FormItem>
                    </Col>

                    <FormItem {...formItemLayout} label="修改为">
                        {getFieldDecorator('newtags', {
                            initialValue: this.props.getTag.name,
                            rules: [],
                        })(
                            <Select name="challengeName" style={{ width: 280 }}
                                showSearch
                                optionFilterProp="children"
                                onSearch={ value => {
                                    this.sendTag(value);
                                }}>
                                {children}
                            </Select>
                        )}
                    </FormItem>
                    <Col span={24} style={{ display: 'none' }}>
                        <FormItem {...formItemLayout} label="视频id">
                            {getFieldDecorator('guid', {
                                initialValue: this.props.getTag.vid,
                                rules: [],
                            })(<Input />)}
                        </FormItem>
                    </Col>
                    <Col span={24} style={{display: 'none' }}>
                        <FormItem {...formItemLayout} label="视频Url">
                            {getFieldDecorator('videoPlayUrl', {
                                initialValue: this.props.getTag.url,
                                rules: [],
                            })(<Input />)}
                        </FormItem>
                    </Col>
                    <Col span={24} style={{ display: 'none'}}>
                        <FormItem {...formItemLayout} label="审核人">
                            {getFieldDecorator('modifier', {
                                initialValue: this.props.getTag.modifier,
                                rules: [],
                            })(<Input />)}
                        </FormItem>
                    </Col>
                    <Col span={24} style={{display: 'none' }}>
                        <FormItem {...formItemLayout} label="来源">
                            {getFieldDecorator('creator', {
                                initialValue: this.props.getTag.creator,
                                rules: [],
                            })(<Input />)}
                        </FormItem>
                    </Col>

                </Row>
            </Form>
        );
        return (
            <Modal
                title="修改标签"
                visible={isModalShow}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                confirmLoading={isLoading}
                maskClosable={false}>
                <Spin spinning={isLoading} tip="保存中...">
                    {form}
                </Spin>
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    item: state.videomanage.list.reduce((a, b) => (b.id === state.videomanage.currentSelectId ? b : a), {}),
    isModalShow: state.videomanage.uiStatus.isUpdateShow,
    isLoading: state.videomanage.uiStatus.isLoading,
    getvideoTags: state.videomanage.oldvideoTags,
    getChallengeVid: state.videomanage.updateChallengeVid,
    getTag: state.videomanage.updateTag,
});

const mapDispatchToProps = dispatch => ({
    modalHide: () => dispatch(actions.changeUiStatus({ isUpdateShow: false })),
    asyncUpdate: contents => dispatch(asyncUpdate(contents)),
    // GetchallengeName: () => dispatch(asyncGetChallenge()),
    sendTags: value => dispatch(asyncVagueGetTag(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Edit));
