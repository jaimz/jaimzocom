(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.startPage = void 0;
var VideoControls_1 = require("./VideoControls");
var movieSfx = ['mov', 'mp4'];
var imgSfx = ['jpg', 'png', 'webp'];
function fillImage(item, src) {
    var width = parseInt(item.dataset['width']);
    var height = parseInt(item.dataset['height']);
    var alt = item.dataset['alt'] || "UI image";
    var img = new Image(width, height);
    img.classList.add('poster');
    img.onload = function () {
        return img.classList.add('visible');
    };
    img.alt = alt;
    img.src = src;
    var container = item.querySelector('.frame') || item;
    container.insertAdjacentElement('beforeend', img);
}
function fillMovie(item, src) {
    var width = parseInt(item.dataset['width']);
    var height = parseInt(item.dataset['height']);
    var movie = document.createElement("video");
    movie.width = width;
    movie.height = height;
    movie.classList.add('poster');
    var controls = new VideoControls_1.VideoControls(movie);
    var container = item.querySelector('.frame') || item;
    container.insertAdjacentElement('beforeend', movie);
    container.insertAdjacentElement('beforeend', controls.ui);
    movie.src = src;
}
function fillItem(item) {
    var src = item.dataset['src'];
    var comps = src.split('.');
    if (comps.length < 2) {
        console.warn('No file suffix on source', src);
        return;
    }
    var sfx = comps[comps.length - 1];
    if (movieSfx.indexOf(sfx) !== -1) {
        fillMovie(item, src);
    } else if (imgSfx.indexOf(sfx) !== -1) {
        fillImage(item, src);
    } else {
        console.warn("Don't know how to fill item type: ", sfx);
    }
}
function didObserve(entries, observer) {
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var entry = entries_1[_i];
        // Should always be true (?)
        if (entry.intersectionRatio >= 0.5) {
            fillItem(entry.target);
            observer.unobserve(entry.target);
        }
    }
}
function startPage() {
    var itemElements = document.querySelectorAll('.item');
    if (!itemElements) return;
    var io = new IntersectionObserver(didObserve, { threshold: 0.5 });
    itemElements.forEach(function (el) {
        return io.observe(el);
    });
}
exports.startPage = startPage;

},{"./VideoControls":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoControls = void 0;
var util_1 = require("./util");
var formatTime = function formatTime(time) {
    // @ts-ignore
    var minutes = ("" + Math.floor(time / 60)).padStart(2, '0');
    // @ts-ignore
    var seconds = ("" + Math.floor(time % 60)).padStart(2, '0');
    return minutes + ":" + seconds;
};
var VideoControls = /** @class */function () {
    function VideoControls(video) {
        var _this = this;
        this.playPause = function () {
            if (_this.video.paused) {
                _this.video.play();
            } else {
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
            if (ranges.length === 0) return;
            var seconds = ranges.end(0);
            var loadPc = Math.round(seconds / _this.duration * 100);
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
        get: function get() {
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
        if (this.durationEl) this.durationEl.innerText = formatTime(seconds);
    };
    VideoControls.prototype.setCurrentTime = function (seconds) {
        var playedPc = Math.round(seconds / this.duration * 100);
        this.progressEl.style.width = playedPc + "%";
        if (this.clockEl) this.clockEl.innerText = formatTime(seconds);
    };
    return VideoControls;
}();
exports.VideoControls = VideoControls;

},{"./util":4}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Page_1 = require("./Page");
document.addEventListener('DOMContentLoaded', Page_1.startPage);

},{"./Page":1}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createDom = void 0;
function createDom(tagName, classList, content, parent) {
    if (classList === void 0) {
        classList = [];
    }
    if (content === void 0) {
        content = null;
    }
    if (parent === void 0) {
        parent = null;
    }
    var dom = document.createElement(tagName);
    if (classList.length > 0) {
        for (var _i = 0, classList_1 = classList; _i < classList_1.length; _i++) {
            var cl = classList_1[_i];
            dom.classList.add(cl);
        }
    }
    if (content !== null) {
        if (typeof content === "string") {
            dom.insertAdjacentText('beforeend', content);
        } else if (content instanceof Element) {
            dom.insertAdjacentElement('beforeend', content);
        } else if (Array.isArray(content)) {
            for (var _a = 0, content_1 = content; _a < content_1.length; _a++) {
                var el = content_1[_a];
                dom.insertAdjacentElement('beforeend', el);
            }
        }
    }
    if (parent) {
        parent.insertAdjacentElement('beforeend', dom);
    }
    return dom;
}
exports.createDom = createDom;

},{}]},{},[3])

//# sourceMappingURL=bundle.js.map
