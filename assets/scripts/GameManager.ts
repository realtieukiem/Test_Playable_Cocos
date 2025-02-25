import { _decorator, Component,Node } from 'cc';
const { ccclass,property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    private static _instance: GameManager | null = null;
    public static get instance(): GameManager {
        return this._instance!;
    }

    onLoad() {
        if (GameManager._instance) {
            this.destroy();
            return;
        }
        GameManager._instance = this;
    }

    //------------------------------------------------------------------------------
    @property({ type: Node })
    enemyNode: Node | null = null;
    @property({ type: Node })
    targetNode: Node; 

    private isUpgraded: boolean = false;
    private typeWeapon: WeaponType = WeaponType.Pistol;

    protected start(): void {
        this.randomizeWeapon();
    }

    public UpdateWeapon() {
        this.isUpgraded = true;
    }





    public randomizeWeapon() {
        if (!this.isUpgraded) {
            // Nếu chưa nâng cấp, chỉ sử dụng Pistol
            this.typeWeapon = WeaponType.Pistol;
        } else {
            // Nếu đã nâng cấp, random giữa Pistol và Gun
            const weaponTypes = Object.getOwnPropertyNames(WeaponType); // Lấy danh sách các loại súng từ enum
            const randomIndex = Math.floor(Math.random() * weaponTypes.length); // Random index
            this.typeWeapon = weaponTypes[randomIndex] as WeaponType; // Chọn loại súng
        }

        //console.log(this.currentWeapon);
        return this.typeWeapon;
    }
}

enum WeaponType {
    Pistol = "Pistol",
    Gun = "Gun"
}