function createDom(
    tagName : string,
    classList : string[] = [],
    content : string | Element | Element[] | null = null,
    parent : Element | null = null) : HTMLElement
{

    let dom = document.createElement(tagName);

    if (classList.length > 0) {
        for (const cl of classList) {
            dom.classList.add(cl);
        }
    }

    if (content !== null) {
        if (typeof(content) === "string") {
            dom.insertAdjacentText('beforeend', content);
        } else if (content instanceof Element) {
            dom.insertAdjacentElement('beforeend', content);
        } else if (Array.isArray(content)) {
            for (const el of content) {
                dom.insertAdjacentElement('beforeend', el);
            }
        }
    }

    if (parent) {
        parent.insertAdjacentElement('beforeend', dom);
    }

    return dom;
}

export { createDom }