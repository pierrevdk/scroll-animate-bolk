// 1 to 151 => 00 - Sphere
// 152 to 212 => 01 - Sphere to branding
// 213 to 413 => 02 - Branding
// 414 to 465  => 03 - Branding to website
// 466 to 616 => 04 - Website
// 617 to 757 => 05 - Website to contents
// 758 to 908 => 06 - Contents
// 909 to 958 => 07 - Contents to portfolio

<<<<<<< HEAD
// Global variable to control the scrolling behavior
const step = 10; // For each 10px, change an image
const section = document.getElementById("sticky-container");
// const toto = window.scrollY;
// console.log(toto.toString()); // => returns 0, why?

function trackScrollPosition() {
  const y = window.scrollY; // would like to put section.scrollTop here but does not work
  const label = Math.min(Math.floor(y/10) + 1, 958); //Animate 200 images and change every 10 pixels
  const imageToUse = [label];
  // Change the background image
  $('.image-container').css('background-image', `url('//res.cloudinary.com/bolk/image/upload/v1617375724/bolk-studio-website-js/scroll-animate/images/sphere-bolk-${imageToUse}.png')`); // TODO: Add url before ${}
  console.log(y.toString());
}

$(document).ready(()=>{
  $(window).scroll(()=>{
    trackScrollPosition();
  })
})
=======
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
>>>>>>> 6e3867142062bd15f250c1635cd4ef7806acdacd
