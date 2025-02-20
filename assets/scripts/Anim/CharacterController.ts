import { _decorator, Component, SkeletalAnimation } from 'cc';
import { IdleState } from './IdleState';
import { RunState } from './RunState';
import { AttackState } from './AttackState';
const { ccclass, property } = _decorator;

@ccclass('CharacterController')
export class CharacterController extends Component {
    private currentState: any | null = null; // Trạng thái hiện tại
    private skeletalAnimation: SkeletalAnimation | null = null; // Thành phần SkeletalAnimation

    start() {
        // Khởi tạo SkeletalAnimation
        this.skeletalAnimation = this.getComponent(SkeletalAnimation);

        // Bắt đầu với trạng thái Idle
        this.changeState('Idle');
    }

    /**
     * Phương thức thay đổi trạng thái
     * @param stateName Tên trạng thái mới
     */
     changeState(stateName: string): void {
        if (this.currentState) {
            this.currentState.onExit(); // Rời khỏi trạng thái hiện tại
        }

        switch (stateName) {
            case 'Idle':
                this.currentState = new IdleState(this.skeletalAnimation);
                break;
            case 'Run':
                this.currentState = new RunState(this.skeletalAnimation);
                break;
            case 'Attack':
                this.currentState = new AttackState(this.skeletalAnimation);
                break;
            default:
                console.warn(`Unknown state: ${stateName}`);
                return;
        }

        this.currentState.onEnter(); // Vào trạng thái mới
    }

    update(deltaTime: number) {
        // Cập nhật trạng thái hiện tại
        if (this.currentState) {
            this.currentState.update(deltaTime);
        }
    }
}