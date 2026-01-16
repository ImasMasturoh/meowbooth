/* ================= RESET ================= */
window.addEventListener('DOMContentLoaded', () => {
  localStorage.removeItem('photoStrip');
});

/* ================= CONSTANTS ================= */
const WIDTH = 1176;
const HEIGHT = 1470;
const SLOT_HEIGHT = HEIGHT / 2; // Disamakan dengan HALF di camera.js (2 foto)

/* ================= ELEMENTS ================= */
const elements = {
  booth: document.getElementById('booth'),
  canvas: document.getElementById('finalCanvas'),
  ctx: document.getElementById('finalCanvas').getContext('2d'),
  uploadInput: document.getElementById('uploadPhotoInput'),
  uploadBtn: document.getElementById('uploadPhoto'),
  retakeBtn: document.getElementById('retakeBtn'),
  readyBtn: document.getElementById('readyButton')
};

/* ================= STATE ================= */
let photoStage = 0; // 0=top, 1=bottom, 2=done

/* ================= DRAW PHOTO ================= */
const drawPhoto = img => {
  const { ctx, booth, uploadBtn, retakeBtn } = elements;
  const yOffset = photoStage * SLOT_HEIGHT;

  const targetAspect = WIDTH / SLOT_HEIGHT;
  const imgAspect = img.width / img.height;

  let sx, sy, sw, sh;

  if (imgAspect > targetAspect) {
    sh = img.height;
    sw = img.height * targetAspect;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    sw = img.width;
    sh = img.width / targetAspect;
    sx = 0;
    sy = (img.height - sh) / 2;
  }

  // Terapkan filter yang sedang aktif di booth ke canvas
  ctx.save();
  ctx.filter = getComputedStyle(booth).filter;
  
  ctx.drawImage(
    img,
    sx, sy, sw, sh,
    0, yOffset, WIDTH, SLOT_HEIGHT
  );
  
  ctx.restore();
  ctx.filter = 'none';

  photoStage++;
  retakeBtn.style.display = 'inline-block';

  if (photoStage === 2) {
    finalizePhotoStrip();
  }
};

/* ================= RESET / RETAKE ================= */
const resetUpload = () => {
  const { ctx, uploadBtn, retakeBtn, readyBtn } = elements;
  photoStage = 0;
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  uploadBtn.style.display = 'inline-block';
  retakeBtn.style.display = 'none';
  readyBtn.style.display = 'none';
};

/* ================= FINALIZE ================= */
const finalizePhotoStrip = () => {
  const { ctx, readyBtn, uploadBtn, retakeBtn } = elements;

  const frame = new Image();
  frame.onload = () => {
    ctx.drawImage(frame, 0, 0, WIDTH, HEIGHT);
    uploadBtn.style.display = 'none';
    retakeBtn.style.display = 'none'; // Sembunyikan retake jika sudah selesai
    readyBtn.style.display = 'inline-block';
  };
  frame.src = 'Assets/meow-photobooth/camerapage/frame.png';
};

/* ================= EVENT LISTENERS ================= */
elements.uploadBtn.addEventListener('click', () => {
  if (photoStage >= 2) return;
  elements.uploadInput.click();
});

elements.uploadInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  img.onload = () => drawPhoto(img);
  img.src = URL.createObjectURL(file);

  e.target.value = ''; // Reset input agar bisa upload file yang sama
});

elements.retakeBtn.addEventListener('click', resetUpload);

elements.readyBtn.addEventListener('click', () => {
  localStorage.setItem(
    'photoStrip',
    elements.canvas.toDataURL('image/png')
  );
  window.location.href = 'final.html';
});

/* ================= LOGO ================= */
document.addEventListener('DOMContentLoaded', () => {
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }
});