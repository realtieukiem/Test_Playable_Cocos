import { _decorator, Component, Node, Vec3, tween, SkeletalAnimation, Quat, math } from 'cc';
import { CharacterSpawner } from './ChacterSpawner';
import { CustomerController } from './CustomerController';
import { ProgressBar } from './UI/ProgressBar';
import { IdleState } from './Anim/IdleState';
import { RunState } from './Anim/RunState';
import { AttackState } from './Anim/AttackState';
import { Data } from './Data';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('StaffController')
export class StaffController extends Component {


    @property({ type: CharacterSpawner })
    characterSpawner: CharacterSpawner | null = null;

    @property({ type: [Node] })
    createGunPosition: Node[]=[] ;

    @property({ type: SkeletalAnimation })
    private skeletalAnimation: SkeletalAnimation | null = null;



    private currentStateAnim: any | null = null;
    private currentTargetIndex: number = -1;
    private currentState: string = "Idle";
    private target: Vec3 = new Vec3(0, 180, 0);
    private customerNeed: string;
    private targetPosition;
    //private originalRotation: Quat = new Quat();
    //progess
    @property({ type: ProgressBar })
    progressBar: ProgressBar | null = null; 
    @property({ type: Number })
    offsetY: number = 100; 
    private currentProgress: number = 0;


    start() {
        if (!this.characterSpawner) { console.error("Please assign the CharacterSpawner in the Inspector."); }
        //if (!this.createItemPosition) { console.error("Please assign the create item position in the Inspector."); }
        this.changeState('Idle');
        //start
        //this.moveToNextState();
        //progess
        if (this.progressBar) {
            this.updateProgresss(0); // Khởi tạo tiến trình
        }
    }
    update(deltaTime: number) {
        // Tăng tiến trình theo thời gian
        if (this.currentProgress < 1) {
            this.currentProgress += deltaTime * 0.1; // Tốc độ tăng tiến trình
            this.updateProgresss(this.currentProgress);
        }

        // Cập nhật vị trí của ProgressBar với offset
        if (this.progressBar) {
            const worldPosition = this.node.getWorldPosition();
            this.progressBar.updatePosition(worldPosition, this.offsetY);
        }
    }
    public checkStartState(){
        this.moveToNextState();
    }
    //progess
    private updateProgresss(value: number) {
        if (this.progressBar) {
            this.progressBar.updateProgress(value);
        }
    }
    //Animation
    public changeState(stateName: string): void {
        if (this.currentStateAnim) {
            this.currentStateAnim.onExit(); // Rời khỏi trạng thái hiện tại
        }

        switch (stateName) {
            case 'Idle':
                this.currentStateAnim = new IdleState(this.skeletalAnimation);
                this.currentStateAnim.state = this.skeletalAnimation.clips[0].name;
                break;
            case 'Run':
                this.currentStateAnim = new RunState(this.skeletalAnimation);
                this.currentStateAnim.state = this.skeletalAnimation.clips[1].name;
                break;
            case 'Attack':
                this.currentStateAnim = new AttackState(this.skeletalAnimation);
                this.currentStateAnim.state = this.skeletalAnimation.clips[2].name;
                break;
            default:
                console.warn(`Unknown state: ${stateName}`);
                return;
        }

        this.currentStateAnim.onEnter();
    }

    private moveToNextState() {
        switch (this.currentState) {
            case "Idle":
                this.checkAndMoveToCustomerSequentially();
                break;
            case "MovingToCustomer":
                this.checkCustomerNeed();
                break;
            case "CheckingCustomerNeed":
                this.moveToCreateItemPosition();
                break;
            case "MovingToCreateItem":
                this.returnToCustomer();
                break;
            case "ReturningToCustomer":
                this.resetState();
                break;
        }
    }

    private checkAndMoveToCustomerSequentially() {
        // Move Customer
        for (let i = 0; i < 4; i++) {
            if (this.characterSpawner?.isSpecificPositionOccupied(i)) {
                const targetPosition = this.characterSpawner.getSpecificWorldPosition(i);
                if (targetPosition) {
                    this.changeState("Run");
                    this.currentState = "MovingToCustomer";

                    const direction = this.target.clone().subtract(this.node.worldPosition).normalize();
                    const targetRotation = this.calculateRotation(direction, true);
                    //console.log(`Found customer at position ${i}. Moving there.`);
                    this.currentTargetIndex = i;
                    const adjustedPosition = targetPosition.clone();
                    adjustedPosition.z += 2;

                    tween(this.node)
                        .to(0.05, { rotation: targetRotation })
                        .parallel(
                            tween(this.node).to(2, { worldPosition: adjustedPosition }),
                            tween(this.node).delay(1.5)
                        )
                        .call(() => {
                            this.changeState("Idle");
                            this.moveToNextState();
                        })
                        .start();

                    return;
                }
            }
        }
        //console.log("No customers available. Checking again in 1 second...");
        this.scheduleOnce(() => this.checkAndMoveToCustomerSequentially(), 1);
    }
    /**
* Cutomer need
*/
    private checkCustomerNeed() {

        this.currentState = "CheckingCustomerNeed";

        const customerNode = this.characterSpawner?.getCustomerNodeByIndex(this.currentTargetIndex);
        if (!customerNode) {
            console.error("Customer node not found!");
            this.moveToNextState();
            return;
        }

        const customerController = customerNode.getComponent(CustomerController);
        if (!customerController) {
            console.error("CustomerManager component not found on customer node!");
            this.moveToNextState();
            return;
        }

        this.customerNeed = customerController.getCustomerNeed();
        console.log(`Customer needs: ${this.customerNeed}`);

        this.scheduleOnce(() => {
            //console.log("Finished checking customer need.");
            this.moveToNextState();
        }, Data.Time_Work_Staff);
    }

    /**
     * Craft item
     */
    private moveToCreateItemPosition() {
        this.currentState = "MovingToCreateItem";
        //if (!this.createItemPosition) return;
        switch (this.customerNeed) {
            case "Pistol":
                this.targetPosition = this.createGunPosition[0].getWorldPosition(new Vec3());
                break;
            case "Gun":
                this.targetPosition = this.createGunPosition[1].getWorldPosition(new Vec3());
                break;
            default:
                console.error("Unknown weapon type!");
                break;
        }

        const direction = this.target.clone().subtract(this.node.worldPosition).normalize();
        const targetRotation = this.calculateRotation(direction);

        //const targetPosition = this.createGunPosition[0].getWorldPosition(new Vec3());

        const adjustedPosition = this.targetPosition.clone();
        adjustedPosition.z += 2;

        this.changeState("Run");


        tween(this.node)
            .to(0.05, { rotation: targetRotation })
            .parallel(
                tween(this.node).to(2, { worldPosition: adjustedPosition }),
                tween(this.node).delay(1.5),
            )
            .call(() => {
                this.changeState("Idle");

                // tween(this.node)
                //     .to(0.125, { eulerAngles: new Vec3(0, -90, 0) })
                //     .start();
            })
            .start();


        this.scheduleOnce(() => {
            //this.node.setRotation(this.originalRotation);
            this.moveToNextState();

        }, Data.Time_Work_Staff);
    }

    /**
     * Trạng thái 4: Quay lại vị trí customer
     */
    private returnToCustomer() {

        this.currentState = "ReturningToCustomer";
        this.changeState("Run");

        const customerPosition = this.characterSpawner?.getSpecificWorldPosition(this.currentTargetIndex);
        const direction = this.target.clone().subtract(this.node.worldPosition).normalize();
        //console.log(direction);
        const targetRotation = this.calculateRotation(direction, true);
        const adjustedPosition = customerPosition.clone();
        adjustedPosition.z += 2;




        tween(this.node)
            .to(0.05, { rotation: targetRotation })
            .parallel(
                tween(this.node).to(2, { worldPosition: adjustedPosition }),
                tween(this.node).delay(2)
            )
            .call(() => {
                this.changeState("Idle");
                this.node.eulerAngles = new Vec3(0, 180, 0);
                const customerNode = this.characterSpawner?.getCustomerNodeByIndex(this.currentTargetIndex);
                const customerController = customerNode.getComponent(CustomerController);
                customerController.doneBuy();
                this.moveToNextState();
                GameManager.instance.plusCoin(50);
            })
            .start();

    }

    /**
     * Reset trạng thái về Idle
     */
    private resetState() {
        this.currentState = "Idle";
        this.changeState("Idle");

        this.scheduleOnce(() => {
            this.moveToNextState(); // Bắt đầu lại quy trình
        }, 0.125); // Đợi 1 giây trước khi bắt đầu lại
    }

    private calculateRotation(direction: Vec3, reverse: boolean = false): Quat {
        const angle = Math.atan2(direction.x, direction.z); // Tính góc theo radian
        const reversedAngle = reverse ? angle + Math.PI : angle;
        const angleInDegrees = math.toDegree(reversedAngle); // Chuyển đổi radian sang độ
        const rotation = Quat.fromEuler(new Quat(), 0, angleInDegrees, 0); // Tạo quaternion từ góc

        return rotation;
    }
    // private moveAndOrient(startPosition: Vec3, targetPosition: Vec3, onComplete: () => void) {
    //     const direction = targetPosition.clone().subtract(startPosition).normalize();
    //     const angle = Math.atan2(direction.x, direction.z); // Tính góc quay theo radian
    //     const rotation = Quat.fromEuler(new Quat(), 0, math.toDegree(angle), 0); // Chuyển đổi sang quaternion

    //     tween(this.node)
    //         .to(0.1, { rotation }, { easing: "smooth" }) // Xoay nhân vật về hướng di chuyển
    //         .parallel(
    //             tween(this.node).to(2, { worldPosition: targetPosition }) // Di chuyển đến đích
    //         )
    //         .call(() => {
    //             onComplete(); // Gọi callback khi hoàn thành
    //         })
    //         .start();
    // }
}