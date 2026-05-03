/* global chrome */

const activeUploadsEl = document.getElementById('activeUploads');
const activeCountEl = document.getElementById('activeCount');
const historyEl = document.getElementById('history');
const historyCountEl = document.getElementById('historyCount');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const closeBtn = document.getElementById('closeBtn');
const toastEl = document.getElementById('toast');
const COLLAPSED_UPLOAD_LIMIT = 10;
const COLLAPSED_ACTIVE_ITEM_LIMIT = 10;
const MEDIA_PREVIEW_HOVER_DELAY_MS = 150;
const VIDEO_PREVIEW_RELEASE_DELAY_MS = 2000;
const PREVIEW_IMAGE_EXTENSIONS = new Set(['avif', 'gif', 'jpg', 'jpeg', 'png', 'webp']);
const PREVIEW_VIDEO_EXTENSIONS = new Set(['m4v', 'mov', 'mp4', 'webm']);
const expandedActiveSessions = new Set();
const expandedHistoryEntries = new Set();
const expandedHistoryGroups = new Set();
const mediaPreviewCleanups = new Set();
let activeMediaPreviewHide = null;

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

function formatHistoryDate(value) {
  if (!Number.isFinite(value)) {
    return '';
  }

  return new Intl.DateTimeFormat([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(value);
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

function getValidRemoteUrl(value) {
  return getSafeExternalUrl(value, {
    allowedHosts: ['dropbox.com', 'google.com', 'googleusercontent.com']
  });
}

function setSafeExternalLink(anchor, value) {
  const label = String(value || '').trim();
  const href = getSafeExternalUrl(label);
  if (href) {
    anchor.href = href;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
  } else {
    anchor.removeAttribute('href');
    anchor.removeAttribute('target');
    anchor.removeAttribute('rel');
  }
  anchor.textContent = label;
  return href;
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

function findFirstPreviewUpload(uploads) {
  return (Array.isArray(uploads) ? uploads : [])
    .find((upload) => getUploadPreviewSource(upload) && getUploadPreviewKind(upload));
}

function findFirstPreviewUploadFromEntries(entries) {
  for (const entry of Array.isArray(entries) ? entries : []) {
    const upload = findFirstPreviewUpload(entry?.uploads);
    if (upload) return upload;
  }

  return null;
}

function clearDetachedMediaPreviews() {
  for (const cleanup of mediaPreviewCleanups) {
    cleanup();
  }
  mediaPreviewCleanups.clear();

  for (const preview of document.querySelectorAll('.history-media-preview')) {
    preview.remove();
  }
}

function positionMediaHoverPreview(anchor, preview) {
  const margin = 8;
  const gap = 10;
  const anchorRect = anchor.getBoundingClientRect();
  const previewWidth = preview.offsetWidth;
  const previewHeight = preview.offsetHeight;

  let left = anchorRect.left;
  let top = anchorRect.top - previewHeight - gap;
  let placement = 'top';

  if (top < margin) {
    top = anchorRect.bottom + gap;
    placement = 'bottom';
  }

  const maxLeft = Math.max(margin, window.innerWidth - previewWidth - margin);
  const maxTop = Math.max(margin, window.innerHeight - previewHeight - margin);
  left = Math.min(Math.max(left, margin), maxLeft);
  top = Math.min(Math.max(top, margin), maxTop);

  preview.style.left = `${left}px`;
  preview.style.top = `${top}px`;
  preview.dataset.placement = placement;
}

function appendMediaHoverPreview(anchor, upload) {
  const sourceUrl = getUploadPreviewSource(upload);
  const kind = getUploadPreviewKind(upload);
  if (!sourceUrl || !kind) {
    return;
  }

  const preview = document.createElement('span');
  preview.className = 'history-media-preview';
  preview.setAttribute('aria-hidden', 'true');

  const media = document.createElement(kind === 'video' ? 'video' : 'img');
  media.className = 'history-media-preview-frame';
  media.addEventListener('error', () => preview.remove(), { once: true });

  if (kind === 'video') {
    media.muted = true;
    media.autoplay = true;
    media.loop = true;
    media.playsInline = true;
    media.preload = 'none';
  } else {
    media.alt = '';
    media.loading = 'lazy';
  }

  preview.appendChild(media);
  anchor.classList.add('has-media-preview');
  preview.hidden = true;
  document.body.appendChild(preview);

  let isVisible = false;
  let showTimer = 0;
  let releaseTimer = 0;
  let isSourceAttached = false;
  const attachPreviewSource = () => {
    clearTimeout(releaseTimer);
    releaseTimer = 0;
    if (isSourceAttached) {
      return;
    }

    media.src = sourceUrl;
    isSourceAttached = true;
  };
  const releaseVideoSource = () => {
    if (kind !== 'video' || !isSourceAttached) {
      return;
    }

    media.pause();
    media.removeAttribute('src');
    media.load();
    isSourceAttached = false;
  };

  const showPreview = () => {
    clearTimeout(showTimer);
    showTimer = setTimeout(() => {
      if (activeMediaPreviewHide && activeMediaPreviewHide !== hidePreview) {
        activeMediaPreviewHide();
      }

      activeMediaPreviewHide = hidePreview;
      attachPreviewSource();
      revealPreview();
    }, MEDIA_PREVIEW_HOVER_DELAY_MS);
  };
  const revealPreview = () => {
    isVisible = true;
    preview.hidden = false;
    positionMediaHoverPreview(anchor, preview);
    preview.classList.add('is-visible');
    if (kind === 'video') {
      media.currentTime = media.currentTime || 0;
      media.play().catch(() => {});
    }
  };
  const hidePreview = () => {
    clearTimeout(showTimer);
    showTimer = 0;
    isVisible = false;
    if (activeMediaPreviewHide === hidePreview) {
      activeMediaPreviewHide = null;
    }

    if (kind === 'video') {
      media.pause();
      clearTimeout(releaseTimer);
      releaseTimer = setTimeout(releaseVideoSource, VIDEO_PREVIEW_RELEASE_DELAY_MS);
    }
    preview.classList.remove('is-visible');
    preview.hidden = true;
  };
  const repositionPreview = () => {
    if (isVisible) {
      positionMediaHoverPreview(anchor, preview);
    }
  };

  anchor.addEventListener('mouseenter', showPreview);
  anchor.addEventListener('focus', showPreview);
  anchor.addEventListener('mouseleave', hidePreview);
  anchor.addEventListener('blur', hidePreview);
  window.addEventListener('scroll', repositionPreview, true);
  window.addEventListener('resize', repositionPreview);

  mediaPreviewCleanups.add(() => {
    anchor.removeEventListener('mouseenter', showPreview);
    anchor.removeEventListener('focus', showPreview);
    anchor.removeEventListener('mouseleave', hidePreview);
    anchor.removeEventListener('blur', hidePreview);
    window.removeEventListener('scroll', repositionPreview, true);
    window.removeEventListener('resize', repositionPreview);
    clearTimeout(showTimer);
    clearTimeout(releaseTimer);
    if (activeMediaPreviewHide === hidePreview) {
      activeMediaPreviewHide = null;
    }

    releaseVideoSource();
    preview.remove();
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

function inferRemoteProvider(upload, remoteUrl) {
  if (upload?.provider === 'google-drive') return 'google-drive';
  if (upload?.provider === 'dropbox') return 'dropbox';

  try {
    const host = new URL(remoteUrl || upload?.dropboxPath || '').hostname;
    if (host.includes('google.')) return 'google-drive';
    if (host.includes('dropbox.')) return 'dropbox';
  } catch {}

  return String(upload?.dropboxPath || '').startsWith('/') ? 'dropbox' : '';
}

function getUploadRemoteLink(upload) {
  const explicitUrl = getValidRemoteUrl(upload?.remoteUrl);
  const legacyUrl = getValidRemoteUrl(upload?.dropboxPath);
  const remoteUrl = explicitUrl || legacyUrl || buildDropboxWebUrl(upload?.dropboxPath);
  if (!remoteUrl) {
    return null;
  }

  const provider = inferRemoteProvider(upload, remoteUrl);
  return {
    url: remoteUrl,
    label: provider === 'google-drive'
      ? 'Open in Google Drive'
      : provider === 'dropbox'
        ? 'Open in Dropbox'
        : 'Open in cloud'
  };
}

function getHistoryEntryKey(entry) {
  return `${entry?.createdAt || 0}:${entry?.inputUrl || ''}`;
}

function getActiveSessionKey(session) {
  return session?.id || `${session?.createdAt || 0}:${session?.sourceInputUrl || ''}`;
}

function isProfileMediaHistoryEntry(entry) {
  return entry?.sourceKind === 'profile-media'
    && entry.sourceInputUrl
    && entry.sourceInputUrl !== entry.inputUrl;
}

function getHistoryGroupKey(entries) {
  const groupEntries = Array.isArray(entries) ? entries : [];
  const first = groupEntries[0] || {};
  const last = groupEntries[groupEntries.length - 1] || {};
  return `${first.sourceKind || ''}:${first.sourceInputUrl || ''}:${first.createdAt || 0}:${last.createdAt || 0}`;
}

function getHistoryRenderItems(entries) {
  const renderItems = [];

  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    if (!isProfileMediaHistoryEntry(entry)) {
      renderItems.push({ type: 'entry', entry });
      continue;
    }

    const groupEntries = [entry];
    while (index + 1 < entries.length) {
      const nextEntry = entries[index + 1];
      if (!isProfileMediaHistoryEntry(nextEntry)
        || nextEntry.sourceInputUrl !== entry.sourceInputUrl
        || nextEntry.sourceKind !== entry.sourceKind) {
        break;
      }

      groupEntries.push(nextEntry);
      index += 1;
    }

    renderItems.push({ type: 'profile-media-group', entries: groupEntries });
  }

  return renderItems;
}

function appendHistoryUploadRows(parent, uploads) {
  for (const upload of uploads) {
    const uploadRow = document.createElement('div');
    uploadRow.className = 'history-upload';

    const filenameLine = document.createElement('p');
    filenameLine.className = 'history-line history-upload-name';
    filenameLine.textContent = upload.filename;
    uploadRow.appendChild(filenameLine);

    const metaLine = document.createElement('div');
    metaLine.className = 'history-upload-meta';

    const remoteLink = getUploadRemoteLink(upload);
    if (remoteLink) {
      const cloudLink = document.createElement('a');
      cloudLink.className = 'history-open-link';
      cloudLink.href = remoteLink.url;
      cloudLink.target = '_blank';
      cloudLink.rel = 'noopener noreferrer';
      cloudLink.textContent = remoteLink.label;
      appendMediaHoverPreview(cloudLink, upload);
      metaLine.appendChild(cloudLink);
    }

    if (upload.localSavedPath) {
      const localCopy = document.createElement('span');
      localCopy.className = 'history-local-copy';
      localCopy.textContent = `Downloads/${upload.localSavedPath}`;
      metaLine.appendChild(localCopy);
    }

    if (upload.localDownloadError) {
      const localError = document.createElement('span');
      localError.className = 'history-local-error';
      localError.textContent = upload.localDownloadError;
      metaLine.appendChild(localError);
    }

    if (metaLine.childNodes.length) {
      uploadRow.appendChild(metaLine);
    }

    parent.appendChild(uploadRow);
  }
}

function describeActiveSession(session) {
  const items = Array.isArray(session?.items) ? session.items : [];
  const completed = items.filter((item) => item.status === 'completed').length;
  const failed = items.filter((item) => item.status === 'failed').length;
  const total = items.length;

  if (session?.status === 'paused') {
    return total ? `Paused - ${completed} of ${total} saved` : 'Paused';
  }

  if (!total) {
    return 'Preparing upload...';
  }

  if (failed && completed) {
    return `${completed} saved, ${failed} failed`;
  }

  if (failed && !completed) {
    return `${failed} failed`;
  }

  if (completed === total) {
    return `${completed} saved`;
  }

  return `${completed} of ${total} saved`;
}

function buildActiveStageText(item) {
  if (item.status === 'paused') {
    return 'Paused';
  }

  if (item.error) {
    return item.error;
  }

  return item.detail || 'Queued';
}

function getActiveItemPriority(item) {
  switch (item?.status) {
    case 'failed':
      return 0;
    case 'running':
    case 'expanding':
    case 'paused':
      return 1;
    case 'queued':
      return 2;
    case 'completed':
      return 3;
    default:
      return 4;
  }
}

function orderActiveItems(items) {
  return (Array.isArray(items) ? items : [])
    .map((item, index) => ({ item, index }))
    .sort((left, right) => {
      const priorityDiff = getActiveItemPriority(left.item) - getActiveItemPriority(right.item);
      return priorityDiff || left.index - right.index;
    })
    .map((entry) => entry.item);
}

function getActiveSessionLabel(session) {
  return session?.label || 'Upload';
}

async function controlActiveUploadSession(session, action) {
  const isPauseToggle = action === 'pause-toggle';
  const messageType = isPauseToggle
    ? (session.status === 'paused' ? 'RESUME_ACTIVE_UPLOAD' : 'PAUSE_ACTIVE_UPLOAD')
    : 'CLEAR_ACTIVE_UPLOAD';

  const response = await sendMessage({
    type: messageType,
    sessionId: session.id
  });

  renderActiveUploads(response.activeUploads || []);
  const label = getActiveSessionLabel(session);
  showToast(isPauseToggle
    ? (messageType === 'RESUME_ACTIVE_UPLOAD' ? `${label} resumed.` : `${label} paused.`)
    : `${label} cleared.`);
}

async function retryActiveUploadItem(session, item) {
  const response = await sendMessage({
    type: 'RETRY_ACTIVE_UPLOAD_ITEM',
    sessionId: session.id,
    inputUrl: item.inputUrl
  });

  renderActiveUploads(response.activeUploads || []);
  if (response.history) {
    renderHistory(response.history);
  }
  showToast(response.canceled ? 'Retry canceled.' : 'Retry saved.');
}

function renderActiveUploads(activeUploads) {
  const sessions = (Array.isArray(activeUploads) ? activeUploads : [])
    .filter((session) => session?.status !== 'canceled');
  const pausedCount = sessions.filter((session) => session?.status === 'paused').length;
  activeCountEl.textContent = sessions.length
    ? `${sessions.length} active upload${sessions.length === 1 ? '' : 's'}${pausedCount ? `, ${pausedCount} paused` : ''}`
    : 'No uploads running';

  if (!sessions.length) {
    activeUploadsEl.className = 'history empty';
    activeUploadsEl.textContent = 'No uploads running right now.';
    return;
  }

  activeUploadsEl.className = 'history active-history';
  activeUploadsEl.innerHTML = '';

  for (const session of sessions) {
    const wrap = document.createElement('article');
    wrap.className = 'history-item active-session';

    const head = document.createElement('div');
    head.className = 'history-head';

    const sourceUrl = document.createElement('a');
    sourceUrl.className = 'history-url';
    setSafeExternalLink(sourceUrl, session.sourceInputUrl);
    head.appendChild(sourceUrl);

    const date = document.createElement('span');
    date.className = 'history-date';
    date.textContent = formatHistoryDate(session.updatedAt || session.createdAt);
    head.appendChild(date);

    wrap.appendChild(head);

    const summary = document.createElement('p');
    summary.className = 'history-line active-session-summary';
    summary.textContent = session.label
      ? `${session.label} - ${describeActiveSession(session)}`
      : describeActiveSession(session);
    wrap.appendChild(summary);

    const sessionItems = orderActiveItems(session.items);
    const sessionKey = getActiveSessionKey(session);
    const canCollapseItems = sessionItems.length > COLLAPSED_ACTIVE_ITEM_LIMIT;
    const isExpanded = expandedActiveSessions.has(sessionKey);
    const visibleItems = canCollapseItems && !isExpanded
      ? sessionItems.slice(0, COLLAPSED_ACTIVE_ITEM_LIMIT)
      : sessionItems;

    if (sessionItems.length) {
      const actions = document.createElement('div');
      actions.className = 'history-actions';

      if (canCollapseItems) {
        const remainingCount = sessionItems.length - COLLAPSED_ACTIVE_ITEM_LIMIT;
        const expandButton = document.createElement('button');
        expandButton.type = 'button';
        expandButton.className = 'history-expand-toggle';
        expandButton.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        expandButton.textContent = isExpanded
          ? 'Minimize downloads'
          : `Expand downloads (${remainingCount} more)`;
        expandButton.addEventListener('click', () => {
          if (expandedActiveSessions.has(sessionKey)) {
            expandedActiveSessions.delete(sessionKey);
          } else {
            expandedActiveSessions.add(sessionKey);
          }

          renderActiveUploads(sessions);
        });
        actions.appendChild(expandButton);
      }

      const pauseButton = document.createElement('button');
      pauseButton.type = 'button';
      pauseButton.className = 'history-expand-toggle';
      pauseButton.textContent = session.status === 'paused' ? 'Resume' : 'Pause';
      pauseButton.addEventListener('click', async () => {
        pauseButton.disabled = true;
        try {
          await controlActiveUploadSession(session, 'pause-toggle');
        } catch (error) {
          showToast(error.message);
          pauseButton.disabled = false;
        }
      });
      actions.appendChild(pauseButton);

      const clearButton = document.createElement('button');
      clearButton.type = 'button';
      clearButton.className = 'history-expand-toggle history-danger-action';
      clearButton.textContent = 'Clear';
      clearButton.addEventListener('click', async () => {
        clearButton.disabled = true;
        try {
          await controlActiveUploadSession(session, 'clear');
        } catch (error) {
          showToast(error.message);
          clearButton.disabled = false;
        }
      });
      actions.appendChild(clearButton);

      wrap.appendChild(actions);
    }

    const itemsWrap = document.createElement('div');
    itemsWrap.className = 'active-items';

    for (const item of visibleItems) {
      const itemWrap = document.createElement('div');
      itemWrap.className = 'active-item';
      itemWrap.dataset.status = item.status || 'queued';

      const itemHead = document.createElement('div');
      itemHead.className = 'active-item-head';

      const itemLink = document.createElement('a');
      itemLink.className = 'history-url active-item-url';
      setSafeExternalLink(itemLink, item.inputUrl);
      itemHead.appendChild(itemLink);

      const itemState = document.createElement('span');
      itemState.className = 'history-date active-item-state';
      itemState.textContent = buildActiveStageText(item);

      const itemStateWrap = document.createElement('span');
      itemStateWrap.className = 'active-item-state-wrap';
      itemStateWrap.appendChild(itemState);

      if (item.status === 'failed') {
        const retryButton = document.createElement('button');
        retryButton.type = 'button';
        retryButton.className = 'history-expand-toggle active-item-retry';
        retryButton.textContent = 'Retry';
        retryButton.addEventListener('click', async () => {
          retryButton.disabled = true;
          try {
            await retryActiveUploadItem(session, item);
          } catch (error) {
            showToast(error.message);
            retryButton.disabled = false;
          }
        });
        itemStateWrap.appendChild(retryButton);
      }

      itemHead.appendChild(itemStateWrap);

      itemWrap.appendChild(itemHead);

      const track = document.createElement('div');
      track.className = 'progress-track';

      const bar = document.createElement('div');
      bar.className = 'progress-bar';
      bar.style.width = `${Math.max(0, Math.min(100, Number(item.progress || 0)))}%`;
      track.appendChild(bar);

      itemWrap.appendChild(track);
      itemsWrap.appendChild(itemWrap);
    }

    wrap.appendChild(itemsWrap);
    activeUploadsEl.appendChild(wrap);
  }
}

function createHistoryEntryElement(entry, allEntries) {
  const wrap = document.createElement('article');
  wrap.className = 'history-item';

  const uploads = Array.isArray(entry.uploads) ? entry.uploads : [];

  const head = document.createElement('div');
  head.className = 'history-head';

  const url = document.createElement('a');
  url.className = 'history-url';
  setSafeExternalLink(url, entry.inputUrl);
  appendMediaHoverPreview(url, findFirstPreviewUpload(uploads));
  head.appendChild(url);

  const date = document.createElement('span');
  date.className = 'history-date';
  date.textContent = formatHistoryDate(entry.createdAt);
  head.appendChild(date);

  wrap.appendChild(head);

  const entryKey = getHistoryEntryKey(entry);
  const canCollapseUploads = uploads.length > COLLAPSED_UPLOAD_LIMIT;
  const isExpanded = expandedHistoryEntries.has(entryKey);
  const visibleUploads = canCollapseUploads && !isExpanded
    ? uploads.slice(0, COLLAPSED_UPLOAD_LIMIT)
    : uploads;

  appendHistoryUploadRows(wrap, visibleUploads);

  if (canCollapseUploads) {
    const remainingCount = uploads.length - COLLAPSED_UPLOAD_LIMIT;
    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.className = 'history-expand-toggle';
    toggleButton.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    toggleButton.textContent = isExpanded
      ? 'Minimize downloads'
      : `Expand downloads (${remainingCount} more)`;
    toggleButton.addEventListener('click', () => {
      if (expandedHistoryEntries.has(entryKey)) {
        expandedHistoryEntries.delete(entryKey);
      } else {
        expandedHistoryEntries.add(entryKey);
      }

      renderHistory(allEntries);
    });
    wrap.appendChild(toggleButton);
  }

  return wrap;
}

function createProfileMediaGroupElement(groupEntries, allEntries) {
  const firstEntry = groupEntries[0];
  const groupKey = getHistoryGroupKey(groupEntries);
  const isExpanded = expandedHistoryGroups.has(groupKey);
  const canCollapseGroup = groupEntries.length > 0;
  const visibleEntries = isExpanded ? groupEntries : [];

  const wrap = document.createElement('article');
  wrap.className = 'history-item history-profile-group';

  const head = document.createElement('div');
  head.className = 'history-head';

  const sourceUrl = document.createElement('a');
  sourceUrl.className = 'history-url';
  setSafeExternalLink(sourceUrl, firstEntry.sourceInputUrl);
  appendMediaHoverPreview(sourceUrl, findFirstPreviewUploadFromEntries(groupEntries));
  head.appendChild(sourceUrl);

  const date = document.createElement('span');
  date.className = 'history-date';
  date.textContent = formatHistoryDate(firstEntry.createdAt);
  head.appendChild(date);

  wrap.appendChild(head);

  const summary = document.createElement('p');
  summary.className = 'history-line history-group-summary';
  summary.textContent = `${firstEntry.sourceLabel || 'Profile media'} - ${groupEntries.length} saved post${groupEntries.length === 1 ? '' : 's'}`;
  wrap.appendChild(summary);

  for (const entry of visibleEntries) {
    const postWrap = document.createElement('div');
    postWrap.className = 'history-profile-post';

    const postUrl = document.createElement('a');
    postUrl.className = 'history-url history-profile-post-url';
    setSafeExternalLink(postUrl, entry.inputUrl);
    appendMediaHoverPreview(postUrl, findFirstPreviewUpload(entry.uploads));
    postWrap.appendChild(postUrl);

    appendHistoryUploadRows(postWrap, Array.isArray(entry.uploads) ? entry.uploads : []);
    wrap.appendChild(postWrap);
  }

  const actions = document.createElement('div');
  actions.className = 'history-actions';

  if (canCollapseGroup) {
    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.className = 'history-expand-toggle';
    toggleButton.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    toggleButton.textContent = isExpanded
      ? 'Minimize downloads'
      : `Expand downloads (${groupEntries.length} posts)`;
    toggleButton.addEventListener('click', () => {
      if (expandedHistoryGroups.has(groupKey)) {
        expandedHistoryGroups.delete(groupKey);
      } else {
        expandedHistoryGroups.add(groupKey);
      }

      renderHistory(allEntries);
    });
    actions.appendChild(toggleButton);
  }

  const clearButton = document.createElement('button');
  clearButton.type = 'button';
  clearButton.className = 'history-expand-toggle history-danger-action';
  clearButton.textContent = 'Clear';
  clearButton.addEventListener('click', async () => {
    clearButton.disabled = true;
    try {
      const response = await sendMessage({
        type: 'CLEAR_PROFILE_HISTORY_GROUP',
        sourceInputUrl: firstEntry.sourceInputUrl,
        sourceKind: firstEntry.sourceKind,
        inputUrls: groupEntries.map((entry) => entry.inputUrl)
      });
      renderHistory(response.history || []);
      showToast('Profile media cleared.');
    } catch (error) {
      showToast(error.message);
      clearButton.disabled = false;
    }
  });
  actions.appendChild(clearButton);
  wrap.appendChild(actions);

  return wrap;
}

function renderHistory(history) {
  const entries = Array.isArray(history) ? history : [];
  clearDetachedMediaPreviews();

  historyCountEl.textContent = entries.length
    ? `${entries.length} saved link${entries.length === 1 ? '' : 's'}`
    : 'No saved links yet';

  if (!entries.length) {
    historyEl.className = 'history empty';
    historyEl.textContent = 'Your saved links and filenames will appear here.';
    clearHistoryBtn.disabled = true;
    return;
  }

  historyEl.className = 'history';
  historyEl.innerHTML = '';
  clearHistoryBtn.disabled = false;

  for (const item of getHistoryRenderItems(entries)) {
    historyEl.appendChild(item.type === 'profile-media-group'
      ? createProfileMediaGroupElement(item.entries, entries)
      : createHistoryEntryElement(item.entry, entries));
  }
}

async function refreshHistory() {
  const response = await sendMessage({ type: 'GET_STATE' });
  renderActiveUploads(response.activeUploads || []);
  renderHistory(response.history || []);
}

clearHistoryBtn.addEventListener('click', async () => {
  clearHistoryBtn.disabled = true;
  try {
    const response = await sendMessage({ type: 'CLEAR_HISTORY' });
    renderHistory(response.history || []);
    showToast('History cleared.');
  } catch (error) {
    showToast(error.message);
    clearHistoryBtn.disabled = false;
  }
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

  refreshHistory().catch(() => {});
});

refreshHistory().catch((error) => {
  activeCountEl.textContent = 'Could not load uploads';
  activeUploadsEl.className = 'history empty';
  activeUploadsEl.textContent = error.message;
  historyCountEl.textContent = 'Could not load history';
  historyEl.className = 'history empty';
  historyEl.textContent = error.message;
  clearHistoryBtn.disabled = true;
});
