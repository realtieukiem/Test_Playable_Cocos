import { _decorator, Component, Node, Vec3, tween } from 'cc';
import { CharacterSpawner } from './ChacterSpawner';
import { CustomerController } from './CustomerController';
const { ccclass, property } = _decorator;

@ccclass('StaffController')
export class StaffController extends Component {
    @property({ type: CharacterSpawner })
    characterSpawner: CharacterSpawner | null = null; // Tham chiếu đến CharacterSpawner

    @property({ type: Node })
    createItemPosition: Node | null = null; // Vị trí tạo đồ

    private currentTargetIndex: number = 0; // Chỉ số vị trí customer hiện tại
    private currentState: string = "Idle"; // Trạng thái hiện tại của staff

    start() {
        // Kiểm tra xem đã thiết lập CharacterSpawner chưa
        if (!this.characterSpawner) {
            console.error("Please assign the CharacterSpawner in the Inspector.");
        }

        // Kiểm tra xem vị trí tạo đồ có tồn tại không
        if (!this.createItemPosition) {
            console.error("Please assign the create item position in the Inspector.");
        }

        // Bắt đầu quy trình di chuyển
        this.moveToNextState();
    }

    /**
     * Chuyển sang trạng thái tiếp theo
     */
    private moveToNextState() {
        switch (this.currentState) {
            case "Idle":
                this.checkAndMoveToCustomerSequentially(); // Trạng thái 1: Kiểm tra tuần tự và di chuyển đến customer
                break;
            case "MovingToCustomer":
                this.checkCustomerNeed(); // Trạng thái 2: Kiểm tra nhu cầu của customer
                break;
            case "CheckingCustomerNeed":
                this.moveToCreateItemPosition(); // Trạng thái 3: Di chuyển đến vị trí tạo đồ
                break;
            case "MovingToCreateItem":
                this.returnToCustomer(); // Trạng thái 4: Quay lại vị trí customer
                break;
            case "ReturningToCustomer":
                this.resetState(); // Kết thúc và quay về trạng thái ban đầu
                break;
        }
    }

    /**
     * Kiểm tra tuần tự các vị trí spawn và di chuyển đến khi có customer
     */
    private checkAndMoveToCustomerSequentially() {
        this.currentState = "Idle";

        // Kiểm tra tuần tự các vị trí spawn
        for (let i = 0; i < 4; i++) {
            if (this.characterSpawner?.isSpecificPositionOccupied(i)) {
                // Nếu vị trí có customer, lấy world position và điều chỉnh trục Z
                const targetPosition = this.characterSpawner.getSpecificWorldPosition(i);
                if (targetPosition) {
                    console.log(`Found customer at position ${i}. Moving there.`);

                    // Tạo bản sao của targetPosition và điều chỉnh trục Z
                    //const adjustedPosition = targetPosition.clone();
                    //adjustedPosition.z -= 5; // Giảm giá trị Z đi 5 đơn vị

                    // Chuyển trạng thái và di chuyển
                    this.currentState = "MovingToCustomer";
                    tween(this.node)
                        .to(2, { worldPosition: targetPosition }) // Di chuyển đến vị trí đã điều chỉnh
                        .call(() => {
                            console.log("Arrived at customer position.");
                            this.moveToNextState(); // Chuyển sang trạng thái tiếp theo
                        })
                        .start();
                    return; // Dừng kiểm tra khi đã tìm thấy customer
                }
            }
        }

        // Nếu không có customer ở bất kỳ vị trí nào, đợi 1 giây và thử lại
        console.log("No customers available. Checking again in 1 second...");
        this.scheduleOnce(() => this.checkAndMoveToCustomerSequentially(), 1);
    }

    /**
     * Kiểm tra nhu cầu của customer
     */
    private checkCustomerNeed() {
        this.currentState = "CheckingCustomerNeed";

        // Lấy node customer tại vị trí hiện tại
        const customerNode = this.characterSpawner?.spawnPositions[this.currentTargetIndex];
        if (!customerNode) {
            console.error("Customer node not found!");
            this.moveToNextState();
            return;
        }

        // Lấy component CustomerManager từ customer node
        const customerController = customerNode.getComponent(CustomerController);
        if (!customerController) {
            console.error("CustomerManager component not found on customer node!");
            this.moveToNextState();
            return;
        }

        // Kiểm tra nhu cầu của customer
        const customerNeed = customerController.getCustomerNeed();
        console.log(`Customer needs: ${customerNeed}`);

        // Đợi 5 giây trước khi chuyển sang trạng thái tiếp theo
        this.scheduleOnce(() => {
            console.log("Finished checking customer need.");
            this.moveToNextState();
        }, 5); // Đợi 5 giây
    }

    /**
     * Trạng thái 3: Di chuyển đến vị trí tạo đồ
     */
    private moveToCreateItemPosition() {
        this.currentState = "MovingToCreateItem";

        if (!this.createItemPosition) return;

        console.log("Moving to create item position.");

        // Lấy world position của vị trí tạo đồ và điều chỉnh trục Z
        const targetPosition = this.createItemPosition.getWorldPosition(new Vec3());
        const adjustedPosition = targetPosition.clone();
        adjustedPosition.z -= 5; // Giảm giá trị Z đi 5 đơn vị

        // Sử dụng tween để di chuyển
        tween(this.node)
            .to(2, { worldPosition: adjustedPosition }) // Di chuyển đến vị trí đã điều chỉnh
            .call(() => {
                console.log("Arrived at create item position.");
                this.moveToNextState(); // Chuyển sang trạng thái tiếp theo
            })
            .start();
    }

    /**
     * Trạng thái 4: Quay lại vị trí customer
     */
    private returnToCustomer() {
        this.currentState = "ReturningToCustomer";

        // Lấy world position của vị trí customer và điều chỉnh trục Z
        const customerPosition = this.characterSpawner?.getSpecificWorldPosition(this.currentTargetIndex);
        if (!customerPosition) {
            console.error("Customer position not found!");
            this.moveToNextState();
            return;
        }

        const adjustedPosition = customerPosition.clone();
        adjustedPosition.z -= 5; // Giảm giá trị Z đi 5 đơn vị

        // Sử dụng tween để di chuyển
        tween(this.node)
            .to(2, { worldPosition: adjustedPosition }) // Di chuyển đến vị trí đã điều chỉnh
            .call(() => {
                console.log("Returned to customer position.");
                this.moveToNextState(); // Kết thúc và reset trạng thái
            })
            .start();
    }

    /**
     * Reset trạng thái về Idle
     */
    private resetState() {
        this.currentState = "Idle";
        console.log("Staff is now idle.");
        this.scheduleOnce(() => {
            this.moveToNextState(); // Bắt đầu lại quy trình
        }, 1); // Đợi 1 giây trước khi bắt đầu lại
    }
}