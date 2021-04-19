// 1 to 61 => 01 - Sphere to branding
// 62 to 262 => 02 - Branding
// 263 to 313  => 03 - Branding to website
// 314 to 464 => 04 - Website
// 465 to 655 => 05 - Website to contents
// 656 to 806 => 06 - Contents
// 807 to 856 => 07 - Contents to portfolio

const url = './images/sphere-bolk-{index}.png';

const containerID = 'sticky';
const animationID = 'image-container';
const frames = 856;
const fps = 60;

const cache = new Map();

const { documentElement: page } = document;

document.addEventListener('DOMContentLoaded', () => {

  const container = document.getElementById(containerID);
  const animation = document.getElementById(animationID);
  const animCtx = animation.getContext('2d');

  let top = null;
  let isAnimated = false;
  let dir = 1;
  let cur = 0;
  let nfr = 1;

  function animate () {
    const {
      top: currentTop,
      height: currentHeight
    } = container.getBoundingClientRect();

    isAnimated = (top == currentTop);
    top = currentTop;

    if (!isAnimated) { return }

    const timeline = page.getBoundingClientRect().height - currentHeight*2;
    const steps = timeline / frames;
    const distance = container.offsetTop;

    let prev = dir;

    nfr = Math.max(1, Math.min(Math.floor(distance / steps), frames));
    dir = nfr > cur ? 1 : nfr < cur ? -1 : 0;

    if (dir == 0 && prev != 0) {
      preload(prev);
    }
  }

  window.addEventListener('scroll', () => {
    window.requestAnimationFrame(animate);
  });

  function loader (index) {
    return cache.has(index)
    ? new Promise((resolve, reject) => { resolve(cache.get(index)) })
    : fetch(url.replace('{index}', index))
      .then(res => res.blob())
      .then(blob => {
        const src = URL.createObjectURL(blob);
        cache.set(index, src);
        return src;
      });
  }

  function preload (prev, force) {
    if (dir != 0 && !force) { return }

    let limit = cur + fps * 1.5 * prev;

    for (let i = cur + prev; i < limit; i = i + prev) {
      const index = Math.max(1, Math.min(i, frames));
      loader(index);
    }
  }

  preload(dir, true);

  function frame (src) {
    const loader = new Image();
    loader.addEventListener('load', () => {
      animCtx.clearRect(0, 0, animation.width, animation.height);
      animCtx.drawImage(loader, 0, 0);
    });
    loader.src = src;
  }

  function draw () {
    window.requestAnimationFrame(draw);

    if (dir == 0 ||
       (dir == 1 && cur >= nfr) ||
       (dir == -1 && cur <= nfr )) { return }

    let s = cur,
        e = nfr,
        f = 1 / (e - s);

    do {
      cur = cur + dir;
      loader(cur).then(frame);
    } while (cur != nfr)
  }

  draw();

});
