/* global chrome */

const PROVIDER_DROPBOX = 'dropbox';
const PROVIDER_GOOGLE_DRIVE = 'google-drive';
const PROVIDER_LOCAL = 'local';
const DEFAULT_DROPBOX_APP_KEY = 'cin5t0v25pdshij';
const DEFAULT_DROPBOX_REDIRECT_URI = 'https://ojicpdlgnoidfggebaifkbcifhamahff.chromiumapp.org/dropbox';
const GOOGLE_CLIENTS_URL = 'https://console.cloud.google.com/auth/clients';
const dropboxFolderEl = document.getElementById('dropboxFolder');
const dropboxFolderFieldEl = document.getElementById('dropboxFolderField');
const googleDriveFolderNameEl = document.getElementById('googleDriveFolderName');
const googleDriveFolderFieldEl = document.getElementById('googleDriveFolderField');
const remoteFolderOptionsEl = document.getElementById('remoteFolderOptions');
const storageProviderEl = document.getElementById('storageProvider');
const providerChoiceBtns = Array.from(document.querySelectorAll('[data-provider-choice]'));
const redirectUriEl = document.getElementById('redirectUri');
const redirectUriFieldEl = document.getElementById('redirectUriField');
const redirectUriHintEl = document.getElementById('redirectUriHint');
const dropboxAppKeyEl = document.getElementById('dropboxAppKey');
const dropboxAppKeyFieldEl = dropboxAppKeyEl.closest('label');
const googleOAuthClientIdEl = document.getElementById('googleOAuthClientId');
const autoStartEl = document.getElementById('autoStartOnPaste');
const overwriteEl = document.getElementById('overwriteExisting');
const saveLocalCopiesEl = document.getElementById('saveLocalCopies');
const localDownloadFolderEl = document.getElementById('localDownloadFolder');
const dropboxAdvancedHintEl = document.getElementById('dropboxAdvancedHint');
const appKeyHintEl = document.getElementById('appKeyHint');
const googleAuthHintEl = document.getElementById('googleAuthHint');
const appKeyStatusEl = document.getElementById('appKeyStatus');
const appKeyStatusLabelEl = document.getElementById('appKeyStatusLabel');
const googleOAuthStatusEl = document.getElementById('googleOAuthStatus');
const googleOAuthStatusLabelEl = document.getElementById('googleOAuthStatusLabel');
const saveAppKeyActionsEl = document.getElementById('saveAppKeyActions');
const xAccountStatusEl = document.getElementById('xAccountStatus');
const xAccountStatusLabelEl = document.getElementById('xAccountStatusLabel');
const instagramAccountStatusEl = document.getElementById('instagramAccountStatus');
const instagramAccountStatusLabelEl = document.getElementById('instagramAccountStatusLabel');
const authStateEl = document.getElementById('authState');
const paymentStateEl = document.getElementById('paymentState');
const paymentMetaEl = document.getElementById('paymentMeta');
const paymentActionsEl = document.getElementById('paymentActions');
const saveBtn = document.getElementById('saveBtn');
const storageActionsEl = saveBtn.closest('.storage-actions');
const connectBtn = document.getElementById('connectBtn');
const saveAppKeyBtn = document.getElementById('saveAppKeyBtn');
const captureXCookiesBtn = document.getElementById('captureXCookiesBtn');
const captureInstagramCookiesBtn = document.getElementById('captureInstagramCookiesBtn');
const clearXCookiesBtn = document.getElementById('clearXCookiesBtn');
const clearInstagramCookiesBtn = document.getElementById('clearInstagramCookiesBtn');
const clearBtn = document.getElementById('clearBtn');
const unlockBtn = document.getElementById('unlockBtn');
const restoreBtn = document.getElementById('restoreBtn');
const messageEl = document.getElementById('message');
const connectProgressEl = document.getElementById('connectProgress');
const connectProgressTextEl = document.getElementById('connectProgressText');
const DROPBOX_LOGIN_URL = 'https://www.dropbox.com/login';
let latestState = null;

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

function normalizeProvider(value) {
  if (value === PROVIDER_LOCAL) return PROVIDER_LOCAL;
  return value === PROVIDER_GOOGLE_DRIVE ? PROVIDER_GOOGLE_DRIVE : PROVIDER_DROPBOX;
}

function getProvider(state = latestState) {
  return normalizeProvider(state?.settings?.storageProvider || storageProviderEl.value);
}

function getProviderLabel(provider) {
  const normalizedProvider = normalizeProvider(provider);
  if (normalizedProvider === PROVIDER_GOOGLE_DRIVE) return 'Google Drive';
  if (normalizedProvider === PROVIDER_LOCAL) return 'Local downloads';
  return 'Dropbox';
}

function getSettingsPayload({ dropboxAppKey = dropboxAppKeyEl.value, googleOAuthClientId = '' } = {}) {
  return {
    storageProvider: storageProviderEl.value,
    dropboxFolder: dropboxFolderEl.value,
    googleDriveFolderName: googleDriveFolderNameEl.value,
    remoteFolderOptions: remoteFolderOptionsEl.value,
    dropboxAppKey,
    googleOAuthClientId,
    autoStartOnPaste: autoStartEl.checked,
    overwriteExisting: overwriteEl.checked,
    saveLocalCopies: saveLocalCopiesEl.checked,
    localDownloadFolder: localDownloadFolderEl.value
  };
}

function getProviderAuth(state = latestState, provider = getProvider(state)) {
  const normalizedProvider = normalizeProvider(provider);
  if (normalizedProvider === PROVIDER_LOCAL) {
    return { connected: true, provider: PROVIDER_LOCAL, accountLabel: 'Local downloads ready' };
  }

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

function syncProviderChoiceButtons(provider = getProvider()) {
  const normalizedProvider = normalizeProvider(provider);
  document.body.dataset.storageProvider = normalizedProvider;
  providerChoiceBtns.forEach((button) => {
    const isSelected = normalizeProvider(button.dataset.providerChoice) === normalizedProvider;
    button.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
  });
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

function flash(message) {
  messageEl.textContent = message;
  messageEl.hidden = false;
  clearTimeout(flash.timer);
  flash.timer = setTimeout(() => {
    messageEl.hidden = true;
  }, 2200);
}

function getDropboxRedirectUri(appKey = '') {
  const normalizedAppKey = appKey.trim();
  if (normalizedAppKey === DEFAULT_DROPBOX_APP_KEY || (!normalizedAppKey && latestState?.defaultDropboxAppKeyInUse)) {
    return DEFAULT_DROPBOX_REDIRECT_URI;
  }

  return chrome.identity.getRedirectURL('dropbox');
}

function getProviderRedirectUri(provider) {
  if (normalizeProvider(provider) === PROVIDER_LOCAL) {
    return '';
  }

  return normalizeProvider(provider) === PROVIDER_GOOGLE_DRIVE
    ? chrome.identity.getRedirectURL()
    : getDropboxRedirectUri(dropboxAppKeyEl.value);
}

function getProviderRedirectHint(provider) {
  if (normalizeProvider(provider) === PROVIDER_LOCAL) {
    return 'Local downloads do not need a cloud Redirect URI.';
  }

  return normalizeProvider(provider) === PROVIDER_GOOGLE_DRIVE
    ? 'Add this exact Redirect URI to your Google Web OAuth client.'
    : 'Add this exact Redirect URI in your Dropbox app settings, including the `/dropbox` path.';
}

function setBusy(isBusy) {
  saveBtn.disabled = isBusy;
  connectBtn.disabled = isBusy;
  saveAppKeyBtn.disabled = isBusy;
  captureXCookiesBtn.disabled = isBusy;
  captureInstagramCookiesBtn.disabled = isBusy;
  clearXCookiesBtn.disabled = isBusy || !latestState?.xCookiesSaved;
  clearInstagramCookiesBtn.disabled = isBusy || !latestState?.instagramCookiesSaved;
  clearBtn.disabled = isBusy || !isProviderConnected(latestState);
  unlockBtn.disabled = isBusy;
  restoreBtn.disabled = isBusy;
  dropboxAppKeyEl.disabled = isBusy;
  googleOAuthClientIdEl.disabled = isBusy;
  storageProviderEl.disabled = isBusy;
  remoteFolderOptionsEl.disabled = isBusy;
  providerChoiceBtns.forEach((button) => {
    button.disabled = isBusy;
  });
}

function setConnectProgress(provider, isConnecting) {
  const label = getProviderLabel(provider);
  connectProgressEl.hidden = !isConnecting;
  connectBtn.toggleAttribute('aria-busy', isConnecting);

  if (isConnecting) {
    connectBtn.textContent = `Connecting ${label}...`;
    authStateEl.textContent = `Connecting ${label}. Continue in the authorization window; this page will update when it finishes.`;
    connectProgressTextEl.textContent = provider === PROVIDER_GOOGLE_DRIVE
      ? 'Opening Google sign-in. Keep this setup page open while the Google page finishes.'
      : 'Opening Dropbox sign-in. Keep this setup page open while the Dropbox page finishes.';
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

function getFriendlyConnectError(provider, error) {
  const message = error instanceof Error ? error.message : String(error);
  if (/authorization page could not be loaded/i.test(message)) {
    const label = getProviderLabel(provider);
    return {
      shortMessage: `${label} authorization did not finish.`,
      statusMessage: `${label} authorization did not finish. If you closed or canceled the authorization window, click Connect ${label} again.`
    };
  }

  if (/invalid redirect_uri/i.test(message) || /redirect uri/i.test(message)) {
    return {
      shortMessage: `Add the exact Redirect URI shown below in your ${getProviderLabel(provider)} app settings, then try again.`,
      statusMessage: `${getProviderLabel(provider)} rejected the Redirect URI. Add this exact value in app settings: ${getProviderRedirectUri(provider)}`
    };
  }

  return {
    shortMessage: message,
    statusMessage: message
  };
}

function syncAppKeyUi() {
  const isDropbox = getProvider() === PROVIDER_DROPBOX;
  const isGoogleDrive = getProvider() === PROVIDER_GOOGLE_DRIVE;
  const isLocal = getProvider() === PROVIDER_LOCAL;
  const hasSavedAppKey = Boolean(latestState?.appKeySaved);
  const hasTypedAppKey = Boolean(dropboxAppKeyEl.value.trim());
  const isUsingDefaultDropboxAppKey = Boolean(latestState?.defaultDropboxAppKeyInUse) && !hasTypedAppKey;
  const hasSavedGoogleClientId = Boolean(latestState?.customGoogleOAuthClientIdSaved);
  const hasTypedGoogleClientId = Boolean(googleOAuthClientIdEl.value.trim());

  if (dropboxAppKeyFieldEl) {
    dropboxAppKeyFieldEl.hidden = !isDropbox;
  }
  appKeyStatusEl.hidden = !isDropbox || !hasSavedAppKey || hasTypedAppKey;
  appKeyStatusLabelEl.textContent = isUsingDefaultDropboxAppKey
    ? 'Using included Dropbox app key'
    : hasSavedAppKey
      ? 'Custom Dropbox app key saved'
      : '';
  googleOAuthStatusEl.hidden = !isGoogleDrive || isLocal || hasTypedGoogleClientId;
  googleOAuthStatusLabelEl.textContent = hasSavedGoogleClientId
    ? 'Custom Google OAuth saved'
    : 'Using included Google OAuth';
  if (isDropbox) {
    redirectUriEl.value = getDropboxRedirectUri(dropboxAppKeyEl.value);
  }
  saveAppKeyActionsEl.hidden = false;
  saveAppKeyBtn.textContent = 'Save OAuth settings';
}

function renderState(state) {
  latestState = state;
  const isPaid = Boolean(state.usage?.paid);
  const provider = getProvider(state);
  const isGoogleDrive = provider === PROVIDER_GOOGLE_DRIVE;
  const isLocal = provider === PROVIDER_LOCAL;
  const providerLabel = getProviderLabel(provider);
  const selectedAuth = getProviderAuth(state, provider);
  storageProviderEl.value = provider;
  syncProviderChoiceButtons(provider);
  dropboxFolderFieldEl.hidden = isGoogleDrive || isLocal;
  googleDriveFolderFieldEl.hidden = !isGoogleDrive || isLocal;
  remoteFolderOptionsEl.closest('label').hidden = isLocal;
  redirectUriFieldEl.hidden = isLocal;
  redirectUriHintEl.hidden = isLocal;
  googleAuthHintEl.hidden = !isGoogleDrive;
  dropboxAdvancedHintEl.hidden = isGoogleDrive || isLocal;
  appKeyHintEl.hidden = isGoogleDrive || isLocal;
  dropboxFolderEl.value = state.settings.dropboxFolder;
  googleDriveFolderNameEl.value = state.settings.googleDriveFolderName || 'Tweet Media Archive';
  remoteFolderOptionsEl.value = (state.settings.remoteFolderOptions || []).join('\n');
  redirectUriEl.value = getProviderRedirectUri(provider);
  redirectUriHintEl.textContent = getProviderRedirectHint(provider);
  dropboxAppKeyEl.value = '';
  dropboxAppKeyEl.placeholder = state.appKeySaved
    ? state.defaultDropboxAppKeyInUse
      ? 'Using included Dropbox app key'
      : 'Custom app key saved. Paste a new key to replace it.'
    : 'your Dropbox app key';
  googleOAuthClientIdEl.value = '';
  googleOAuthClientIdEl.placeholder = state.customGoogleOAuthClientIdSaved
    ? 'Custom Google OAuth client saved on this device'
    : 'Use included Google OAuth client';
  autoStartEl.checked = state.settings.autoStartOnPaste;
  overwriteEl.checked = state.settings.overwriteExisting;
  saveLocalCopiesEl.checked = isLocal || state.settings.saveLocalCopies;
  saveLocalCopiesEl.disabled = isLocal;
  localDownloadFolderEl.value = state.settings.localDownloadFolder;
  appKeyHintEl.textContent = state.appKeySaved
    ? state.defaultDropboxAppKeyInUse
      ? 'The included Dropbox app key uses the fixed Redirect URI shown above. Paste your own app key to use this browser profile’s Redirect URI instead.'
      : 'Your custom Dropbox app key uses this browser profile’s Redirect URI shown above. Paste a new key only if you want to replace it.'
    : 'Paste an app key here only if you need it for Dropbox setup.';
  googleAuthHintEl.textContent = state.googleAuthConfigured
    ? 'Leave blank to keep using the included Google OAuth client. Saving a custom client ID will require reconnecting Google Drive.'
    : 'Google Drive needs a Web OAuth client ID before it can connect.';
  syncAppKeyUi();
  xAccountStatusEl.hidden = !state.xCookiesSaved;
  xAccountStatusLabelEl.textContent = state.xCookiesSaved ? 'X account connected' : '';
  clearXCookiesBtn.hidden = !state.xCookiesSaved;
  instagramAccountStatusEl.hidden = !state.instagramCookiesSaved;
  instagramAccountStatusLabelEl.textContent = state.instagramCookiesSaved ? 'Instagram account connected' : '';
  clearInstagramCookiesBtn.hidden = !state.instagramCookiesSaved;
  connectBtn.hidden = isLocal;
  connectBtn.textContent = `Connect ${providerLabel}`;
  clearBtn.textContent = `Disconnect ${providerLabel}`;
  clearBtn.hidden = isLocal;
  clearBtn.disabled = isLocal || !selectedAuth.connected;
  storageActionsEl.classList.toggle('local-storage-actions', isLocal);
  paymentStateEl.textContent = isPaid
    ? `Unlimited uploads unlocked${state.usage?.paymentEmail ? ` for ${state.usage.paymentEmail}` : '.'}`
    : `${state.usage?.remainingFreeUploads ?? 0} of ${state.usage?.freeUploadLimit ?? 30} free uploads remaining.`;
  paymentMetaEl.textContent = isPaid
    ? 'Manage billing to change or cancel your subscription. If you use another profile or machine later, use Restore purchase there.'
    : `The first ${state.usage?.freeUploadLimit ?? 30} successful URL uploads are free. Unlimited uploads are unlocked with ${getUnlockPlanText(state.usage)}.`;
  paymentActionsEl.hidden = false;
  unlockBtn.hidden = false;
  restoreBtn.hidden = isPaid;
  unlockBtn.textContent = isPaid ? 'Manage subscription' : getUnlockButtonText(state.usage);
  restoreBtn.textContent = 'Restore purchase';

  if (isLocal) {
    authStateEl.textContent = 'Local downloads are ready. Files save into your browser Downloads folder.';
  } else if (selectedAuth.connected) {
    authStateEl.textContent = `${selectedAuth.accountLabel || `${providerLabel} connected`}.`;
  } else if (isGoogleDrive) {
    authStateEl.textContent = state.googleAuthConfigured
      ? 'Google Drive sign-in is ready. Connect Google Drive when you are ready.'
      : 'Save a Web OAuth client ID in Advanced setup, then connect Google Drive.';
  } else {
    authStateEl.textContent = state.appKeySaved
      ? state.defaultDropboxAppKeyInUse
        ? 'Included Dropbox app key ready. Finish connecting from the main popup.'
        : 'Custom Dropbox app key ready. Finish connecting from the main popup.'
      : 'Click Connect Dropbox and we will send you to Dropbox login first, then to app setup so you can get your app key.';
  }
}

async function refresh() {
  const response = await sendMessage({ type: 'GET_STATE' });
  renderState({
    settings: response.settings,
    auth: response.auth,
    auths: response.auths || {},
    appKeySaved: Boolean(response.appKeySaved),
    customGoogleOAuthClientIdSaved: Boolean(response.customGoogleOAuthClientIdSaved),
    googleAuthConfigured: Boolean(response.googleAuthConfigured),
    xCookiesSaved: Boolean(response.xCookiesSaved),
    instagramCookiesSaved: Boolean(response.instagramCookiesSaved),
    usage: response.usage || {}
  });
}

saveBtn.addEventListener('click', async () => {
  setBusy(true);
  try {
    await sendMessage({
      type: 'SAVE_SETTINGS',
      settings: getSettingsPayload()
    });
    await refresh();
    flash('Settings saved.');
  } catch (error) {
    flash(error.message);
  } finally {
    setBusy(false);
  }
});

dropboxAppKeyEl.addEventListener('input', () => {
  if (getProvider() === PROVIDER_DROPBOX) {
    redirectUriEl.value = getDropboxRedirectUri(dropboxAppKeyEl.value);
  }
  syncAppKeyUi();
});

googleOAuthClientIdEl.addEventListener('input', () => {
  syncAppKeyUi();
});

storageProviderEl.addEventListener('change', () => {
  const provider = normalizeProvider(storageProviderEl.value);
  syncProviderChoiceButtons(provider);
  renderState({
    ...(latestState || {}),
    settings: {
      ...(latestState?.settings || {}),
      storageProvider: provider
    },
    auth: getProviderAuth(latestState, provider),
    auths: latestState?.auths || {},
    appKeySaved: Boolean(latestState?.appKeySaved),
    customGoogleOAuthClientIdSaved: Boolean(latestState?.customGoogleOAuthClientIdSaved),
    googleAuthConfigured: Boolean(latestState?.googleAuthConfigured),
    xCookiesSaved: Boolean(latestState?.xCookiesSaved),
    instagramCookiesSaved: Boolean(latestState?.instagramCookiesSaved),
    usage: latestState?.usage || {}
  });
});

providerChoiceBtns.forEach((button) => {
  button.addEventListener('click', () => {
    const provider = normalizeProvider(button.dataset.providerChoice);
    if (storageProviderEl.value === provider) {
      return;
    }

    storageProviderEl.value = provider;
    storageProviderEl.dispatchEvent(new Event('change'));
  });
});

saveAppKeyBtn.addEventListener('click', async () => {
  const typedAppKey = dropboxAppKeyEl.value.trim();
  const typedGoogleClientId = googleOAuthClientIdEl.value.trim();
  if (!typedAppKey && !typedGoogleClientId) {
    flash('Paste an OAuth value first.');
    return;
  }

  setBusy(true);
  try {
    await sendMessage({
      type: 'SAVE_SETTINGS',
      settings: getSettingsPayload({
        dropboxAppKey: typedAppKey,
        googleOAuthClientId: typedGoogleClientId
      })
    });
    await refresh();
    flash('OAuth settings saved. Reconnect the affected service before uploading.');
  } catch (error) {
    flash(error.message);
  } finally {
    setBusy(false);
  }
});

captureXCookiesBtn.addEventListener('click', async () => {
  setBusy(true);
  try {
    await sendMessage({ type: 'CAPTURE_CURRENT_X_COOKIES' });
    await refresh();
    flash('Your X account is connected.');
  } catch (error) {
    flash(error.message);
  } finally {
    setBusy(false);
  }
});

captureInstagramCookiesBtn.addEventListener('click', async () => {
  setBusy(true);
  try {
    await sendMessage({ type: 'CAPTURE_CURRENT_INSTAGRAM_COOKIES' });
    await refresh();
    flash('Your Instagram account is connected.');
  } catch (error) {
    flash(error.message);
  } finally {
    setBusy(false);
  }
});

clearXCookiesBtn.addEventListener('click', async () => {
  setBusy(true);
  try {
    await sendMessage({ type: 'CLEAR_X_COOKIES' });
    await refresh();
    flash('Your saved X account was removed.');
  } catch (error) {
    flash(error.message);
  } finally {
    setBusy(false);
  }
});

clearInstagramCookiesBtn.addEventListener('click', async () => {
  setBusy(true);
  try {
    await sendMessage({ type: 'CLEAR_INSTAGRAM_COOKIES' });
    await refresh();
    flash('Your saved Instagram account was removed.');
  } catch (error) {
    flash(error.message);
  } finally {
    setBusy(false);
  }
});

connectBtn.addEventListener('click', async () => {
  const provider = normalizeProvider(storageProviderEl.value);
  const providerLabel = getProviderLabel(provider);
  if (provider === PROVIDER_LOCAL) {
    flash('Local downloads do not need a connection.');
    return;
  }

  const typedAppKey = dropboxAppKeyEl.value.trim();
  const hasAppKey = Boolean(latestState?.appKeySaved || typedAppKey);
  if (provider === PROVIDER_DROPBOX && !hasAppKey) {
    openDropboxAppSetup();
    flash('Dropbox opened. Log in first, then create your app and copy the app key back here.');
    return;
  }

  if (provider === PROVIDER_GOOGLE_DRIVE && !latestState?.googleAuthConfigured) {
    openGoogleClientSetup();
    flash('Google Cloud opened. Save a Web OAuth client ID in Advanced setup, then connect.');
    return;
  }

  setBusy(true);
  setConnectProgress(provider, true);
  try {
    await sendMessage({
      type: 'SAVE_SETTINGS',
      settings: getSettingsPayload()
    });
    await sendMessage({
      type: provider === PROVIDER_GOOGLE_DRIVE ? 'CONNECT_GOOGLE_DRIVE' : 'CONNECT_DROPBOX'
    });
    await refresh();
    flash(`${providerLabel} connected.`);
  } catch (error) {
    const friendly = getFriendlyConnectError(provider, error);
    authStateEl.textContent = friendly.statusMessage;
    flash(friendly.shortMessage);
  } finally {
    setConnectProgress(provider, false);
    setBusy(false);
  }
});

clearBtn.addEventListener('click', async () => {
  const provider = normalizeProvider(storageProviderEl.value);
  if (provider === PROVIDER_LOCAL) {
    flash('Local downloads do not have a cloud connection to clear.');
    return;
  }

  setBusy(true);
  try {
    await sendMessage({
      type: provider === PROVIDER_GOOGLE_DRIVE ? 'CLEAR_GOOGLE_DRIVE_AUTH' : 'CLEAR_DROPBOX_AUTH'
    });
    await refresh();
    flash(provider === PROVIDER_DROPBOX
      ? 'Dropbox disconnected. Connect again to choose another Dropbox account.'
      : `${getProviderLabel(provider)} auth cleared.`);
  } catch (error) {
    flash(error.message);
  } finally {
    setBusy(false);
  }
});

unlockBtn.addEventListener('click', async () => {
  setBusy(true);
  try {
    await sendMessage({ type: 'OPEN_PAYMENT_PAGE' });
    flash('Payment page opened.');
  } catch (error) {
    flash(error.message);
  } finally {
    setBusy(false);
  }
});

restoreBtn.addEventListener('click', async () => {
  setBusy(true);
  try {
    await sendMessage({ type: 'RESTORE_PURCHASE' });
    flash('Restore page opened.');
  } catch (error) {
    flash(error.message);
  } finally {
    setBusy(false);
  }
});

refresh().catch((error) => {
  authStateEl.textContent = error.message;
  paymentStateEl.textContent = error.message;
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    refresh().catch(() => {});
  }
});

window.addEventListener('focus', () => {
  refresh().catch(() => {});
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'local' && areaName !== 'sync') {
    return;
  }

  if (!Object.keys(changes || {}).length) {
    return;
  }

  refresh().catch(() => {});
});
