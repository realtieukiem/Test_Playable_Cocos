import { CharacterState } from './CharacterState';

export class DieState extends CharacterState {
    public update(deltaTime: number): void {
        // Không cần làm gì trong trạng thái Die
    }

    public onEnter(): void {
        super.onEnter();
        this.skeletalAnimation.play('die'); // Phát animation Die
    }
}