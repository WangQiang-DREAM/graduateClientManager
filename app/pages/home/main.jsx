import React from 'react';
import {connect} from 'react-redux';
import {List, Spin, Card, Col, Row, Avatar, Tooltip, Carousel,ChartCard} from 'antd';
import {actions, asyncGet, asyncDel, asyncGetLogs} from './models';
import styles from './main.css';
import moment from 'moment';
import {Link} from 'react-router-dom';
import NumberInfo from 'ant-design-pro/lib/NumberInfo';
import numeral from 'numeral';

import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/scatter';
import 'echarts/lib/chart/effectScatter';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/calendar';

class Main extends React.Component {  
    componentDidMount() {
        this.props.asyncGet();
        this.props.getLogs();
        this.showChart()
    }
    getVirtulData = year =>{
        year = year || '2017';
        var date = +echarts.number.parseDate(year + '-01-01');
        var end = +echarts.number.parseDate((+year + 1) + '-01-01');
        var dayTime = 3600 * 24 * 1000;
        var data = [];
        for (var time = date; time < end; time += dayTime) {
            data.push([
                echarts.format.formatTime('yyyy-MM-dd', time),
                Math.floor(Math.random() * 100 )
            ]);
        }
        return data;
    }
    showChart = () => {
        let myChart = echarts.init(document.getElementById('main'));
        let data = this.getVirtulData(2016);
        // 绘制图表
        myChart.setOption({
            backgroundColor: 'transparent',
            title: {
                top: 30,
                text: '托老所上半年日预约数',
                left: 'center',
                textStyle: {
                    color: '#666'
                }
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '30',
                left: '100',
                data: ['预约数', 'Top 12'],
                textStyle: {
                    color: '#999'
                }
            },
            calendar: [{
                top: 90,
                left: 'center',
                width: '100%',
                height: 270,
                range: ['2016-01-01', '2016-06-30'],
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#444',
                        width: 4,
                        type: 'solid'
                    }
                },
                yearLabel: {
                    formatter: '{start}  1st',
                    textStyle: {
                        color: '#fff'
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#999',
                        borderWidth: 1,
                        borderColor: '#555'
                    }
                }
            }],
            series: [
                {
                    name: '预约数',
                    type: 'scatter',
                    coordinateSystem: 'calendar',
                    data: data,
                    symbolSize: function (val) {
                        return val[1] / 5;
                    },
                    itemStyle: {
                        normal: {
                            color: '#ddb926'
                        }
                    }
                },
                {
                    name: 'Top 12',
                    type: 'effectScatter',
                    coordinateSystem: 'calendar',
                    data: data.sort(function (a, b) {
                        return b[1] - a[1];
                    }).slice(0, 12),
                    symbolSize: function (val) {
                        return val[1] / 5;
                    },
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    hoverAnimation: true,
                    itemStyle: {
                        normal: {
                            color: '#f4e925',
                            shadowBlur: 5,
                            shadowColor: '#999'
                        }
                    },
                    zlevel: 1
                }
            ]
        },true);
    }

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
        this.props.changeSort({key: sorter.field, order: sorter.order});
        this.props.asyncGet();
    };
    eventView = (status, name) => {
        switch (status) {
            case '1':
                return (<span style={{ display: 'inline-block', paddingLeft: '5px' }}>接受了<span style={{ display: 'inline-block', padding: '0 5px', color: '#1890ff' }}>{name}</span><span>先生的预约</span></span>);
                break;
            case '2':
                return (<span style={{ display: 'inline-block', paddingLeft: '5px' }}>拒绝了<span style={{ display: 'inline-block', padding: '0 5px', color: '#1890ff' }}>{name}</span><span>先生的预约</span></span>);
                break;
            case '3':
                return (<span>为<span style={{ display: 'inline-block', padding: '0 5px', color: '#1890ff' }}>{name}</span><span>先生办理了入住手续</span></span>);
                break;
            case '4':
                return (<span style={{ display: 'inline-block', paddingLeft: '5px' }}>结束了<span style={{ display: 'inline-block', padding: '0 5px', color: '#1890ff' }}>{name}</span><span>先生的预约</span></span>);
                break;
        };
    };
    renderActivities = ()=> {
        const list = this.props.logsData;
        return list.map(item => {
            return (
                <List.Item key={item.uid}>
                    <List.Item.Meta
                        avatar={<Avatar src={item.operatorAvatar} />}
                        title={
                            <span>
                                <a className={styles.username}>{item.operator}</a>
                                &nbsp;
                                <span className={styles.event}>{this.eventView(item.status, item.name)}</span>
                            </span>
                        }
                        description={
                            <span className={styles.datetime} title={item.operateTime}>
                                {moment(item.operateTime).fromNow()}
                            </span>
                        }
                    />
                </List.Item>
            );
        });
    }

    render() {
        const {isLoading, list, pagination} = this.props;
        let h = parseInt(new Date().getHours());
        let regard = '';
        if (h < 11) {
            regard = '早安';
        } else if (h > 13) {
            regard = '下午好';
        } else {
            regard = '午安';
        }
        return (
            <div className={styles.mainBox}>
                <div className={styles.personInfo}>
                    <Row style={{
                        height: '100%',
                    }}>
                        <Col
                            span="17"
                            style={{
                                height: '100%',
                            }}>
                            <Row
                                style={{
                                    height: '100%',
                                }}>
                                <div
                                    style={{
                                        height: '100%',
                                        float: 'left',
                                    }}>
                                    <img className={styles.big_avatar} src={this.props.manager.photo}/>
                                </div>
                                <div
                                    style={{
                                        height: '100%',
                                        float: 'left',
                                        display: 'table',
                                        marginLeft: '20px',
                                    }}>
                                    <div className={styles.perCol}>
                                        <p className={styles.info}>{regard}，{this.props.manager.name}，祝你开心每一天！</p>
                                        <p>托老所管理系统 | 管理员</p>
                                    </div>
                                </div>
                            </Row>
                        </Col>
                        <Col
                            span="7"
                            style={{
                                height: '100%',
                            }}>
                            <div className={styles.perCont}>
                                <div className={styles.perColRight}>
                                    <div className={styles.statItem}>
                                        <p>项目数</p>
                                        <p>56</p>
                                    </div>
                                    <div className={styles.statItem}>
                                        <p>团队内排名</p>
                                        <p>8<span>/24</span></p>
                                    </div>
                                    <div className={styles.statItem}>
                                        <p>项目访问</p>
                                        <p>2,223</p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div
                    style={{
                        background: '#f0f2f5',
                        padding: '25px',
                    }}>
                     
                    <Row gutter={24}>
                        <Col xl={16} lg={24} md={24} sm={24} xs={24}>
                         
                            <Card title="居住情况" bordered={false}
                                style={{marginBottom: '24px'}}
                            >
                                <Row>
                                    <Col md={6} sm={12} xs={24}>
                                        <NumberInfo
                                            subTitle="今日交易总额"
                                            suffix="元"
                                            total={numeral(124543233).format('0,0')}
                                        />
                                    </Col>
                                    <Col md={6} sm={12} xs={24}>
                                        <NumberInfo subTitle="销售目标完成率" total="92%" />
                                    </Col>
                                    <Col md={6} sm={12} xs={24}>
                                        <NumberInfo subTitle="活动剩余时间"/>
                                    </Col>
                                    <Col md={6} sm={12} xs={24}>
                                        <NumberInfo
                                            subTitle="每秒交易总额"
                                            suffix="元"
                                            total={numeral(234).format('0,0')}
                                        />
                                    </Col>
                                </Row>
                                <div className={styles.mapChart}>
                                    <div id='main' className={styles.chartbox}></div> 
                                </div>
                            </Card>
                        </Col>
                        <Col xl={8} lg={24} md={24} sm={24} xs={24}>
                            <Card
                                style={{
                                    marginBottom: 24,
                                }}
                                title="动态"
                                bordered={false}
                                bodyStyle={{
                                    padding: 0,
                                }}>
                                <List size="large">
                                    <div className={styles.activitiesList}>
                                        {this.renderActivities()}
                                    </div>
                                </List>                         
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    list: state.home.list,
    isLoading: state.home.uiStatus.isLoading,
    pagination: state.home.pagination,
    manager: state.user.info,
    logsData: state.home.logsData,
});

const mapDispatchToProps = dispatch => ({
    asyncGet: () => dispatch(asyncGet()),
    asyncDel: id => dispatch(asyncDel(id)),
    viewShow: () => dispatch(actions.changeUiStatus({isViewShow: true})),
    addShow: () => dispatch(actions.changeUiStatus({isAddShow: true})),
    editShow: () => dispatch(actions.changeUiStatus({isUpdateShow: true})),
    changeCurrentSelectId: id => dispatch(actions.changeCurrentSelectId(id)),
    changePagination: pagination => dispatch(actions.changePagination(pagination)),
    changeSort: data => dispatch(actions.changeSort(data)),
    getLogs:() => dispatch(asyncGetLogs())
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
