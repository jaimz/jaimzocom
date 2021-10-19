import { VideoControls } from "./VideoControls";

const movieSfx = ['mov', 'mp4'];
const imgSfx = ['jpg', 'png', 'webp'];

function fillImage(item : HTMLElement, src: string) {
    const width = parseInt(item.dataset['width']);
    const height = parseInt(item.dataset['height']);
    const alt = item.dataset['alt'] || "UI image";

    const img = new Image(width, height);
    img.classList.add('poster');
    img.onload = () => img.classList.add('visible');
    img.alt = alt;
    img.src = src;

    const container = item.querySelector('.frame') || item;

    container.insertAdjacentElement('beforeend', img);
}

function fillMovie(item: HTMLElement, src: string) {
    const width = parseInt(item.dataset['width']);
    const height = parseInt(item.dataset['height']);

    const movie = document.createElement("video");
    movie.width = width;
    movie.height = height;
    movie.classList.add('poster');
    const controls = new VideoControls(movie);

    const container = item.querySelector('.frame') || item;
    container.insertAdjacentElement('beforeend', movie);
    container.insertAdjacentElement('beforeend', controls.ui);

    movie.src = src;
}


function fillItem(item : HTMLElement) {
    const src = item.dataset['src'];
    const comps = src.split('.');
    if (comps.length < 2) {
        console.warn('No file suffix on source', src);
        return;
    }

    const sfx = comps[comps.length - 1];

    if(movieSfx.indexOf(sfx) !== -1) {
        fillMovie(item, src);
    } else if (imgSfx.indexOf(sfx) !== -1) {
        fillImage(item, src);
    } else {
        console.warn("Don't know how to fill item type: ", sfx);
    }
}

function didObserve(entries: IntersectionObserverEntry[], observer : IntersectionObserver) {
    for (const entry of entries) {
        // Should always be true (?)
        if (entry.intersectionRatio >= 0.5) {
            fillItem(entry.target as HTMLElement);
            observer.unobserve(entry.target);
        }
    }
}

export function startPage() {
    const itemElements = document.querySelectorAll('.item');
    if (!itemElements)
        return;

    const io = new IntersectionObserver(didObserve, { threshold : 0.5 });
    itemElements.forEach((el : Element) => io.observe(el));
}