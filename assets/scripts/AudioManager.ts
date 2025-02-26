import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {

    static instance: AudioManager = null

    private channels_sfx: { [key: string]: AudioSource } = {};
    private channels_music: { [key: string]: AudioSource } = {};
    private volume_sfx: { [key: string]: number } = {};
    private volume_music: { [key: string]: number } = {};
    public isOn: boolean;

    //Audio
    @property({ type: [AudioClip] }) public Audios: AudioClip[] = [];

    start() {
        this.onInitialize(true);
        this.playBgmGame();
    }
    playBgmGame(){
        this.onPlayMusic("bgm", this.Audios[0], 1, true);
    }

    protected onLoad(): void {
        AudioManager.instance = this
    }

    // call init first
    public onInitialize(isOn: boolean) {
        this.isOn = isOn;
    }

    //set on - off
    public onSetOnOff(isOn: boolean) {
        this.isOn = isOn;

        this.onUpdateValue();
    }

    private onUpdateValue() {
        let vol = this.isOn ? 1 : 0;

        for (const key in this.channels_sfx) {
            if (this.channels_sfx.hasOwnProperty(key)) {
                const source = this.channels_sfx[key];
                if (this.volume_sfx.hasOwnProperty(key))
                    source.volume = vol * this.volume_sfx[key];
            }
        }

        for (const key in this.channels_music) {
            if (this.channels_music.hasOwnProperty(key)) {
                const source = this.channels_music[key];
                if (this.volume_music.hasOwnProperty(key))
                    source.volume = vol * this.volume_music[key];
            }
        }
    }

    public onPlaySFX(channel: string, clip: AudioClip, volume: number, loop: boolean, priority: boolean = true) {
        if (clip == null) return;

        let source = this.onGetChannel(channel);
        let vol = volume;
        if (!this.isOn) vol = 0;

        if (source == null) {
            source = this.onCreateChannel(channel);
            this.channels_sfx[channel] = source;
            this.volume_sfx[channel] = volume;
        }

        if (source) {
            this.volume_sfx[channel] = volume
            if (!source.playing || priority) {
                source.clip = clip;
                source.volume = vol;
                source.loop = loop;
                source.play();
            }
        }
    }

    public onPlayMusic(channel: string, clip: AudioClip, volume: number, loop: boolean = true) {
        if (clip == null) return;

        let source = this.onGetChannelMusic(channel);
        let vol = volume;
        if (!this.isOn) vol = 0;

        if (source == null) {
            source = this.onCreateChannel(channel);
            this.channels_music[channel] = source;
            this.volume_music[channel] = volume;
        }

        if (source) {
            this.volume_music[channel] = volume;
            if (!source.playing) {
                source.clip = clip;
                source.volume = vol;
                source.loop = loop;
                source.play();
            }
        }
    }

    private onGetChannel(channel: string): AudioSource {
        if (this.channels_sfx.hasOwnProperty(channel))
            return this.channels_sfx[channel];
        return null;
    }

    private onGetChannelMusic(channel: string): AudioSource {
        if (this.channels_music.hasOwnProperty(channel))
            return this.channels_music[channel];
        return null;
    }

    private onCreateChannel(channel: string): AudioSource {
        let nodeChannel = new Node("audio_channel_" + channel);
        nodeChannel.setParent(this.node);
        let source = nodeChannel.addComponent(AudioSource);
        source.playOnAwake = false;
        source.loop = false;
        return source;
    }

}