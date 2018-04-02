import React from 'react';
import { connect } from 'react-redux';
import { Button, Row, Col, Select, Icon, InputNumber, message, Slider, Switch } from 'antd';
import styles from './list.css';
import { actions, asyncGet, asyncUpdate, asyncGetVIdeo, asyncQueryUser, asyncgetChangedTagsTotal } from './models';

class List extends React.Component {
    componentDidMount() {
        this.props.asyncGet();
        this.props.asyncGetVIdeo();
        this.props.queryUser();
        this.props.ChangedTagsTotal();
    }
    state = {
        jumpValue: '',
        videoSpeed: 1,
        selectTags: [],
    };

    viewHandler = id => {
        this.props.viewShow();
        this.props.changeCurrentSelectId(id);
    };
    editHandler = id => {
        this.props.editShow();
        this.props.changeCurrentSelectId(id);
    };
    changeHandle = (pagination, filters, sorter) => {
        this.props.changePagination(pagination);
        this.props.changeSort({ key: sorter.field, order: sorter.order });
        this.props.asyncGet();
    };
    changeUrl = index => {
        if (index === 1) {
            let current = this.props.pagination.current;
            let pagination = {
                current: current - 1,
                total: this.props.pagination.total,
                pageSize: this.props.pagination.pageSize,
            };
            if (current <= 1) {
                message.warning('已经是第一条啦！');
            } else {
                this.props.changePagination(pagination);
                this.props.asyncGetVIdeo();
                let speed = this.state.videoSpeed;
                document.getElementById('videoAuto').addEventListener('play', function() {
                    document.getElementById('videoAuto').playbackRate = speed;
                });
            }
        } else {
            let current = this.props.pagination.current;
            if ( this.props.searchValue.modifier === '标签审核小助手') {
                if (this.props.getCheckTags.newtags.length === 0) {
                    let contents = {
                        newtags: '冷宫',
                        guid: this.props.videodata.guid,
                    };
                    this.props.asyncUpdate(contents);
                    let total = this.props.changedTagsTotal.total;
                    let todayTotal =  this.props.changedTagsTotal.todayTotal;
                    let alltotal = {
                        total: total + 1,
                        todayTotal: todayTotal + 1,
                    };
                    this.props.addTagsTotal(alltotal);
                }
                let pagination = {
                    current: current,
                    total: this.props.pagination.total,
                    pageSize: this.props.pagination.pageSize,
                };
                if (current >= this.props.pagination.total) {
                    message.warning('已经是最后一条啦！');
                } else {
                    this.props.changePagination(pagination);
                    this.props.asyncGetVIdeo();
                    const selectTags = [];
                    this.setState({ selectTags });
                    let speed = this.state.videoSpeed;
                    document.getElementById('videoAuto').addEventListener('play', function() {
                        document.getElementById('videoAuto').playbackRate = speed;
                    });
                }
            } else {
                let pagination = {
                    current: current + 1,
                    total: this.props.pagination.total,
                    pageSize: this.props.pagination.pageSize,
                };
                if (current >= this.props.pagination.total) {
                    message.warning('已经是最后一条啦！');
                } else {
                    this.props.changePagination(pagination);
                    this.props.asyncGetVIdeo();
                    let speed = this.state.videoSpeed;
                    document.getElementById('videoAuto').addEventListener('play', function() {
                        document.getElementById('videoAuto').playbackRate = speed;
                    });
                }
            }
        }
    };
    onClick = value => { 
        this.state.videoSpeed = value;
        this.refs.video.playbackRate = this.state.videoSpeed;
    };
    onChange = value => {
        const jumpValue = value;
        this.setState({ jumpValue });
    };
    changeTags = title => {
        let Tags = this.props.selectVideoTags;
        console.log(Tags)
        for ( let i = 0; i < Tags.length; i++) {
            if (Tags[i].tag === title) {
                Tags[i].select = true;
                this.state.selectTags.push(Tags[i]);
            }
        }
        console.log( this.state.selectTags)
        let contents = {
            newtags: title,
            guid: this.props.videodata.guid,
        };
        this.props.asyncUpdate(contents);
        let total = this.props.changedTagsTotal.total;
        let todayTotal =  this.props.changedTagsTotal.todayTotal;
        let alltotal = {
            total: total + 1,
            todayTotal: todayTotal + 1,
        }
        this.props.addTagsTotal(alltotal);
    };
    jump = () => {
        const pagination = {
            current: this.state.jumpValue,
            total: this.props.pagination.total,
            pageSize: this.props.pagination.pageSize,
        };
        this.props.changePagination(pagination);
        this.props.asyncGetVIdeo();
    };
    autoPlay = function() {
        let that = this;
        let video = document.getElementById('videoAuto');
        video.addEventListener('ended', function() {
            that.changeUrl();
        });
    };
    switchPlay = function(checked) {
        if (checked) {
            document.getElementById('videoAuto').play();
        } else {
            document.getElementById('videoAuto').pause();
        }
    };
    render() {
        let selecttag = [];
        if (sessionStorage.selectTags) {
            selecttag = JSON.parse(sessionStorage.selectTags).tags;
        } else {
            selecttag = [{ tag: '暂不处理' }];
        }
        const Option = Select.Option;
        const tagsli = [];
        for (let i = 0; i < selecttag.length; i++) {
            tagsli.push(
                <Col span={24}>
                    <input
                        type="button"
                        value={selecttag[i].tag}
                        onClick={() => {
                            this.changeTags(selecttag[i].tag);
                        }}
                    />
                </Col>,
            );
        }
        let Tags = '';
        const oldtags = this.props.videodata.tags;
        for (let i in oldtags) {
            if (i < oldtags.length - 1 && oldtags[i] !== '') {
                Tags += oldtags[i] + ',';
            } else {
                Tags += oldtags[i];
            }
        }
        return (
            <div className={styles.box}>
                <div className={styles.boxtop}>
                    <Col span={14}>
                        <div className={styles.playNum}>
                            <span>
                                当前第<i className={styles.currentNum}>{this.props.pagination.current}</i>条
                            </span>
                            <span>
                                共<i className={styles.currentNum}>{this.props.pagination.total}</i>条
                            </span>
                            <span className={styles.changedname}>
                                已更改<i className={styles.changed}>{this.props.changedTagsTotal.total}</i>条
                            </span>
                            <span className={styles.changedname}>
                                今日更改<i className={styles.changed}>{this.props.changedTagsTotal.todayTotal}</i>条
                            </span>
                            <span>
                                跳转到<InputNumber className={styles.tiaozhuan} onChange={this.onChange} />条
                            </span>
                            <Button onClick={this.jump}>跳</Button>
                        </div>
                    </Col>
                    <Col span={10}>
                        <div className={styles.playNum}>
                            <span>
                                审核标签：<i className={styles.checkNum}>{this.props.getCheckTags.newtags}</i>
                            </span>
                        </div>
                    </Col>
                    <Col span={24}>
                        <div className={styles.playNum}>
                            <span>
                                当前视频标签：<i className={styles.currentTag}>{Tags}</i>
                            </span>
                        </div>
                    </Col>
                </div>
                <div className={styles.c_list}>
                    <Row>
                        <Col xs={24} sm={24} md={24} lg={14} xl={14}>
                            <div className={styles.playvideo}>
                                
                                <Row className={styles.playvideos}>
                                    <video
                                        ref="video"
                                        id="videoAuto"
                                        src={this.props.videodata.videoPlayUrl}
                                        width="400"
                                        height="580"
                                        controls="controls"
                                        autoPlay
                                    />
                                </Row>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                            <div className={styles.tags}>
                                <div className={styles.tagcontent}>{tagsli}</div>
                                <div className={styles.operator}>
                                    <Row>
                                        <div className={styles.next}>
                                            <Button
                                                type="primary"
                                                className={styles.nextBut}
                                                size="large"
                                                onClick={() => {
                                                    this.changeUrl(1);
                                                }}>
                                                <Icon type="left" />上一个
                                            </Button>
                                            <Button
                                                type="primary"
                                                className={styles.nextBut}
                                                size="large"
                                                onClick={() => {
                                                    this.changeUrl(2);
                                                }}>
                                                下一个<Icon type="right" />
                                            </Button>
                                            
                                        </div>
                                    </Row>
                                    <Row>
                                        <div className={styles.next}>
                                            <Button
                                                className={styles.autoBut}
                                                size="large"
                                                onClick={() => {
                                                    this.autoPlay();
                                                }}>
                                                自动播放
                                            </Button>
                                            <div className={styles.playspeed}>
                                                <Select
                                                    className={styles.downspeed}
                                                    defaultValue="1"
                                                    style={{ width: 140}}
                                                    onChange={this.onClick}
                                                    dropdownClassName={styles.selectDown}>
                                                    <Option value="1">1倍播放</Option>
                                                    <Option value="2">2倍播放</Option>
                                                    <Option value="3">3倍播放</Option>
                                                    <Option value="4">4倍播放</Option>
                                                </Select>
                                            </div>
                                        </div>
                                    </Row>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    list: state.videotag.list,
    isLoading: state.videotag.uiStatus.isLoading,
    pagination: state.videotag.pagination,
    videodata: state.videotag.videoData,
    videotags: state.videotag.videoTags,
    selectVideoTags: state.videotag.selectVideoTags,
    getCheckTags: state.videotag.checkTags,
    modifierInfo: state.videotag.modifierInfo,
    searchValue: state.videotag.searchValues,
    changedTagsTotal: state.videotag.changedTagsTotal,
});

const mapDispatchToProps = dispatch => ({
    asyncGet: () => dispatch(asyncGet()),
    asyncGetVIdeo: () => dispatch(asyncGetVIdeo()),
    asyncDel: id => dispatch(asyncDel(id)),
    viewShow: () => dispatch(actions.changeUiStatus({ isViewShow: true })),
    addShow: () => dispatch(actions.changeUiStatus({ isAddShow: true })),
    editShow: () => dispatch(actions.changeUiStatus({ isUpdateShow: true })),
    changeCurrentSelectId: id => dispatch(actions.changeCurrentSelectId(id)),
    changePagination: pagination => dispatch(actions.changePagination(pagination)),
    changeSort: data => dispatch(actions.changeSort(data)),
    changeSelectTags: data => dispatch(actions.getSelectVideoTags(data)),
    asyncUpdate: contents => dispatch(asyncUpdate(contents)),
    clearCheckTags: ([]) => dispatch(actions.getCheckTags([])),
    queryUser: () => dispatch(asyncQueryUser()),
    addTagsTotal: index => dispatch(actions.getChangedTagsTotal(index)),
    ChangedTagsTotal: ()=> dispatch(asyncgetChangedTagsTotal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
