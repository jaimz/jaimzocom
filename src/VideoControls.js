"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoControls = void 0;
var util_1 = require("./util");
var formatTime = function (time) {
    // @ts-ignore
    var minutes = ("" + Math.floor(time / 60)).padStart(2, '0');
    // @ts-ignore
    var seconds = ("" + Math.floor(time % 60)).padStart(2, '0');
    return minutes + ":" + seconds;
};
var VideoControls = /** @class */ (function () {
    function VideoControls(video) {
        var _this = this;
        this.playPause = function () {
            if (_this.video.paused) {
                _this.video.play();
            }
            else {
                _this.video.pause();
            }
            _this.playPauseButton.classList.toggle('playing');
        };
        this.canPlay = function () {
            _this.setCurrentTime(_this.video.currentTime);
            _this.controlsContainer.classList.remove('disabled');
            _this.video.classList.add('visible');
        };
        this.gotMetadata = function () {
            _this.setDuration(Math.round(_this.video.duration));
        };
        this.endedPlayback = function () {
            if (Math.round(_this.video.currentTime) === Math.round(_this.duration)) {
                _this.video.currentTime = 0;
                _this.setCurrentTime(0);
            }
        };
        this.timeUpdate = function () {
            _this.setCurrentTime(Math.round(_this.video.currentTime));
        };
        this.loadProgress = function () {
            var ranges = _this.video.buffered;
            if (ranges.length === 0)
                return;
            var seconds = ranges.end(0);
            var loadPc = Math.round((seconds / _this.duration) * 100);
            _this.loadProgressEl.style.width = loadPc + "%";
        };
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
    Object.defineProperty(VideoControls.prototype, "ui", {
        get: function () {
            return this.controlsContainer;
        },
        enumerable: false,
        configurable: true
    });
    VideoControls.prototype.setupUI = function () {
        this.playPauseButton = util_1.createDom('div', ['playPauseButton', 'paused']);
        this.playPauseButton.addEventListener('click', this.playPause);
        this.loadProgressEl = util_1.createDom('div', ['loadProgress']);
        this.progressEl = util_1.createDom('div', ['playProgress']);
        var track = util_1.createDom('div', ['track'], [this.loadProgressEl, this.progressEl]);
        this.clockEl = util_1.createDom('div', ['clock']);
        this.controlsContainer = util_1.createDom('div', ['videoControls', 'disabled'], [this.playPauseButton, track, this.clockEl]);
    };
    VideoControls.prototype.setDuration = function (seconds) {
        this.duration = seconds;
        if (this.durationEl)
            this.durationEl.innerText = formatTime(seconds);
    };
    VideoControls.prototype.setCurrentTime = function (seconds) {
        var playedPc = Math.round((seconds / this.duration) * 100);
        this.progressEl.style.width = playedPc + "%";
        if (this.clockEl)
            this.clockEl.innerText = formatTime(seconds);
    };
    return VideoControls;
}());
exports.VideoControls = VideoControls;
