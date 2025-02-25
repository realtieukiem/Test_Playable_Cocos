import { SkeletalAnimation } from 'cc';
import { CharacterState } from './CharacterState';

export class IdleState extends CharacterState {
    public state: string;
    public update(deltaTime: number): void {
        // Không cần làm gì trong trạng thái Idle
    }

    public onEnter(): void {
        super.onEnter();
        this.skeletalAnimation.play(this.state); // Phát animation Idle
    }
}