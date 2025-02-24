import { _decorator, CCBoolean, Component, find, math, Quat, SkeletalAnimation, tween, Vec3, Node, Scene } from 'cc';
import { IdleState } from './Anim/IdleState';
import { RunState } from './Anim/RunState';
import { AttackState } from './Anim/AttackState';
import { EnemyController } from './EnemyController';
const { ccclass, property } = _decorator;


@ccclass('CustomerController')
export class CustomerController extends Component {

    @property({ type: Node })
    enemyNode: Node | null = null;


    private currentState: any | null = null; // Trạng thái hiện tại
    private skeletalAnimation: SkeletalAnimation | null = null; // Thành phần SkeletalAnimation
    public target: Vec3 = new Vec3(0, 0, 0);
    private originalRotation: Quat = new Quat(); // Lưu trữ hướng ban đầu
    private isMovingToBattlePosition: boolean = false;

    start() {
        //find enemy node
        if (!this.enemyNode) {
            this.enemyNode = this.findEnemyNodeInScene();
            if (!this.enemyNode) {
                console.error("Enemy node not found in the scene!");
            }
        }
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
    getCustomerNeed() {
        return 'sung ong gi chua';
    }
    doneBuy() {
        console.log("mua xong ");
        const posRaw = this.node.getWorldPosition();
        this.node.setParent(this.node.scene);
        this.node.setWorldPosition(posRaw);

        this.scheduleOnce(() => this.moveToEnemy(), 0.125);
    }
    moveToEnemy() {
        if (this.isMovingToBattlePosition) return; // Đảm bảo không gọi trùng lặp

        this.isMovingToBattlePosition = true;
        console.log("Buy done! Moving to random battle position.");

        // Di chuyển đến vị trí ngẫu nhiên và xoay về hướng enemy
        this.moveToRandomBattlePosition();

        //this.destroy();
    }
    private calculateRotation(direction: Vec3): Quat {
        const angle = Math.atan2(direction.x, direction.z); // Tính góc theo radian
        const angleInDegrees = math.toDegree(angle); // Chuyển đổi radian sang độ
        const rotation = Quat.fromEuler(new Quat(), 0, angleInDegrees, 0); // Tạo quaternion từ góc
        return rotation;
    }
    private moveToRandomBattlePosition() {
        //Random
        const randomX = Math.random() * 10 - 2.5;
        //const randomZ = Math.random() * (2-(-4)) - 4; 
        const randomZ = -5;
        const startPosition = this.node.getWorldPosition(new Vec3());
        const targetPosition = new Vec3(startPosition.x + randomX, startPosition.y, startPosition.z + randomZ);
        //const targetPosition = this.enemyNode.worldPosition.clone();
        const direction = this.target.clone().subtract(this.node.worldPosition).normalize();
        const targetRotation = this.calculateRotation(direction);

        this.changeState("Run");

        tween(this.node)
            .to(0.05, { rotation: targetRotation })
            .parallel(
                tween(this.node).to(2, { worldPosition: targetPosition }),
                tween(this.node).delay(1.5)
            )
            .call(() => {
                this.skeletalAnimation?.play("Idle");
                this.faceTowardsEnemy();
                //this.node.setRotation(this.originalRotation);
            })
            .start();
    }

    /**
     * Xoay nhân vật về hướng của enemy
     */
    private faceTowardsEnemy() {
        if (!this.enemyNode) {
            return;
        }

        // Lấy vị trí của enemy
        const enemyPosition = this.enemyNode.getWorldPosition(new Vec3());
        this.enemyNode

        // Tính toán vector hướng từ nhân vật đến enemy
        const direction = enemyPosition.clone().subtract(this.node.worldPosition).normalize();

        // Tính góc quay và áp dụng quaternion
        const angle = Math.atan2(direction.x, direction.z); // Góc quay ban đầu
        const rotation = Quat.fromEuler(new Quat(), 0, math.toDegree(angle), 0); // Chuyển đổi sang quaternion

        this.node.setRotation(rotation); // Áp dụng góc quay
        console.log("Facing towards enemy.");
    }
    private findEnemyNodeInScene(): Node | null {
        // Tìm kiếm node có tên cụ thể (ví dụ: "Enemy")
        const enemyNode = find("CHARACTER/Enemy");
        if (enemyNode) {
            const enemyController = enemyNode.getComponent(EnemyController);
            if (enemyController) {
                console.log("Enemy node found in the scene.");
                return enemyNode;
            } else {
                console.error("Enemy node found but does not have EnemyController component!");
            }
        } else {
            console.error("Enemy node not found in the scene!");
        }
        return null;
    }
}

enum TypeGun {
    Pistol = 0,
    Gun = 1
}