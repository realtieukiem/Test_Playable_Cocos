import { _decorator, Component, Input, Node,KeyCode, input, EventKeyboard } from 'cc';
import { CharacterController } from './Anim/CharacterController';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {
    @property({ type: CharacterController })
    characterController: CharacterController | null = null; // Tham chiếu đến CharacterController

    private keyState: { [key: string]: boolean } = {}; // Lưu trạng thái của các phím

    start() {
        // Đăng ký sự kiện bàn phím
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        //input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy() {
        // Hủy đăng ký sự kiện khi component bị hủy
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        //input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    /**
     * Xử lý khi phím được nhấn
     */
    private onKeyDown(event: EventKeyboard) {
        //this.keyState[event.keyCode.toString()] = true;
        if (!this.characterController) return;

        switch (event.keyCode) {
            case KeyCode.KEY_A: // Nhấn A để chuyển sang trạng thái Attack
                this.characterController.changeState('Attack');
                break;
            case KeyCode.KEY_D: // Nhấn D để chuyển sang trạng thái Run
                this.characterController.changeState('Run');
                break;
            default:
                break;
        }
    }

    /**
     * Xử lý khi phím được thả ra
     */
    // private onKeyUp(event: EventKeyboard) {
    //     this.keyState[event.keyCode.toString()] = false;
    // }

    /**
     * Kiểm tra xem một phím có đang được nhấn hay không
     */
    // private isKeyPressed(keyCode: KeyCode): boolean {
    //     return this.keyState[keyCode.toString()] === true;
    // }

    // update(deltaTime: number) {
    //     if (!this.characterController) return;

    //     // Điều khiển trạng thái dựa trên input
    //     if (this.isKeyPressed(KeyCode.KEY_D)) {
    //         this.characterController.changeState('Move');
    //     } else if (this.isKeyPressed(KeyCode.KEY_A)) {
    //         this.characterController.changeState('Attack_1');
    //     } else {
    //         this.characterController.changeState('Idle');
    //     }
    // }
}


