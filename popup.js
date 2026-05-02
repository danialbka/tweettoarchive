/* global chrome */

const authStatusEl = document.getElementById('authStatus');
const folderStatusEl = document.getElementById('folderStatus');
const folderInputEl = document.getElementById('folderInput');
const localStatusEl = document.getElementById('localStatus');
const pasteStatusEl = document.getElementById('pasteStatus');
const planStatusEl = document.getElementById('planStatus');
const quotaStatusEl = document.getElementById('quotaStatus');
const statusDetailsEl = document.getElementById('statusDetails');
const statusDotEl = document.getElementById('statusDot');
const statusIndicatorLabelEl = document.getElementById('statusIndicatorLabel');
const statusIndicatorHintEl = document.getElementById('statusIndicatorHint');
const setupBannerEl = document.getElementById('setupBanner');
const setupTitleEl = setupBannerEl?.querySelector('.panel-title');
const setupCopyEl = document.getElementById('setupCopy');
const paymentBannerEl = document.getElementById('paymentBanner');
const paymentTitleEl = document.getElementById('paymentTitle');
const paymentCopyEl = document.getElementById('paymentCopy');
const paymentActionsEl = document.getElementById('paymentActions');
const storageChoiceBtns = Array.from(document.querySelectorAll('[data-storage-choice]'));
const dropboxChoiceStatusEl = document.getElementById('dropboxChoiceStatus');
const googleDriveChoiceStatusEl = document.getElementById('googleDriveChoiceStatus');
const urlInputEl = document.getElementById('urlInput');
const folderSelectFieldEl = document.getElementById('folderSelectField');
const folderSelectEl = document.getElementById('folderSelect');
const uploadSpinnerEl = document.getElementById('uploadSpinner');
const connectProgressEl = document.getElementById('connectProgress');
const connectProgressTextEl = document.getElementById('connectProgressText');
const captureXCookiesBtn = document.getElementById('captureXCookiesBtn');
const captureInstagramCookiesBtn = document.getElementById('captureInstagramCookiesBtn');
const uploadBtn = document.getElementById('uploadBtn');
const uploadStatusTextEl = document.getElementById('uploadStatusText');
const connectBtn = document.getElementById('connectBtn');
const optionsBtn = document.getElementById('optionsBtn');
const settingsIconBtn = document.getElementById('settingsIconBtn');
const openHistoryBtn = document.getElementById('openHistoryBtn');
const unlockBtn = document.getElementById('unlockBtn');
const restoreBtn = document.getElementById('restoreBtn');
const paymentDismissBtn = document.getElementById('paymentDismissBtn');
const toastEl = document.getElementById('toast');
const pageBody = document.body;
const POPUP_WIDTH_PX = 400;
const HISTORY_WINDOW_URL = chrome.runtime.getURL('history.html');
const UPLOAD_COMPLETE_HOLD_MS = 1000;
let latestState = null;
let uploadInFlight = false;
let activeUploadRequestCount = 0;
let refreshInFlight = null;
let uploadProgressResetTimer = null;
let pasteAutoStartTimer = null;
let folderEditInFlight = false;
const DROPBOX_LOGIN_URL = 'https://www.dropbox.com/login';
const GOOGLE_CLIENTS_URL = 'https://console.cloud.google.com/auth/clients';
const PROVIDER_DROPBOX = 'dropbox';
const PROVIDER_GOOGLE_DRIVE = 'google-drive';
const PAID_PAYMENT_BANNER_SEEN_PREFIX = 'tweet_media_archive_paid_banner_seen_';

function getUnlockButtonText(usage) {
  if (usage?.hasMultipleUnlockPlans) {
    return 'View paid plans';
  }

  const label = usage?.unlockPriceLabel || '';
  return label ? `Unlock unlimited for ${label}` : 'Unlock unlimited uploads';
}

function getUnlockPlanText(usage) {
  const summary = usage?.unlockPlanSummary || usage?.unlockPriceLabel || '';
  if (!summary) {
    return 'the paid plan';
  }

  return usage?.hasMultipleUnlockPlans ? summary : `the ${summary} plan`;
}

function getPaidPaymentBannerSeenKey(usage) {
  const accountKey = String(usage?.paymentEmail || 'account')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '_')
    .slice(0, 120) || 'account';
  return `${PAID_PAYMENT_BANNER_SEEN_PREFIX}${accountKey}`;
}

function hasSeenPaidPaymentBanner(usage) {
  try {
    return window.localStorage.getItem(getPaidPaymentBannerSeenKey(usage)) === '1';
  } catch {
    return false;
  }
}

function markPaidPaymentBannerSeen(usage) {
  try {
    window.localStorage.setItem(getPaidPaymentBannerSeenKey(usage), '1');
  } catch {}
}

function dismissPaidPaymentBanner() {
  const usage = latestState?.usage || {};
  if (usage.paid) {
    markPaidPaymentBannerSeen(usage);
  }
  paymentBannerEl.hidden = true;
}

function getProvider(state = latestState) {
  return state?.settings?.storageProvider === PROVIDER_GOOGLE_DRIVE
    ? PROVIDER_GOOGLE_DRIVE
    : PROVIDER_DROPBOX;
}

function getProviderLabel(provider) {
  return provider === PROVIDER_GOOGLE_DRIVE ? 'Google Drive' : 'Dropbox';
}

function getProviderAuth(state = latestState, provider = getProvider(state)) {
  const normalizedProvider = provider === PROVIDER_GOOGLE_DRIVE ? PROVIDER_GOOGLE_DRIVE : PROVIDER_DROPBOX;
  const providerAuth = state?.auths?.[normalizedProvider];
  if (providerAuth) {
    return providerAuth;
  }

  if (state?.auth
    && (state.auth.provider === normalizedProvider || (!state.auth.provider && getProvider(state) === normalizedProvider))) {
    return state.auth;
  }

  return { connected: false, provider: normalizedProvider };
}

function isProviderConnected(state = latestState, provider = getProvider(state)) {
  return Boolean(getProviderAuth(state, provider)?.connected);
}

function isProviderSetupReady(state = latestState, provider = getProvider(state)) {
  return provider === PROVIDER_GOOGLE_DRIVE
    ? Boolean(state?.googleAuthConfigured)
    : Boolean(state?.appKeySaved);
}

function forcePopupFrameWidth() {
  const width = `${POPUP_WIDTH_PX}px`;
  document.documentElement.style.width = width;
  document.documentElement.style.minWidth = width;
  document.documentElement.style.maxWidth = width;
  document.documentElement.style.inlineSize = width;
  document.body.style.width = width;
  document.body.style.minWidth = width;
  document.body.style.maxWidth = width;
  document.body.style.inlineSize = width;
}

function expandPopupFrameWidth() {
  document.documentElement.style.width = '100%';
  document.documentElement.style.minWidth = '0';
  document.documentElement.style.maxWidth = 'none';
  document.documentElement.style.inlineSize = '100%';
  document.body.style.width = '100%';
  document.body.style.minWidth = '0';
  document.body.style.maxWidth = 'none';
  document.body.style.inlineSize = '100%';
}

function isTabbedExtensionPage() {
  return new Promise((resolve) => {
    if (!chrome.tabs?.getCurrent) {
      resolve(false);
      return;
    }

    chrome.tabs.getCurrent((tab) => {
      if (chrome.runtime.lastError) {
        resolve(false);
        return;
      }

      resolve(Boolean(tab));
    });
  });
}

async function syncPopupFrameWidth() {
  const inTab = await isTabbedExtensionPage();
  if (inTab) {
    expandPopupFrameWidth();
    return;
  }

  forcePopupFrameWidth();
}

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

function buildUploadToast(summary) {
  const totalInputs = Number(summary?.totalInputs || 0);
  const successfulInputs = Number(summary?.successfulInputs || 0);
  const failedInputs = Number(summary?.failedInputs || 0);
  const failedResults = Array.isArray(summary?.results)
    ? summary.results.filter((entry) => !entry?.ok)
    : [];
  const firstFailure = failedResults[0]?.error || '';

  if (successfulInputs > 0 && failedInputs === 0) {
    return `Uploaded ${successfulInputs} link${successfulInputs === 1 ? '' : 's'}.`;
  }

  if (successfulInputs > 0 && failedInputs > 0) {
    return `Uploaded ${successfulInputs} of ${totalInputs} links. ${firstFailure || `${failedInputs} failed.`}`;
  }

  if (failedInputs > 0) {
    return firstFailure || `Could not upload ${failedInputs} link${failedInputs === 1 ? '' : 's'}.`;
  }

  return 'Nothing was uploaded.';
}

function getFriendlyConnectError(provider, error) {
  const message = error instanceof Error ? error.message : String(error);
  if (/invalid redirect_uri/i.test(message) || /redirect uri/i.test(message)) {
    return {
      shortMessage: `${getProviderLabel(provider)} setup is missing the exact Redirect URI. Opening setup now.`,
      openSetup: true
    };
  }

  return {
    shortMessage: message,
    openSetup: false
  };
}

function setBusy(isBusy, options = {}) {
  if (options.persist !== false) {
    uploadInFlight = isBusy;
  }
  uploadBtn.disabled = isBusy;
  captureXCookiesBtn.disabled = isBusy;
  captureInstagramCookiesBtn.disabled = isBusy;
  connectBtn.disabled = isBusy;
  unlockBtn.disabled = isBusy;
  restoreBtn.disabled = isBusy;
  paymentDismissBtn.disabled = isBusy;
  folderInputEl.disabled = isBusy;
  folderSelectEl.disabled = isBusy;
  storageChoiceBtns.forEach((button) => {
    button.disabled = isBusy;
  });
}

function getCurrentUploadProgress() {
  return Math.max(0, Math.min(100, Number(pageBody.style.getPropertyValue('--upload-progress') || 0) * 100));
}

function setUploadProgress(progress) {
  const clamped = Math.max(0, Math.min(100, Number(progress || 0)));
  pageBody.style.setProperty('--upload-progress', String(clamped / 100));
}

function getActiveUploadProgress(activeUploads) {
  const items = getActiveUploadItems(activeUploads);
  if (!items.length) {
    return null;
  }

  const totalProgress = items.reduce((total, item) => {
    const progress = Math.max(0, Math.min(100, Number(item?.progress || 0)));
    return total + progress;
  }, 0);
  return totalProgress / items.length;
}

function getActiveUploadItems(activeUploads) {
  const sessions = Array.isArray(activeUploads) ? activeUploads : [];
  return sessions
    .filter((session) => session?.status !== 'canceled')
    .flatMap((session) => (Array.isArray(session?.items) ? session.items : []));
}

function hasActiveUploadSessions(activeUploads) {
  return getActiveUploadItems(activeUploads).length > 0;
}

function getActiveUploadStatusText(activeUploads) {
  const sessions = Array.isArray(activeUploads) ? activeUploads : [];
  if (sessions.some((session) => session?.status === 'paused')) {
    return 'Upload paused';
  }

  const items = getActiveUploadItems(activeUploads);
  const activeItem = items.find((item) => item?.status === 'running' && item?.detail)
    || items.find((item) => item?.status === 'expanding' && item?.detail)
    || items.find((item) => item?.status === 'queued' && item?.detail)
    || items.find((item) => item?.detail);
  const detail = activeItem?.detail || '';
  if (detail && detail !== 'Queued') {
    return detail;
  }

  const queued = items.filter((item) => item?.status === 'queued').length;
  if (queued > 1) {
    return `${queued} posts queued`;
  }

  return 'Upload running';
}

function updateUploadProgressFromActiveUploads(activeUploads) {
  const progress = getActiveUploadProgress(activeUploads);
  if (progress === null) {
    return;
  }

  setUploadProgress(progress);
}

function syncActiveUploadState(activeUploads) {
  const hasActiveUploads = hasActiveUploadSessions(activeUploads);
  if (!hasActiveUploads) {
    if (!uploadInFlight && !uploadProgressResetTimer) {
      uploadSpinnerEl.hidden = true;
      uploadStatusTextEl.hidden = true;
      uploadStatusTextEl.textContent = '';
      pageBody.dataset.uploadPending = 'false';
      pageBody.dataset.uploadComplete = 'false';
      setUploadProgress(0);
    }
    return false;
  }

  clearTimeout(uploadProgressResetTimer);
  uploadProgressResetTimer = null;
  uploadSpinnerEl.hidden = false;
  uploadStatusTextEl.hidden = false;
  uploadStatusTextEl.textContent = getActiveUploadStatusText(activeUploads);
  pageBody.dataset.uploadPending = 'true';
  pageBody.dataset.uploadComplete = 'false';
  updateUploadProgressFromActiveUploads(activeUploads);
  return true;
}

function setUploadPending(isPending) {
  uploadSpinnerEl.hidden = !isPending;
  clearTimeout(uploadProgressResetTimer);
  uploadProgressResetTimer = null;

  if (isPending) {
    uploadStatusTextEl.hidden = false;
    uploadStatusTextEl.textContent = 'Starting upload...';
    pageBody.dataset.uploadPending = 'true';
    pageBody.dataset.uploadComplete = 'false';
    setUploadProgress(4);
    return;
  }

  pageBody.dataset.uploadComplete = 'true';
  uploadStatusTextEl.hidden = false;
  uploadStatusTextEl.textContent = 'Upload complete';
  setUploadProgress(100);
  uploadProgressResetTimer = setTimeout(() => {
    uploadProgressResetTimer = null;
    if (!uploadInFlight) {
      uploadStatusTextEl.hidden = true;
      uploadStatusTextEl.textContent = '';
      pageBody.dataset.uploadPending = 'false';
      pageBody.dataset.uploadComplete = 'false';
      setUploadProgress(0);
    }
  }, UPLOAD_COMPLETE_HOLD_MS);
}

function setConnectPending(provider, isPending) {
  const label = getProviderLabel(provider);
  connectProgressEl.hidden = !isPending;
  connectBtn.toggleAttribute('aria-busy', isPending);

  if (isPending) {
    connectBtn.textContent = `Connecting ${label}...`;
    connectProgressTextEl.textContent = provider === PROVIDER_GOOGLE_DRIVE
      ? 'Opening Google sign-in. Keep this popup open while the Google page finishes.'
      : 'Opening Dropbox sign-in. Keep this popup open while the Dropbox page finishes.';
    return;
  }

  connectBtn.textContent = `Connect ${label}`;
}

function openDropboxAppSetup() {
  const loginUrl = new URL(DROPBOX_LOGIN_URL);
  loginUrl.searchParams.set('cont', '/developers/apps/create');
  window.open(loginUrl.toString(), '_blank', 'noopener,noreferrer');
}

function openGoogleClientSetup() {
  window.open(GOOGLE_CLIENTS_URL, '_blank', 'noopener,noreferrer');
}

function formatChoiceStatus(state, provider) {
  const auth = getProviderAuth(state, provider);
  if (auth?.connected) {
    return 'Connected';
  }

  if (isProviderSetupReady(state, provider)) {
    return 'Ready';
  }

  return provider === PROVIDER_GOOGLE_DRIVE ? 'Needs setup' : 'Needs app key';
}

function syncStorageSelector(state) {
  const provider = getProvider(state);
  storageChoiceBtns.forEach((button) => {
    const choiceProvider = button.dataset.storageChoice === PROVIDER_GOOGLE_DRIVE
      ? PROVIDER_GOOGLE_DRIVE
      : PROVIDER_DROPBOX;
    button.setAttribute('aria-pressed', choiceProvider === provider ? 'true' : 'false');
  });

  dropboxChoiceStatusEl.textContent = formatChoiceStatus(state, PROVIDER_DROPBOX);
  googleDriveChoiceStatusEl.textContent = formatChoiceStatus(state, PROVIDER_GOOGLE_DRIVE);
}

function syncSetupBanner(state) {
  const provider = getProvider(state);
  const label = getProviderLabel(provider);
  const needsSetup = !isProviderConnected(state, provider);
  pageBody.dataset.storageConnected = needsSetup ? 'false' : 'true';
  setupBannerEl.hidden = !needsSetup;
  settingsIconBtn.hidden = needsSetup;

  if (!needsSetup) {
    return;
  }

  if (isProviderSetupReady(state, provider)) {
    if (setupTitleEl) {
      setupTitleEl.textContent = `Connect ${label}`;
    }
    connectBtn.textContent = `Connect ${label}`;
    setupCopyEl.textContent = provider === PROVIDER_GOOGLE_DRIVE
      ? 'Google Drive sign-in is ready. Finish the connection.'
      : 'Dropbox sign-in is ready. Finish the connection.';
    return;
  }

  if (setupTitleEl) {
    setupTitleEl.textContent = `Set up ${label}`;
  }
  connectBtn.textContent = 'Start setup';
  setupCopyEl.textContent = provider === PROVIDER_GOOGLE_DRIVE
    ? 'Google Drive needs a Web OAuth client ID saved in Setup before it can connect.'
    : 'We will send you to Dropbox login first, then to app setup so you can copy your app key.';
}

function formatLocalFolder(settings) {
  if (!settings?.saveLocalCopies) {
    return `${getProviderLabel(getProvider({ settings }))} only`;
  }

  const folder = String(settings.localDownloadFolder || '').trim();
  return folder ? `Downloads/${folder}` : 'Downloads';
}

function getRemoteFolderLabel(settings) {
  return getProvider({ settings }) === PROVIDER_GOOGLE_DRIVE
    ? (settings?.googleDriveFolderName || 'Tweet Media Archive')
    : (settings?.dropboxFolder || '/');
}

function normalizeEditableRemoteFolder(provider, value) {
  const normalized = String(value || '').trim().replace(/\\/g, '/').replace(/\/+/g, '/');
  const segments = normalized
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .filter((segment) => segment !== '.' && segment !== '..');

  if (provider === PROVIDER_GOOGLE_DRIVE) {
    return segments.join('/') || 'Tweet Media Archive';
  }

  return segments.length ? `/${segments.join('/')}` : '/';
}

function getRemoteFolderOptions(settings) {
  const provider = getProvider({ settings });
  const currentFolder = normalizeEditableRemoteFolder(provider, getRemoteFolderLabel(settings));
  const options = Array.isArray(settings?.remoteFolderOptions) ? settings.remoteFolderOptions : [];
  const seen = new Set();

  return [currentFolder, ...options]
    .map((option) => normalizeEditableRemoteFolder(provider, option))
    .filter((option) => {
      const key = option.toLowerCase();
      if (!option || seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
}

function renderFolderSelect(settings) {
  const options = getRemoteFolderOptions(settings);
  folderSelectEl.replaceChildren(...options.map((folder) => {
    const option = document.createElement('option');
    option.value = folder;
    option.textContent = folder;
    return option;
  }));
  folderSelectEl.value = normalizeEditableRemoteFolder(getProvider({ settings }), getRemoteFolderLabel(settings));
  folderSelectFieldEl.hidden = options.length === 0;
}

function setFolderEditorVisible(isEditing) {
  folderStatusEl.hidden = isEditing;
  folderInputEl.hidden = !isEditing;
}

function startFolderEdit() {
  if (uploadInFlight || folderEditInFlight || !latestState?.settings) {
    return;
  }

  const provider = getProvider(latestState);
  folderInputEl.value = getRemoteFolderLabel(latestState.settings);
  folderInputEl.dataset.originalValue = folderInputEl.value;
  folderInputEl.placeholder = provider === PROVIDER_GOOGLE_DRIVE ? 'Tweet Media Archive' : '/Twitter Imports';
  setFolderEditorVisible(true);
  folderInputEl.focus();
  folderInputEl.select();
}

function cancelFolderEdit() {
  folderInputEl.value = folderInputEl.dataset.originalValue || '';
  setFolderEditorVisible(false);
}

async function saveFolderEdit() {
  if (folderInputEl.hidden || folderEditInFlight || !latestState?.settings) {
    return;
  }

  const provider = getProvider(latestState);
  const nextFolder = normalizeEditableRemoteFolder(provider, folderInputEl.value);
  const currentFolder = normalizeEditableRemoteFolder(provider, getRemoteFolderLabel(latestState.settings));
  setFolderEditorVisible(false);

  if (nextFolder === currentFolder) {
    folderStatusEl.textContent = getRemoteFolderLabel(latestState.settings);
    return;
  }

  const nextSettings = {
    ...latestState.settings,
    ...(provider === PROVIDER_GOOGLE_DRIVE
      ? { googleDriveFolderName: nextFolder }
      : { dropboxFolder: nextFolder })
  };
  const optimisticState = {
    ...(latestState || {}),
    settings: nextSettings
  };
  renderState(optimisticState);

  folderEditInFlight = true;
  setBusy(true);
  try {
    await sendMessage({
      type: 'SAVE_SETTINGS',
      settings: nextSettings
    });
    await refreshState();
    showToast(`Saving to ${nextFolder}.`);
  } catch (error) {
    showToast(error.message);
    await requestRefreshState().catch(() => {});
  } finally {
    folderEditInFlight = false;
    setBusy(false);
  }
}

async function saveSelectedFolder() {
  if (!latestState?.settings || uploadInFlight) {
    return;
  }

  const provider = getProvider(latestState);
  const nextFolder = normalizeEditableRemoteFolder(provider, folderSelectEl.value);
  const currentFolder = normalizeEditableRemoteFolder(provider, getRemoteFolderLabel(latestState.settings));
  if (!nextFolder || nextFolder === currentFolder) {
    return;
  }

  const nextSettings = {
    ...latestState.settings,
    ...(provider === PROVIDER_GOOGLE_DRIVE
      ? { googleDriveFolderName: nextFolder }
      : { dropboxFolder: nextFolder })
  };
  renderState({
    ...(latestState || {}),
    settings: nextSettings
  });

  setBusy(true, { persist: false });
  try {
    await sendMessage({
      type: 'SAVE_SETTINGS',
      settings: nextSettings
    });
    await refreshState();
  } catch (error) {
    showToast(error.message);
    await requestRefreshState().catch(() => {});
  } finally {
    setBusy(uploadInFlight || hasActiveUploadSessions(latestState?.activeUploads), { persist: false });
  }
}

function renderStatusIndicator(state) {
  const provider = getProvider(state);
  const connected = isProviderConnected(state, provider);
  const label = getProviderLabel(provider);
  const setupReady = isProviderSetupReady(state, provider);
  const folder = getRemoteFolderLabel(state?.settings || {});
  const usage = state?.usage || {};

  statusDetailsEl.dataset.connected = connected ? 'true' : 'false';
  statusDotEl.classList.toggle('connected', connected);
  statusDotEl.classList.toggle('warning', !connected);

  if (connected) {
    if (usage.paid) {
      statusIndicatorLabelEl.textContent = `${label} connected`;
      statusIndicatorHintEl.textContent = `${folder} • unlimited`;
      return;
    }

    statusIndicatorLabelEl.textContent = usage.limitReached
      ? `${label} connected • upgrade needed`
      : `${label} connected`;
    statusIndicatorHintEl.textContent = `${folder} • ${usage.remainingFreeUploads} free left`;
    return;
  }

  if (setupReady) {
    statusIndicatorLabelEl.textContent = `Ready to connect ${label}`;
    statusIndicatorHintEl.textContent = `Click Connect ${label}`;
    return;
  }

  statusIndicatorLabelEl.textContent = `${label} setup needed`;
  statusIndicatorHintEl.textContent = 'Open details';
}

function syncPaymentBanner(state) {
  const usage = state?.usage || {};
  const shouldShowBanner = Boolean(usage.paid || usage.lowFreeUploads || usage.limitReached);
  paymentBannerEl.hidden = !shouldShowBanner;

  if (!shouldShowBanner) {
    return;
  }

  if (usage.paid) {
    if (hasSeenPaidPaymentBanner(usage)) {
      paymentBannerEl.hidden = true;
      return;
    }

    paymentTitleEl.textContent = 'Unlimited uploads unlocked';
    paymentCopyEl.textContent = usage.paymentEmail
      ? `Paid plan active for ${usage.paymentEmail}. Manage billing to change or cancel your subscription.`
      : 'Paid plan active on this device. Manage billing to change or cancel your subscription.';
    paymentActionsEl.hidden = false;
    unlockBtn.hidden = false;
    restoreBtn.hidden = true;
    paymentDismissBtn.hidden = false;
    unlockBtn.textContent = 'Manage subscription';
    return;
  }

  paymentActionsEl.hidden = false;
  unlockBtn.hidden = false;
  restoreBtn.hidden = false;
  paymentDismissBtn.hidden = true;
  unlockBtn.textContent = getUnlockButtonText(usage);
  restoreBtn.textContent = 'Restore purchase';

  if (usage.limitReached) {
    paymentTitleEl.textContent = 'Free uploads used up';
    paymentCopyEl.textContent = `Unlimited uploads are unlocked with ${getUnlockPlanText(usage)}. Restore your purchase if you already paid.`;
    return;
  }

  paymentTitleEl.textContent = `${usage.remainingFreeUploads} free upload${usage.remainingFreeUploads === 1 ? '' : 's'} left`;
  paymentCopyEl.textContent = `You still have a few free successful URL uploads. Unlock unlimited uploads anytime with ${getUnlockPlanText(usage)}.`;
}

function renderState(state) {
  latestState = state;
  const provider = getProvider(state);
  const label = getProviderLabel(provider);
  const selectedAuth = getProviderAuth(state, provider);
  if (selectedAuth.connected) {
    authStatusEl.textContent = selectedAuth.accountLabel || `${label} connected`;
  } else if (isProviderSetupReady(state, provider)) {
    authStatusEl.textContent = provider === PROVIDER_GOOGLE_DRIVE
      ? 'Google Drive ready. Connect Google Drive.'
      : 'App key saved. Connect Dropbox.';
  } else {
    authStatusEl.textContent = `Finish ${label} setup`;
  }

  folderStatusEl.textContent = getRemoteFolderLabel(state.settings);
  renderFolderSelect(state.settings);
  localStatusEl.textContent = formatLocalFolder(state.settings);
  pasteStatusEl.textContent = state.settings.autoStartOnPaste ? 'Starts automatically' : `Click Save to ${label}`;
  planStatusEl.textContent = state.usage?.paid
    ? 'Unlimited'
    : (state.usage?.hasMultipleUnlockPlans
        ? `Free tier (plans from ${state.usage.unlockPriceLabel})`
        : (state.usage?.unlockPriceLabel ? `Free tier (${state.usage.unlockPriceLabel})` : 'Free tier'));
  quotaStatusEl.textContent = state.usage?.paid ? 'Unlimited' : String(state.usage?.remainingFreeUploads ?? 0);
  syncStorageSelector(state);
  renderStatusIndicator(state);
  syncSetupBanner(state);
  syncPaymentBanner(state);
  captureXCookiesBtn.hidden = Boolean(state.xCookiesSaved);
  captureXCookiesBtn.textContent = 'Connect my X account';
  captureInstagramCookiesBtn.hidden = Boolean(state.instagramCookiesSaved);
  captureInstagramCookiesBtn.textContent = 'Connect my Instagram account';
  uploadBtn.textContent = state.usage?.limitReached
    ? getUnlockButtonText(state.usage)
    : `Save to ${label}`;
  setBusy(uploadInFlight || hasActiveUploadSessions(state.activeUploads), { persist: false });
  syncActiveUploadState(state.activeUploads);
}

function openHistoryWindow() {
  chrome.windows.create({
    url: HISTORY_WINDOW_URL,
    type: 'popup',
    width: 760,
    height: 620,
    focused: true
  }, () => {
    const runtimeError = chrome.runtime.lastError;
    if (runtimeError) {
      window.open(HISTORY_WINDOW_URL, '_blank', 'popup=yes,width=760,height=620');
    }
  });
}

async function refreshState() {
  const response = await sendMessage({ type: 'GET_STATE' });
  renderState({
    settings: response.settings,
    auth: response.auth,
    auths: response.auths || {},
    appKeySaved: Boolean(response.appKeySaved),
    googleAuthConfigured: Boolean(response.googleAuthConfigured),
    xCookiesSaved: Boolean(response.xCookiesSaved),
    instagramCookiesSaved: Boolean(response.instagramCookiesSaved),
    activeUploads: response.activeUploads || [],
    history: response.history || [],
    usage: response.usage || {}
  });
}

function handleRefreshError(error) {
  latestState = null;
  pageBody.dataset.storageConnected = 'false';
  statusDetailsEl.dataset.connected = 'false';
  statusDotEl.classList.remove('connected');
  statusDotEl.classList.add('warning');
  statusIndicatorLabelEl.textContent = 'Could not load status';
  statusIndicatorHintEl.textContent = 'Open details';
  authStatusEl.textContent = error instanceof Error ? error.message : String(error);
  folderStatusEl.textContent = 'Unavailable';
  localStatusEl.textContent = 'Unavailable';
  pasteStatusEl.textContent = 'Unavailable';
  planStatusEl.textContent = 'Unavailable';
  quotaStatusEl.textContent = 'Unavailable';
  settingsIconBtn.hidden = true;
  setupBannerEl.hidden = false;
  paymentBannerEl.hidden = true;
}

function requestRefreshState() {
  if (refreshInFlight) {
    return refreshInFlight;
  }

  refreshInFlight = refreshState()
    .catch((error) => {
      handleRefreshError(error);
      throw error;
    })
    .finally(() => {
      refreshInFlight = null;
    });

  return refreshInFlight;
}

async function startUpload() {
  const provider = getProvider(latestState);
  const label = getProviderLabel(provider);
  if (!isProviderConnected(latestState, provider)) {
    showToast(isProviderSetupReady(latestState, provider)
      ? `Click Connect ${label} first.`
      : `Connect ${label} first.`);
    return;
  }

  const text = urlInputEl.value.trim();
  if (!text) {
    showToast('Paste one or more URLs first.');
    return;
  }

  let shouldRestoreSubmittedText = false;
  urlInputEl.value = '';
  activeUploadRequestCount += 1;
  uploadInFlight = true;
  setBusy(true, { persist: false });
  setUploadPending(true);
  try {
    const response = await sendMessage({
      type: 'UPLOAD_URLS',
      text
    });
    latestState = {
      ...(latestState || {}),
      auth: latestState?.auth,
      auths: latestState?.auths,
      appKeySaved: latestState?.appKeySaved,
      googleAuthConfigured: latestState?.googleAuthConfigured,
      history: response.summary.history || [],
      usage: response.summary.usage || latestState?.usage
    };
    renderState({
      ...(latestState || {}),
      settings: latestState?.settings || {},
      auth: latestState?.auth || {},
      auths: latestState?.auths || {},
      appKeySaved: latestState?.appKeySaved,
      googleAuthConfigured: latestState?.googleAuthConfigured,
      history: latestState?.history || [],
      usage: latestState?.usage || {}
    });
    shouldRestoreSubmittedText = !response.summary.successfulInputs && Boolean(response.summary.failedInputs);
    showToast(buildUploadToast(response.summary));
  } catch (error) {
    shouldRestoreSubmittedText = true;
    showToast(error.message);
  } finally {
    if (shouldRestoreSubmittedText && !urlInputEl.value.trim()) {
      urlInputEl.value = text;
    }
    activeUploadRequestCount = Math.max(0, activeUploadRequestCount - 1);
    uploadInFlight = activeUploadRequestCount > 0;
    setUploadPending(uploadInFlight);
    setBusy(uploadInFlight || hasActiveUploadSessions(latestState?.activeUploads), { persist: false });
  }
}

async function maybeStartUploadAfterPaste() {
  if (!urlInputEl.value.trim()) {
    return;
  }

  if (!isProviderConnected(latestState, getProvider(latestState))) {
    const provider = getProvider(latestState);
    const label = getProviderLabel(provider);
    showToast(isProviderSetupReady(latestState, provider)
      ? `Click Connect ${label} first.`
      : `Connect ${label} first.`);
    return;
  }

  if (!latestState?.settings?.autoStartOnPaste) {
    return;
  }

  if (latestState?.usage?.limitReached) {
    await openUpgradeFlow();
    return;
  }

  await startUpload();
}

function queuePasteAutoStart() {
  clearTimeout(pasteAutoStartTimer);
  pasteAutoStartTimer = setTimeout(() => {
    pasteAutoStartTimer = null;
    maybeStartUploadAfterPaste();
  }, 0);
}

async function openUpgradeFlow() {
  setBusy(true);
  try {
    await sendMessage({ type: 'OPEN_PAYMENT_PAGE' });
    showToast('Payment page opened.');
  } catch (error) {
    showToast(error.message);
  } finally {
    setBusy(false);
  }
}

uploadBtn.addEventListener('click', () => {
  if (latestState?.usage?.limitReached) {
    openUpgradeFlow();
    return;
  }
  startUpload();
});

captureXCookiesBtn.addEventListener('click', async () => {
  setBusy(true);
  try {
    await sendMessage({ type: 'CAPTURE_CURRENT_X_COOKIES' });
    await refreshState();
    showToast('Your X account is connected.');
  } catch (error) {
    showToast(error.message);
  } finally {
    setBusy(false);
  }
});

captureInstagramCookiesBtn.addEventListener('click', async () => {
  setBusy(true);
  try {
    await sendMessage({ type: 'CAPTURE_CURRENT_INSTAGRAM_COOKIES' });
    await refreshState();
    showToast('Your Instagram account is connected.');
  } catch (error) {
    showToast(error.message);
  } finally {
    setBusy(false);
  }
});

connectBtn.addEventListener('click', async () => {
  const provider = getProvider(latestState);
  const label = getProviderLabel(provider);
  if (!isProviderSetupReady(latestState, provider)) {
    if (provider === PROVIDER_GOOGLE_DRIVE) {
      openGoogleClientSetup();
      showToast('Google Cloud opened. Save a Web OAuth client ID in Setup, then connect.');
    } else {
      openDropboxAppSetup();
      showToast('Dropbox opened. Log in first, then copy your app key into Setup.');
    }
    return;
  }

  setBusy(true);
  setConnectPending(provider, true);
  try {
    await sendMessage({
      type: provider === PROVIDER_GOOGLE_DRIVE ? 'CONNECT_GOOGLE_DRIVE' : 'CONNECT_DROPBOX'
    });
    await refreshState();
    showToast(`${label} connected.`);
  } catch (error) {
    const friendly = getFriendlyConnectError(provider, error);
    if (friendly.openSetup) {
      chrome.runtime.openOptionsPage();
    }
    showToast(friendly.shortMessage);
  } finally {
    setConnectPending(provider, false);
    setBusy(false);
  }
});

storageChoiceBtns.forEach((button) => {
  button.addEventListener('click', async () => {
    const provider = button.dataset.storageChoice === PROVIDER_GOOGLE_DRIVE
      ? PROVIDER_GOOGLE_DRIVE
      : PROVIDER_DROPBOX;
    if (!latestState?.settings || provider === getProvider(latestState) || uploadInFlight) {
      return;
    }

    const nextState = {
      ...(latestState || {}),
      settings: {
        ...(latestState?.settings || {}),
        storageProvider: provider
      }
    };
    renderState(nextState);

    setBusy(true);
    try {
      await sendMessage({
        type: 'SAVE_SETTINGS',
        settings: nextState.settings
      });
      await refreshState();
      showToast(`Saving to ${getProviderLabel(provider)}.`);
    } catch (error) {
      showToast(error.message);
      await requestRefreshState().catch(() => {});
    } finally {
      setBusy(false);
    }
  });
});

optionsBtn.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

settingsIconBtn.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

openHistoryBtn.addEventListener('click', () => {
  openHistoryWindow();
});

unlockBtn.addEventListener('click', async () => {
  openUpgradeFlow();
});

restoreBtn.addEventListener('click', async () => {
  setBusy(true);
  try {
    await sendMessage({ type: 'RESTORE_PURCHASE' });
    showToast('Restore page opened.');
  } catch (error) {
    showToast(error.message);
  } finally {
    setBusy(false);
  }
});

paymentDismissBtn.addEventListener('click', () => {
  dismissPaidPaymentBanner();
});

folderStatusEl.addEventListener('dblclick', () => {
  startFolderEdit();
});

folderStatusEl.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') {
    return;
  }

  event.preventDefault();
  startFolderEdit();
});

folderInputEl.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    folderInputEl.blur();
    return;
  }

  if (event.key === 'Escape') {
    event.preventDefault();
    cancelFolderEdit();
  }
});

folderInputEl.addEventListener('blur', () => {
  saveFolderEdit();
});

folderSelectEl.addEventListener('change', () => {
  saveSelectedFolder();
});

urlInputEl.addEventListener('paste', () => {
  queuePasteAutoStart();
});

urlInputEl.addEventListener('input', (event) => {
  if (event.inputType !== 'insertFromPaste') {
    return;
  }

  queuePasteAutoStart();
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    requestRefreshState().catch(() => {});
  }
});

window.addEventListener('focus', () => {
  requestRefreshState().catch(() => {});
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'local' && areaName !== 'sync') {
    return;
  }

  if (!Object.keys(changes || {}).length) {
    return;
  }

  requestRefreshState().catch(() => {});
});

syncPopupFrameWidth().catch(() => {
  forcePopupFrameWidth();
});
window.addEventListener('load', () => {
  syncPopupFrameWidth().catch(() => {
    forcePopupFrameWidth();
  });
});

requestRefreshState().catch(() => {});
