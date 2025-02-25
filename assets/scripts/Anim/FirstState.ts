import { EnemyController } from '../EnemyController';
import { CharacterState } from './CharacterState';

export class FirstState extends CharacterState {
    public state: string;
    public update(deltaTime: number): void {
        // if (!this.skeletalAnimation.getState(this.state)?.isPlaying) {
        //     this.skeletalAnimation.getComponent('EnemyController')?.node.get changeState('new IdleState(this.skeletalAnimation)');
        // }
    }

    public onEnter(): void {
        super.onEnter();
        this.skeletalAnimation.play(this.state);
    }
}