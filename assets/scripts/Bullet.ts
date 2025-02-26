import { _decorator, Component, Node, Vec3 } from 'cc';
import { ObjectPoolManager } from './ObjectPoolManager';
import { EnemyHealth } from './Health/EnemyHealth';
import { BaseHealth } from './Health/BaseHealth';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
    @property({ type: Number })
    speed: number = 5;

    private targetPosition: Vec3 = new Vec3();
    private targetNode: Node | null = null;
    private customName: string = "";
    private damage: number = 0;

    public initialize(startPosition: Vec3, targetPosition: Node, customName: string, damage:number = 10) {
        this.targetNode = targetPosition;
        this.node.setPosition(startPosition);
        this.targetPosition.set(targetPosition.worldPosition);
        this.damage = damage;
        //fix z
        const adjustedPosition = this.targetPosition.clone();
        adjustedPosition.z -= 2;
        this.targetPosition.set(adjustedPosition);


        this.customName = customName;
    }

    update(deltaTime: number) {
        const currentPosition = this.node.position;
        Vec3.lerp(currentPosition, currentPosition, this.targetPosition, deltaTime * this.speed);

        if (Vec3.distance(currentPosition, this.targetPosition) < 0.1) {
            this.destroyBullet();
        }

        this.node.setPosition(currentPosition);
    }

    private destroyBullet() {
        //damage
        this.causeDamage();
        if (this.customName) {

            ObjectPoolManager.instance.despawn(this.customName, this.node); // Trả đạn về pool
        }
    }
    private causeDamage() {
        const targetHealth = this.targetNode.getComponent(BaseHealth);
        if (targetHealth) {
            //console.log("damage");
            targetHealth.takeDamage(this.damage);
        }
    }
}