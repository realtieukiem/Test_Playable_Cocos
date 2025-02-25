import { _decorator, CCBoolean, Component, find, math, Quat, SkeletalAnimation, tween, Vec3, Node, MeshRenderer, Material, SkinnedMeshRenderer } from 'cc';
import { IdleState } from './Anim/IdleState';
import { RunState } from './Anim/RunState';
import { AttackState } from './Anim/AttackState';
import { EnemyController } from './EnemyController';
import { GameManager } from './GameManager';
import { ObjectPoolManager } from './ObjectPoolManager';
import { Bullet } from './Bullet';
import { Data } from './Data';
const { ccclass, property } = _decorator;


@ccclass('CustomerController')
export class CustomerController extends Component {
    @property({ type: Material })
    newMaterial: Material | null = null;



    private currentState: any | null = null;
    private skeletalAnimation: SkeletalAnimation | null = null;
    public target: Vec3 = new Vec3(0, 0, 0);
    private originalRotation: Quat = new Quat();
    private isMovingToBattlePosition: boolean = false;
    private meshRen: SkinnedMeshRenderer | null = null;
    //--Gun--
    private typeWeapon: string = "Pistol";
    @property({ type: [Node] })
    nodeWeaponArray: Node[] = [];
    @property({ type: Node })
    spawnPosGun: Node | null = null;

    start() {
        //find enemy node
        // if (!this.enemyNode) {
        //     this.enemyNode = this.findEnemyNodeInScene();
        //     if (!this.enemyNode) {
        //         console.error("Enemy node not found in the scene!");
        //     }
        // }
        //get material
        this.meshRen = this.getComponentInChildren(SkinnedMeshRenderer);
        // SkeletalAnimation
        this.skeletalAnimation = this.getComponent(SkeletalAnimation);
        this.node.getRotation(this.originalRotation);

        // start idle
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
        this.typeWeapon = GameManager.instance.randomizeWeapon();
        //this.setCustomerWepon(type);
        return this.typeWeapon;
    }
    setCustomerWepon(weaponType: string) {
        switch (weaponType) {
            case "Pistol":
                //console.log("Using Pistol: Shoot with low damage.");
                this.nodeWeaponArray[0].active = true;
                break;
            case "Gun":
                //console.log("Using Gun: Shoot with high damage.");
                this.nodeWeaponArray[1].active = true;
                break;
            default:
                console.error("Unknown weapon type!");
                break;
        }
    }
    doneBuy() {
        //console.log("Buy Done ");
        //Set parent
        this.node.setParent(GameManager.instance.targetNode, true);
        //SetMat
        this.meshRen.materials[0] = this.newMaterial;
        //SetWeapon
        this.setCustomerWepon(this.typeWeapon);
        //Move
        this.scheduleOnce(() => this.moveToEnemy(), 0.125);
    }
    moveToEnemy() {
        if (this.isMovingToBattlePosition) return; // Đảm bảo không gọi trùng lặp
        this.isMovingToBattlePosition = true;
        //console.log("Buy done! Moving to random battle position.");
        this.moveToRandomBattlePosition();

        //this.destroy();
    }
    attackEnemy() {
        this.changeState("Attack");
        this.schedule(() => {
            this.shootBullet();
        }, Data.Time_Shoot_Delay);


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
                this.attackEnemy();
                //this.node.setRotation(this.originalRotation);
            })
            .start();
    }

    /**
     * Xoay nhân vật về hướng của enemy
     */
    private faceTowardsEnemy() {
        if (!GameManager.instance.enemyNode) {
            return;
        }

        // Lấy vị trí của enemy
        const enemyPosition = GameManager.instance.enemyNode.getWorldPosition(new Vec3());

        // Tính toán vector hướng từ nhân vật đến enemy
        const direction = enemyPosition.clone().subtract(this.node.worldPosition).normalize();

        // Tính góc quay và áp dụng quaternion
        const angle = Math.atan2(direction.x, direction.z); // Góc quay ban đầu
        const rotation = Quat.fromEuler(new Quat(), 0, math.toDegree(angle), 0); // Chuyển đổi sang quaternion

        this.node.setRotation(rotation); // Áp dụng góc quay
        console.log("Facing towards enemy.");
    }
    // private findEnemyNodeInScene(): Node | null {
    //     const enemyNode = find("CHARACTER/Enemy");
    //     if (enemyNode) {
    //         const enemyController = enemyNode.getComponent(EnemyController);
    //         if (enemyController) {
    //             console.log("Enemy node found in the scene.");
    //             return enemyNode;
    //         } else {
    //             console.error("Enemy node found but does not have EnemyController component!");
    //         }
    //     } else {
    //         console.error("Enemy node not found in the scene!");
    //     }
    //     return null;
    // }

    private shootBullet() {
        if (!GameManager.instance.enemyNode) {
            console.error("EnemyNode is not assigned!");
            return;
        }

        const startPosition = this.spawnPosGun.worldPosition; // Vị trí của Customer
        const targetPosition = GameManager.instance.enemyNode; // Vị trí của Enemy

        const bullet = ObjectPoolManager.instance.spawn('Bullet', startPosition); // Lấy đạn từ pool
        if (bullet) {
            const bulletScript = bullet.getComponent(Bullet);
            if (bulletScript) {
                bulletScript.initialize(startPosition, targetPosition, 'Bullet');
            }
        }
    }

}

