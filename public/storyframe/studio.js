const sceneKey = 'personal-storytelling-scenes-v1';
const profileKey = 'personal-storytelling-profile-v1';
const photoDbName = 'storyframe-photos-v1';
const pageLimit = 30;
const isReadMode = new URLSearchParams(location.search).get('view') === 'read';
const emptyScene = { year: '', label: '', title: '', description: '', theme: '', mediaRatio: 'balanced', photoFit: 'cover', photoX: 50, photoY: 50 };
const emptyProfile = { name: '', title: '', description: '', endingTitle: '', endingDescription: '', coverTheme: '', coverLayout: 'split', coverAlign: 'left', coverPhotoFit: 'cover', coverPhotoX: 50, coverPhotoY: 50 };

function readSaved(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? structuredClone(fallback); }
  catch { return structuredClone(fallback); }
}
let scenes = readSaved(sceneKey, [emptyScene]);
if (!Array.isArray(scenes) || !scenes.length) scenes = [structuredClone(emptyScene)];
scenes = scenes.slice(0, pageLimit).map((scene) => ({ ...emptyScene, ...(scene && typeof scene === 'object' ? scene : {}) }));
let profile = { ...emptyProfile, ...readSaved(profileKey, {}) };
const oldDefaults = { name: '나의 이야기', title: '나의 이야기를\n만들어보세요.', description: '기억하고 싶은 순간을 한 장씩 담아보세요.', endingTitle: '이야기는 계속됩니다.', endingDescription: '다음 장면을 기다리며.' };
for (const [key, value] of Object.entries(oldDefaults)) if (profile[key] === value) profile[key] = '';
const sceneList = document.querySelector('#sceneList');
const photoCache = new Map();
const photoUrls = new Map();
let uploadVersion = 0;
const cover = document.querySelector('.story-cover');
const photoDialog = document.querySelector('#photoDialog');
const pendingPhoto = document.querySelector('#pendingPhoto');
let pendingFile = null;
let pendingIndex = null;
let pendingUrl = null;

function announce(message) { document.querySelector('#saveStatus').textContent = message; }
function persist() {
  try {
    localStorage.setItem(sceneKey, JSON.stringify(scenes));
    localStorage.setItem(profileKey, JSON.stringify(profile));
    announce('이 브라우저에 저장됨');
  } catch { announce('저장 공간을 사용할 수 없습니다'); }
}
function openPhotoDb() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) return reject(new Error('사진 저장을 지원하지 않습니다'));
    const request = indexedDB.open(photoDbName, 1);
    request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains('photos')) request.result.createObjectStore('photos'); };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
function photoOperation(mode, index, value) {
  return openPhotoDb().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction('photos', mode === 'get' ? 'readonly' : 'readwrite');
    const store = tx.objectStore('photos');
    const request = mode === 'put' ? store.put(value, index) : mode === 'delete' ? store.delete(index) : store.get(index);
    let result;
    request.onsuccess = () => { result = request.result; };
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => { db.close(); resolve(result); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  }));
}
async function compressPhoto(file) {
  const sourceUrl = URL.createObjectURL(file);
  try {
    const source = new Image(); source.src = sourceUrl; await source.decode();
    const scale = Math.min(1, 1800 / Math.max(source.naturalWidth, source.naturalHeight));
    const bitmap = document.createElement('canvas');
    bitmap.width = Math.max(1, Math.round(source.naturalWidth * scale));
    bitmap.height = Math.max(1, Math.round(source.naturalHeight * scale));
    bitmap.getContext('2d').drawImage(source, 0, 0, bitmap.width, bitmap.height);
    return await new Promise((resolve, reject) => bitmap.toBlob((blob) => blob ? resolve(blob) : reject(new Error('사진 처리 실패')), 'image/webp', .86));
  } finally { URL.revokeObjectURL(sourceUrl); }
}
function fitTextarea(field) {
  field.style.height = 'auto';
  field.style.height = `${Math.min(field.scrollHeight + 2, 300)}px`;
}
function fitAllTextareas() { document.querySelectorAll('textarea').forEach(fitTextarea); }
function themeClass(theme) { return { 'story-card-dark': 'theme-dark', 'story-card-lilac': 'theme-lilac', 'story-card-warm': 'theme-warm', 'story-card-now': 'theme-plum' }[theme] || ''; }
function revokePhotoUrls() { for (const url of photoUrls.values()) URL.revokeObjectURL(url); photoUrls.clear(); }
function renderCover() {
  cover.className = `story-cover cover-${profile.coverTheme || 'ivory'} layout-${profile.coverLayout === 'background' ? 'background' : 'split'} align-${profile.coverAlign === 'center' ? 'center' : 'left'}`;
  const image = document.querySelector('#coverImage');
  const blob = photoCache.get('cover');
  document.querySelector('#coverPhoto').hidden = !blob;
  document.querySelector('#removeCoverPhoto').hidden = !blob;
  if (photoUrls.has('cover')) URL.revokeObjectURL(photoUrls.get('cover'));
  photoUrls.delete('cover');
  if (blob) {
    const url = URL.createObjectURL(blob); photoUrls.set('cover', url); image.src = url;
    image.style.objectFit = profile.coverPhotoFit === 'contain' ? 'contain' : 'cover';
    image.style.objectPosition = `${Number(profile.coverPhotoX) || 0}% ${Number(profile.coverPhotoY) || 0}%`;
  } else image.removeAttribute('src');
}
function updatePhoto(index) {
  const node = sceneList.querySelector(`[data-scene="${index}"]`);
  if (!node) return;
  const image = node.querySelector('.scene-photo-image');
  const empty = node.querySelector('.scene-photo-empty');
  const remove = node.querySelector('.remove-photo');
  const blob = photoCache.get(index);
  node.dataset.hasContent = String(Boolean(blob || ['year', 'label', 'title', 'description'].some((field) => String(scenes[index][field] || '').trim())));
  if (photoUrls.has(index)) URL.revokeObjectURL(photoUrls.get(index));
  photoUrls.delete(index);
  image.hidden = !blob; empty.hidden = !!blob; remove.hidden = !blob;
  if (blob) {
    const url = URL.createObjectURL(blob); photoUrls.set(index, url); image.src = url;
    image.alt = `${scenes[index].title || '장면'}에 넣은 사진`;
    image.style.objectFit = scenes[index].photoFit === 'contain' ? 'contain' : 'cover';
    image.style.objectPosition = `${Number(scenes[index].photoX) || 0}% ${Number(scenes[index].photoY) || 0}%`;
  } else image.removeAttribute('src');
}
function renderScenes() {
  revokePhotoUrls();
  sceneList.replaceChildren();
  scenes.forEach((scene, index) => {
    const article = document.createElement('article');
    article.className = `story-scene ${themeClass(scene.theme)} ratio-${['balanced', 'text', 'photo'].includes(scene.mediaRatio) ? scene.mediaRatio : 'balanced'}`;
    article.dataset.scene = String(index);
    article.dataset.hasContent = String(['year', 'label', 'title', 'description'].some((field) => String(scene[field] || '').trim()));
    article.innerHTML = `<div class="scene-number">${String(index + 1).padStart(2, '0')} <span>STORY</span></div>
      <div class="scene-text"><div class="scene-meta"><input data-field="year" maxlength="16" aria-label="${index + 1}번째 장면의 연도" placeholder="연도 또는 시기" /><input data-field="label" maxlength="28" aria-label="${index + 1}번째 장면의 작은 제목" placeholder="장면 이름" /></div><textarea data-field="title" rows="2" maxlength="80" aria-label="${index + 1}번째 장면의 제목" placeholder="이 순간의 제목"></textarea><textarea data-field="description" rows="3" maxlength="300" aria-label="${index + 1}번째 장면의 이야기" placeholder="그때 어떤 일이 있었나요? 짧게 적어보세요."></textarea><div class="scene-tools"><details class="scene-options"><summary>장면 꾸미기</summary><div class="options-panel"><label>배경 색상<select data-field="theme" aria-label="${index + 1}번째 장면 배경 색상"><option value="">아이보리</option><option value="story-card-dark">차콜</option><option value="story-card-lilac">라일락</option><option value="story-card-warm">샌드</option><option value="story-card-now">플럼</option></select></label><label>사진과 글 비율<select data-field="mediaRatio" aria-label="사진과 글 비율"><option value="balanced">균형 · 글 55% / 사진 45%</option><option value="text">글 중심 · 글 65% / 사진 35%</option><option value="photo">사진 중심 · 글 40% / 사진 60%</option></select></label><label>사진 표시<select data-field="photoFit" aria-label="사진 표시 방식"><option value="cover">채워서 자르기</option><option value="contain">전체 보이기</option></select></label><label>사진 가로 위치<input data-field="photoX" type="range" min="0" max="100" aria-label="사진 가로 위치" /></label><label>사진 세로 위치<input data-field="photoY" type="range" min="0" max="100" aria-label="사진 세로 위치" /></label><button class="remove-photo" type="button" hidden>사진 제거</button></div></details><button class="remove-scene" type="button" ${scenes.length === 1 ? 'hidden' : ''}>장면 삭제</button></div></div>
      <div class="scene-photo"><img class="scene-photo-image" hidden /><div class="scene-photo-empty"><span>이 장면의 사진</span><small>직접 고른 사진이 여기에 들어갑니다</small></div><label class="photo-picker">＋ 사진 ${photoCache.has(index) ? '바꾸기' : '넣기'}<input class="photo-file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" hidden /></label></div>`;
    sceneList.append(article);
    for (const field of ['year', 'label', 'title', 'description', 'theme', 'mediaRatio', 'photoFit', 'photoX', 'photoY']) article.querySelector(`[data-field="${field}"]`).value = scene[field] ?? emptyScene[field];
    updatePhoto(index);
  });
  document.querySelector('#addScene').hidden = scenes.length >= pageLimit || isReadMode;
  fitAllTextareas();
}
for (const [key, id] of Object.entries({ name: 'profileName', title: 'profileTitle', description: 'profileDescription', endingTitle: 'endingTitle', endingDescription: 'endingDescription' })) {
  const input = document.getElementById(id); input.value = profile[key] || '';
  input.addEventListener('input', () => { profile[key] = input.value; persist(); if (input.tagName === 'TEXTAREA') fitTextarea(input); });
}
for (const [key, id] of Object.entries({ coverTheme: 'coverTheme', coverLayout: 'coverLayout', coverAlign: 'coverAlign' })) {
  const input = document.getElementById(id);
  input.value = profile[key] || emptyProfile[key];
  input.addEventListener('input', () => { profile[key] = input.value; renderCover(); persist(); });
}
document.querySelector('#removeCoverPhoto').addEventListener('click', async () => {
  try { await photoOperation('delete', 'cover'); photoCache.delete('cover'); renderCover(); announce('표지 사진이 제거됨'); }
  catch { announce('표지 사진을 제거하지 못했습니다'); }
});
sceneList.addEventListener('input', (event) => {
  const input = event.target.closest('[data-field]'); if (!input) return;
  const article = input.closest('[data-scene]'); const index = Number(article.dataset.scene); const field = input.dataset.field;
  scenes[index][field] = field === 'photoX' || field === 'photoY' ? Number(input.value) : input.value;
  article.dataset.hasContent = String(Boolean(photoCache.get(index) || ['year', 'label', 'title', 'description'].some((key) => String(scenes[index][key] || '').trim())));
  if (field === 'theme' || field === 'mediaRatio') article.className = `story-scene ${themeClass(scenes[index].theme)} ratio-${scenes[index].mediaRatio}`;
  if (field === 'photoFit' || field === 'photoX' || field === 'photoY') {
    const image = article.querySelector('.scene-photo-image');
    image.style.objectFit = scenes[index].photoFit === 'contain' ? 'contain' : 'cover';
    image.style.objectPosition = `${scenes[index].photoX}% ${scenes[index].photoY}%`;
  }
  if (field === 'title') article.querySelector('.scene-photo-image').alt = `${input.value || '장면'}에 넣은 사진`;
  if (input.tagName === 'TEXTAREA') fitTextarea(input);
  persist();
});
function closePhotoDialog() {
  photoDialog.close();
  if (pendingUrl) URL.revokeObjectURL(pendingUrl);
  pendingUrl = null; pendingFile = null; pendingIndex = null;
  document.querySelector('#coverFile').value = '';
  document.querySelectorAll('.photo-file').forEach((input) => { input.value = ''; });
}
function updatePendingPreview() {
  pendingPhoto.style.objectFit = document.querySelector('input[name="photoFitChoice"]:checked').value;
  pendingPhoto.style.objectPosition = `${document.querySelector('#pendingPhotoX').value}% ${document.querySelector('#pendingPhotoY').value}%`;
}
function preparePhoto(file, index) {
  if (!file) return;
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type) || file.size > 20 * 1024 * 1024) {
    announce('20MB 이하 JPG, PNG, WebP, AVIF 사진을 선택해 주세요'); return;
  }
  pendingFile = file; pendingIndex = index;
  pendingUrl = URL.createObjectURL(file); pendingPhoto.src = pendingUrl;
  document.querySelector('input[name="photoFitChoice"][value="cover"]').checked = true;
  document.querySelector('#pendingPhotoX').value = 50;
  document.querySelector('#pendingPhotoY').value = 50;
  updatePendingPreview(); photoDialog.showModal();
}
sceneList.addEventListener('change', (event) => {
  const input = event.target.closest('.photo-file'); if (!input) return;
  preparePhoto(input.files?.[0], Number(input.closest('[data-scene]').dataset.scene));
});
document.querySelector('#coverFile').addEventListener('change', (event) => preparePhoto(event.target.files?.[0], 'cover'));
photoDialog.querySelectorAll('input').forEach((input) => input.addEventListener('input', updatePendingPreview));
for (const id of ['cancelPhoto', 'photoCancel']) document.getElementById(id).addEventListener('click', closePhotoDialog);
photoDialog.addEventListener('cancel', (event) => { event.preventDefault(); closePhotoDialog(); });
document.querySelector('#photoForm').addEventListener('submit', async (event) => {
  event.preventDefault(); if (!pendingFile) return;
  const file = pendingFile; const index = pendingIndex;
  const fit = document.querySelector('input[name="photoFitChoice"]:checked').value;
  const x = Number(document.querySelector('#pendingPhotoX').value);
  const y = Number(document.querySelector('#pendingPhotoY').value);
  const version = ++uploadVersion; document.querySelector('#photoApply').disabled = true; announce('사진 저장 중…');
  try {
    const blob = await compressPhoto(file); await photoOperation('put', index, blob);
    if (version !== uploadVersion) return;
    photoCache.set(index, blob);
    if (index === 'cover') {
      profile.coverPhotoFit = fit; profile.coverPhotoX = x; profile.coverPhotoY = y; renderCover();
    } else {
      scenes[index].photoFit = fit; scenes[index].photoX = x; scenes[index].photoY = y;
      const article = sceneList.querySelector(`[data-scene="${index}"]`);
      article.querySelector('[data-field="photoFit"]').value = fit;
      article.querySelector('[data-field="photoX"]').value = x;
      article.querySelector('[data-field="photoY"]').value = y;
      updatePhoto(index); article.querySelector('.photo-picker').firstChild.textContent = '＋ 사진 바꾸기';
    }
    persist(); closePhotoDialog(); announce('사진이 이 브라우저에 저장됨');
  } catch { announce('사진을 저장하지 못했습니다'); }
  finally { document.querySelector('#photoApply').disabled = false; }
});
sceneList.addEventListener('click', async (event) => {
  const article = event.target.closest('[data-scene]'); if (!article) return;
  const index = Number(article.dataset.scene);
  if (event.target.closest('.remove-photo')) {
    try { await photoOperation('delete', index); photoCache.delete(index); updatePhoto(index); article.querySelector('.photo-picker').firstChild.textContent = '＋ 사진 넣기'; announce('사진이 제거됨'); }
    catch { announce('사진을 제거하지 못했습니다'); }
  }
  const remove = event.target.closest('.remove-scene'); if (!remove || scenes.length <= 1) return;
  if (remove.dataset.confirm !== 'yes') { remove.dataset.confirm = 'yes'; remove.textContent = '다시 누르면 삭제'; return; }
  const last = scenes.length - 1;
  try {
    const tail = await Promise.all(Array.from({ length: last - index }, (_, offset) => photoOperation('get', index + offset + 1)));
    const db = await openPhotoDb();
    await new Promise((resolve, reject) => { const tx = db.transaction('photos', 'readwrite'); const store = tx.objectStore('photos'); tail.forEach((blob, offset) => { if (blob) store.put(blob, index + offset); else store.delete(index + offset); }); store.delete(last); tx.oncomplete = () => { db.close(); resolve(); }; tx.onerror = () => { db.close(); reject(tx.error); }; });
    scenes.splice(index, 1);
    const shifted = new Map(); for (const [key, blob] of photoCache) if (key !== index) shifted.set(key > index ? key - 1 : key, blob);
    photoCache.clear(); for (const [key, blob] of shifted) photoCache.set(key, blob);
    persist(); renderScenes();
  } catch { announce('장면을 삭제하지 못했습니다'); remove.dataset.confirm = ''; remove.textContent = '장면 삭제'; }
});
document.querySelector('#addScene').addEventListener('click', () => { if (scenes.length >= pageLimit) return; scenes.push(structuredClone(emptyScene)); persist(); renderScenes(); sceneList.lastElementChild.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' }); sceneList.lastElementChild.querySelector('[data-field="year"]').focus(); });
renderScenes();
for (let index = 0; index < scenes.length; index++) photoOperation('get', index).then((blob) => { if (blob) { photoCache.set(index, blob); updatePhoto(index); sceneList.querySelector(`[data-scene="${index}"] .photo-picker`).firstChild.textContent = '＋ 사진 바꾸기'; } }).catch(() => {});
photoOperation('get', 'cover').then((blob) => { if (blob) { photoCache.set('cover', blob); renderCover(); } }).catch(() => {});
renderCover();
fitAllTextareas();
if (isReadMode) {
  document.body.classList.add('read-mode');
  const link = document.querySelector('#modeLink');
  link.href = './index.html'; link.removeAttribute('target'); link.textContent = '내 이야기 편집하기 ↗';
  document.querySelector('.header-purpose').textContent = '독자 화면';
  document.querySelector('#saveStatus').hidden = true;
  document.querySelector('.skip-link').textContent = '이야기 본문으로 건너뛰기';
  document.title = `${profile.title.trim().split('\n')[0] || '나의 이야기'} — STORYFRAME`;
  document.querySelectorAll('input:not([type="file"]), textarea').forEach((field) => { field.readOnly = true; field.tabIndex = -1; });
} else persist();
