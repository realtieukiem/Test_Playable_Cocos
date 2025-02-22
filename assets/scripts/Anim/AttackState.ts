import { CharacterState } from './CharacterState';

export class AttackState extends CharacterState {
    public update(deltaTime: number): void {
        // Kiểm tra xem animation đã kết thúc chưa
        if (!this.skeletalAnimation.getState('attack')?.isPlaying) {
            //this.skeletalAnimation.getComponent('CharacterController')?.changeState(new IdleState(this.skeletalAnimation));
        }
    }

    public onEnter(): void {
        super.onEnter();
        this.skeletalAnimation.play('Attack_1'); // Phát animation Attack
    }
}