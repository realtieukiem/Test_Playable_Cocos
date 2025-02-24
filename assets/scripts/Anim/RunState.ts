import { CharacterState } from './CharacterState';

export class RunState extends CharacterState {
    public state: string;
    public update(deltaTime: number): void {
        // Có thể thêm logic liên quan đến di chuyển ở đây
    }

    public onEnter(): void {
        super.onEnter();
        this.skeletalAnimation.play(this.state); // Phát animation Run
    }
}