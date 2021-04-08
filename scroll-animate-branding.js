// Script based on https://levelup.gitconnected.com/how-to-create-frame-by-frame-moving-image-on-scroll-effect-30ce577c63c2
// 1 to 151 => 00 - Sphere
// 152 to 212 => 01 - Sphere to branding
// 213 to 413 => 02 - Branding
// 414 to 465  => 03 - Branding to website
// 466 to 616 => 04 - Website
// 617 to 757 => 05 - Website to contents
// 758 to 908 => 06 - Contents
// 909 to 958 => 07 - Contents to portfolio

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
