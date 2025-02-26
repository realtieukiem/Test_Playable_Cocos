import { _decorator, Component, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BaseHealth')
export class BaseHealth extends Component {
    @property({ type: Number })
    maxHealth: number = 100;
    @property({ type: Number })
    protected currentHealth: number = 0;

    @property({ type: Sprite })
    healthBarSprite: Sprite | null = null;

    start() {
        this.currentHealth = this.maxHealth;
    }
    protected onDisable(): void {
        this.currentHealth = this.maxHealth;
    }
    public takeDamage(damage: number) {
        if (this.currentHealth <= 0) {
            this.die();
        } else {
            this.currentHealth -= damage;
            this.updateHealthBar();
        }
    }

    protected die() {
        this.onDeath();
    }

    protected onDeath() {
        //this.currentHealth = this.maxHealth;
        //this.node.active = false;
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
    private updateHealthBar() {
        if (!this.healthBarSprite) {
            console.error("HealthBar Sprite is not assigned!");
            return;
        }

        const fillAmount = this.currentHealth / this.maxHealth; // Tính tỷ lệ máu
        this.healthBarSprite.fillRange = fillAmount; // Cập nhật fillRange
    }

}