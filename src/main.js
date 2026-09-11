import html2canvas from "html2canvas";
import { FILTERS, TEMPLATES, renderTemplate } from "./templates.js";
import { STICKERS } from "./stickers.js";

const stage = document.getElementById("stage");
const stageScale = document.getElementById("stageScale");
const templateList = document.getElementById("templateList");
const filterList = document.getElementById("filterList");
const stickerList = document.getElementById("stickerList");
const slotButtons = document.getElementById("slotButtons");
const headlineInput = document.getElementById("headlineInput");
const dateInput = document.getElementById("dateInput");
const captionInput = document.getElementById("captionInput");
const countdownEl = document.getElementById("countdown");
const uploadInput = document.getElementById("uploadInput");
const camFeed = document.getElementById("camFeed");

const state = {
  templateId: "snapmanner",
  filterId: "film",
  activeSlot: 0,
  facingMode: "user",
  stream: null,
  shots: [],
  texts: {
    headline: "Risk It All",
    date: "11 SEPTEMBER 2026",
    caption: "I'M TRYNA BE YOUR MAN 'TIL THE END OF TIME",
  },
};

headlineInput.value = state.texts.headline;
dateInput.value = state.texts.date;
captionInput.value = state.texts.caption;

function currentTemplate() {
  return TEMPLATES.find((t) => t.id === state.templateId);
}

function renderGallery(orient = "all") {
  templateList.innerHTML = "";
  TEMPLATES.filter((t) => orient === "all" || t.orientation === orient).forEach((t) => {
    const btn = document.createElement("button");
    btn.className = `tpl${t.id === state.templateId ? " on" : ""}`;
    btn.innerHTML = `<span class="tpl-thumb ${t.orientation}">${t.orientation === "portrait" ? "P" : "L"}</span>
      <span><b>${t.name}</b><span>${t.vibe} · ${t.slots} foto</span></span>`;
    btn.addEventListener("click", () => {
      state.templateId = t.id;
      state.activeSlot = 0;
      state.shots = [];
      renderGallery(orient);
      mountStage();
    });
    templateList.appendChild(btn);
  });
}

function renderFilters() {
  filterList.innerHTML = "";
  FILTERS.forEach((f) => {
    const btn = document.createElement("button");
    btn.textContent = f.label;
    btn.className = f.id === state.filterId ? "on" : "";
    btn.addEventListener("click", () => {
      state.filterId = f.id;
      renderFilters();
      applyFilter();
    });
    filterList.appendChild(btn);
  });
}

function renderStickers() {
  stickerList.innerHTML = "";
  STICKERS.forEach((s) => {
    const btn = document.createElement("button");
    btn.title = s.label;
    btn.innerHTML = s.svg;
    btn.addEventListener("click", () => addSticker(s));
    stickerList.appendChild(btn);
  });
}

function bindTexts() {
  stage.querySelectorAll("[data-bind]").forEach((el) => {
    const key = el.getAttribute("data-bind");
    if (state.texts[key] != null) el.textContent = state.texts[key];
  });
}

function mountStage() {
  const template = currentTemplate();
  stage.innerHTML = renderTemplate(template, state.texts);
  stage.style.width = `${template.width}px`;
  stage.style.height = `${template.height}px`;
  slotButtons.innerHTML = "";
  const slots = [...stage.querySelectorAll(".photo-slot")];
  slots.forEach((slot, i) => {
    const btn = document.createElement("button");
    btn.textContent = `Slot ${i + 1}`;
    btn.className = i === state.activeSlot ? "on" : "";
    btn.addEventListener("click", () => selectSlot(i));
    slotButtons.appendChild(btn);
    slot.addEventListener("click", () => selectSlot(i));
    if (state.shots[i]) applyShot(slot, state.shots[i]);
  });
  selectSlot(Math.min(state.activeSlot, slots.length - 1));
  applyFilter();
  scaleStage();
  attachLiveToActive();
  document.getElementById("textPanel").hidden = false;
}

function applyFilter() {
  const css = FILTERS.find((f) => f.id === state.filterId)?.css || "none";
  stage.querySelectorAll(".photo-slot img, .photo-slot video").forEach((el) => {
    el.style.filter = css;
  });
}

function selectSlot(index) {
  state.activeSlot = index;
  [...slotButtons.children].forEach((b, i) => b.classList.toggle("on", i === index));
  stage.querySelectorAll(".photo-slot").forEach((slot, i) => {
    slot.classList.toggle("active", i === index);
  });
  attachLiveToActive();
}

function slots() {
  return [...stage.querySelectorAll(".photo-slot")];
}

function applyShot(slot, dataUrl) {
  const img = slot.querySelector("img");
  img.src = dataUrl;
  slot.classList.add("has-shot");
  slot.classList.remove("has-live");
}

async function startCamera() {
  stopCamera();
  try {
    state.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: state.facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
      audio: false,
    });
    camFeed.srcObject = state.stream;
    await camFeed.play();
    attachLiveToActive();
  } catch {
    alert("Kamera tidak bisa dibuka. Izinkan akses kamera, atau upload foto dari galeri.");
  }
}

function stopCamera() {
  state.stream?.getTracks().forEach((t) => t.stop());
  state.stream = null;
}

function attachLiveToActive() {
  slots().forEach((slot) => {
    const video = slot.querySelector("video");
    video.srcObject = null;
    if (!slot.classList.contains("has-shot")) slot.classList.remove("has-live");
  });
  if (!state.stream) return;
  const slot = slots()[state.activeSlot];
  if (!slot || slot.classList.contains("has-shot")) return;
  const video = slot.querySelector("video");
  video.srcObject = state.stream;
  video.style.transform = state.facingMode === "user" ? "scaleX(-1)" : "none";
  video.play?.();
  slot.classList.add("has-live");
}

function captureFrame() {
  const slot = slots()[state.activeSlot];
  if (!slot) return;
  if (!state.stream || camFeed.readyState < 2) {
    alert("Nyalakan kamera dulu, atau upload foto.");
    return;
  }
  const canvas = document.createElement("canvas");
  canvas.width = camFeed.videoWidth || 1280;
  canvas.height = camFeed.videoHeight || 720;
  const ctx = canvas.getContext("2d");
  if (state.facingMode === "user") {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(camFeed, 0, 0);
  const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
  state.shots[state.activeSlot] = dataUrl;
  applyShot(slot, dataUrl);
  applyFilter();
  const nextEmpty = state.shots.findIndex((s, i) => i < currentTemplate().slots && !s);
  if (nextEmpty >= 0) selectSlot(nextEmpty);
}

async function captureCountdown() {
  countdownEl.hidden = false;
  for (const n of [3, 2, 1]) {
    countdownEl.textContent = String(n);
    await wait(700);
  }
  countdownEl.hidden = true;
  captureFrame();
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function addSticker(sticker) {
  const el = document.createElement("div");
  el.className = "deco-sticker";
  el.innerHTML = sticker.svg;
  const size = 96;
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.left = `${currentTemplate().width / 2 - size / 2}px`;
  el.style.top = `${currentTemplate().height / 2 - size / 2}px`;
  stage.appendChild(el);
  makeDraggable(el);
}

function makeDraggable(el) {
  let dragging = false;
  let ox = 0;
  let oy = 0;
  el.addEventListener("pointerdown", (e) => {
    dragging = true;
    el.setPointerCapture(e.pointerId);
    const rect = stage.getBoundingClientRect();
    const scale = Number(stageScale.dataset.scale || 1);
    ox = (e.clientX - rect.left) / scale - el.offsetLeft;
    oy = (e.clientY - rect.top) / scale - el.offsetTop;
  });
  el.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const rect = stage.getBoundingClientRect();
    const scale = Number(stageScale.dataset.scale || 1);
    el.style.left = `${(e.clientX - rect.left) / scale - ox}px`;
    el.style.top = `${(e.clientY - rect.top) / scale - oy}px`;
  });
  el.addEventListener("pointerup", () => {
    dragging = false;
  });
  el.addEventListener("wheel", (e) => {
    e.preventDefault();
    const next = Math.max(40, el.offsetWidth + (e.deltaY > 0 ? -12 : 12));
    el.style.width = `${next}px`;
    el.style.height = `${next}px`;
  }, { passive: false });
  el.addEventListener("dblclick", () => el.remove());
}

function scaleStage() {
  const wrap = document.querySelector(".stage-wrap");
  const t = currentTemplate();
  const pad = 48;
  const sx = (wrap.clientWidth - pad) / t.width;
  const sy = (wrap.clientHeight - pad) / t.height;
  const use = Math.min(sx, sy, 1);
  stageScale.style.transform = `scale(${use})`;
  stageScale.dataset.scale = String(use);
  stageScale.style.width = `${t.width * use}px`;
  stageScale.style.height = `${t.height * use}px`;
}

async function download() {
  await document.fonts.ready;
  const canvas = await html2canvas(stage, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
    logging: false,
  });
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = `snapmanner-${state.templateId}.png`;
  a.click();
}

function onTextInput() {
  state.texts.headline = headlineInput.value || "Risk It All";
  state.texts.date = dateInput.value;
  state.texts.caption = captionInput.value;
  bindTexts();
}

document.getElementById("orientFilter").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  [...e.currentTarget.children].forEach((b) => b.classList.toggle("on", b === btn));
  renderGallery(btn.dataset.orient);
});

document.getElementById("startCamBtn").addEventListener("click", startCamera);
document.getElementById("captureBtn").addEventListener("click", captureCountdown);
document.getElementById("flipCamBtn").addEventListener("click", async () => {
  state.facingMode = state.facingMode === "user" ? "environment" : "user";
  await startCamera();
});
document.getElementById("resetBtn").addEventListener("click", () => {
  state.shots = [];
  mountStage();
});
document.getElementById("downloadBtn").addEventListener("click", download);
headlineInput.addEventListener("input", onTextInput);
dateInput.addEventListener("input", onTextInput);
captionInput.addEventListener("input", onTextInput);
uploadInput.addEventListener("change", () => {
  const file = uploadInput.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    state.shots[state.activeSlot] = reader.result;
    const slot = slots()[state.activeSlot];
    applyShot(slot, reader.result);
    applyFilter();
  };
  reader.readAsDataURL(file);
  uploadInput.value = "";
});
window.addEventListener("resize", scaleStage);

renderGallery();
renderFilters();
renderStickers();
mountStage();
