"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDom = void 0;
function createDom(tagName, classList, content, parent) {
    if (classList === void 0) { classList = []; }
    if (content === void 0) { content = null; }
    if (parent === void 0) { parent = null; }
    var dom = document.createElement(tagName);
    if (classList.length > 0) {
        for (var _i = 0, classList_1 = classList; _i < classList_1.length; _i++) {
            var cl = classList_1[_i];
            dom.classList.add(cl);
        }
    }
    if (content !== null) {
        if (typeof (content) === "string") {
            dom.insertAdjacentText('beforeend', content);
        }
        else if (content instanceof Element) {
            dom.insertAdjacentElement('beforeend', content);
        }
        else if (Array.isArray(content)) {
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
