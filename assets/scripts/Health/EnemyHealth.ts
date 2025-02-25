import { _decorator, Component } from 'cc';
import { BaseHealth } from './BaseHealth';
const { ccclass } = _decorator;

@ccclass('EnemyHealth')
export class EnemyHealth extends BaseHealth {
    protected override onDeath() {
        this.revive();
       // super.onDeath();
    }

    public revive() {

        this.currentHealth = this.maxHealth; // Đặt lại máu tối đa
        this.node.active = true; // Kích hoạt lại node

    }
}