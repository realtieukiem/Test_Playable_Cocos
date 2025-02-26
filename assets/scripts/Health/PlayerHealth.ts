import { _decorator, Component } from 'cc';
import { BaseHealth } from './BaseHealth';
import { ObjectPoolManager } from '../ObjectPoolManager';
import { Data } from '../Data';
const { ccclass } = _decorator;

@ccclass('PlayerHealth')
export class PlayerHealth extends BaseHealth {
    protected override onDeath() {
        console.log("Player has died!");
        ObjectPoolManager.instance.despawn(Data.Customer_Name, this.node);
        super.onDeath();
    }


}