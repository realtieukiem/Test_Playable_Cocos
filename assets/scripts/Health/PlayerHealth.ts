import { _decorator, Component } from 'cc';
import { BaseHealth } from './BaseHealth';
const { ccclass } = _decorator;

@ccclass('PlayerHealth')
export class PlayerHealth extends BaseHealth {
    protected override onDeath() {
        console.log("Player has died! Game Over!");
        // Ví dụ: Hiển thị màn hình game over, dừng game, v.v.
        super.onDeath(); // Gọi phương thức gốc để tắt node
    }


}