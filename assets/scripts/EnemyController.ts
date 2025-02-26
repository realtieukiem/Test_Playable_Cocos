import { _decorator, Component, Node, SkeletalAnimation } from 'cc';
const { ccclass, property } = _decorator;
import { IdleState } from './Anim/IdleState';
import { AttackState } from './Anim/AttackState';
import { FirstState } from './Anim/FirstState';
import { GameManager } from './GameManager';
import { PlayerHealth } from './Health/PlayerHealth';
import { BaseHealth } from './Health/BaseHealth';
import { ObjectPoolManager } from './ObjectPoolManager';
import { Bullet } from './Bullet';
import { Data } from './Data';



@ccclass('EnemyController')
export class EnemyController extends Component {

    private skeletalAnimation: SkeletalAnimation | null = null;
    private currentState: any | null = null;
    //Shoot
    @property({ type: Node })
    private currentCustomer: Node | null = null;
    private isShooting: boolean = false;
    @property({ type: Node })
    spawnPosGun: Node | null = null;

    protected start(): void {
        this.skeletalAnimation = this.getComponent(SkeletalAnimation);
        this.changeState('First');
        this.scheduleOnce(() => {
            this.changeState('Idle');

        }, 0.5);
        //find Cus
        this.findCustomer();
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
                // this.scheduleOnce(() => {
                //     this.changeState('Idle');
                // }, 1);
                break;
            case 'Idle':
                this.skeletalAnimation.play(this.skeletalAnimation.clips[1].name);
                // this.currentState = new IdleState(this.skeletalAnimation);
                // this.currentState.state = this.skeletalAnimation.clips[1].name;
                break;

            case 'Attack':
                this.skeletalAnimation.play(this.skeletalAnimation.clips[2].name);
                // this.currentState = new AttackState(this.skeletalAnimation);
                // this.currentState.state = this.skeletalAnimation.clips[2].name;
                break;
            default:
                console.warn(`Unknown state: ${stateName}`);
                return;
        }
    }
    private startShooting() {
        if (!this.isShooting && this.currentCustomer) {
            this.isShooting = true;
            this.schedule(this.shootBullet, Data.Time_Shoot_Delay);
        }
    }
    public stopShooting() {
        if (this.isShooting) {
            this.isShooting = false;
            this.unschedule(this.shootBullet);
            this.currentCustomer = null;
            this.scheduleOnce(() => {

                this.findCustomer();
            }, 1);

        }
    }
    private shootBullet() {
        if (!this.currentCustomer) {
            console.error("CusNode is not assigned!");
            return;
        }
        this.changeState("Attack");
        this.scheduleOnce(() => {
            this.changeState('Idle');

        }, 0.25);
        const startPosition = this.spawnPosGun.worldPosition;
        const targetPosition = this.currentCustomer;

        const bullet = ObjectPoolManager.instance.spawn('Bullet', startPosition);
        if (bullet) {
            const bulletScript = bullet.getComponent(Bullet);
            if (bulletScript) {
                bulletScript.initialize(startPosition, targetPosition, 'Bullet', Data.Damage_Boss);
            }
        }
    }

    private findCustomer() {
        console.log("Find CusContain" + GameManager.instance.customerContainer.children.length);
        if (GameManager.instance.customerContainer.children.length <= 0) {
            this.scheduleOnce(() => {
                this.findCustomer();
                console.log("Find Cus");
            }, 1);
            return;
        }

        const customers = GameManager.instance.customerContainer.children.filter(child => child.name === "Customer");

        if (customers.length > 0) {
            const customer = customers[0];
            const customerScript = customer.getComponent(BaseHealth);

            if (customerScript && customerScript.isAlive()) {
                this.currentCustomer = customer;
                this.startShooting();
                return;
            }
        }
    }
}

