import { _decorator, Component, Node, Prefab, instantiate, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ObjectPoolManager')
export class ObjectPoolManager extends Component {
    private static _instance: ObjectPoolManager | null = null; // Singleton instance

    @property({ type: [Prefab] })
    prefabs: Prefab[] = []; // Danh sách các prefab cần quản lý

    private pools: Map<string, Node[]> = new Map(); // Lưu trữ các pool theo tên prefab

    // Getter để truy cập Singleton instance
    public static get instance(): ObjectPoolManager {
        if (!this._instance) {
            console.error("ObjectPoolManager has not been initialized!");
        }
        return this._instance!;
    }

    onLoad() {
        // Đảm bảo chỉ có một instance duy nhất
        if (ObjectPoolManager._instance) {
            console.error("Multiple instances of ObjectPoolManager detected!");
            this.destroy(); // Hủy instance mới nếu đã tồn tại
            return;
        }

        ObjectPoolManager._instance = this; // Gán instance hiện tại
    }

    onDestroy() {
        // Xóa instance khi node bị hủy
        if (ObjectPoolManager._instance === this) {
            ObjectPoolManager._instance = null;
        }
    }

    start() {
        // Khởi tạo pool cho từng prefab
        for (const prefab of this.prefabs) {
            const pool: Node[] = [];
            const poolSize = 5; // Số lượng đối tượng ban đầu trong mỗi pool

            for (let i = 0; i < poolSize; i++) {
                const obj = instantiate(prefab); // Tạo instance từ prefab
                obj.active = false; // Vô hiệu hóa đối tượng ban đầu
                this.node.addChild(obj); // Thêm đối tượng vào node cha
                pool.push(obj);
            }

            this.pools.set(prefab.name, pool); // Lưu pool với key là tên prefab
        }
    }

    /**
     * Lấy một đối tượng từ pool theo tên prefab và đặt vị trí
     * @param prefabName Tên của prefab
     * @param position Vị trí để kích hoạt đối tượng
     * @returns Node của đối tượng hoặc null nếu pool hết
     */
    public spawn(prefabName: string, position: Vec3): Node | null {
        const pool = this.pools.get(prefabName);
        if (!pool) {
            console.error(`No pool found for prefab: ${prefabName}`);
            return null;
        }

        for (const obj of pool) {
            if (!obj.active) {
                obj.active = true; // Kích hoạt đối tượng
                obj.setPosition(position); // Đặt vị trí
                return obj;
            }
        }

        console.warn(`Pool for prefab ${prefabName} is empty! Creating a new object.`);
        const prefab = this.prefabs.find(prefab => prefab.name === prefabName);
        if (!prefab) {
            console.error(`Prefab ${prefabName} not found in the prefabs list!`);
            return null;
        }

        const newObj = instantiate(prefab); 
        newObj.active = true; 
        newObj.setPosition(position); 
        this.node.addChild(newObj); 
        pool.push(newObj);

        return newObj;
    }

    public despawn(prefabName: string, obj: Node) {
        const pool = this.pools.get(prefabName);
        if (!pool) {
            console.error(`No pool found for prefab: ${prefabName}`);
            return;
        }

        obj.active = false; // Vô hiệu hóa đối tượng
        obj.setPosition(0, 0, 0); // Đặt lại vị trí về gốc
    }
}