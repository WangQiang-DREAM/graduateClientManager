import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Table, Spin, Popconfirm, Icon, Tooltip  } from 'antd';
import numeral from 'numeral';
const { Column } = Table;
import { actions, asyncGet, asyncDel, asyncQueryUser, asyncGetTotalData, asyncGetWeekData} from './models';
import { formatViewData } from './utils';
import { Bar, TagCloud, TimelineChart, Pie, ChartCard, yuan, Field, MiniProgress} from 'ant-design-pro/lib/Charts';
import Trend from 'ant-design-pro/lib/Trend';
import styles from './list.css';

class List extends React.Component {  
    componentDidMount() {
        this.props.queryUser();
        this.props.asyncGet();
        this.props.asyncGetTotalData();
        this.props.asyncGetWeekData();   
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
        this.props.changeSort({ key: sorter.field, order: sorter.order });
        this.props.asyncGet();
    };
    renderAction = (text, record) => (
        <span>
            <a
                href="#"
                onClick={() => {
                    this.viewHandler(record.id);
                }}>
                查看
            </a>
            <span className="ant-divider" />
            <a
                href="#"
                onClick={() => {
                    this.editHandler(record.id);
                }}>
                编辑
            </a>
            <span className="ant-divider" />
            <Popconfirm
                title="确定删除该条信息？"
                okText="确定删除"
                cancelText="取消删除"
                onConfirm={() => {
                    this.props.asyncDel(record.id);
                }}>
                <a href="#">删除</a>
            </Popconfirm>
        </span>
    );
    render() {
        const salesData = this.props.weekdata;
       
        const chartData = [];
        for (let i = 0; i < 12; i += 1) {
            chartData.push({
                x: (1000 * 60 * 60 ) + (1000 * 60 * 60 * i),
                y1: this.props.perdata[i],
            });
        }
        const tags = [];
        for (let i = 0; i < 20; i += 1) {
            tags.push({
                name: `TagClout-Title-${i}`,
                value: Math.floor((Math.random() * 50)) + 20,
            });
        }
        const salesPieData = this.props.totaldata;
        const { isLoading, list, pagination } = this.props;
        return (
            <Spin spinning={isLoading} tip="加载中...">
                <div className={styles.chart}>
                    <div className={styles.Chart}>
                        <ChartCard
                            title="日工作量"
                            action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
                            contentHeight={330}
                        > 
                            <TimelineChart
                                height={250}
                                data={chartData}                                                                                   
                                titleMap={{ y1: '时点工作量' }}
                            />
                        </ChartCard>
                    </div>
                    <div className={styles.listChart}>
                        <Row>
                            <Col span={8}>
                                <ChartCard
                                    title="日工作总量"
                                    action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
                                    contentHeight={670}
                                >         
                                    <div>
                                        <Pie
                                            hasLegend
                                            title="当日工作总量"
                                            subTitle="当日工作总量"
                                            total={salesPieData.reduce((pre, now) => now.y + pre, 0)}
                                            data={salesPieData}
                                            valueFormat={val => val}
                                            height={250}
                                        />
                                    </div>
                                </ChartCard>
                            </Col>
                            <Col span={16}>
                                <div>
                                    <ChartCard
                                        title="最近五天工作量"
                                        action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
                                        contentHeight={270}
                                    >  
                                        <Bar
                                            height={250}
                                            title=""
                                            data={salesData}
                                        />
                                    </ChartCard>
                                </div>
                                <div className={styles.tags}>
                                  
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Spin>
        );
    }
}

const mapStateToProps = state => ({
    list: state.videohandle.list,
    isLoading: state.videohandle.uiStatus.isLoading,
    pagination: state.videohandle.pagination,
    perdata: state.videohandle.perData,
    totaldata: state.videohandle.totalData,
    weekdata: state.videohandle.weekData,
    modifier: state.videohandle.searchValues.modifier,
});

const mapDispatchToProps = dispatch => ({
    asyncGet: () => dispatch(asyncGet()),
    asyncGetTotalData: () => dispatch(asyncGetTotalData()),
    asyncGetWeekData: () => dispatch(asyncGetWeekData()),
    asyncDel: id => dispatch(asyncDel(id)),
    viewShow: () => dispatch(actions.changeUiStatus({ isViewShow: true })),
    addShow: () => dispatch(actions.changeUiStatus({ isAddShow: true })),
    editShow: () => dispatch(actions.changeUiStatus({ isUpdateShow: true })),
    changeCurrentSelectId: id => dispatch(actions.changeCurrentSelectId(id)),
    changePagination: pagination => dispatch(actions.changePagination(pagination)),
    changeSort: data => dispatch(actions.changeSort(data)),
    queryUser: () => dispatch(asyncQueryUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
