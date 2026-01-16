// constants
const BUBBLE_FRAMES = [
  'Assets/meow-photobooth/homepage/animated-bubbles-home/bubble-1.png',
  'Assets/meow-photobooth/homepage/animated-bubbles-home/bubble-2.png',
  'Assets/meow-photobooth/homepage/animated-bubbles-home/bubble-3.png',
];

const PHOTOBOOTH_FRAMES = Array.from({ length: 8 }, (_, i) =>
  `Assets/meow-photobooth/homepage/animated-photobooth-mock/${i + 1}.jpg`
);

const PHOTOBOOTH_FRAME_INTERVAL = 200;

// dom references
const selectButton = document.getElementById('select-button');
const bubbleEl = document.querySelector('.bubbles-mock');
const photoboothEl = document.querySelector('.photobooth-mock');
const cameraBtn = document.getElementById('menu-camera-button');
const uploadBtn = document.getElementById('menu-upload-button');
const logoEl = document.querySelector('.logo');


// bubble animation
let bubbleAnimating = false;
let currentBubbleFrame = 0;
let bubbleAnimationFrameId = null;

function animateBubbles() {
  if (!bubbleAnimating || !bubbleEl) return;

  bubbleEl.style.backgroundImage = `url('${BUBBLE_FRAMES[currentBubbleFrame]}')`;
  currentBubbleFrame = (currentBubbleFrame + 1) % BUBBLE_FRAMES.length;

  bubbleAnimationFrameId = setTimeout(() => {
    requestAnimationFrame(animateBubbles);
  }, 200);
}

function startBubbleAnimation() {
  if (!bubbleAnimating) {
    bubbleAnimating = true;
    animateBubbles();
  }
}

function stopBubbleAnimation() {
  bubbleAnimating = false;
  clearTimeout(bubbleAnimationFrameId);
}


// fish animations
const fishes = [
  { el: document.querySelector('.fish-mock-1'), rotation: 7.52, dir: -1 },
  { el: document.querySelector('.fish-mock-2'), rotation: 7.52, dir: 1 },
  { el: document.querySelector('.fish-mock-3'), rotation: 7.52, dir: -1 },
];

let fishAnimating = false;
let fishTimeouts = [];

function animateFish(index) {
  if (!fishAnimating) return;
  const fish = fishes[index];
  if (!fish.el) return;

  fish.el.style.transform = `rotate(${fish.rotation * fish.dir}deg)`;
  fish.dir *= -1;

  fishTimeouts[index] = setTimeout(() => {
    requestAnimationFrame(() => animateFish(index));
  }, 200);
}

function startFishAnimation() {
  if (fishAnimating) return;
  fishAnimating = true;
  fishes.forEach((_, i) => animateFish(i));
}

function stopFishAnimation() {
  fishAnimating = false;
  fishTimeouts.forEach(clearTimeout);
  fishes.forEach(f => {
    if (f.el) f.el.style.transform = 'rotate(0deg)';
  });
}






// button interactions + adding safe navigation
function addSafeNavigation(button, url, id) {
  if (!button) return;

  button.addEventListener('click', e => {
    if (typeof gtag === 'function') {
      gtag('event', 'button_click', {
        button_id: id || button.id || 'no-id',
        button_text: button.innerText || 'no-text',
      });
      console.log('GA event sent:', id || button.id);
    }

    e.preventDefault();
    setTimeout(() => (window.location.href = url), 100);
  });
}

// animation for select button
if (selectButton) {
  ['mouseenter', 'mousedown'].forEach(evt =>
    selectButton.addEventListener(evt, () => {
      startBubbleAnimation();
      startFishAnimation();
      startPhotostripAnimation();
    })
  );

  ['mouseleave', 'mouseup'].forEach(evt =>
    selectButton.addEventListener(evt, () => {
      stopBubbleAnimation();
      stopFishAnimation();
      stopPhotostripAnimation();
    })
  );
}

// add more safe nav
addSafeNavigation(selectButton, 'menu.html');
addSafeNavigation(cameraBtn, 'camera.html');
addSafeNavigation(uploadBtn, 'upload.html');
addSafeNavigation(logoEl, 'index.html', 'logo');
