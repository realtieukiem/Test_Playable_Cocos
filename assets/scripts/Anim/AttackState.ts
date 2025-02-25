import { CharacterController } from 'cc';
import { CharacterState } from './CharacterState';
import { IdleState } from './IdleState';
import { CustomerController } from '../CustomerController';

export class AttackState extends CharacterState {
    public state: string;
    public idleState: IdleState | null = null;
    public update(deltaTime: number): void {

        if (!this.skeletalAnimation.getState(this.state)?.isPlaying) {
            this.skeletalAnimation.getComponent(CustomerController)?.changeState('Idle');
        }
    }

    public onEnter(): void {
        super.onEnter();
        this.skeletalAnimation.play(this.state); 
    }
}