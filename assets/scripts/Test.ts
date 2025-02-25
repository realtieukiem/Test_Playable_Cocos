import { _decorator, Component, Input, Node,KeyCode, input, EventKeyboard } from 'cc';
import { CustomerController } from './CustomerController';
import { GameManager } from './GameManager';
import { ObjectPoolManager } from './ObjectPoolManager';
import { Bullet } from './Bullet';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {


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

        switch (event.keyCode) {
            case KeyCode.KEY_A: // Nhấn A để chuyển sang trạng thái Attack
            this.shootBullet();
                //this.customerController.changeState('Attack');
                break;
            case KeyCode.KEY_D: // Nhấn D để chuyển sang trạng thái Run
                //this.customerController.changeState('Run');
                break;
            default:
                break;
        }
    }

    private shootBullet() {
        if (!GameManager.instance.enemyNode) {
            console.error("EnemyNode is not assigned!");
            return;
        }

        const startPosition = this.node.worldPosition; // Vị trí của Customer
        const targetPosition = GameManager.instance.enemyNode.worldPosition; // Vị trí của Enemy

        const bullet = ObjectPoolManager.instance.spawn('Bullet', startPosition); // Lấy đạn từ pool
        if (bullet) {
            const bulletScript = bullet.getComponent(Bullet);
            if (bulletScript) {
                //bulletScript.initialize(startPosition, targetPosition, 'Bullet');
            }
        }
    }
}


