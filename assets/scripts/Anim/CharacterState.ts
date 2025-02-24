import { SkeletalAnimation } from 'cc';

export abstract class CharacterState {
    protected skeletalAnimation: SkeletalAnimation;

    constructor(skeletalAnimation: SkeletalAnimation) {
        this.skeletalAnimation = skeletalAnimation;
    }

    // Phương thức cập nhật trạng thái
    public abstract update(deltaTime: number): void;

    // Phương thức xử lý khi vào trạng thái
    public onEnter(): void {
        //console.log(`Entering state: ${this.constructor.name}`);
    }

    // Phương thức xử lý khi rời khỏi trạng thái
    public onExit(): void {
        //console.log(`Exiting state: ${this.constructor.name}`);
    }
}