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


// ball animations
const balls = [
  { el: document.querySelector('.ball-mock-1'), rotation: 7.52, dir: -1 },
  { el: document.querySelector('.ball-mock-2'), rotation: 7.52, dir: 1 },
  { el: document.querySelector('.ball-mock-3'), rotation: 7.52, dir: -1 },
];

let ballAnimating = false;
let ballTimeouts = [];

function animateBall(index) {
  if (!ballAnimating) return;
  const ball = balls[index];
  if (!ball.el) return;

  ball.el.style.transform = `rotate(${ball.rotation * ball.dir}deg)`;
  ball.dir *= -1;

  ballTimeouts[index] = setTimeout(() => {
    requestAnimationFrame(() => animateBall(index));
  }, 200);
}

function startBallAnimation() {
  if (ballAnimating) return;
  ballAnimating = true;
  balls.forEach((_, i) => animateBall(i));
}

function stopBallAnimation() {
  ballAnimating = false;
  ballTimeouts.forEach(clearTimeout);
  balls.forEach(b => {
    if (b.el) b.el.style.transform = 'rotate(0deg)';
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
      startBallAnimation(); // Sudah diubah
      if (typeof startPhotostripAnimation === 'function') startPhotostripAnimation();
    })
  );

  ['mouseleave', 'mouseup'].forEach(evt =>
    selectButton.addEventListener(evt, () => {
      stopBubbleAnimation();
      stopBallAnimation(); // Sudah diubah
      if (typeof stopPhotostripAnimation === 'function') stopPhotostripAnimation();
    })
  );
}

// add more safe nav
addSafeNavigation(selectButton, 'menu.html');
addSafeNavigation(cameraBtn, 'camera.html');
addSafeNavigation(uploadBtn, 'upload.html');
addSafeNavigation(logoEl, 'index.html', 'logo');