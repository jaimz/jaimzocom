import { createDom } from "./util";

const formatTime = (time: number) : string => {
    // @ts-ignore
    const minutes = `${Math.floor(time / 60)}`.padStart(2, '0');
    // @ts-ignore
    const seconds = `${Math.floor(time % 60)}`.padStart(2, '0');

    return `${minutes}:${seconds}`;
};


export class VideoControls {
    private video : HTMLVideoElement;

    private duration : number;
    private durationEl : HTMLElement;

    private progressEl : HTMLElement;
    private loadProgressEl : HTMLElement;
    private clockEl : HTMLElement;
    private playPauseButton : HTMLElement;

    private controlsContainer : HTMLElement;

    constructor(video : HTMLVideoElement) {
        this.video = video;

        this.setupUI();

        this.video.addEventListener('canplay', this.canPlay);
        this.video.addEventListener('timeupdate', this.timeUpdate);
        this.video.addEventListener('progress', this.loadProgress);
        this.video.addEventListener('ended', this.endedPlayback);
        this.video.addEventListener('loadedmetadata', this.gotMetadata);

        // Sometimes the video cna be in the ready state before we attach the listeners
        // If this is the case fill everything in manually...
        if (this.video.readyState >= 2) {
            this.canPlay();
            this.setDuration(this.video.duration);
            this.loadProgress();
        }
    }

    public get ui() {
        return this.controlsContainer;
    }

    private setupUI() {
        this.playPauseButton = createDom('div', ['playPauseButton', 'paused']);
        this.playPauseButton.addEventListener(
            'click',
            this.playPause
        );

        this.loadProgressEl = createDom('div', ['loadProgress']);
        this.progressEl = createDom('div', ['playProgress']);

        const track = createDom('div', ['track'], [this.loadProgressEl, this.progressEl]);
        this.clockEl = createDom('div', ['clock']);

        this.controlsContainer = createDom(
            'div',
            ['videoControls', 'disabled'],
            [ this.playPauseButton, track, this.clockEl ]
        );
    }

    private setDuration(seconds : number) {
        this.duration = seconds;
        if (this.durationEl) this.durationEl.innerText = formatTime(seconds);
    }


    private setCurrentTime(seconds : number) {
        const playedPc = Math.round((seconds / this.duration) * 100);
        this.progressEl.style.width = `${playedPc}%`;
        if (this.clockEl) this.clockEl.innerText = formatTime(seconds);
    }

    private playPause = () => {
        if (this.video.paused) {
            this.video.play();
        } else {
            this.video.pause();
        }

        this.playPauseButton.classList.toggle('playing');
    }

    private canPlay = () => {
        this.setCurrentTime(this.video.currentTime);
        this.controlsContainer.classList.remove('disabled');
        this.video.classList.add('visible');
    }

    private gotMetadata = () => {
        this.setDuration(Math.round(this.video.duration));
    }

    private endedPlayback = () => {
        if (Math.round(this.video.currentTime) === Math.round(this.duration)) {
            this.video.currentTime = 0;
            this.setCurrentTime(0);
        }
    }

    private timeUpdate = () => {
        this.setCurrentTime(Math.round(this.video.currentTime));
    }

    private loadProgress = () => {
        const ranges = this.video.buffered;
        if (ranges.length === 0)
            return;

        const seconds = ranges.end(0)

        const loadPc = Math.round((seconds / this.duration) * 100);
        this.loadProgressEl.style.width = `${loadPc}%`;
    }
}