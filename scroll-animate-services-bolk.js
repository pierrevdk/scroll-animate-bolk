// 1 to 61 => 01 - Sphere to branding
// 62 to 262 => 02 - Branding
// 263 to 313  => 03 - Branding to website
// 314 to 464 => 04 - Website
// 465 to 655 => 05 - Website to contents
// 656 to 806 => 06 - Contents
// 807 to 856 => 07 - Contents to portfolio

// Base URL pattern to retrieve all images frames
const url = '//res.cloudinary.com/bolk/image/upload/v1617906269/bolk-studio-website-js/scroll-animate/images/sphere-bolk-{index}.png'

// HTML element's IDs used for the canvas container
const containerID = 'sticky';

// Number of frames available
const frames = 856;

// Refresh rate expected
const fps = 60;

// The `cache` map will store images blob to avoid redownloads
const cache = new Map();

document.addEventListener('DOMContentLoaded', () => {

  // Caching some elements for a faster access
  const container = document.getElementById(containerID);
  const page = container.parentElement;
  const animation = container.querySelector('canvas');
  const animCtx = animation.getContext('2d');

  // Internals declarations
  let top = null;           // current top position of the sticky block
  let isAnimated = false;   // animation flag, stop the animation when falsy
  let dir = 1;              // direction: 1 == scroll down ; -1 == scroll up
  let cur = 0;              // current displayed frame
  let nfr = 1;              // next expected frame to display

  /****************************************************************************
   * Animation runtime
   ****************************************************************************/
  function animate () {
    // Getting top position of the container
    const {
      top: currentTop,
      height: currentHeight
    } = container.getBoundingClientRect();

    // If top position didn't changed between two calls,
    // then the block is sticky, so we can start the animation
    isAnimated = (top == currentTop);
    top = currentTop;

    // Stops here if the block is not animated (== not sticky)
    if (!isAnimated) { return }

    // Getting the total length of the scroll, based on the parent container
    // height minus the container itself.
    const timeline = page.getBoundingClientRect().height - currentHeight*2;
    // Find how many steps can exists in the total length
    const steps = timeline / frames;
    // Detect the current position of the container in the total scroll
    const distance = container.offsetTop;

    // Temporary store the current direction
    let prev = dir;

    // Set the next frame to reach: it's the frame corresponding to the current
    // step, based on the position of the container in the total scroll.
    // Limits from 1 to max-frames, to avoid issues with roundings.
    nfr = Math.max(1, Math.min(Math.floor(distance / steps), frames));
    // Compute direction, base on the current frame and the next frame position.
    dir = nfr > cur ? 1 : nfr < cur ? -1 : 0;

    // When the scroll just stops, then trigger the images preloading
    // in the previous direction.
    if (dir == 0 && prev != 0) {
      preload(prev);
    }
  }

  // Avoid too many calls by delaying the animate function to the next tick
  // when the user is scrolling.
  window.addEventListener('scroll', () => {
    window.requestAnimationFrame(animate);
  });

  /****************************************************************************
   * Images loading runtim
   ****************************************************************************/
  // Loader function expect the image index to load.
  //  Returns a Promise.
  function loader (index) {
    // If the cache previously stored the image
    return cache.has(index)
    // ... then it serves it from the cache
    ? new Promise((resolve, reject) => { resolve(cache.get(index)) })
    // ... otherwise fetch the regarding image, stores the blob in cache,
    // and returns it
    : fetch(url.replace('{index}', index))
      .then(res => res.blob())
      .then(blob => {
        const src = URL.createObjectURL(blob);
        cache.set(index, src);
        return src;
      });
  }

  // Preloading function call the loader for the next 1.5 seconds frames
  function preload (prev, force) {
    // Stops here if call during an animation to reduce the load,
    // expect when forced.
    if (dir != 0 && !force) { return }

    let limit = cur + fps * 1.5 * prev;

    for (let i = cur + prev; i < limit; i = i + prev) {
      const index = Math.max(1, Math.min(i, frames));
      loader(index);
    }
  }

  // At start, force preloading in the scroll down direction
  preload(dir, true);

  /****************************************************************************
   * Drawing runtime
   ****************************************************************************/
  // Frame function load an JS Image from a source (can be a binary blob
  // stored in cache). When ready, it erase the canvas and draw image in it.
  function frame (src) {
    const loader = new Image();
    loader.addEventListener('load', () => {
      animCtx.clearRect(0, 0, animation.width, animation.height);
      animCtx.drawImage(loader, 0, 0);
    });
    loader.src = src;
  }

  // Draw function is automatically registered to be called on next tick
  (function draw () {
    window.requestAnimationFrame(draw);

    // Stops here if scroll is paused, or when the current frame is
    // the next expected frame in the scroll direction
    if (dir == 0 ||
       (dir == 1 && cur >= nfr) ||
       (dir == -1 && cur <= nfr )) { return }

    // Loop over each frames from the current one to the next expected.
    // For each iteration, load the relevant image and frame it into the canvas.
    do {
      cur = cur + dir;
      loader(cur).then(frame);
    } while (cur != nfr)
  })();

});
