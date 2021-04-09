// 1 to 61 => 01 - Sphere to branding
// 62 to 262 => 02 - Branding
// 263 to 313  => 03 - Branding to website
// 314 to 464 => 04 - Website
// 465 to 655 => 05 - Website to contents
// 656 to 806 => 06 - Contents
// 807 to 856 => 07 - Contents to portfolio

const containerID = 'sticky';
const animationID = 'image-container';
const frames = 856;

const { documentElement: page } = document;

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById(containerID);
  const animation = document.getElementById(animationID);
  const animCtx = animation.getContext('2d');

  let top = null;
  let isAnimated = false;

  function animate () {
    const {
      top: currentTop,
      height: currentHeight,
      offsetTop
    } = container.getBoundingClientRect();

    isAnimated = (top == currentTop);
    top = currentTop;

    if (!isAnimated) { return }

    const timeline = page.getBoundingClientRect().height - currentHeight*2;
    const steps = timeline / frames;
    const distance = container.offsetTop;

    const index = Math.max(1, Math.min(Math.floor(distance / steps), frames));
    draw(index);

  }

  function draw (index) {
    const loader = new Image();
    loader.addEventListener('load', () => {
      animCtx.clearRect(0, 0, animation.width, animation.height);
      animCtx.drawImage(loader, 0, 0);
    });
    loader.src = `//res.cloudinary.com/bolk/image/upload/v1617906269/bolk-studio-website-js/scroll-animate/images/sphere-bolk-${index}.png`;
  }

  draw(1);

  window.addEventListener('scroll', () => {
    requestAnimationFrame(animate);
  });

});
