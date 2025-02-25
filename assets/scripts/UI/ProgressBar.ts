import { _decorator, Component, Sprite } from 'cc';
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
}