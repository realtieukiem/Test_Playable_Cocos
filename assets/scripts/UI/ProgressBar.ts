import { _decorator, Component, Sprite, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ProgressBar')
export class ProgressBar extends Component {
    @property({ type: Sprite })
    progressSprite: Sprite | null = null; // Tham chiếu đến Sprite

    private currentProgress: number = 0; // Tiến trình hiện tại (0 = 0%, 1 = 100%)

    start() {
        if (!this.progressSprite) {
            console.error("Progress sprite is not assigned!");
            return;
        }

        this.updateProgress(0); // Khởi tạo tiến trình
    }

    public updateProgress(value: number) {
        this.currentProgress = Math.min(1, Math.max(0, value)); // Giới hạn giá trị từ 0 đến 1

        // Cập nhật fillRange của Sprite
        if (this.progressSprite) {
            this.progressSprite.fillRange = this.currentProgress;
        }
    }
    public updatePosition(worldPosition: Vec3, offsetY: number) {
        const uiTransform = this.getComponent(UITransform);
        if (!uiTransform || !this.node.parent) return;

        // Chuyển đổi vị trí thế giới sang vị trí màn hình
        const screenPosition = this.node.parent.getComponent(UITransform)?.convertToNodeSpaceAR(worldPosition);

        if (screenPosition) {
            // Dịch lên trên bằng cách cộng offset vào trục Y
            screenPosition.y += offsetY;
            this.node.setPosition(screenPosition);
        }
    }
}