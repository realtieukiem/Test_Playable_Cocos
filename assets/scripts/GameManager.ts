import { _decorator, Component, Label, Node } from 'cc';
import { Data } from './Data';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

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
    customerContainer: Node;
    @property({ type: Node })
    tapNode: Node | null = null;

    @property({ type: [Node] })
    tapNodes: Node[] = [];
    @property({ type: Label })
    moneyLabel: Label | null = null;

    private isUpgraded: boolean = false;
    private typeWeapon: WeaponType = WeaponType.Pistol;
    private numTap: number = 0;
    private currentCoin: number = 0;

    protected start(): void {
        this.randomizeWeapon();
        this.OnBtTap(true);
        //update Money
        this.updateMoneyLabel();
    }

    private OnBtTap(isTap: boolean) {
        this.tapNode.active = isTap;
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
    public TapToScreen() {
        //Audio
        AudioManager.instance.onPlaySFX('Button-Click', AudioManager.instance.Audios[1], 1, false);
        if (this.numTap == 0) {
            this.OnBtTap(false);
            this.numTap++;

            //set node
            this.tapNodes[0].active = false;
            this.tapNodes[2].active = true;
            //set time
            this.scheduleOnce(() => {
                this.stateUpgrade();
                this.openActiveBtTap();
            }, Data.Time_Upgrade_Gun_Delay);

        } else if (this.numTap == 1) {
            this.numTap++;
            this.OnBtTap(false);
            this.tapNodes[1].active = false;
            this.tapNodes[3].active = true;
            this.UpdateWeapon();

            this.scheduleOnce(() => {
                this.openActiveBtTap();
            }, Data.Time_Upgrade_Gun_Delay);

        } else {
            this.clickLinkUrl();
        }
    }
    private stateUpgrade() {
        //this.OnBtTap(true);
        this.tapNodes[1].active = true;
    }
    private openActiveBtTap() {
        this.OnBtTap(true);
        //this.tapNodes[1].active = true;
    }
    private clickLinkUrl() {
        if (Data.webUrl) {
            window.open(Data.webUrl, "_blank");
        } else {
            console.error("Web URL is not set!");
        }
    }
    //COIN
    public plusCoin(coin: number) {
        //audio
        AudioManager.instance.onPlaySFX('Coin', AudioManager.instance.Audios[2], 1, false);
        this.currentCoin += coin;
        this.updateMoneyLabel();

    }
    private updateMoneyLabel() {
        if (!this.moneyLabel) {
            return;
        }

        this.moneyLabel.string = this.currentCoin.toString();
    }
}

enum WeaponType {
    Pistol = "Pistol",
    Gun = "Gun"
}