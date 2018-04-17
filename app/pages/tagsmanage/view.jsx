import React from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Col } from 'antd';
import { actions } from './models';
import { formatViewData } from './utils';
import styles from './view.css';
class View extends React.Component {
    handleCancel = () => {
        this.props.viewHide();
    };
    render() {
        const { isViewShow } = this.props;
        return (
            <Modal title="查看详情" width={600} visible={isViewShow} onCancel={this.handleCancel} footer={null}>
                <div className={styles.presonbox}>
                    <p></p>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    isViewShow: state.tagsmanage.uiStatus.isViewShow,
    UserDetail: state.tagsmanage.userDetail,
});

const mapDispatchToProps = dispatch => ({
    viewHide: () => dispatch(actions.changeUiStatus({ isViewShow: false })),
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
