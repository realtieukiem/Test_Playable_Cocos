import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BaseHealth')
export class BaseHealth extends Component {
    @property({ type: Number })
    maxHealth: number = 100;
    @property({ type: Number })
    protected currentHealth: number = 0;

    start() {
        this.currentHealth = this.maxHealth;
    }

    public takeDamage(damage: number) {
        if (this.currentHealth <= 0) {
            this.die();
        } else {
            this.currentHealth -= damage;
        }
    }

    protected die() {
        this.onDeath();
    }

    protected onDeath() {

        this.node.active = false;
    }


    public heal(amount: number) {
        if (this.currentHealth <= 0) {
            return;
        }

        this.currentHealth = Math.min(this.maxHealth, this.currentHealth + amount);
    }
    public isAlive(): boolean {
        return this.currentHealth > 0;
    }

}