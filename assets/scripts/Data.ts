import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Data')
export class Data {
    //TIME
    public static Time_Spawn_Customer: number = 5;
    public static Time_Work_Staff: number = 5;
    public static Time_Shoot_Delay: number = 2;
    public static Time_Upgrade_Gun_Delay: number = 30;
    //Pool
    public static Bullet_Name: string = "Bullet";
    public static Customer_Name: string = "Customer";
    //
    public static Damage_Customer_Pistol: number = 10;
    public static Damage_Customer_Gun: number = 50;
    public static Damage_Boss: number = 50;
    public static webUrl: string = "https://https://www.imgamedev.com";
}


