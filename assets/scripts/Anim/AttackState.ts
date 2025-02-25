import { CharacterState } from './CharacterState';
import { IdleState } from './IdleState';

export class AttackState extends CharacterState {
    public state: string;
    public update(deltaTime: number): void {

        // if (!this.skeletalAnimation.getState('attack')?.isPlaying) {
        //     this.skeletalAnimation.getComponent('CharacterController')?. changeState(new IdleState(this.skeletalAnimation));
        // }
    }

    public onEnter(): void {
        super.onEnter();
        this.skeletalAnimation.play(this.state); 
    }
}