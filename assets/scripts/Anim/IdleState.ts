import { CharacterState } from './CharacterState';

export class IdleState extends CharacterState {
    public update(deltaTime: number): void {
        // Không cần làm gì trong trạng thái Idle
    }

    public onEnter(): void {
        super.onEnter();
        this.skeletalAnimation.play('Idle'); // Phát animation Idle
    }
}