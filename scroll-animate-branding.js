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
function trackScrollPosition() {
  const y = window.scrollY;
  const label = Math.min(Math.floor(y/10) + 1, 958); //Animate 200 images and change every 10 pixels
  const imageToUse = [label];
  // Change the background image
  $('.image-container').css('background-image', `url('/images/sphere-bolk-${imageToUse}.png')`); // TODO: Add url before ${}
}
$(document).ready(()=>{
  $(window).scroll(()=>{
    trackScrollPosition();
  })
})
