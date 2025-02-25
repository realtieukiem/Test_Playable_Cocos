import { SkeletalAnimation } from 'cc';

export abstract class CharacterState {
    protected skeletalAnimation: SkeletalAnimation;

    constructor(skeletalAnimation: SkeletalAnimation) {
        this.skeletalAnimation = skeletalAnimation;
    }

    public abstract update(deltaTime: number): void;

    public onEnter(): void {
        //console.log(`Entering state: ${this.constructor.name}`);
    }

    public onExit(): void {
        //console.log(`Exiting state: ${this.constructor.name}`);
    }
}