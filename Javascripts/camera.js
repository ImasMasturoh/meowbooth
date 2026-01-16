// constants
const WIDTH = 1176, HEIGHT = 1470, HALF = HEIGHT / 2;

// dom elements
const elements = {
  video: document.getElementById('liveVideo'),
  canvas: document.getElementById('finalCanvas'),
  ctx: document.getElementById('finalCanvas').getContext('2d'),
  takePhotoBtn: document.getElementById('takePhoto'),
  retakeBtn: document.getElementById('retakeBtn'),
  downloadBtn: document.getElementById('downloadBtn'),
  countdownEl: document.querySelector('.countdown-timer')
};

let photoStage = 0; // 0=top, 1=bottom, 2=done

// move video to half
const moveVideoToHalf = i => {
  const { video } = elements;
  video.style.display = 'block';
  video.style.top = i === 0 ? '0' : '50%';
  video.style.left = '0';
  video.style.width = '100%';
  video.style.height = '50%';
};

// countdown
const startCountdown = callback => {
  let count = 3;
  const { countdownEl } = elements;
  countdownEl.textContent = count;
  countdownEl.style.display = 'flex';
  const intervalId = setInterval(() => {
    count--;
    if (count > 0) countdownEl.textContent = count;
    else {
      clearInterval(intervalId);
      countdownEl.style.display = 'none';
      callback();
    }
  }, 1000);
};

// capture photo
const capturePhoto = () => {
  const { video, ctx, takePhotoBtn, retakeBtn } = elements;
  const yOffset = photoStage === 0 ? 0 : HALF;
  const vW = video.videoWidth, vH = video.videoHeight;
  const targetAspect = WIDTH / HALF, vAspect = vW / vH;
  let sx, sy, sw, sh;

  if (vAspect > targetAspect) { 
    sh = vH; sw = vH * targetAspect; sx = (vW - sw) / 2; sy = 0; 
  } else { 
    sw = vW; sh = vW / targetAspect; sx = 0; sy = (vH - sh) / 2; 
  }

  // APLIKASIKAN FILTER KE CANVAS
  ctx.save();
  ctx.filter = getComputedStyle(video).filter; // Ambil filter dari CSS video
  
  ctx.translate(WIDTH, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, sx, sy, sw, sh, 0, yOffset, WIDTH, HALF);
  
  ctx.restore();
  ctx.filter = 'none'; // Reset filter canvas agar frame bersih

  photoStage++;
  retakeBtn.style.display = 'inline-block'; // Munculkan tombol retake

  if (photoStage === 1) { 
    moveVideoToHalf(1); 
    takePhotoBtn.disabled = false; 
  } else if (photoStage === 2) {
    finalizePhotoStrip();
  }
};

// reset booth (Retake)
const resetCapture = () => {
  const { ctx, takePhotoBtn, retakeBtn, video } = elements;
  photoStage = 0;
  ctx.clearRect(0, 0, WIDTH, HEIGHT); // Bersihkan canvas
  moveVideoToHalf(0); // Balikkan video ke atas
  takePhotoBtn.disabled = false;
  retakeBtn.style.display = 'none';
  video.style.display = 'block';
};

// finalize photo strip
const finalizePhotoStrip = () => {
  const { video, ctx, canvas, retakeBtn } = elements;
  video.style.display = 'none';
  retakeBtn.style.display = 'none'; // Sembunyikan retake saat sudah final
  
  const frame = new Image();
  frame.src = 'Assets/meow-photobooth/camerapage/frame.png';
  frame.onload = () => {
    ctx.drawImage(frame, 0, 0, WIDTH, HEIGHT);
    localStorage.setItem('photoStrip', canvas.toDataURL('image/png'));
    setTimeout(() => window.location.href = 'final.html', 500);
  };
  if (frame.complete) frame.onload();
};

// setup camera
const setupCamera = () => {
  navigator.mediaDevices.getUserMedia({ 
    video: { width: { ideal: 2560 }, height: { ideal: 1440 }, facingMode: 'user' }, 
    audio: false 
  })
  .then(stream => { 
    elements.video.srcObject = stream; 
    elements.video.play(); 
    moveVideoToHalf(0); 
  })
  .catch(err => alert('Camera access failed: ' + err));
};

// setup events
const setupEventListeners = () => {
  const { takePhotoBtn, retakeBtn, downloadBtn } = elements;

  takePhotoBtn.addEventListener('click', () => {
    if (photoStage > 1) return;
    takePhotoBtn.disabled = true;
    startCountdown(capturePhoto);
  });

  retakeBtn.addEventListener('click', resetCapture);

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      elements.canvas.toBlob(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'photo-strip.png';
        a.click();
      }, 'image/png');
    });
  }

  window.addEventListener('resize', () => {
    if (photoStage === 0) moveVideoToHalf(0);
    else if (photoStage === 1) moveVideoToHalf(1);
  });
};

// initialize
const initPhotoBooth = () => { 
  setupCamera(); 
  setupEventListeners(); 
};
initPhotoBooth();

// logo redirect
document.addEventListener('DOMContentLoaded', () => {
  const logo = document.querySelector('.logo');
  if (logo) logo.addEventListener('click', () => window.location.href = 'index.html');
});