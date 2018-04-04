import React from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Col, Table, Card} from 'antd';
import { actions } from './models';
import { formatViewData } from './utils';
const { Column } = Table;
import styles from './view.css';
class View extends React.Component {
    handleCancel = () => {
        this.props.viewHide();
    };
    render() {
        const { isViewShow, item } = this.props;
        let img = [];
        let roomimg = this.props.roomDetail;
        for (let i = 0; i < roomimg.length; i++) {
            img.push(<img src={formatViewData('image', roomimg[i])} className={styles.user_avatar} />)
        }
        return (
            <Modal title="查看详情" visible={isViewShow} onCancel={this.handleCancel} footer={null}>
                <Card style={{ width: '100%', marginBottom: 20 }} bodyStyle={{ padding: 10 }}>
                    <div style={{padding:'0 0 5px', borderBottom:'1px solid #dcdcdc', marginBottom:'10px',color:'#000'}}> 房间图片</div>
                    <div style= {{display:'block'}}>
                        {img}
                    </div>
                </Card>
                <Table size="middle" >
                    <Column
                        title="床位号"
                        dataIndex="direction"
                        key="direction"
                        render={text=> {
                            return formatViewData('direction', text);
                        }}
                    />
                    <Column
                        title="姓名"
                        dataIndex="direction"
                        key="direction"
                        render={text => {
                            return formatViewData('direction', text);
                        }}
                    />
                    <Column
                        title="家属"
                        dataIndex="direction"
                        key="direction"
                        render={text => {
                            return formatViewData('direction', text);
                        }}
                    />
                </Table>
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    item: state.roommanage.list.reduce((a, b) => (b.id === state.roommanage.currentSelectId ? b : a), {}),
    isViewShow: state.roommanage.uiStatus.isViewShow,
    roomDetail: state.roommanage.currentRoomDetail,
});

const mapDispatchToProps = dispatch => ({
    viewHide: () => dispatch(actions.changeUiStatus({ isViewShow: false })),
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
