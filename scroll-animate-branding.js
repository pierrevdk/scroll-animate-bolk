// 1 to 151 => 00 - Sphere
// 152 to 212 => 01 - Sphere to branding
// 213 to 413 => 02 - Branding
// 414 to 465  => 03 - Branding to website
// 466 to 616 => 04 - Website
// 617 to 757 => 05 - Website to contents
// 758 to 908 => 06 - Contents
// 909 to 958 => 07 - Contents to portfolio

const containerID = 'sticky';
const animationID = 'image-container';
const frames = 958;

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

    const index = Math.min(Math.floor(distance / steps), frames);
    draw(index);

  }

  function draw (index) {
    const loader = new Image();
    loader.addEventListener('load', () => {
      animCtx.clearRect(0, 0, animation.width, animation.height);
      animCtx.drawImage(loader, 0, 0);
    });
    loader.src = `./images/sphere-bolk-${index}.png`;
  }

  draw(1);

  window.addEventListener('scroll', () => {
    requestAnimationFrame(animate);
  });

});
