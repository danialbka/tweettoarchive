/* global chrome */

const galleryEl = document.getElementById('gallery');
const galleryCountEl = document.getElementById('galleryCount');
const refreshBtn = document.getElementById('refreshBtn');
const closeBtn = document.getElementById('closeBtn');
const toastEl = document.getElementById('toast');
const INITIAL_GALLERY_BATCH_SIZE = 36;
const NEXT_GALLERY_BATCH_SIZE = 24;
const PREVIEW_IMAGE_EXTENSIONS = new Set(['avif', 'gif', 'jpg', 'jpeg', 'png', 'webp']);
const PREVIEW_VIDEO_EXTENSIONS = new Set(['m4v', 'mov', 'mp4', 'webm']);
let galleryItems = [];
let renderedGalleryItemCount = 0;
let mediaObserver = null;
let batchObserver = null;
let loadMoreSentinel = null;

function sendMessage(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      const runtimeError = chrome.runtime.lastError;
      if (runtimeError) {
        reject(new Error(runtimeError.message));
        return;
      }

      if (!response?.ok) {
        reject(new Error(response?.error || 'Unknown extension error.'));
        return;
      }

      resolve(response);
    });
  });
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toastEl.hidden = true;
  }, 1800);
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  textArea.remove();
}

async function shareFallbackLink({ url, title = 'Saved media' }) {
  const shareUrl = getSafeExternalUrl(url);
  if (!shareUrl) {
    throw new Error('No shareable link is available for this file.');
  }

  if (navigator.share) {
    await navigator.share({
      title,
      text: title,
      url: shareUrl
    });
    return 'Share sheet opened';
  }

  await copyTextToClipboard(shareUrl);
  return 'Share link copied';
}

async function fetchShareFile({ url, filename, contentType }) {
  const sourceUrl = getSafeExternalUrl(url);
  if (!sourceUrl) {
    throw new Error('No media file URL is available.');
  }

  const response = await fetch(sourceUrl, { credentials: 'omit' });
  if (!response.ok) {
    throw new Error(`Media file could not be loaded (${response.status}).`);
  }

  const blob = await response.blob();
  const fileType = blob.type || String(contentType || '').split(';')[0].trim() || 'application/octet-stream';
  return new File([blob], filename || 'saved-media', { type: fileType });
}

async function shareMediaTarget({ fileUrl, linkUrl, title = 'Saved media', filename = 'saved-media', contentType = '' }) {
  if (navigator.share && fileUrl) {
    try {
      const file = await fetchShareFile({ url: fileUrl, filename, contentType });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title,
          text: title
        });
        return 'Share sheet opened';
      }
    } catch (error) {
      if (error?.name === 'AbortError') {
        throw error;
      }
    }
  }

  return shareFallbackLink({ url: linkUrl || fileUrl, title });
}

function hostnameMatches(hostname, allowedHost) {
  return hostname === allowedHost || hostname.endsWith(`.${allowedHost}`);
}

function getSafeExternalUrl(value, { allowedHosts = [], allowHttp = false } = {}) {
  const raw = String(value || '').trim();
  if (!raw) return '';

  try {
    const parsed = new URL(raw);
    const isAllowedProtocol = parsed.protocol === 'https:' || (allowHttp && parsed.protocol === 'http:');
    if (!isAllowedProtocol) {
      return '';
    }

    if (allowedHosts.length) {
      const hostname = parsed.hostname.toLowerCase();
      const hasAllowedHost = allowedHosts.some((allowedHost) => hostnameMatches(hostname, allowedHost));
      if (!hasAllowedHost) {
        return '';
      }
    }

    return parsed.toString();
  } catch {
    return '';
  }
}

function getPathExtension(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';

  try {
    const parsed = raw.includes('://') ? new URL(raw).pathname : raw;
    const match = String(parsed).toLowerCase().match(/\.([a-z0-9]+)$/);
    return match ? match[1] : '';
  } catch {
    const match = raw.toLowerCase().match(/\.([a-z0-9]+)(?:[?#].*)?$/);
    return match ? match[1] : '';
  }
}

function getValidRemoteUrl(value) {
  return getSafeExternalUrl(value, {
    allowedHosts: ['dropbox.com', 'google.com', 'googleusercontent.com']
  });
}

function buildDropboxWebUrl(filePath) {
  const normalizedPath = String(filePath || '').trim().replace(/\\/g, '/').replace(/\/+/g, '/');
  if (!normalizedPath || !normalizedPath.startsWith('/')) {
    return '';
  }

  const pathParts = normalizedPath
    .split('/')
    .filter(Boolean);
  const filename = pathParts.pop() || '';
  const encodedFolderPath = pathParts.map((part) => encodeURIComponent(part)).join('/');
  const url = new URL(encodedFolderPath
    ? `https://www.dropbox.com/home/${encodedFolderPath}`
    : 'https://www.dropbox.com/home');

  if (filename) {
    url.searchParams.set('preview', filename);
  }

  return url.toString();
}

function getUploadPreviewKind(upload) {
  const contentType = String(upload?.contentType || '').split(';')[0].trim().toLowerCase();
  if (contentType.startsWith('image/')) return 'image';
  if (contentType.startsWith('video/')) return 'video';

  const extension = getPathExtension(upload?.filename) || getPathExtension(upload?.sourceUrl);
  if (PREVIEW_IMAGE_EXTENSIONS.has(extension)) return 'image';
  if (PREVIEW_VIDEO_EXTENSIONS.has(extension)) return 'video';
  return '';
}

function getUploadPreviewSource(upload) {
  return getSafeExternalUrl(upload?.sourceUrl);
}

function getUploadShareUrl(upload) {
  return getValidRemoteUrl(upload?.remoteUrl)
    || getValidRemoteUrl(upload?.dropboxPath)
    || buildDropboxWebUrl(upload?.dropboxPath)
    || getUploadPreviewSource(upload);
}

function getUploadShareTarget(upload) {
  const fileUrl = getUploadPreviewSource(upload);
  const linkUrl = getUploadShareUrl(upload);
  if (!fileUrl && !linkUrl) {
    return null;
  }

  const filename = upload?.filename || 'saved-media';
  return {
    fileUrl,
    linkUrl,
    title: filename,
    filename,
    contentType: upload?.contentType || ''
  };
}

function getEntrySourceLabel(entry) {
  const label = entry?.sourceLabel || entry?.sourceKind || '';
  return label ? String(label) : 'Saved upload';
}

function collectGalleryItems(history) {
  const seenSources = new Set();
  const items = [];

  for (const entry of Array.isArray(history) ? history : []) {
    const uploads = Array.isArray(entry?.uploads) ? entry.uploads : [];
    for (const upload of uploads) {
      const sourceUrl = getUploadPreviewSource(upload);
      const kind = getUploadPreviewKind(upload);
      if (!sourceUrl || !kind || seenSources.has(sourceUrl)) {
        continue;
      }

      seenSources.add(sourceUrl);
      const shareTarget = getUploadShareTarget(upload);
      items.push({
        sourceUrl,
        shareTarget,
        kind,
        filename: upload.filename || 'media',
        sourceLabel: getEntrySourceLabel(entry),
        createdAt: Number(entry.createdAt || 0)
      });
    }
  }

  return items.sort((left, right) => right.createdAt - left.createdAt);
}

function setupGalleryObservers() {
  if (mediaObserver) {
    mediaObserver.disconnect();
  }
  if (batchObserver) {
    batchObserver.disconnect();
  }

  mediaObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }

          attachTileMediaSource(entry.target);
          mediaObserver.unobserve(entry.target);
        }
      }, { rootMargin: '720px 0px' })
    : null;

  batchObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          appendGalleryBatch();
        }
      }, { rootMargin: '920px 0px' })
    : null;
}

function attachTileMediaSource(tile) {
  const media = tile?.querySelector('.gallery-frame');
  const sourceUrl = tile?.dataset.sourceUrl || '';
  if (!media || !sourceUrl || media.dataset.loaded === 'true') {
    return;
  }

  media.src = sourceUrl;
  media.dataset.loaded = 'true';
  tile.classList.add('has-media-source');
}

function createGalleryTile(item) {
  const tile = document.createElement('div');
  tile.className = `gallery-tile is-${item.kind}`;
  tile.dataset.sourceUrl = item.sourceUrl;
  tile.title = item.filename;

  const link = document.createElement('a');
  link.className = 'gallery-media-link';
  link.href = item.sourceUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label', `Open ${item.filename} in a new tab`);

  const media = document.createElement(item.kind === 'video' ? 'video' : 'img');
  media.className = 'gallery-frame';
  media.addEventListener('error', () => {
    tile.classList.add('is-unavailable');
  }, { once: true });

  if (item.kind === 'video') {
    media.muted = true;
    media.loop = true;
    media.playsInline = true;
    media.preload = 'metadata';
    tile.addEventListener('mouseenter', () => {
      attachTileMediaSource(tile);
      media.play().catch(() => {});
    });
    tile.addEventListener('focusin', () => {
      attachTileMediaSource(tile);
      media.play().catch(() => {});
    });
    tile.addEventListener('mouseleave', () => media.pause());
    tile.addEventListener('focusout', () => media.pause());
  } else {
    media.alt = '';
    media.loading = 'lazy';
    tile.addEventListener('mouseenter', () => attachTileMediaSource(tile), { once: true });
    tile.addEventListener('focusin', () => attachTileMediaSource(tile), { once: true });
  }

  const caption = document.createElement('span');
  caption.className = 'gallery-caption';

  const title = document.createElement('span');
  title.className = 'gallery-title';
  title.textContent = item.filename;
  caption.appendChild(title);

  const source = document.createElement('span');
  source.className = 'gallery-source';
  source.textContent = item.sourceLabel;
  caption.appendChild(source);

  link.appendChild(media);
  link.appendChild(caption);
  tile.appendChild(link);

  if (item.shareTarget) {
    const shareButton = document.createElement('button');
    shareButton.className = 'gallery-share-button';
    shareButton.type = 'button';
    shareButton.title = 'Share to phone with AirDrop';
    shareButton.setAttribute('aria-label', `Share ${item.filename} to phone with AirDrop`);
    shareButton.textContent = '↗';
    shareButton.addEventListener('click', async () => {
      shareButton.disabled = true;
      try {
        const message = await shareMediaTarget(item.shareTarget);
        showToast(message);
      } catch (error) {
        if (error?.name !== 'AbortError') {
          showToast(error instanceof Error ? error.message : String(error));
        }
      } finally {
        shareButton.disabled = false;
      }
    });
    tile.appendChild(shareButton);
  }

  mediaObserver?.observe(tile);
  if (!mediaObserver) {
    attachTileMediaSource(tile);
  }
  return tile;
}

function appendLoadMoreSentinel() {
  if (loadMoreSentinel) {
    loadMoreSentinel.remove();
  }

  if (renderedGalleryItemCount >= galleryItems.length) {
    loadMoreSentinel = null;
    return;
  }

  loadMoreSentinel = document.createElement('div');
  loadMoreSentinel.className = 'gallery-load-sentinel';
  loadMoreSentinel.setAttribute('aria-hidden', 'true');
  galleryEl.appendChild(loadMoreSentinel);

  if (batchObserver) {
    batchObserver.observe(loadMoreSentinel);
  } else {
    appendGalleryBatch();
  }
}

function appendGalleryBatch() {
  if (loadMoreSentinel) {
    batchObserver?.unobserve(loadMoreSentinel);
    loadMoreSentinel.remove();
    loadMoreSentinel = null;
  }

  if (renderedGalleryItemCount >= galleryItems.length) {
    return;
  }

  const batchSize = renderedGalleryItemCount
    ? NEXT_GALLERY_BATCH_SIZE
    : INITIAL_GALLERY_BATCH_SIZE;
  const nextItems = galleryItems.slice(renderedGalleryItemCount, renderedGalleryItemCount + batchSize);

  for (const item of nextItems) {
    galleryEl.appendChild(createGalleryTile(item));
  }

  renderedGalleryItemCount += nextItems.length;
  appendLoadMoreSentinel();
}

function renderGallery(history) {
  galleryItems = collectGalleryItems(history);
  renderedGalleryItemCount = 0;
  setupGalleryObservers();

  galleryCountEl.textContent = galleryItems.length
    ? `${galleryItems.length} media item${galleryItems.length === 1 ? '' : 's'}`
    : 'No media yet';

  if (!galleryItems.length) {
    galleryEl.className = 'gallery-grid empty';
    galleryEl.textContent = 'Your saved media will appear here.';
    loadMoreSentinel = null;
    return;
  }

  galleryEl.className = 'gallery-grid';
  galleryEl.innerHTML = '';
  appendGalleryBatch();
}

async function refreshGallery() {
  refreshBtn.disabled = true;
  try {
    const response = await sendMessage({ type: 'GET_STATE' });
    renderGallery(response.history || []);
  } finally {
    refreshBtn.disabled = false;
  }
}

refreshBtn.addEventListener('click', () => {
  refreshGallery().catch((error) => showToast(error.message));
});

closeBtn.addEventListener('click', () => {
  window.close();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'local' && areaName !== 'sync') {
    return;
  }

  if (!Object.keys(changes || {}).length) {
    return;
  }

  refreshGallery().catch(() => {});
});

refreshGallery().catch((error) => {
  galleryCountEl.textContent = 'Could not load media';
  galleryEl.className = 'gallery-grid empty';
  galleryEl.textContent = error.message;
});
