import React from 'react';
import styles from './search.css';
import { connect } from 'react-redux';
import { Row, Col, Button, Form, Select, Modal, Transfer, DatePicker, Input, notification } from 'antd';
import { actions, asyncSearchVideo, asyncVagueGetTag, asyncDownLoad, asyncqueryModifierNewtags } from './models';
import { formItemLayout, formatFormData } from './utils';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const downloadError = (type, msg, desc) => {
    notification[type]({
        message: msg,
        description: desc,
    });
};

class Search extends React.Component {
    state = {
        mockData: [],
        targetKeys: [],
        modifyTime: [],
    };
    componentDidMount = () => {
        const downLoadValues = formatFormData(this.props.form.getFieldsValue());
        console.log(downLoadValues);
        this.props.queryCheckTags(downLoadValues);
    };
    resetForm = () => {
        this.props.form.resetFields();
        this.props.changeSearchValues({});
    };
    handleSearch = e => {
        e.preventDefault();
        const values = formatFormData(this.props.form.getFieldsValue());
        this.props.changeSearchValues(values);
        this.props.resetPagination();
        this.props.asyncSearchVideo();
    };
    vagueSearchTags = value => {
        this.props.sendTags(value);
    };
    downLoad = () => {
        const downLoadValues = formatFormData(this.props.form.getFieldsValue());
        this.props.downLoad(downLoadValues);
    };
    open = () => {
        this.props.modalShow();
        this.getMock();
    };
    handleCancel = () => {
        this.props.modalHide();
    };
    handleOk = () => {
        let targetData = this.state.targetKeys;
        let modifyTime = this.state.modifyTime;
        console.log(modifyTime);
        if (targetData.length > 15) {
            downloadError('error', '下载失败', '一次下载标签数量不可超过15个');
            return false;
        } else if (targetData.length === 0) {
            downloadError('error', '下载失败', '请先选择标签');
            return false;
        } else if (modifyTime === []) {
            downloadError('error', '下载失败', '请选择下载数据起止时间');
            return false;
        } else {
            const downLoadValues = formatFormData(this.props.form.getFieldsValue());
            this.props.downLoad(downLoadValues, targetData, modifyTime);
            this.props.modalHide();
        }
    };
    getMock = () => {
        const targetKeys = [];
        const mockData = this.props.checkTags;
        this.setState({ mockData, targetKeys });
    };
    handleChange = targetKeys => {
        this.setState({ targetKeys });
    };
    timeRangeOk = value => {
        let modifyTime = [Date.parse(value[0]), Date.parse(value[1])];
        let downLoadValues = formatFormData(this.props.form.getFieldsValue());
        let downLoadObj = {
            modifier: downLoadValues.modifier,
            modifyTime: modifyTime,
        };
        this.props.queryCheckTags(downLoadObj);
        this.setState({ modifyTime });
    }
    render() {
        const { isModalShow, isLoading } = this.props;
        const { getFieldDecorator } = this.props.form;
        const creators = this.props.oldvideotags;
        const children = [<Select.Option value={''}>不限</Select.Option>, <Select.Option value={'空标签'}>空标签</Select.Option>];
        for (let i = 0; i < creators.length; i++) {
            children.push(<Select.Option value={creators[i].title}>{creators[i].title}</Select.Option>);
        }
        const children2 = [];
        for (let i = 0; i < creators.length; i++) {
            children2.push(<Select.Option value={creators[i].title}>{creators[i].title}</Select.Option>);
        }
        return (
            <span>
                <Form onSubmit={this.handleSearch}>
                    <Row className={styles.c_searchBox}>
                        <Col span={6}>
                            <FormItem {...formItemLayout} label="视频原标签">
                                {getFieldDecorator('tags', {})(
                                    <Select
                                        style={{ width: '100%' }}
                                        placeholder="请选择"
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
                            <FormItem {...formItemLayout} label="审核标签">
                                {getFieldDecorator('newtags', {})(
                                    <Select
                                        style={{ width: '100%' }}
                                        placeholder="请选择"
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
                            <FormItem {...formItemLayout} label="操作人">
                                {getFieldDecorator('modifier', {
                                    initialValue: this.props.userInfo,
                                })(<Input placeholder="请填写" />)}
                            </FormItem>
                        </Col>

                        <Col span={6} className={styles.m_tools}>
                            <Button onClick={this.resetForm}>重置</Button>
                            <Button type="primary" htmlType="submit">
                                搜索
                            </Button>
                            <Button
                                type="primary"
                                icon="download"
                                onClick={() => {
                                    this.open();
                                }}>
                                下载数据
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <Modal
                    width={800}
                    title="下载数据"
                    visible={isModalShow}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    confirmLoading={isLoading}
                    maskClosable={false}>
                    <Row>
                        <Col span={6} style={{ marginTop: 5 }}>
                            请先选择数据起止时间:
                        </Col>
                        <Col span={12}>
                            <RangePicker
                                showTime={{ format: 'HH:mm' }}
                                format="YYYY-MM-DD HH:mm"
                                placeholder={['Start Time', 'End Time']}
                                onOk={this.timeRangeOk}
                            />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 15 }}>
                        <Transfer
                            dataSource={this.props.checkTags}
                            showSearch
                            listStyle={{
                                width: '40%',
                                height: 400,
                            }}
                            operations={['添加标签', '删除标签']}
                            targetKeys={this.state.targetKeys}
                            onChange={this.handleChange}
                            render={item => `${item.title}-------${item.description}`}
                        />
                    </Row>
                </Modal>
            </span>
        );
    }
}

const mapStateToProps = state => ({
    userInfo: state.user.info.name,
    getuid: state.videomanage.getUid,
    searchValue: state.videomanage.searchValues,
    oldvideotags: state.videomanage.oldvideoTags,
    isModalShow: state.videomanage.uiStatus.isAddPlusShow,
    isLoading: state.videomanage.uiStatus.isLoading,
    checkTags: state.videomanage.checkTags,
});
const mapDispatchToProps = dispatch => ({
    asyncSearchVideo: () => dispatch(asyncSearchVideo()),
    changeSearchValues: params => dispatch(actions.changeSearchValues(params)),
    resetPagination: () => dispatch(actions.changePagination({ current: 1 })),
    sendTags: value => dispatch(asyncVagueGetTag(value)),
    downLoad: (value, targetData, modifyTime) => dispatch(asyncDownLoad(value, targetData, modifyTime)),
    modalHide: () => dispatch(actions.changeUiStatus({ isAddPlusShow: false })),
    modalShow: () => dispatch(actions.changeUiStatus({ isAddPlusShow: true })),
    queryCheckTags: value => dispatch(asyncqueryModifierNewtags(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Search));
