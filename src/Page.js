"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startPage = void 0;
var VideoControls_1 = require("./VideoControls");
var movieSfx = ['mov', 'mp4'];
var imgSfx = ['jpg', 'png'];
function fillImage(item, src) {
    var width = parseInt(item.dataset['width']);
    var height = parseInt(item.dataset['height']);
    var alt = item.dataset['alt'] || "UI image";
    var img = new Image(width, height);
    img.classList.add('poster');
    img.onload = function () { return img.classList.add('visible'); };
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
    }
    else if (imgSfx.indexOf(sfx) !== -1) {
        fillImage(item, src);
    }
    else {
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
    if (!itemElements)
        return;
    var io = new IntersectionObserver(didObserve, { threshold: 0.5 });
    itemElements.forEach(function (el) { return io.observe(el); });
}
exports.startPage = startPage;
