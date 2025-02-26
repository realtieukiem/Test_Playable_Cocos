import { _decorator, Component, Game } from 'cc';
import { BaseHealth } from './BaseHealth';
import { ObjectPoolManager } from '../ObjectPoolManager';
import { Data } from '../Data';
import { GameManager } from '../GameManager';
import { EnemyController } from '../EnemyController';
const { ccclass } = _decorator;

@ccclass('PlayerHealth')
export class PlayerHealth extends BaseHealth {
    protected override onDeath() {
        console.log("Player has died!");
        GameManager.instance.enemyNode.getComponent(EnemyController).stopShooting();
        //ObjectPoolManager.instance.despawn(Data.Customer_Name, this.node);
        this.node.destroy();
        //super.onDeath();
    }


}