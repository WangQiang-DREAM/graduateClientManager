import React from 'react';
import { connect } from 'react-redux';
import { asyncLogin } from '../../common/models/user';
import { actions } from './models';
import { Icon, Button, Spin, Input, Form } from 'antd';
const FormItem = Form.Item;
import { afterLogin } from 'utils';
import THREE from '../../common/three';
import styles from './login.css';
class Comp extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                this.props.changeUiStatus({ isLoading: true });
                await this.props.asyncLogin(values.userName, values.password);
                this.props.changeUiStatus({ isLoading: false });
                afterLogin();
            }
        });
    };
    init3D = () =>{ // 初始化3D动画
        let SCREEN_WIDTH = window.innerWidth;
        let SCREEN_HEIGHT = window.innerHeight;
        let SEPARATION = 90;
        let AMOUNTX = 50;
        let AMOUNTY = 50;
        let container;
        let particles, particle;
        let count;
        let camera;
        let scene;
        let renderer;
        let mouseX = 0;
        let mouseY = 0;
        let windowHalfX = window.innerWidth / 2;
        let windowHalfY = window.innerHeight / 2;
        init();
        this.interval = setInterval(loop, 1000 / 60);

        function init() {
            container = document.createElement('div');
            container.style.position = 'relative';
            container.style.top = '200px';
            document.getElementById('loginThree').appendChild(container);
            camera = new THREE.Camera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
            camera.position.z = 1000;
            scene = new THREE.Scene();
            renderer = new THREE.CanvasRenderer();
            renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
            particles = new Array();
            let i = 0;
            let material = new THREE.ParticleCircleMaterial(0x097bdb, 1);
            for (let ix = 0; ix < AMOUNTX; ix++) {
                for (let iy = 0; iy < AMOUNTY; iy++) {
                    particle = particles[i++] = new THREE.Particle(material);
                    particle.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
                    particle.position.z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
                    scene.add(particle);
                }
            }
            count = 0;
            container.appendChild(renderer.domElement);
            document.addEventListener('mousemove', onDocumentMouseMove, false);
            document.addEventListener('touchmove', onDocumentTouchMove, false);
        }

        function onDocumentMouseMove(event) {
            mouseX = event.clientX - windowHalfX;
            mouseY = event.clientY - windowHalfY;
        }

        function onDocumentTouchMove(event) {
            if (event.touches.length == 1) {
                event.preventDefault();
                mouseX = event.touches[0].pageX - windowHalfX;
                mouseY = event.touches[0].pageY - windowHalfY;
            }
        }

        function loop() {
            camera.position.x += (mouseX - camera.position.x) * .05;
            camera.position.y = 364;
            let i = 0;
            for (let ix = 0; ix < AMOUNTX; ix++) {
                for (let iy = 0; iy < AMOUNTY; iy++) {
                    particle = particles[i++];
                    particle.position.y = (Math.sin((ix + count) * 0.3) * 50) + (Math.sin((iy + count) * 0.5) * 50);
                    particle.scale.x = particle.scale.y = (Math.sin((ix + count) * 0.3) + 1) * 2 + (Math.sin((iy + count) * 0.5) + 1) * 2;
                }
            }
            renderer.render(scene, camera);
            count += 0.1;
        }
    }
    componentDidMount=()=>{
        this.init3D();
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { isLoading } = this.props;
        return (
            <div className={styles.main}>
                <Spin spinning={isLoading} tip="登录中...">
                    <div className={styles.box}>
                        <div className={styles.mainbox}>
                            <div className={styles.title}>
                            托老所管理系统
                                <p style={{fontSize:'13px'}}>BEADHOUSE MANAGE SYSTYM</p>
                            </div>
                            <Form onSubmit={this.handleSubmit} className="login-form">
                                <FormItem>
                                    {getFieldDecorator('userName', {
                                        rules: [{ required: true, message: '请输入用户名!' }],
                                    })(<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />)}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('password', {
                                        rules: [{ required: true, message: '请输入密码!' }],
                                    })(
                                        <Input
                                            prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                                            type="password"
                                            placeholder="密码"
                                        />,
                                    )}
                                </FormItem>
                                <FormItem>
                                    <Button style={{width: '100%'}} type="primary" htmlType="submit" className="login-form-button">
                                        登录
                                    </Button>
                                </FormItem>
                            </Form>
                        </div>
                        <div className={styles.loginThree} id="loginThree"> </div>
                    </div>
                </Spin>
            </div>
        );
    }
}

const mapStateToProps = state => ({ ...state.user.info, ...state.login.uiStatus });

const mapDispatchToProps = dispatch => ({
    asyncLogin: (name, password) => dispatch(asyncLogin(name, password)),
    changeUiStatus: status => dispatch(actions.changeUiStatus(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Comp));
