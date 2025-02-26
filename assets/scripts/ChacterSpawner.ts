import { _decorator, Component, Node, instantiate, Vec3, tween, v3, CCFloat, Prefab, debug } from 'cc';
import { Data } from './Data';
import { CustomerController } from './CustomerController';
import { ObjectPoolManager } from './ObjectPoolManager';
const { ccclass, property } = _decorator;

@ccclass('CharacterSpawner')
export class CharacterSpawner extends Component {
    @property({ type: [Node] })
    spawnPositions: Node[] = []; // Mảng chứa 4 vị trí spawn

    // @property({ type: Prefab })
    //characterPrefab: Prefab | null = null; // Prefab của nhân vật cần spawn

    private timer: number = 0; // Biến đếm thời gian

    start() {
        // Khởi tạo timer
        this.timer = Data.Time_Spawn_Customer;

        // Kiểm tra xem đã thiết lập đủ 4 vị trí spawn chưa
        if (this.spawnPositions.length !== 4) {
            console.error("Please set exactly 4 spawn positions in the Inspector.");
        }
    }

    update(deltaTime: number) {
        // Giảm timer theo thời gian thực
        this.timer -= deltaTime;

        // Nếu timer <= 0, spawn nhân vật và reset timer
        if (this.timer <= 0) {
            this.spawnAndMoveCharacter();
            this.timer = Data.Time_Spawn_Customer; // Reset timer
        }
    }

//Spawn
    spawnAndMoveCharacter() {
        for (let i = 0; i < this.spawnPositions.length; i++) {
            const targetPosition = this.spawnPositions[i];

            if (!this.isPositionOccupied(targetPosition)) {
                // Clone prefab
                //if (this.characterPrefab) {
                const newCharacter = ObjectPoolManager.instance.spawn(Data.Customer_Name, this.node.worldPosition);
                //const newCharacter = instantiate(this.characterPrefab); // Clone prefab
                newCharacter.setParent(this.node); // Đặt nhân vật vào scene
                newCharacter.setWorldPosition(this.node.worldPosition); // Spawn tại vị trí của node chứa script

                // Lấy component CharacterController từ nhân vật mới
                const customerController = newCharacter.getComponent(CustomerController);
                if (customerController) {
                    customerController.target = targetPosition.worldPosition;
                }

                //console.log(`Character spawned and moving to position ${i}`);
                return;
                //}
            }
        }

        //console.log("No available spawn positions!");
    }

    /**
     * Kiểm tra xem một vị trí có bị chiếm không
     * @param positionNode Node đại diện cho vị trí spawn
     * @returns true nếu vị trí bị chiếm, false nếu trống
     */
    private isPositionOccupied(positionNode: Node): boolean {
        const children = this.node.children;
        for (const child of children) {
            if (child.worldPosition.equals(positionNode.worldPosition)) {
                return true; // Vị trí bị chiếm
            }
        }
        return false; // Vị trí trống
    }
    // public getOccupiedWorldPositions(): Vec3[] {
    //     return this.spawnPositions
    //         .filter((worldPosition) => this.isPositionOccupied(worldPosition))
    //         .map((worldPosition) => worldPosition.getWorldPosition(new Vec3()));
    // }

    public isSpecificPositionOccupied(index: number): boolean {
        if (index < 0 || index >= this.spawnPositions.length) return false;
        return this.isPositionOccupied(this.spawnPositions[index]);
    }
    public getSpecificWorldPosition(index: number): Vec3 | null {
        if (index < 0 || index >= this.spawnPositions.length) return null;
        return this.spawnPositions[index].getWorldPosition(new Vec3());
    }
    public getCustomerNodeByIndex(index: number): Node | null {
        // Kiểm tra xem index có hợp lệ không
        if (index < 0 || index >= this.node.children.length) {
            console.error(`Invalid index: ${index}. Index must be between 0 and ${this.node.children.length - 1}.`);
            return null;
        }

        // Lấy node con tại vị trí index
        const customerNode = this.node.children[index];

        // Kiểm tra xem node con có phải là customer không (tùy chọn kiểm tra component)
        const customerController = customerNode.getComponent("CustomerController");
        if (!customerController) {
            console.warn(`Node at index ${index} is not a valid customer node.`);
            return null;
        }

        return customerNode;
    }
}