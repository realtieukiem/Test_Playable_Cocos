import { _decorator, CCBoolean, Component, math, Quat, SkeletalAnimation, tween, Vec3 } from 'cc';
import { Data } from './Data';
import { IdleState } from './Anim/IdleState';
import { RunState } from './Anim/RunState';
import { AttackState } from './Anim/AttackState';
const { ccclass, property } = _decorator;

@ccclass('CustomerController')
export class CustomerController extends Component {

    private currentState: any | null = null; // Trạng thái hiện tại
    private skeletalAnimation: SkeletalAnimation | null = null; // Thành phần SkeletalAnimation
    public target: Vec3 = new Vec3(0, 0, 0);
    private originalRotation: Quat = new Quat(); // Lưu trữ hướng ban đầu

    start() {
        // Khởi tạo SkeletalAnimation
        this.skeletalAnimation = this.getComponent(SkeletalAnimation);
        this.node.getRotation(this.originalRotation);

        // Bắt đầu với trạng thái Idle
        this.changeState('Idle');

        this.moveToTarget();
    }
    update(deltaTime: number) {
        if (this.currentState) {
            this.currentState.update(deltaTime);
        }
    }
    public changeState(stateName: string): void {
        if (this.currentState) {
            this.currentState.onExit(); // Rời khỏi trạng thái hiện tại
        }

        switch (stateName) {
            case 'Idle':
                this.currentState = new IdleState(this.skeletalAnimation);
                this.currentState.state = this.skeletalAnimation.clips[0].name;
                break;
            case 'Run':
                this.currentState = new RunState(this.skeletalAnimation);
                this.currentState.state = this.skeletalAnimation.clips[1].name;
                break;
            case 'Attack':
                this.currentState = new AttackState(this.skeletalAnimation);
                this.currentState.state = this.skeletalAnimation.clips[2].name;
                break;
            default:
                console.warn(`Unknown state: ${stateName}`);
                return;
        }

        this.currentState.onEnter(); // Vào trạng thái mới
    }
    protected moveToTarget() {
        if (!this.skeletalAnimation) return;
        // Phát animation di chuyển
        this.changeState("Run");
        // Tính toán góc quay để quay mặt về hướng đích
        const direction = this.target.clone().subtract(this.node.worldPosition).normalize();
        const targetRotation = this.calculateRotation(direction);

        // Lưu trữ hướng ban đầu trước khi quay
        tween(this.node)
            .to(0.05, { rotation: targetRotation })
            .parallel(
                tween(this.node).to(2, { worldPosition: this.target }),
                tween(this.node).delay(1.5)
            )
            .call(() => {
                this.skeletalAnimation?.play("Idle");
                this.node.setRotation(this.originalRotation);
            })
            .start();

    }
    getCustomerNeed(){
        return 'sung ong gi chua';
    }
    private calculateRotation(direction: Vec3): Quat {
        const angle = Math.atan2(direction.x, direction.z); // Tính góc theo radian
        const angleInDegrees = math.toDegree(angle); // Chuyển đổi radian sang độ
        const rotation = Quat.fromEuler(new Quat(), 0, angleInDegrees, 0); // Tạo quaternion từ góc
        return rotation;
    }
}