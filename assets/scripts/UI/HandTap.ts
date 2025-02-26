import { _decorator, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HandTap')
export class HandTap extends Component {
    @property({ type: Number })
    moveDistance: number = 50; // Khoảng cách di chuyển của bàn tay (pixel)

    @property({ type: Number })
    duration: number = 0.5; // Thời gian cho mỗi lần di chuyển (giây)

    start() {
        this.animateHand();
    }

    /**
     * Tạo hiệu ứng nhấp liên tục cho bàn tay
     */
    private animateHand() {
        const startPosition = this.node.position; // Vị trí ban đầu của bàn tay
        const targetPosition = new Vec3(startPosition.x, startPosition.y - this.moveDistance, startPosition.z); // Vị trí khi bàn tay chạm màn hình

        // Tween di chuyển xuống và lên, sau đó lặp lại
        tween(this.node)
            .to(this.duration, { position: targetPosition }) // Di chuyển xuống
            .to(this.duration, { position: startPosition }) // Di chuyển lên
            .to(this.duration, { position: targetPosition, scale: new Vec3(0.75, 0.75, 1) }) // Di chuyển xuống và thu nhỏ
            .to(this.duration, { position: startPosition, scale: new Vec3(1, 1, 1) }) // Di chuyển lên và trở về kích thước ban đầu
            .union() // Kết hợp hai hành động thành một chuỗi
            .repeatForever() // Lặp lại vô hạn
            .start(); // Bắt đầu tween
    }
}