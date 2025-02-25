import { _decorator, Component, Node, SkeletalAnimation } from 'cc';
const { ccclass, property } = _decorator;
import { IdleState } from './Anim/IdleState';
import { AttackState } from './Anim/AttackState';
import { FirstState } from './Anim/FirstState';



@ccclass('EnemyController')
export class EnemyController extends Component {
    private skeletalAnimation: SkeletalAnimation | null = null;
    private currentState: any | null = null;

    protected start(): void {
        this.skeletalAnimation = this.getComponent(SkeletalAnimation);
        this.changeState('Idle');
    }

    public changeState(stateName: string): void {
        if (this.currentState) {
            this.currentState.onExit();
        }

        switch (stateName) {
            case 'First':
                //this.currentState = new FirstState(this.skeletalAnimation);
                //this.currentState.state = this.skeletalAnimation.clips[0].name;
                this.skeletalAnimation.play(this.skeletalAnimation.clips[0].name);
                console.log('FirstBosss');
                // this.scheduleOnce(() => {
                //     this.changeState('Idle');
                // }, 1);
                break;
            case 'Idle':
                console.log('IdleBosss');
                this.currentState = new IdleState(this.skeletalAnimation);
                this.currentState.state = this.skeletalAnimation.clips[1].name;
                break;

            case 'Attack':
                this.currentState = new AttackState(this.skeletalAnimation);
                this.currentState.state = this.skeletalAnimation.clips[2].name;
                break;
            default:
                console.warn(`Unknown state: ${stateName}`);
                return;
        }
    }
}

