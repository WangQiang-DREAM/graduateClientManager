import React from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Button } from 'antd';
import { Row, Col, Select } from 'antd';
import { actions, asyncGet} from './models';
import { formItemLayout, formatFormData } from './utils';
const FormItem = Form.Item;
class ADD extends React.Component {
    
    vagueSearchTags = value => {
        this.props.sendTags(value);
    }
    handleCancel = () => {
        this.props.modalHide();
    };
    handleOk = () => {
        const values = formatFormData(this.props.form.getFieldsValue());
        console.log(values)
        let tags = [];
        if (typeof(values.tags) === 'string') {
            let tag = {
                tag: values.tags,
                select: false,
            };
            tags.push(tag);
        } else {
            for (let i = 0; i < values.tags.length; i++) {
                let tag = {
                    tag: values.tags[i],
                    select: false,
                };
                tags.push(tag);
            }
        };
        window.sessionStorage.setItem('selectTags', JSON.stringify({ 'tags': tags }));
        this.props.changeSelectTags(tags);
        this.props.modalHide();
    };
    handleTags =() => {
        let modalSelectTags = [];
        if (sessionStorage.selectTags) {
            let sessionTags = JSON.parse(sessionStorage.selectTags).tags;
            for (let i = 0; i < sessionTags.length; i++) {
                modalSelectTags.push(sessionTags[i].tag);
            }
        } else {
            modalSelectTags.push('暂不处理');
        };
        this.props.form.setFieldsValue({ 'tags': modalSelectTags });
        this.props.modalShow();
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { isModalShow, isLoading } = this.props;
        const creators = this.props.videotags;
        const children = [];
        for (let i = 0; i < creators.length; i++) {
            children.push(<Select.Option value={creators[i].title}>{creators[i].title}</Select.Option>);
        }
        return (
            <span>
                <Button onClick={this.handleTags}>编辑标签</Button>
                <Modal
                    width={800}
                    height={400}
                    title="标签编辑"
                    visible={isModalShow}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    confirmLoading={isLoading}
                    maskClosable={false}>
                    <Form onSubmit={this.handleSearch}>
                        <Row >
                            <Col span={6}>
                                <FormItem {...formItemLayout} label="视频标签">
                                    {getFieldDecorator('tags', {
                                        initialValue: this.props.selectTags[0].tag,
                                    })(
                                        <Select
                                            style={{ width: 660 }}
                                            placeholder="请选择"
                                            showSearch
                                            mode="multiple"
                                            optionFilterProp="children"
                                            onSearch={ value => {
                                                this.vagueSearchTags(value);
                                            }}
                                        >
                                            {children}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </span>
        );
    }
}

const mapStateToProps = state => ({
    isModalShow: state.videotag.uiStatus.isAddShow,
    isLoading: state.videotag.uiStatus.isLoading,
    videotags: state.videotag.videoTags,
    selectTags: state.videotag.selectVideoTags,
    videoTagsPagination: state.videotag.videoTagsPagination,
});

const mapDispatchToProps = dispatch => ({
    modalHide: () => dispatch(actions.changeUiStatus({ isAddShow: false })),
    modalShow: () => dispatch(actions.changeUiStatus({ isAddShow: true })),
    changeSelectTags: data =>dispatch(actions.getSelectVideoTags(data)),
    changeTags: current => dispatch(asyncGet(current)),
    sendTags: value => dispatch(asyncGet(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ADD));
