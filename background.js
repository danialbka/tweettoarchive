/* global chrome, importScripts, ExtPay */

function useProductionExtPayInstallType() {
  const getSelf = chrome?.management?.getSelf;
  if (typeof getSelf !== 'function') {
    return;
  }

  const normalizeInstallInfo = (info) => info?.installType === 'development'
    ? { ...info, installType: 'normal' }
    : info;
  const originalGetSelf = getSelf.bind(chrome.management);

  chrome.management.getSelf = (callback) => {
    if (typeof callback === 'function') {
      return originalGetSelf((info) => callback(normalizeInstallInfo(info)));
    }

    return new Promise((resolve, reject) => {
      try {
        const maybePromise = originalGetSelf((info) => {
          const runtimeError = chrome.runtime.lastError;
          if (runtimeError) {
            reject(new Error(runtimeError.message));
            return;
          }
          resolve(normalizeInstallInfo(info));
        });
        if (maybePromise && typeof maybePromise.then === 'function') {
          maybePromise.then(
            (info) => resolve(normalizeInstallInfo(info)),
            reject
          );
        }
      } catch (error) {
        reject(error);
      }
    });
  };
}

useProductionExtPayInstallType();

try {
  // Official packaged builds may inject this optional payment bridge.
  importScripts('vendor/ExtPay.js');
} catch {}

const SETTINGS_KEY = 'tweet_to_dropbox_settings_v1';
const AUTH_KEY = 'tweet_to_dropbox_auth_v1';
const HISTORY_KEY = 'tweet_to_dropbox_history_v1';
const ACTIVE_UPLOADS_KEY = 'tweet_to_dropbox_active_uploads_v1';
const USAGE_KEY = 'tweet_to_dropbox_usage_v1';
const USAGE_SYNC_KEY = 'tweet_to_dropbox_usage_sync_v1';
const SECRETS_KEY = 'tweet_to_dropbox_secrets_v1';
const DROPBOX_FORCE_REAUTH_KEY = 'tweet_to_dropbox_force_reauth_v1';
const PAYMENT_REFRESH_REQUESTED_KEY = 'tweet_to_dropbox_payment_refresh_requested_v1';
const SECURE_DB_NAME = 'tweet_to_dropbox_secure_v1';
const SECURE_DB_STORE = 'crypto';
const SECURE_DB_KEY = 'auth_key_v1';
const PROVIDER_DROPBOX = 'dropbox';
const PROVIDER_GOOGLE_DRIVE = 'google-drive';
const PROVIDER_LOCAL = 'local';
const STORAGE_PROVIDERS = [PROVIDER_DROPBOX, PROVIDER_GOOGLE_DRIVE, PROVIDER_LOCAL];
const CLOUD_STORAGE_PROVIDERS = [PROVIDER_DROPBOX, PROVIDER_GOOGLE_DRIVE];
const DROPBOX_AUTHORIZE_URL = 'https://www.dropbox.com/oauth2/authorize';
const DROPBOX_TOKEN_URL = 'https://api.dropboxapi.com/oauth2/token';
const DROPBOX_ACCOUNT_URL = 'https://api.dropboxapi.com/2/users/get_current_account';
const DROPBOX_CREATE_FOLDER_URL = 'https://api.dropboxapi.com/2/files/create_folder_v2';
const DROPBOX_UPLOAD_URL = 'https://content.dropboxapi.com/2/files/upload';
const DROPBOX_UPLOAD_SESSION_START_URL = 'https://content.dropboxapi.com/2/files/upload_session/start';
const DROPBOX_UPLOAD_SESSION_APPEND_URL = 'https://content.dropboxapi.com/2/files/upload_session/append_v2';
const DROPBOX_UPLOAD_SESSION_FINISH_URL = 'https://content.dropboxapi.com/2/files/upload_session/finish';
const DEFAULT_DROPBOX_APP_KEY = 'cin5t0v25pdshij';
const DEFAULT_DROPBOX_REDIRECT_URL = 'https://ojicpdlgnoidfggebaifkbcifhamahff.chromiumapp.org/dropbox';
const GOOGLE_OAUTH_AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_OAUTH_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_DRIVE_ABOUT_URL = 'https://www.googleapis.com/drive/v3/about?fields=user(displayName,emailAddress)';
const GOOGLE_DRIVE_FILES_URL = 'https://www.googleapis.com/drive/v3/files';
const GOOGLE_DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files';
const GOOGLE_DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';
const GOOGLE_DRIVE_CLIENT_ID_PLACEHOLDER = 'REPLACE_WITH_CHROME_EXTENSION_OAUTH_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_DRIVE_WEB_CLIENT_ID_PLACEHOLDER = 'REPLACE_WITH_GOOGLE_WEB_OAUTH_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_DRIVE_WEB_CLIENT_ID = '857797361531-f6s0l2nfspanq4vakr10kacu3e63ute8.apps.googleusercontent.com';
const TWITTER_SYNDICATION_URL = 'https://cdn.syndication.twimg.com/tweet-result';
const INSTAGRAM_HOME_URL = 'https://www.instagram.com/';
const INSTAGRAM_OEMBED_URL = 'https://www.instagram.com/api/v1/oembed/';
const INSTAGRAM_MEDIA_INFO_BASE_URL = 'https://www.instagram.com/api/v1/media';
const INSTAGRAM_WEB_APP_ID = '936619743392459';
const INSTAGRAM_ASBD_ID = '129477';
const GENERIC_ALBUM_HOME_URL = 'https://www.generic_album.com/';
const GENERIC_VIDEO_HOME_URL = 'https://www.generic_video.com/';
const X_HOME_URL = 'https://x.com/';
const X_GUEST_ACTIVATE_URL = 'https://api.x.com/1.1/guest/activate.json';
const X_GRAPHQL_BASE_URL = 'https://x.com/i/api/graphql';
const X_DEFAULT_WEB_BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';
const X_DEFAULT_TWEET_RESULT_QUERY_ID = 'fHLDP3qFEjnTqhWBVvsREg';
const X_DEFAULT_BOOKMARKS_QUERY_ID = '1nFKbANnLDDNT2nyLFZxtQ';
const X_DEFAULT_BOOKMARK_FOLDER_QUERY_ID = '-IsCV-k4D19s_FVAlxh8pQ';
const X_DEFAULT_USER_BY_SCREEN_NAME_QUERY_ID = 'IGgvgiOx4QZndDHuD3x9TQ';
const X_DEFAULT_USER_MEDIA_QUERY_ID = 'd_uaoPr42_nSDblfvi7NPw';
const X_BOOKMARKS_SHARED_CHUNK_NAME = 'shared~bundle.BookmarkFolders~bundle.Bookmarks';
const X_API_METADATA_TTL_MS = 15 * 60 * 1000;
const INSTAGRAM_SESSION_RULE_ID_BASE = 820000;
const GENERIC_ALBUM_SESSION_RULE_ID_BASE = 920000;
const X_SESSION_RULE_ID_BASE = 720000;
const TOKEN_REFRESH_BUFFER_MS = 60 * 1000;
const BIG_INT_SCALE = 1000000000000000n;
const HISTORY_LIMIT = 40;
const ACTIVE_UPLOAD_STALE_MS = 6 * 60 * 60 * 1000;
const ACTIVE_UPLOAD_PAUSE_POLL_MS = 500;
const UPLOAD_CANCELED_MESSAGE = 'Upload canceled.';
const PAYMENT_REFRESH_REQUEST_TTL_MS = 30 * 60 * 1000;
const ENCRYPTION_VERSION = 1;
const FREE_UPLOAD_LIMIT = 30;
const EXTPAY_EXTENSION_ID = 'tweet-to-dropbox';
const GOOGLE_DRIVE_DEFAULT_FOLDER_NAME = 'Tweet Media Archive';
const GOOGLE_IDENTITY_TIMEOUT_MS = 20 * 1000;
const GOOGLE_WEB_AUTH_TIMEOUT_MS = 60 * 1000;
const MAX_REMOTE_DOWNLOAD_BYTES = 250 * 1024 * 1024;
const REMOTE_DOWNLOAD_TIMEOUT_MS = 2 * 60 * 1000;
const DOWNLOAD_PROGRESS_MIN_INTERVAL_MS = 500;
const DOWNLOAD_PROGRESS_MIN_BYTES = 1024 * 1024;
const PARALLEL_RANGE_DOWNLOAD_MIN_BYTES = 16 * 1024 * 1024;
const PARALLEL_RANGE_DOWNLOAD_CHUNK_BYTES = 4 * 1024 * 1024;
const PARALLEL_RANGE_DOWNLOAD_MAX_CONCURRENCY = 6;
const MAX_CONCURRENT_PARALLEL_RANGE_REQUESTS = 10;
const REMOTE_STREAM_UPLOAD_CHUNK_BYTES = 16 * 1024 * 1024;
const REMOTE_STREAM_PREFETCH_CONCURRENCY = 8;
const MAX_CONCURRENT_SOURCE_UPLOADS = 3;
const MAX_CONCURRENT_EXPANDED_UPLOADS = 3;
const MAX_CONCURRENT_ACTIVE_UPLOADS = 3;
const DROPBOX_SIMPLE_UPLOAD_MAX_BYTES = 150 * 1000 * 1000;
const DROPBOX_UPLOAD_CHUNK_BYTES = 128 * 1024 * 1024;
const X_BOOKMARK_PAGE_SIZE = 40;
const X_MAX_BOOKMARK_EXPANSION_PAGES = 8;
const X_PROFILE_MEDIA_PAGE_SIZE = 40;
const X_MAX_PROFILE_MEDIA_EXPANSION_PAGES = 50;
const X_DEFAULT_USER_FEATURE_SWITCHES = [
  'hidden_profile_subscriptions_enabled',
  'profile_label_improvements_pcf_label_in_post_enabled',
  'responsive_web_profile_redirect_enabled',
  'rweb_tipjar_consumption_enabled',
  'verified_phone_label_enabled',
  'subscriptions_verification_info_is_identity_verified_enabled',
  'subscriptions_verification_info_verified_since_enabled',
  'highlights_tweets_tab_ui_enabled',
  'responsive_web_twitter_article_notes_tab_enabled',
  'subscriptions_feature_can_gift_premium',
  'creator_subscriptions_tweet_preview_api_enabled',
  'responsive_web_graphql_skip_user_profile_image_extensions_enabled',
  'responsive_web_graphql_timeline_navigation_enabled'
];
const X_DEFAULT_USER_FIELD_TOGGLES = [
  'withPayments',
  'withAuxiliaryUserLabels'
];
const X_DEFAULT_TIMELINE_FEATURE_SWITCHES = [
  'rweb_video_screen_enabled',
  'rweb_cashtags_enabled',
  'profile_label_improvements_pcf_label_in_post_enabled',
  'responsive_web_profile_redirect_enabled',
  'rweb_tipjar_consumption_enabled',
  'verified_phone_label_enabled',
  'creator_subscriptions_tweet_preview_api_enabled',
  'responsive_web_graphql_timeline_navigation_enabled',
  'responsive_web_graphql_skip_user_profile_image_extensions_enabled',
  'premium_content_api_read_enabled',
  'communities_web_enable_tweet_community_results_fetch',
  'c9s_tweet_anatomy_moderator_badge_enabled',
  'responsive_web_grok_analyze_button_fetch_trends_enabled',
  'responsive_web_grok_analyze_post_followups_enabled',
  'responsive_web_jetfuel_frame',
  'responsive_web_grok_share_attachment_enabled',
  'responsive_web_grok_annotations_enabled',
  'articles_preview_enabled',
  'responsive_web_edit_tweet_api_enabled',
  'graphql_is_translatable_rweb_tweet_is_translatable_enabled',
  'view_counts_everywhere_api_enabled',
  'longform_notetweets_consumption_enabled',
  'responsive_web_twitter_article_tweet_consumption_enabled',
  'content_disclosure_indicator_enabled',
  'content_disclosure_ai_generated_indicator_enabled',
  'responsive_web_grok_show_grok_translated_post',
  'responsive_web_grok_analysis_button_from_backend',
  'post_ctas_fetch_enabled',
  'freedom_of_speech_not_reach_fetch_enabled',
  'standardized_nudges_misinfo',
  'tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled',
  'longform_notetweets_rich_text_read_enabled',
  'longform_notetweets_inline_media_enabled',
  'responsive_web_grok_image_annotation_enabled',
  'responsive_web_grok_imagine_annotation_enabled',
  'responsive_web_grok_community_note_auto_translation_is_enabled',
  'responsive_web_enhance_cards_enabled'
];
const X_DEFAULT_TIMELINE_FIELD_TOGGLES = [
  'withPayments',
  'withAuxiliaryUserLabels',
  'withArticleRichContentState',
  'withArticlePlainText',
  'withArticleSummaryText',
  'withArticleVoiceOver',
  'withGrokAnalyze',
  'withDisallowedReplyControls'
];

const extpayBackground = typeof ExtPay === 'function' ? ExtPay(EXTPAY_EXTENSION_ID) : null;
extpayBackground?.startBackground();

const DEFAULT_SETTINGS = {
  storageProvider: PROVIDER_DROPBOX,
  dropboxFolder: '/Twitter Imports',
  googleDriveFolderName: GOOGLE_DRIVE_DEFAULT_FOLDER_NAME,
  autoStartOnPaste: true,
  overwriteExisting: false,
  saveLocalCopies: false,
  localDownloadFolder: 'Tweet Media Archive',
  remoteFolderOptions: []
};

const COOKIE_ATTRIBUTE_NAMES = new Set([
  'domain',
  'path',
  'expires',
  'max-age',
  'samesite',
  'secure',
  'httponly',
  'priority',
  'partitioned'
]);
const X_COOKIE_ALLOWLIST = new Set(['auth_token', 'ct0', 'twid']);
const INSTAGRAM_COOKIE_ALLOWLIST = new Set(['sessionid', 'csrftoken', 'ds_user_id', 'mid', 'ig_did', 'rur']);
const DIRECT_MEDIA_HOSTS = new Set([
  'pbs.twimg.com',
  'video.twimg.com'
]);
const DIRECT_MEDIA_HOST_SUFFIXES = [
  'cdninstagram.com',
  'fbcdn.net',
  'generic_album.com',
  'generic_video.com'
];
const ALLOWED_MEDIA_CONTENT_TYPE_PREFIXES = ['image/', 'video/'];
const ALLOWED_MEDIA_CONTENT_TYPES = new Set(['application/octet-stream', 'binary/octet-stream']);
const GENERIC_ALBUM_MEDIA_FILE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'm4v', 'mov', 'webm']);
const GENERIC_ALBUM_VIDEO_FILE_EXTENSIONS = new Set(['mp4', 'm4v', 'mov', 'webm']);
const GENERIC_VIDEO_VIDEO_FILE_EXTENSIONS = new Set(['mp4']);

let xApiMetadataCache = null;
let xApiMetadataPromise = null;
let xSessionRuleCounter = 0;
let instagramSessionRuleCounter = 0;
let generic_albumSessionRuleCounter = 0;
let activeUploadWorkerCount = 0;
const pendingUploadWorkerResolvers = [];
let activeParallelRangeRequestCount = 0;
const pendingParallelRangeRequestResolvers = [];
let freeUsageQueue = Promise.resolve();
let reservedFreeUploadSlots = 0;
const canceledActiveUploadSessionIds = new Set();

function clampString(value, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback;
}

function normalizeRemoteFolderOptions(value, provider) {
  if (provider === PROVIDER_LOCAL) {
    return [];
  }

  const rawOptions = Array.isArray(value)
    ? value
    : String(value || '').split(/\r?\n/);
  const seen = new Set();

  return rawOptions
    .map((option) => clampString(option, ''))
    .filter(Boolean)
    .map((option) => provider === PROVIDER_GOOGLE_DRIVE
      ? normalizeGoogleDriveFolderName(option)
      : normalizeDropboxFolder(option))
    .filter(Boolean)
    .filter((option) => {
      const key = option.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .slice(0, 30);
}

function normalizeSettings(raw) {
  const merged = { ...DEFAULT_SETTINGS, ...(raw || {}) };
  const storageProvider = normalizeStorageProvider(merged.storageProvider);
  return {
    storageProvider,
    dropboxFolder: normalizeDropboxFolder(merged.dropboxFolder || DEFAULT_SETTINGS.dropboxFolder),
    googleDriveFolderName: normalizeGoogleDriveFolderName(
      merged.googleDriveFolderName || DEFAULT_SETTINGS.googleDriveFolderName
    ),
    autoStartOnPaste: Boolean(merged.autoStartOnPaste),
    overwriteExisting: Boolean(merged.overwriteExisting),
    saveLocalCopies: storageProvider === PROVIDER_LOCAL || Boolean(merged.saveLocalCopies),
    localDownloadFolder: normalizeLocalDownloadFolder(merged.localDownloadFolder, DEFAULT_SETTINGS.localDownloadFolder),
    remoteFolderOptions: normalizeRemoteFolderOptions(merged.remoteFolderOptions, storageProvider)
  };
}

async function getSettings() {
  const stored = await chrome.storage.sync.get(SETTINGS_KEY);
  return normalizeSettings(stored[SETTINGS_KEY]);
}

async function setSettings(nextSettings) {
  const normalized = normalizeSettings(nextSettings);
  await chrome.storage.sync.set({ [SETTINGS_KEY]: normalized });
  return normalized;
}

function normalizeSecrets(raw) {
  return {
    dropboxAppKeyEncrypted: raw?.dropboxAppKeyEncrypted || null,
    googleOAuthClientIdEncrypted: raw?.googleOAuthClientIdEncrypted || null,
    xCookieHeaderEncrypted: raw?.xCookieHeaderEncrypted || null,
    instagramCookieHeaderEncrypted: raw?.instagramCookieHeaderEncrypted || null
  };
}

async function getSecrets() {
  const stored = await chrome.storage.local.get(SECRETS_KEY);
  return normalizeSecrets(stored[SECRETS_KEY]);
}

async function setSecrets(nextSecrets) {
  const normalized = normalizeSecrets(nextSecrets);
  await chrome.storage.local.set({ [SECRETS_KEY]: normalized });
  return normalized;
}

function openSecureDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(SECURE_DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(SECURE_DB_STORE)) {
        db.createObjectStore(SECURE_DB_STORE);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Could not open secure token storage.'));
  });
}

function readDbValue(db, storeName, key) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error || new Error('Could not read secure token storage.'));
  });
}

function writeDbValue(db, storeName, key, value) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(value, key);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || request.error || new Error('Could not write secure token storage.'));
    transaction.onabort = () => reject(transaction.error || request.error || new Error('Could not write secure token storage.'));
  });
}

async function getOrCreateAuthKey() {
  const db = await openSecureDb();
  const existing = await readDbValue(db, SECURE_DB_STORE, SECURE_DB_KEY);
  if (existing) {
    return existing;
  }

  const key = await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256
    },
    false,
    ['encrypt', 'decrypt']
  );

  await writeDbValue(db, SECURE_DB_STORE, SECURE_DB_KEY, key);
  return key;
}

function encodeBase64(bytes) {
  let binary = '';
  for (const value of bytes) {
    binary += String.fromCharCode(value);
  }
  return btoa(binary);
}

function decodeBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

async function encryptSecret(secret) {
  const normalized = clampString(secret, '');
  if (!normalized) {
    return null;
  }

  const key = await getOrCreateAuthKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(normalized);
  const cipherBuffer = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);

  return {
    version: ENCRYPTION_VERSION,
    iv: encodeBase64(iv),
    data: encodeBase64(new Uint8Array(cipherBuffer))
  };
}

async function decryptSecret(payload) {
  if (!payload?.iv || !payload?.data) {
    return '';
  }

  const key = await getOrCreateAuthKey();
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: decodeBase64(payload.iv)
    },
    key,
    decodeBase64(payload.data)
  );

  return new TextDecoder().decode(decrypted);
}

async function setDropboxAppKey(appKey) {
  const normalized = clampString(appKey, '');
  const currentSecrets = await getSecrets();
  await setSecrets({
    ...currentSecrets,
    dropboxAppKeyEncrypted: await encryptSecret(normalized)
  });
  return normalized;
}

async function setGoogleOAuthClientId(clientId) {
  const normalized = clampString(clientId, '');
  const currentSecrets = await getSecrets();
  await setSecrets({
    ...currentSecrets,
    googleOAuthClientIdEncrypted: await encryptSecret(normalized)
  });
  return normalized;
}

function normalizeInlineWhitespace(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseCookieHeaderEntries(rawHeader) {
  return String(rawHeader || '')
    .replace(/^cookie:\s*/i, '')
    .replace(/\r/g, '')
    .replace(/\n+/g, '; ')
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const separatorIndex = part.indexOf('=');
      if (separatorIndex <= 0) {
        return null;
      }

      const name = clampString(part.slice(0, separatorIndex), '');
      const value = part.slice(separatorIndex + 1).trim();
      if (!name || COOKIE_ATTRIBUTE_NAMES.has(name.toLowerCase())) {
        return null;
      }

      return {
        name,
        value
      };
    })
    .filter(Boolean);
}

function parseSetCookieEntries(rawHeader) {
  return String(rawHeader || '')
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^set-cookie\s*:/i.test(line))
    .map((line) => line.replace(/^set-cookie\s*:/i, '').trim())
    .map((line) => line.split(';')[0].trim())
    .map((part) => {
      const separatorIndex = part.indexOf('=');
      if (separatorIndex <= 0) {
        return null;
      }

      return {
        name: clampString(part.slice(0, separatorIndex), ''),
        value: part.slice(separatorIndex + 1).trim()
      };
    })
    .filter((entry) => entry?.name);
}

function parseNetscapeCookieEntries(rawHeader) {
  return String(rawHeader || '')
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => (line.startsWith('#HttpOnly_') ? line.slice('#HttpOnly_'.length) : line))
    .filter((line) => !line.startsWith('#'))
    .map((line) => line.split('\t'))
    .filter((parts) => parts.length >= 7)
    .map((parts) => ({
      name: clampString(parts[5], ''),
      value: parts.slice(6).join('\t').trim()
    }))
    .filter((entry) => entry.name);
}

function normalizeCookieHeader(rawHeader) {
  const input = clampString(rawHeader, '');
  if (!input) {
    return '';
  }

  let entries = [];
  if (/^\s*set-cookie\s*:/im.test(input)) {
    entries = parseSetCookieEntries(input);
  } else if (/(^|\n)\s*#?HttpOnly_|(?:^|\n)[^\n]+\t(?:TRUE|FALSE)\t/i.test(input)) {
    entries = parseNetscapeCookieEntries(input);
  } else {
    entries = parseCookieHeaderEntries(input);
  }

  const cookieMap = new Map();
  entries.forEach((entry) => {
    if (entry?.name) {
      cookieMap.set(entry.name, entry.value);
    }
  });

  return Array.from(cookieMap.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join('; ');
}

function filterCookieHeader(rawHeader, allowedNames) {
  const allowed = allowedNames instanceof Set ? allowedNames : new Set();
  if (!allowed.size) {
    return normalizeCookieHeader(rawHeader);
  }

  const cookieMap = new Map();
  parseCookieHeaderEntries(normalizeCookieHeader(rawHeader)).forEach((entry) => {
    if (allowed.has(entry.name)) {
      cookieMap.set(entry.name, entry.value);
    }
  });

  return Array.from(cookieMap.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join('; ');
}

function normalizeXCookieHeader(rawHeader) {
  return filterCookieHeader(rawHeader, X_COOKIE_ALLOWLIST);
}

function parseNormalizedXCookieHeader(cookieHeader) {
  const normalized = normalizeXCookieHeader(cookieHeader);
  return parseCookieHeaderEntries(normalized);
}

function getXCookieValue(cookieHeader, cookieName) {
  const match = parseNormalizedXCookieHeader(cookieHeader).find((entry) => entry.name === cookieName);
  return match?.value || '';
}

function assertValidXCookieHeader(cookieHeader) {
  const normalized = normalizeXCookieHeader(cookieHeader);
  const authToken = getXCookieValue(normalized, 'auth_token');
  const csrfToken = getXCookieValue(normalized, 'ct0');

  if (!authToken || !csrfToken) {
    throw new Error('That saved X sign-in looks incomplete. Click "Connect my X account" again while signed into x.com or twitter.com in this browser.');
  }

  return normalized;
}

async function setXCookieHeader(cookieHeader) {
  const normalized = assertValidXCookieHeader(cookieHeader);
  const currentSecrets = await getSecrets();
  await setSecrets({
    ...currentSecrets,
    xCookieHeaderEncrypted: await encryptSecret(normalized)
  });
  return normalized;
}

async function getXCookieHeader() {
  const secrets = await getSecrets();
  const decrypted = await decryptSecret(secrets.xCookieHeaderEncrypted);
  if (!decrypted) {
    return '';
  }

  const normalized = assertValidXCookieHeader(decrypted);
  if (normalized !== decrypted) {
    await setXCookieHeader(normalized);
  }
  return normalized;
}

async function clearXCookieHeader() {
  const currentSecrets = await getSecrets();
  await setSecrets({
    ...currentSecrets,
    xCookieHeaderEncrypted: null
  });
}

function normalizeInstagramCookieHeader(rawHeader) {
  return filterCookieHeader(rawHeader, INSTAGRAM_COOKIE_ALLOWLIST);
}

function parseNormalizedInstagramCookieHeader(cookieHeader) {
  const normalized = normalizeInstagramCookieHeader(cookieHeader);
  return parseCookieHeaderEntries(normalized);
}

function getInstagramCookieValue(cookieHeader, cookieName) {
  const match = parseNormalizedInstagramCookieHeader(cookieHeader).find((entry) => entry.name === cookieName);
  return match?.value || '';
}

function assertValidInstagramCookieHeader(cookieHeader) {
  const normalized = normalizeInstagramCookieHeader(cookieHeader);
  const sessionId = getInstagramCookieValue(normalized, 'sessionid');
  const csrfToken = getInstagramCookieValue(normalized, 'csrftoken');

  if (!sessionId || !csrfToken) {
    throw new Error('That saved Instagram sign-in looks incomplete. Click "Connect my Instagram account" again while signed into instagram.com in this browser.');
  }

  return normalized;
}

async function setInstagramCookieHeader(cookieHeader) {
  const normalized = assertValidInstagramCookieHeader(cookieHeader);
  const currentSecrets = await getSecrets();
  await setSecrets({
    ...currentSecrets,
    instagramCookieHeaderEncrypted: await encryptSecret(normalized)
  });
  return normalized;
}

async function getInstagramCookieHeader() {
  const secrets = await getSecrets();
  const decrypted = await decryptSecret(secrets.instagramCookieHeaderEncrypted);
  if (!decrypted) {
    return '';
  }

  const normalized = assertValidInstagramCookieHeader(decrypted);
  if (normalized !== decrypted) {
    await setInstagramCookieHeader(normalized);
  }
  return normalized;
}

async function clearInstagramCookieHeader() {
  const currentSecrets = await getSecrets();
  await setSecrets({
    ...currentSecrets,
    instagramCookieHeaderEncrypted: null
  });
}

async function getUsableXCookieHeader() {
  try {
    return await getXCookieHeader();
  } catch (error) {
    console.warn('Saved X account details could not be read:', error);
    return '';
  }
}

async function getUsableInstagramCookieHeader() {
  try {
    return await getInstagramCookieHeader();
  } catch (error) {
    console.warn('Saved Instagram account details could not be read:', error);
    return '';
  }
}

function getChromeCookies(details) {
  return new Promise((resolve, reject) => {
    chrome.cookies.getAll(details, (cookies) => {
      const runtimeError = chrome.runtime.lastError;
      if (runtimeError) {
        reject(new Error(runtimeError.message));
        return;
      }

      resolve(Array.isArray(cookies) ? cookies : []);
    });
  });
}

async function collectCookieHeaderForSources(cookieSources, allowedNames = null) {
  const cookieMap = new Map();
  const allowed = allowedNames instanceof Set ? allowedNames : null;

  for (const source of cookieSources) {
    const cookies = await getChromeCookies(source);
    cookies
      .filter((cookie) => clampString(cookie?.name, '') && typeof cookie?.value === 'string')
      .filter((cookie) => !allowed || allowed.has(cookie.name))
      .forEach((cookie) => {
        cookieMap.set(cookie.name, cookie.value);
      });
  }

  return Array.from(cookieMap.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join('; ');
}

async function captureCurrentXCookieHeader() {
  const cookieSources = [
    { domain: 'twitter.com' },
    { domain: 'x.com' }
  ];
  const normalized = await collectCookieHeaderForSources(cookieSources, X_COOKIE_ALLOWLIST);

  if (!normalized) {
    throw new Error('We could not find an X account signed in in this browser. Sign in on x.com or twitter.com, then try again.');
  }

  try {
    return await setXCookieHeader(normalized);
  } catch (error) {
    throw new Error('We could not use your current X sign-in from this browser. Sign in on x.com or twitter.com, then try again.');
  }
}

async function captureCurrentInstagramCookieHeader() {
  const cookieSources = [
    { domain: 'instagram.com' }
  ];
  const normalized = await collectCookieHeaderForSources(cookieSources, INSTAGRAM_COOKIE_ALLOWLIST);

  if (!normalized) {
    throw new Error('We could not find an Instagram account signed in in this browser. Sign in on instagram.com, then try again.');
  }

  try {
    return await setInstagramCookieHeader(normalized);
  } catch (error) {
    throw new Error('We could not use your current Instagram sign-in from this browser. Sign in on instagram.com, then try again.');
  }
}

function nextXSessionRuleId() {
  xSessionRuleCounter = (xSessionRuleCounter + 1) % 100000;
  return X_SESSION_RULE_ID_BASE + xSessionRuleCounter;
}

function nextInstagramSessionRuleId() {
  instagramSessionRuleCounter = (instagramSessionRuleCounter + 1) % 100000;
  return INSTAGRAM_SESSION_RULE_ID_BASE + instagramSessionRuleCounter;
}

function nextGenericAlbumSessionRuleId() {
  generic_albumSessionRuleCounter = (generic_albumSessionRuleCounter + 1) % 100000;
  return GENERIC_ALBUM_SESSION_RULE_ID_BASE + generic_albumSessionRuleCounter;
}

function escapeRegex(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function withTemporaryRequestHeaders({ ruleId, regexFilter, requestHeaders }, callback) {
  const rule = {
    id: ruleId,
    priority: 1,
    action: {
      type: 'modifyHeaders',
      requestHeaders
    },
    condition: {
      regexFilter
    }
  };

  await chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: [ruleId],
    addRules: [rule]
  });

  try {
    return await callback();
  } finally {
    try {
      await chrome.declarativeNetRequest.updateSessionRules({
        removeRuleIds: [ruleId]
      });
    } catch {}
  }
}

async function withTemporaryXCookieHeader(cookieHeader, callback) {
  const requestTag = `ttd-${crypto.randomUUID()}`;
  const ruleId = nextXSessionRuleId();
  return withTemporaryRequestHeaders({
    ruleId,
    regexFilter: `^https://x\\.com/i/api/graphql/.*[?&]ttd_x_req=${escapeRegex(requestTag)}(?:&|$)`,
    requestHeaders: [
      {
        header: 'cookie',
        operation: 'set',
        value: cookieHeader
      }
    ]
  }, async () => callback(requestTag));
}

async function withTemporaryReferrerHeader(inputUrl, referrerUrl, callback) {
  const ruleId = nextGenericAlbumSessionRuleId();
  let regexFilter = '^https://[^/]+/.*';
  try {
    const parsed = new URL(inputUrl);
    regexFilter = `^${escapeRegex(parsed.origin)}${escapeRegex(parsed.pathname)}(?:\\?.*)?$`;
  } catch {}

  return withTemporaryRequestHeaders({
    ruleId,
    regexFilter,
    requestHeaders: [
      {
        header: 'referer',
        operation: 'set',
        value: referrerUrl || ''
      }
    ]
  }, callback);
}

function buildXSessionFromCookieHeader(cookieHeader) {
  const cookieEntries = parseNormalizedXCookieHeader(cookieHeader);
  if (!cookieEntries.length) {
    throw new Error('Your saved X account details look empty. Add them again in Setup.');
  }

  return {
    cookieHeader,
    csrfToken: getXCookieValue(cookieHeader, 'ct0')
  };
}

async function getSavedXSession() {
  let cookieHeader = '';
  try {
    cookieHeader = await getXCookieHeader();
  } catch {}

  if (cookieHeader) {
    return buildXSessionFromCookieHeader(cookieHeader);
  }

  return refreshSavedXSessionFromBrowser();
}

async function refreshSavedXSessionFromBrowser() {
  const cookieHeader = await captureCurrentXCookieHeader();
  return buildXSessionFromCookieHeader(cookieHeader);
}

async function withTemporaryInstagramCookieHeader(cookieHeader, callback) {
  const requestTag = `ttd-ig-${crypto.randomUUID()}`;
  const ruleId = nextInstagramSessionRuleId();
  const rule = {
    id: ruleId,
    priority: 1,
    action: {
      type: 'modifyHeaders',
      requestHeaders: [
        {
          header: 'cookie',
          operation: 'set',
          value: cookieHeader
        }
      ]
    },
    condition: {
      regexFilter: `^https://www\\.instagram\\.com/.*[?&]ttd_ig_req=${escapeRegex(requestTag)}(?:&|$)`
    }
  };

  await chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: [ruleId],
    addRules: [rule]
  });

  try {
    return await callback(requestTag);
  } finally {
    try {
      await chrome.declarativeNetRequest.updateSessionRules({
        removeRuleIds: [ruleId]
      });
    } catch {}
  }
}

async function getSavedInstagramSession() {
  const cookieHeader = await getInstagramCookieHeader();
  if (!cookieHeader) {
    throw new Error('Add your Instagram account in Setup first.');
  }

  const cookieEntries = parseNormalizedInstagramCookieHeader(cookieHeader);
  if (!cookieEntries.length) {
    throw new Error('Your saved Instagram account details look empty. Add them again in Setup.');
  }

  return {
    cookieHeader,
    csrfToken: getInstagramCookieValue(cookieHeader, 'csrftoken')
  };
}

async function migrateLegacyDropboxAppKey() {
  const secrets = await getSecrets();
  const existingKey = await decryptSecret(secrets.dropboxAppKeyEncrypted);
  if (existingKey) {
    return existingKey;
  }

  const storedSettings = await chrome.storage.sync.get(SETTINGS_KEY);
  const rawSettings = storedSettings[SETTINGS_KEY] || {};
  const legacySettingsKey = clampString(rawSettings.dropboxAppKey, '');
  if (legacySettingsKey) {
    await setDropboxAppKey(legacySettingsKey);
    await chrome.storage.sync.set({ [SETTINGS_KEY]: normalizeSettings(rawSettings) });
    return legacySettingsKey;
  }

  const storedAuth = await chrome.storage.local.get(AUTH_KEY);
  const rawAuth = storedAuth[AUTH_KEY] || null;
  const legacyAuthKey = clampString(rawAuth?.appKey, '');
  if (legacyAuthKey) {
    await setDropboxAppKey(legacyAuthKey);
    await chrome.storage.local.set({
      [AUTH_KEY]: {
        ...rawAuth,
        appKey: ''
      }
    });
    return legacyAuthKey;
  }

  return '';
}

async function getDropboxAppKey() {
  const secrets = await getSecrets();
  const decrypted = await decryptSecret(secrets.dropboxAppKeyEncrypted);
  if (decrypted) {
    return clampString(decrypted, '');
  }

  return (await migrateLegacyDropboxAppKey()) || DEFAULT_DROPBOX_APP_KEY;
}

async function hasCustomGoogleOAuthClientId() {
  const secrets = await getSecrets();
  return Boolean(clampString(await decryptSecret(secrets.googleOAuthClientIdEncrypted), ''));
}

function getGoogleOAuthClientId() {
  return clampString(chrome.runtime.getManifest()?.oauth2?.client_id, '');
}

function getGoogleOAuthScopes() {
  const scopes = chrome.runtime.getManifest()?.oauth2?.scopes;
  return Array.isArray(scopes) && scopes.length ? scopes : [GOOGLE_DRIVE_SCOPE];
}

function isGoogleOAuthConfigured() {
  const clientId = getGoogleOAuthClientId();
  return Boolean(clientId) && clientId !== GOOGLE_DRIVE_CLIENT_ID_PLACEHOLDER;
}

async function getGoogleBrowserOAuthClientId() {
  const secrets = await getSecrets();
  const savedClientId = await decryptSecret(secrets.googleOAuthClientIdEncrypted);
  return clampString(savedClientId, '') || clampString(GOOGLE_DRIVE_WEB_CLIENT_ID, '');
}

async function isGoogleBrowserOAuthConfigured() {
  const clientId = await getGoogleBrowserOAuthClientId();
  return Boolean(clientId) && clientId !== GOOGLE_DRIVE_WEB_CLIENT_ID_PLACEHOLDER;
}

async function buildStoredAuthRecord(auth) {
  return {
    provider: normalizeStorageProvider(auth?.provider),
    mode: clampString(auth?.mode, 'manual') || 'manual',
    accessTokenEncrypted: await encryptSecret(auth?.accessToken),
    refreshTokenEncrypted: await encryptSecret(auth?.refreshToken),
    expiresAt: Number.isFinite(auth?.expiresAt) ? Number(auth.expiresAt) : null,
    accountName: clampString(auth?.accountName, ''),
    accountEmail: clampString(auth?.accountEmail, '')
  };
}

async function parseStoredAuthRecord(rawAuth, fallbackProvider) {
  if (!rawAuth || typeof rawAuth !== 'object') {
    return null;
  }

  const provider = normalizeStorageProvider(rawAuth.provider || fallbackProvider);
  if (rawAuth.accessToken || rawAuth.refreshToken) {
    const legacyAuth = {
      ...rawAuth,
      provider,
      accessToken: clampString(rawAuth.accessToken, ''),
      refreshToken: clampString(rawAuth.refreshToken, '')
    };
    if (legacyAuth.appKey) {
      await setDropboxAppKey(legacyAuth.appKey);
    }
    return legacyAuth.accessToken ? legacyAuth : null;
  }

  const accessToken = await decryptSecret(rawAuth.accessTokenEncrypted);
  const refreshToken = await decryptSecret(rawAuth.refreshTokenEncrypted);
  if (!accessToken) {
    return null;
  }

  return {
    provider,
    mode: clampString(rawAuth.mode, 'manual') || 'manual',
    accessToken,
    refreshToken,
    expiresAt: Number.isFinite(rawAuth.expiresAt) ? Number(rawAuth.expiresAt) : null,
    accountName: clampString(rawAuth.accountName, ''),
    accountEmail: clampString(rawAuth.accountEmail, '')
  };
}

async function writeAuthStore(authsByProvider) {
  const providers = {};
  for (const provider of CLOUD_STORAGE_PROVIDERS) {
    const auth = authsByProvider?.[provider];
    if (auth?.accessToken) {
      providers[provider] = await buildStoredAuthRecord({
        ...auth,
        provider
      });
    }
  }

  if (!Object.keys(providers).length) {
    await chrome.storage.local.remove(AUTH_KEY);
    return {};
  }

  await chrome.storage.local.set({
    [AUTH_KEY]: {
      version: 2,
      providers
    }
  });
  return providers;
}

async function getAuthStore() {
  const stored = await chrome.storage.local.get(AUTH_KEY);
  const rawAuth = stored[AUTH_KEY] || null;
  const providers = {};
  if (!rawAuth) {
    return providers;
  }

  if (rawAuth.providers && typeof rawAuth.providers === 'object') {
    for (const provider of CLOUD_STORAGE_PROVIDERS) {
      const auth = await parseStoredAuthRecord(rawAuth.providers[provider], provider);
      if (auth?.accessToken) {
        providers[provider] = auth;
      }
    }
    return providers;
  }

  const legacyAuth = await parseStoredAuthRecord(rawAuth, rawAuth.provider);
  if (legacyAuth?.accessToken) {
    providers[legacyAuth.provider] = legacyAuth;
    await writeAuthStore(providers);
  }
  return providers;
}

async function getAuth(provider) {
  const normalizedProvider = normalizeStorageProvider(provider);
  const providers = await getAuthStore();
  return providers[normalizedProvider] || null;
}

async function setAuth(auth) {
  const provider = normalizeStorageProvider(auth?.provider);
  const providers = await getAuthStore();
  providers[provider] = {
    ...auth,
    provider
  };
  await writeAuthStore(providers);
  return auth;
}

async function clearAuth(provider = null) {
  if (!provider) {
    await chrome.storage.local.remove(AUTH_KEY);
    return;
  }

  const normalizedProvider = normalizeStorageProvider(provider);
  const providers = await getAuthStore();
  delete providers[normalizedProvider];
  await writeAuthStore(providers);
}

async function shouldForceDropboxReauthentication() {
  const stored = await chrome.storage.local.get(DROPBOX_FORCE_REAUTH_KEY);
  return Boolean(stored[DROPBOX_FORCE_REAUTH_KEY]);
}

async function setDropboxForceReauthentication(shouldForce) {
  if (shouldForce) {
    await chrome.storage.local.set({ [DROPBOX_FORCE_REAUTH_KEY]: true });
    return;
  }

  await chrome.storage.local.remove(DROPBOX_FORCE_REAUTH_KEY);
}

async function clearDropboxAuth({ forceNextReauthentication = false } = {}) {
  await clearAuth(PROVIDER_DROPBOX);
  await setDropboxForceReauthentication(forceNextReauthentication);
}

function normalizeHistoryEntry(entry) {
  if (!entry || typeof entry !== 'object') {
    return null;
  }

  const inputUrl = clampString(entry.inputUrl, '');
  if (!inputUrl) {
    return null;
  }

  const uploads = Array.isArray(entry.uploads)
    ? entry.uploads
        .map((upload) => ({
          filename: sanitizeFileName(upload?.filename || ''),
          dropboxPath: clampString(upload?.dropboxPath, ''),
          remoteUrl: clampString(upload?.remoteUrl, ''),
          provider: STORAGE_PROVIDERS.includes(upload?.provider) ? upload.provider : '',
          localSavedPath: normalizeLocalDownloadFolder(upload?.localSavedPath, ''),
          localDownloadError: clampString(upload?.localDownloadError, ''),
          sourceUrl: clampString(upload?.sourceUrl, ''),
          contentType: clampString(upload?.contentType, ''),
          size: Number.isFinite(upload?.size) ? Number(upload.size) : 0
        }))
        .filter((upload) => upload.filename)
    : [];

  if (!uploads.length) {
    return null;
  }

  return {
    inputUrl,
    sourceInputUrl: clampString(entry.sourceInputUrl, ''),
    sourceKind: clampString(entry.sourceKind, ''),
    sourceLabel: clampString(entry.sourceLabel, ''),
    uploads,
    createdAt: Number.isFinite(entry.createdAt) ? Number(entry.createdAt) : Date.now()
  };
}

async function getHistory() {
  const stored = await chrome.storage.local.get(HISTORY_KEY);
  const rawEntries = Array.isArray(stored[HISTORY_KEY]) ? stored[HISTORY_KEY] : [];

  return rawEntries
    .map(normalizeHistoryEntry)
    .filter(Boolean)
    .slice(0, HISTORY_LIMIT);
}

async function setHistory(entries) {
  const normalized = Array.isArray(entries)
    ? entries.map(normalizeHistoryEntry).filter(Boolean).slice(0, HISTORY_LIMIT)
    : [];

  await chrome.storage.local.set({ [HISTORY_KEY]: normalized });
  return normalized;
}

async function clearProfileHistoryGroup(payload = {}) {
  const sourceInputUrl = clampString(payload.sourceInputUrl, '');
  const sourceKind = clampString(payload.sourceKind, 'profile-media') || 'profile-media';
  const inputUrls = Array.isArray(payload.inputUrls)
    ? new Set(payload.inputUrls.map((inputUrl) => clampString(inputUrl, '')).filter(Boolean))
    : null;

  if (!sourceInputUrl) {
    return getHistory();
  }

  const existing = await getHistory();
  return setHistory(existing.filter((entry) => {
    if (entry.sourceInputUrl !== sourceInputUrl || entry.sourceKind !== sourceKind) {
      return true;
    }

    return inputUrls ? !inputUrls.has(entry.inputUrl) : false;
  }));
}

async function recordHistoryEntries(results) {
  const successfulEntries = Array.isArray(results)
    ? results
        .filter((entry) => entry?.ok && Array.isArray(entry.uploads) && entry.uploads.length)
        .map((entry) => normalizeHistoryEntry({
          inputUrl: entry.inputUrl,
          sourceInputUrl: entry.sourceInputUrl,
          sourceKind: entry.sourceKind,
          sourceLabel: entry.sourceLabel,
          uploads: entry.uploads,
          createdAt: Date.now()
        }))
        .filter(Boolean)
    : [];

  if (!successfulEntries.length) {
    return getHistory();
  }

  const existing = await getHistory();
  return setHistory([...successfulEntries.reverse(), ...existing]);
}

async function clearHistory() {
  await chrome.storage.local.remove(HISTORY_KEY);
}

function normalizeActiveUploadItem(item) {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const inputUrl = clampString(item.inputUrl, '');
  if (!inputUrl) {
    return null;
  }

  const progress = Math.max(0, Math.min(100, Math.round(Number(item.progress || 0))));
  return {
    id: clampString(item.id, inputUrl) || inputUrl,
    inputUrl,
    status: clampString(item.status, 'queued') || 'queued',
    progress,
    detail: clampString(item.detail, ''),
    error: clampString(item.error, ''),
    createdAt: Number.isFinite(item.createdAt) ? Number(item.createdAt) : Date.now(),
    updatedAt: Number.isFinite(item.updatedAt) ? Number(item.updatedAt) : Date.now()
  };
}

function normalizeActiveUploadSession(session) {
  if (!session || typeof session !== 'object') {
    return null;
  }

  const sourceInputUrl = clampString(session.sourceInputUrl, '');
  if (!sourceInputUrl) {
    return null;
  }

  const items = Array.isArray(session.items)
    ? session.items.map(normalizeActiveUploadItem).filter(Boolean)
    : [];

  return {
    id: clampString(session.id, '') || crypto.randomUUID(),
    sourceInputUrl,
    kind: clampString(session.kind, 'link') || 'link',
    label: clampString(session.label, ''),
    status: clampString(session.status, items.length ? 'running' : 'queued') || 'queued',
    createdAt: Number.isFinite(session.createdAt) ? Number(session.createdAt) : Date.now(),
    updatedAt: Number.isFinite(session.updatedAt) ? Number(session.updatedAt) : Date.now(),
    items
  };
}

function isStaleActiveUploadSession(session, now = Date.now()) {
  const updatedAt = Number(session?.updatedAt || session?.createdAt || 0);
  return Number.isFinite(updatedAt) && updatedAt > 0 && (now - updatedAt) > ACTIVE_UPLOAD_STALE_MS;
}

async function getActiveUploads() {
  const stored = await chrome.storage.local.get(ACTIVE_UPLOADS_KEY);
  const rawSessions = Array.isArray(stored[ACTIVE_UPLOADS_KEY]) ? stored[ACTIVE_UPLOADS_KEY] : [];
  const normalized = rawSessions
    .map(normalizeActiveUploadSession)
    .filter(Boolean);
  const activeSessions = normalized.filter((session) => !isStaleActiveUploadSession(session));

  if (activeSessions.length !== normalized.length) {
    await chrome.storage.local.set({ [ACTIVE_UPLOADS_KEY]: activeSessions });
  }

  return activeSessions
    .sort((left, right) => Number(right.updatedAt || 0) - Number(left.updatedAt || 0));
}

async function setActiveUploads(sessions) {
  const normalized = Array.isArray(sessions)
    ? sessions.map(normalizeActiveUploadSession).filter(Boolean)
    : [];

  await chrome.storage.local.set({ [ACTIVE_UPLOADS_KEY]: normalized });
  return normalized;
}

async function updateActiveUploadSession(sessionId, updater) {
  const sessions = await getActiveUploads();
  const index = sessions.findIndex((session) => session.id === sessionId);
  const current = index >= 0 ? sessions[index] : null;
  const next = normalizeActiveUploadSession(updater(current));

  if (!next) {
    if (index >= 0) {
      sessions.splice(index, 1);
      await setActiveUploads(sessions);
    }
    return null;
  }

  if (index >= 0) {
    sessions[index] = next;
  } else {
    sessions.unshift(next);
  }

  await setActiveUploads(sessions);
  return next;
}

async function removeActiveUploadSession(sessionId) {
  await updateActiveUploadSession(sessionId, () => null);
}

function waitForActiveUploadPoll() {
  return new Promise((resolve) => {
    setTimeout(resolve, ACTIVE_UPLOAD_PAUSE_POLL_MS);
  });
}

async function getActiveUploadSession(sessionId) {
  const sessions = await getActiveUploads();
  return sessions.find((session) => session.id === sessionId) || null;
}

async function setActiveUploadSessionStatus(sessionId, status) {
  return updateActiveUploadSession(sessionId, (current) => {
    if (!current) {
      return null;
    }

    const isPaused = status === 'paused';
    const nextItems = current.items.map((item) => {
      if (!['queued', 'expanding', 'running', 'paused'].includes(item.status)) {
        return item;
      }

      return createActiveUploadItem(item.inputUrl, {
        ...item,
        status: isPaused ? 'paused' : 'queued',
        detail: isPaused ? 'Paused' : (item.detail === 'Paused' ? 'Queued' : item.detail),
        updatedAt: Date.now()
      });
    });

    return {
      ...current,
      status,
      updatedAt: Date.now(),
      items: nextItems
    };
  });
}

async function pauseActiveUploadSession(sessionId) {
  return setActiveUploadSessionStatus(sessionId, 'paused');
}

async function resumeActiveUploadSession(sessionId) {
  return setActiveUploadSessionStatus(sessionId, 'running');
}

async function cancelActiveUploadSession(sessionId) {
  const normalizedSessionId = clampString(sessionId, '');
  if (normalizedSessionId) {
    canceledActiveUploadSessionIds.add(normalizedSessionId);
  }

  return setActiveUploadSessionStatus(sessionId, 'canceled');
}

async function waitForActiveUploadTurn(sessionId) {
  while (true) {
    const session = await getActiveUploadSession(sessionId);
    if (!session || session.status === 'canceled') {
      return 'canceled';
    }

    if (session.status !== 'paused') {
      return 'running';
    }

    await waitForActiveUploadPoll();
  }
}

async function waitForRetryUploadTurn(sessionId) {
  while (true) {
    const session = await getActiveUploadSession(sessionId);
    if (!session) {
      return canceledActiveUploadSessionIds.has(sessionId) ? 'canceled' : 'running';
    }

    if (session.status === 'canceled') {
      canceledActiveUploadSessionIds.add(sessionId);
      return 'canceled';
    }

    if (session.status !== 'paused') {
      return 'running';
    }

    await waitForActiveUploadPoll();
  }
}

async function isActiveUploadSessionCanceled(sessionId) {
  const session = await getActiveUploadSession(sessionId);
  return !session || session.status === 'canceled';
}

async function isRetryUploadSessionCanceled(sessionId) {
  if (canceledActiveUploadSessionIds.has(sessionId)) {
    return true;
  }

  const session = await getActiveUploadSession(sessionId);
  if (session?.status === 'canceled') {
    canceledActiveUploadSessionIds.add(sessionId);
    return true;
  }

  return false;
}

function formatPlanCurrency(unitAmountCents, currency) {
  const amount = Number(unitAmountCents);
  const normalizedCurrency = clampString(currency, '').toUpperCase();
  if (!Number.isFinite(amount) || !normalizedCurrency) {
    return '';
  }

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: normalizedCurrency
    }).format(amount / 100);
  } catch {
    return '';
  }
}

function formatPlanInterval(interval, intervalCount) {
  const normalizedInterval = clampString(interval, '').toLowerCase();
  const count = Math.max(1, Math.floor(Number(intervalCount || 1)));

  if (!normalizedInterval) {
    return '';
  }

  if (normalizedInterval === 'once') {
    return ' one-time';
  }

  const plural = count === 1 ? normalizedInterval : `${normalizedInterval}s`;
  return count === 1 ? `/${normalizedInterval}` : ` every ${count} ${plural}`;
}

function formatPlanDisplayLabel(plan) {
  const amount = formatPlanCurrency(plan?.unitAmountCents, plan?.currency);
  const interval = formatPlanInterval(plan?.interval, plan?.intervalCount);

  if (!amount || !interval) {
    return '';
  }

  return `${amount}${interval}`;
}

function getPlanSortOrder(plan) {
  const interval = clampString(plan?.interval, '').toLowerCase();
  switch (interval) {
    case 'month':
      return 0;
    case 'quarter':
      return 1;
    case 'year':
      return 2;
    case 'once':
      return 3;
    default:
      return 4;
  }
}

function buildUnlockPlanDetails(plans) {
  if (!Array.isArray(plans) || !plans.length) {
    return {
      unlockPriceLabel: '',
      unlockPlanSummary: '',
      hasMultipleUnlockPlans: false
    };
  }

  const planEntries = plans
    .map((plan) => ({
      plan,
      label: formatPlanDisplayLabel(plan)
    }))
    .filter((entry) => Boolean(entry.label))
    .sort((left, right) => {
      const orderDifference = getPlanSortOrder(left.plan) - getPlanSortOrder(right.plan);
      if (orderDifference !== 0) {
        return orderDifference;
      }

      return Number(left.plan?.unitAmountCents || 0) - Number(right.plan?.unitAmountCents || 0);
    });

  const labels = [...new Set(planEntries.map((entry) => entry.label))];
  const [primaryLabel = ''] = labels;

  return {
    unlockPriceLabel: primaryLabel,
    unlockPlanSummary: labels.join(' or '),
    hasMultipleUnlockPlans: labels.length > 1
  };
}

function buildUpgradeRequiredMessage(usage) {
  const summary = clampString(usage?.unlockPlanSummary || usage?.unlockPriceLabel, '');
  return summary
    ? `Free limit reached. Unlock unlimited uploads with ${summary}.`
    : 'Free limit reached. Unlock unlimited uploads to continue.';
}

function normalizeUsageState(raw) {
  const freeUploadCount = Math.max(0, Math.floor(Number(raw?.freeUploadCount || 0)));
  const paid = Boolean(raw?.paid);
  const remainingFreeUploads = Math.max(0, FREE_UPLOAD_LIMIT - freeUploadCount);

  return {
    freeUploadCount,
    freeUploadLimit: FREE_UPLOAD_LIMIT,
    remainingFreeUploads,
    paid,
    paymentEmail: clampString(raw?.paymentEmail, ''),
    lastEntitlementSyncAt: Number.isFinite(raw?.lastEntitlementSyncAt)
      ? Number(raw.lastEntitlementSyncAt)
      : null,
    unlockPriceLabel: clampString(raw?.unlockPriceLabel, ''),
    unlockPlanSummary: clampString(raw?.unlockPlanSummary, ''),
    hasMultipleUnlockPlans: Boolean(raw?.hasMultipleUnlockPlans),
    limitReached: !paid && remainingFreeUploads <= 0,
    lowFreeUploads: !paid && remainingFreeUploads > 0 && remainingFreeUploads <= 3
  };
}

function normalizeSyncedUsageState(raw) {
  return {
    freeUploadCount: Math.max(0, Math.floor(Number(raw?.freeUploadCount || 0)))
  };
}

function toStoredUsageState(normalized) {
  return {
    freeUploadCount: normalized.freeUploadCount,
    paid: normalized.paid,
    paymentEmail: normalized.paymentEmail,
    lastEntitlementSyncAt: normalized.lastEntitlementSyncAt,
    unlockPriceLabel: normalized.unlockPriceLabel,
    unlockPlanSummary: normalized.unlockPlanSummary,
    hasMultipleUnlockPlans: normalized.hasMultipleUnlockPlans
  };
}

function toStoredSyncedUsageState(normalized) {
  return {
    freeUploadCount: normalized.freeUploadCount
  };
}

async function getSyncedUsageState() {
  try {
    const stored = await chrome.storage.sync.get(USAGE_SYNC_KEY);
    return normalizeSyncedUsageState(stored[USAGE_SYNC_KEY]);
  } catch {
    return normalizeSyncedUsageState(null);
  }
}

async function mirrorUsageStateToSync(normalized) {
  try {
    await chrome.storage.sync.set({
      [USAGE_SYNC_KEY]: toStoredSyncedUsageState(normalized)
    });
  } catch {}
}

async function getUsageState() {
  const [storedLocal, syncedUsage] = await Promise.all([
    chrome.storage.local.get(USAGE_KEY),
    getSyncedUsageState()
  ]);
  const localUsage = normalizeUsageState(storedLocal[USAGE_KEY]);
  const mergedUsage = normalizeUsageState({
    ...localUsage,
    freeUploadCount: Math.max(localUsage.freeUploadCount, syncedUsage.freeUploadCount)
  });

  if (localUsage.freeUploadCount !== mergedUsage.freeUploadCount) {
    await chrome.storage.local.set({
      [USAGE_KEY]: toStoredUsageState(mergedUsage)
    });
  }

  if (syncedUsage.freeUploadCount !== mergedUsage.freeUploadCount) {
    await mirrorUsageStateToSync(mergedUsage);
  }

  return mergedUsage;
}

async function setUsageState(nextUsage) {
  const normalized = normalizeUsageState(nextUsage);
  await chrome.storage.local.set({
    [USAGE_KEY]: toStoredUsageState(normalized)
  });
  await mirrorUsageStateToSync(normalized);
  return normalized;
}

function createExtPayClient() {
  if (typeof ExtPay !== 'function') {
    throw new Error('The official payment bridge is not included in this source checkout. Use an official packaged release to unlock paid plans.');
  }

  return ExtPay(EXTPAY_EXTENSION_ID);
}

async function syncUsageWithExtPayUser(user) {
  const currentUsage = await getUsageState();
  const nextPaid = Boolean(user?.paid);
  const nextPaymentEmail = clampString(user?.email, '');

  if (currentUsage.paid === nextPaid && currentUsage.paymentEmail === nextPaymentEmail) {
    return currentUsage;
  }

  return setUsageState({
    ...currentUsage,
    paid: nextPaid,
    paymentEmail: nextPaymentEmail,
    lastEntitlementSyncAt: Date.now()
  });
}

async function refreshPaymentState() {
  const currentUsage = await getUsageState();
  let nextUsage = currentUsage;

  try {
    const user = await createExtPayClient().getUser();
    nextUsage = await syncUsageWithExtPayUser(user);
  } catch {}

  try {
    const plans = await createExtPayClient().getPlans();
    const planDetails = buildUnlockPlanDetails(plans);
    if (
      planDetails.unlockPriceLabel !== nextUsage.unlockPriceLabel
      || planDetails.unlockPlanSummary !== nextUsage.unlockPlanSummary
      || planDetails.hasMultipleUnlockPlans !== nextUsage.hasMultipleUnlockPlans
    ) {
      nextUsage = await setUsageState({
        ...nextUsage,
        unlockPriceLabel: planDetails.unlockPriceLabel,
        unlockPlanSummary: planDetails.unlockPlanSummary,
        hasMultipleUnlockPlans: planDetails.hasMultipleUnlockPlans
      });
    }
  } catch {}

  return nextUsage;
}

async function requestPaymentStateRefresh() {
  await chrome.storage.local.set({ [PAYMENT_REFRESH_REQUESTED_KEY]: Date.now() });
}

async function clearPaymentStateRefreshRequest() {
  await chrome.storage.local.remove(PAYMENT_REFRESH_REQUESTED_KEY);
}

async function shouldRefreshPaymentStateForPopup() {
  const stored = await chrome.storage.local.get(PAYMENT_REFRESH_REQUESTED_KEY);
  const requestedAt = Number(stored[PAYMENT_REFRESH_REQUESTED_KEY] || 0);
  if (!Number.isFinite(requestedAt) || requestedAt <= 0) {
    return false;
  }

  if ((Date.now() - requestedAt) > PAYMENT_REFRESH_REQUEST_TTL_MS) {
    await clearPaymentStateRefreshRequest();
    return false;
  }

  return true;
}

async function getPopupUsageState() {
  let usage = await getUsageState();
  if (!(await shouldRefreshPaymentStateForPopup())) {
    return usage;
  }

  usage = await refreshPaymentState();
  if (usage.paid) {
    await clearPaymentStateRefreshRequest();
  }
  return usage;
}

async function recordSuccessfulUsage(successfulInputs) {
  const increment = Math.max(0, Math.floor(Number(successfulInputs || 0)));
  if (!increment) {
    return getUsageState();
  }

  const currentUsage = await getUsageState();
  if (currentUsage.freeUploadCount >= FREE_UPLOAD_LIMIT) {
    return currentUsage;
  }

  return setUsageState({
    ...currentUsage,
    freeUploadCount: Math.min(FREE_UPLOAD_LIMIT, currentUsage.freeUploadCount + increment)
  });
}

async function withFreeUsageLock(operation) {
  const run = freeUsageQueue.then(operation, operation);
  freeUsageQueue = run.catch(() => {});
  return run;
}

async function reserveFreeUploadSlot() {
  return withFreeUsageLock(async () => {
    const usage = await getUsageState();
    if (usage.paid) {
      return {
        ok: true,
        paid: true,
        reserved: false,
        released: true,
        usage
      };
    }

    if ((usage.remainingFreeUploads - reservedFreeUploadSlots) <= 0) {
      return {
        ok: false,
        paid: false,
        reserved: false,
        released: true,
        usage
      };
    }

    reservedFreeUploadSlots += 1;
    return {
      ok: true,
      paid: false,
      reserved: true,
      released: false,
      usage
    };
  });
}

async function finishFreeUploadSlot(reservation, didSucceed) {
  return withFreeUsageLock(async () => {
    if (!reservation?.reserved || reservation.released) {
      return getUsageState();
    }

    reservation.released = true;
    try {
      return didSucceed ? await recordSuccessfulUsage(1) : await getUsageState();
    } finally {
      reservedFreeUploadSlots = Math.max(0, reservedFreeUploadSlots - 1);
    }
  });
}

async function runWithConcurrency(items, limit, worker) {
  const list = Array.isArray(items) ? items : [];
  const concurrency = Math.min(Math.max(1, Number(limit || 1)), list.length || 1);
  const errors = [];
  let nextIndex = 0;

  async function runWorker() {
    while (nextIndex < list.length) {
      const index = nextIndex;
      nextIndex += 1;
      try {
        await worker(list[index], index);
      } catch (error) {
        errors.push(error);
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => runWorker()));
  if (errors.length) {
    throw errors[0];
  }
}

async function acquireUploadWorkerSlot() {
  if (activeUploadWorkerCount >= MAX_CONCURRENT_ACTIVE_UPLOADS) {
    await new Promise((resolve) => pendingUploadWorkerResolvers.push(resolve));
    return;
  }
  activeUploadWorkerCount += 1;
}

function releaseUploadWorkerSlot() {
  const resolve = pendingUploadWorkerResolvers.shift();
  if (resolve) {
    resolve();
    return;
  }
  activeUploadWorkerCount = Math.max(0, activeUploadWorkerCount - 1);
}

async function acquireParallelRangeRequestSlot() {
  if (activeParallelRangeRequestCount >= MAX_CONCURRENT_PARALLEL_RANGE_REQUESTS) {
    await new Promise((resolve) => pendingParallelRangeRequestResolvers.push(resolve));
    return;
  }
  activeParallelRangeRequestCount += 1;
}

function releaseParallelRangeRequestSlot() {
  const resolve = pendingParallelRangeRequestResolvers.shift();
  if (resolve) {
    resolve();
    return;
  }
  activeParallelRangeRequestCount = Math.max(0, activeParallelRangeRequestCount - 1);
}

function authSummary(auth) {
  if (!auth?.accessToken) {
    return {
      connected: false,
      provider: null,
      mode: null,
      accountLabel: '',
      expiresAt: null
    };
  }

  const provider = normalizeStorageProvider(auth.provider);
  const parts = [];
  if (auth.accountName) parts.push(auth.accountName);
  if (auth.accountEmail) parts.push(auth.accountEmail);

  return {
    connected: true,
    provider,
    mode: auth.mode || 'manual',
    accountLabel: parts.join(' - ') || (provider === PROVIDER_GOOGLE_DRIVE ? 'Google Drive connected' : 'Dropbox connected'),
    expiresAt: Number.isFinite(auth.expiresAt) ? auth.expiresAt : null
  };
}

function isDropboxAuthError(error) {
  const message = error instanceof Error ? error.message : String(error || '');
  return /expired_access_token|invalid_access_token|invalid_grant|missing_scope|401\b/i.test(message);
}

function isGoogleDriveAuthError(error) {
  const message = error instanceof Error ? error.message : String(error || '');
  return /invalid.?token|invalid_grant|invalid credentials|login required|unauthorized|401\b/i.test(message);
}

function normalizeStorageProvider(value) {
  if (value === PROVIDER_GOOGLE_DRIVE) return PROVIDER_GOOGLE_DRIVE;
  if (value === PROVIDER_LOCAL) return PROVIDER_LOCAL;
  return PROVIDER_DROPBOX;
}

function normalizeDropboxFolder(input) {
  const trimmed = clampString(input, DEFAULT_SETTINGS.dropboxFolder)
    .replace(/\\/g, '/')
    .replace(/\/+/g, '/');

  if (!trimmed || trimmed === '/') return '/';
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

function normalizeGoogleDriveFolderName(input) {
  const normalized = clampString(input, GOOGLE_DRIVE_DEFAULT_FOLDER_NAME)
    .replace(/\\/g, '/')
    .replace(/\/+/g, '/');

  const segments = normalized
    .split('/')
    .map((segment) => clampString(segment, ''))
    .filter(Boolean)
    .filter((segment) => segment !== '.' && segment !== '..')
    .map((segment) => sanitizeFileName(segment));

  return segments.join('/') || GOOGLE_DRIVE_DEFAULT_FOLDER_NAME;
}

function normalizeLocalDownloadFolder(input, fallback = DEFAULT_SETTINGS.localDownloadFolder) {
  const normalized = clampString(input, fallback)
    .replace(/\\/g, '/')
    .replace(/\/+/g, '/');

  const segments = normalized
    .split('/')
    .map((segment) => clampString(segment, ''))
    .filter(Boolean)
    .filter((segment) => segment !== '.' && segment !== '..')
    .map((segment) => sanitizeFileName(segment));

  return segments.join('/');
}

function joinDropboxPath(folder, filename) {
  const base = normalizeDropboxFolder(folder);
  const cleanName = sanitizeFileName(filename || 'download.bin');
  if (base === '/') return `/${cleanName}`;
  return `${base}/${cleanName}`.replace(/\/+/g, '/');
}

function getDropboxFolderSegments(folder) {
  return normalizeDropboxFolder(folder)
    .split('/')
    .map((segment) => clampString(segment, ''))
    .filter(Boolean)
    .filter((segment) => segment !== '.' && segment !== '..');
}

function buildDropboxWebUrl(filePath) {
  const normalizedPath = normalizeDropboxFolder(filePath);
  if (normalizedPath === '/') {
    return 'https://www.dropbox.com/home';
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

function joinGoogleDriveDisplayPath(folderName, filename) {
  const base = normalizeGoogleDriveFolderName(folderName);
  const cleanName = sanitizeFileName(filename || 'download.bin');
  return `${base}/${cleanName}`.replace(/\/+/g, '/');
}

function joinLocalDownloadPath(folder, filename) {
  const cleanName = sanitizeFileName(filename || 'download.bin');
  const base = normalizeLocalDownloadFolder(folder, '');
  return base ? `${base}/${cleanName}` : cleanName;
}

function sanitizeFileName(name) {
  return String(name || 'download.bin')
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180) || 'download.bin';
}

function extractExtensionFromUrl(inputUrl, fallback = 'bin') {
  try {
    const parsed = new URL(inputUrl);
    const pathname = parsed.pathname || '';
    const match = pathname.match(/\.([a-z0-9]{2,5})(?:$|\?)/i);
    return match ? match[1].toLowerCase() : fallback;
  } catch {
    return fallback;
  }
}

function guessExtensionFromContentType(contentType, fallback = 'bin') {
  const normalized = String(contentType || '').toLowerCase();
  if (normalized.includes('jpeg')) return 'jpg';
  if (normalized.includes('png')) return 'png';
  if (normalized.includes('gif')) return 'gif';
  if (normalized.includes('webp')) return 'webp';
  if (normalized.includes('mp4')) return 'mp4';
  if (normalized.includes('quicktime')) return 'mov';
  if (normalized.includes('mpeg')) return 'mpg';
  return fallback;
}

function guessContentTypeFromExtension(extension, fallback = 'application/octet-stream') {
  switch (String(extension || '').toLowerCase()) {
    case 'mp4':
    case 'm4v':
      return 'video/mp4';
    case 'mov':
      return 'video/quicktime';
    case 'webm':
      return 'video/webm';
    default:
      return fallback;
  }
}

function stripQueryAndHash(value) {
  try {
    const parsed = new URL(value);
    parsed.search = '';
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return value;
  }
}

function collectUrls(rawText) {
  const matches = String(rawText || '').match(/https?:\/\/[^\s<>"']+/gi) || [];
  const normalized = [];
  const seen = new Set();

  for (const raw of matches) {
    let url;
    try {
      url = new URL(raw);
    } catch {
      continue;
    }

    const key = url.toString();
    if (seen.has(key)) continue;
    seen.add(key);
    normalized.push(key);
  }

  return normalized;
}

function extractTweetId(inputUrl) {
  try {
    const parsed = new URL(inputUrl);
    const host = parsed.hostname.replace(/^www\./, '');
    if (!/(^|\.)x\.com$|(^|\.)twitter\.com$/.test(host)) return null;
    const match = parsed.pathname.match(/\/status\/(\d+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

function extractBookmarkInfo(inputUrl) {
  try {
    const parsed = new URL(inputUrl);
    const host = parsed.hostname.replace(/^www\./, '');
    if (!/(^|\.)x\.com$|(^|\.)twitter\.com$/.test(host)) {
      return null;
    }

    const match = parsed.pathname.match(/^\/i\/bookmarks(?:\/(\d+))?\/?$/);
    if (!match) {
      return null;
    }

    return {
      folderId: clampString(match[1], ''),
      canonicalUrl: match[1]
        ? `https://x.com/i/bookmarks/${match[1]}`
        : 'https://x.com/i/bookmarks'
    };
  } catch {
    return null;
  }
}

function extractProfileMediaInfo(inputUrl) {
  try {
    const parsed = new URL(inputUrl);
    const host = parsed.hostname.replace(/^www\./, '');
    if (!/(^|\.)x\.com$|(^|\.)twitter\.com$/.test(host)) {
      return null;
    }

    const match = parsed.pathname.match(/^\/([A-Za-z0-9_]{1,15})\/media\/?$/);
    if (!match) {
      return null;
    }

    const username = clampString(match[1], '');
    if (!username || /^(home|explore|notifications|messages|search|settings|compose|i)$/i.test(username)) {
      return null;
    }

    return {
      username,
      canonicalUrl: `https://x.com/${username}/media`
    };
  } catch {
    return null;
  }
}

function extractInstagramPostInfo(inputUrl) {
  try {
    const parsed = new URL(inputUrl);
    const host = parsed.hostname.replace(/^www\./, '');
    if (!/(^|\.)instagram\.com$/.test(host)) return null;

    const match = parsed.pathname.match(/^\/(p|reel|reels|tv)\/([A-Za-z0-9_-]+)/);
    if (!match) {
      return null;
    }

    const kind = match[1] === 'reels' ? 'reel' : match[1];
    const shortcode = clampString(match[2], '');
    if (!shortcode) {
      return null;
    }

    return {
      kind,
      shortcode,
      canonicalUrl: `${INSTAGRAM_HOME_URL}${kind}/${shortcode}/`
    };
  } catch {
    return null;
  }
}

function extractGenericAlbumAlbumInfo(inputUrl) {
  try {
    const parsed = new URL(inputUrl);
    const host = parsed.hostname.replace(/^www\./, '');
    if (!/(^|\.)generic_album\.com$/.test(host)) {
      return null;
    }

    const match = parsed.pathname.match(/^\/a\/([A-Za-z0-9_-]+)\/?$/);
    if (!match) {
      return null;
    }

    const albumId = clampString(match[1], '');
    if (!albumId) {
      return null;
    }

    return {
      albumId,
      canonicalUrl: `${GENERIC_ALBUM_HOME_URL}a/${albumId}`
    };
  } catch {
    return null;
  }
}

function extractGenericVideoVideoInfo(inputUrl) {
  try {
    const parsed = new URL(inputUrl);
    const host = parsed.hostname.replace(/^www\./, '');
    if (!/(^|\.)generic_video\.com$/.test(host)) {
      return null;
    }

    const match = parsed.pathname.match(/^\/video-([A-Za-z0-9]+)(?:\/([^/]+))?\/?$/);
    if (!match) {
      return null;
    }

    const videoId = clampString(match[1], '');
    if (!videoId) {
      return null;
    }

    const slug = clampString(match[2], '');
    return {
      videoId,
      canonicalUrl: `${GENERIC_VIDEO_HOME_URL}video-${videoId}/${slug ? `${slug}/` : ''}`
    };
  } catch {
    return null;
  }
}

function normalizeHostname(hostname) {
  return String(hostname || '')
    .replace(/^\[/, '')
    .replace(/\]$/, '')
    .toLowerCase();
}

function isIpv4Address(hostname) {
  const parts = normalizeHostname(hostname).split('.');
  if (parts.length !== 4) {
    return false;
  }

  return parts.every((part) => /^\d+$/.test(part) && Number(part) >= 0 && Number(part) <= 255);
}

function isPrivateOrLocalHostname(hostname) {
  const host = normalizeHostname(hostname);
  if (!host) {
    return true;
  }

  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local')) {
    return true;
  }

  if (host === '::1' || host.startsWith('fc') || host.startsWith('fd') || host.startsWith('fe80:')) {
    return true;
  }

  if (!isIpv4Address(host)) {
    return false;
  }

  const parts = host.split('.').map((part) => Number(part));
  const [first, second] = parts;
  return first === 0
    || first === 10
    || first === 127
    || first >= 224
    || (first === 100 && second >= 64 && second <= 127)
    || (first === 169 && second === 254)
    || (first === 172 && second >= 16 && second <= 31)
    || (first === 192 && second === 168)
    || (first === 198 && (second === 18 || second === 19));
}

function hostMatchesDomain(hostname, domain) {
  const host = normalizeHostname(hostname);
  const normalizedDomain = normalizeHostname(domain);
  return host === normalizedDomain || host.endsWith(`.${normalizedDomain}`);
}

function isKnownDirectMediaHost(hostname) {
  const host = normalizeHostname(hostname);
  return DIRECT_MEDIA_HOSTS.has(host)
    || DIRECT_MEDIA_HOST_SUFFIXES.some((domain) => hostMatchesDomain(host, domain));
}

function assertAllowedDownloadUrl(inputUrl) {
  let parsed;
  try {
    parsed = new URL(inputUrl);
  } catch {
    throw new Error('That media URL is not valid.');
  }

  if (parsed.protocol !== 'https:') {
    throw new Error('Only HTTPS media URLs can be downloaded.');
  }

  if (isPrivateOrLocalHostname(parsed.hostname)) {
    throw new Error('Local or private-network URLs cannot be downloaded.');
  }

  if (!isKnownDirectMediaHost(parsed.hostname)) {
    throw new Error('Direct media URLs are limited to supported media hosts. Paste an X, Twitter, Instagram, GenericAlbum, or GenericVideo link instead.');
  }

  return parsed;
}

function getTweetToken(tweetId) {
  const bigId = BigInt(tweetId);
  const hi = Number(bigId / BIG_INT_SCALE);
  const lo = Number(bigId % BIG_INT_SCALE) / 1e15;
  return ((hi + lo) * Math.PI).toString(36).replace(/(0+|\.)/g, '');
}

function buildDropboxAuthUrl(appKey, redirectUrl, codeChallenge, { forceReauthentication = false, state = '' } = {}) {
  const url = new URL(DROPBOX_AUTHORIZE_URL);
  url.searchParams.set('client_id', appKey);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('token_access_type', 'offline');
  url.searchParams.set('force_reapprove', 'true');
  if (forceReauthentication) {
    url.searchParams.set('force_reauthentication', 'true');
  }
  url.searchParams.set('code_challenge_method', 'S256');
  url.searchParams.set('code_challenge', codeChallenge);
  url.searchParams.set('redirect_uri', redirectUrl);
  if (state) {
    url.searchParams.set('state', state);
  }
  return url.toString();
}

function getDropboxRedirectUrl(appKey) {
  return appKey === DEFAULT_DROPBOX_APP_KEY
    ? DEFAULT_DROPBOX_REDIRECT_URL
    : chrome.identity.getRedirectURL('dropbox');
}

function getDropboxAuthAttempts(primaryAppKey) {
  const appKeys = [primaryAppKey];
  if (primaryAppKey !== DEFAULT_DROPBOX_APP_KEY) {
    appKeys.push(DEFAULT_DROPBOX_APP_KEY);
  }

  return appKeys.flatMap((appKey) => {
    const redirectUrls = [getDropboxRedirectUrl(appKey)];
    const runtimeRedirectUrl = appKey === DEFAULT_DROPBOX_APP_KEY
      ? ''
      : chrome.identity.getRedirectURL('dropbox');
    if (runtimeRedirectUrl && !redirectUrls.includes(runtimeRedirectUrl)) {
      redirectUrls.push(runtimeRedirectUrl);
    }

    return redirectUrls.map((redirectUrl) => ({ appKey, redirectUrl }));
  });
}

function isRetryableDropboxAuthError(error) {
  const message = error instanceof Error ? error.message : String(error || '');
  return /authorization page could not be loaded|invalid_app|invalid[_\s-]?redirect[_\s-]?uri|redirect uri|invalid_client/i.test(message);
}

function assertExpectedOAuthCallbackUrl(callbackUrl, expectedRedirectUrl) {
  const parsed = new URL(callbackUrl);
  const expected = new URL(expectedRedirectUrl);
  if (parsed.origin !== expected.origin || parsed.pathname !== expected.pathname) {
    throw new Error('The OAuth callback did not match this extension. Try connecting again.');
  }
  return parsed;
}

function buildGoogleDriveAuthUrl({ clientId, redirectUrl, responseType = 'token', codeChallenge = '', state }) {
  const url = new URL(GOOGLE_OAUTH_AUTHORIZE_URL);
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUrl);
  url.searchParams.set('response_type', responseType);
  url.searchParams.set('include_granted_scopes', 'true');
  url.searchParams.set('scope', getGoogleOAuthScopes().join(' '));
  url.searchParams.set('state', state);

  if (responseType === 'code') {
    url.searchParams.set('access_type', 'offline');
    url.searchParams.set('prompt', 'consent');
    url.searchParams.set('code_challenge_method', 'S256');
    url.searchParams.set('code_challenge', codeChallenge);
  }

  return url.toString();
}

function createCodeVerifier() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return base64UrlEncode(bytes);
}

async function createCodeChallenge(verifier) {
  const encoded = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return base64UrlEncode(new Uint8Array(digest));
}

function base64UrlEncode(bytes) {
  let binary = '';
  for (const value of bytes) {
    binary += String.fromCharCode(value);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function fetchJsonResponse(url, init = {}) {
  const response = await fetch(url, init);
  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  return {
    response,
    text,
    data
  };
}

async function fetchJson(url, init = {}) {
  const { response, text, data } = await fetchJsonResponse(url, init);

  if (!response.ok) {
    const message = data?.error?.message || data?.error_summary || data?.error_description || text || `Request failed with ${response.status}`;
    throw new Error(message);
  }

  return data;
}

function extractXMainScriptUrl(html) {
  const match = String(html || '').match(/https:\/\/abs\.twimg\.com\/responsive-web\/client-web\/main\.[^"]+\.js/);
  return match ? match[0] : '';
}

function extractXBearerToken(scriptText) {
  const match = String(scriptText || '').match(/Bearer ([A-Za-z0-9%_-]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

function parseQuotedStringArray(rawItems) {
  return Array.from(String(rawItems || '').matchAll(/"([^"]+)"/g), (match) => match[1])
    .filter(Boolean);
}

function extractXOperationMetadata(scriptText, operationName) {
  const escapedName = escapeRegex(operationName);
  const pattern = new RegExp(
    `queryId:"([^"]+)",operationName:"${escapedName}",operationType:"[^"]+",metadata:\\{featureSwitches:\\[([^\\]]*)\\],fieldToggles:\\[([^\\]]*)\\]`
  );
  const match = String(scriptText || '').match(pattern);
  if (!match) {
    return null;
  }

  return {
    queryId: match[1],
    featureSwitches: parseQuotedStringArray(match[2]),
    fieldToggles: parseQuotedStringArray(match[3])
  };
}

function createFallbackXOperationMetadata(queryId, featureSwitches = X_DEFAULT_TIMELINE_FEATURE_SWITCHES, fieldToggles = X_DEFAULT_TIMELINE_FIELD_TOGGLES) {
  return {
    queryId,
    featureSwitches,
    fieldToggles
  };
}

function mergeXOperationMetadata(fallback, nextMetadata) {
  return {
    queryId: nextMetadata?.queryId || fallback.queryId,
    featureSwitches: nextMetadata?.featureSwitches?.length
      ? nextMetadata.featureSwitches
      : fallback.featureSwitches,
    fieldToggles: nextMetadata?.fieldToggles?.length
      ? nextMetadata.fieldToggles
      : fallback.fieldToggles
  };
}

function buildXToggleObject(names) {
  return (Array.isArray(names) ? names : [])
    .filter(Boolean)
    .reduce((toggles, name) => ({
      ...toggles,
      [name]: true
    }), {});
}

function addXGraphQLMetadataParams(url, operationMetadata) {
  url.searchParams.set('features', JSON.stringify(buildXToggleObject(operationMetadata?.featureSwitches)));
  url.searchParams.set('fieldToggles', JSON.stringify(buildXToggleObject(operationMetadata?.fieldToggles)));
}

function extractXChunkScriptUrl(html, chunkName) {
  const escapedChunkName = escapeRegex(chunkName);
  const chunkId = String(html || '').match(new RegExp(`(\\d+):"${escapedChunkName}"`))?.[1] || '';
  if (!chunkId) {
    return '';
  }

  const hash = String(html || '').match(new RegExp(`${escapeRegex(chunkId)}:"([a-z0-9]+)"`))?.[1] || '';
  return hash ? `https://abs.twimg.com/responsive-web/client-web/${chunkName}.${hash}a.js` : '';
}

async function getXApiMetadata() {
  if (xApiMetadataCache && (Date.now() - xApiMetadataCache.cachedAt) < X_API_METADATA_TTL_MS) {
    return xApiMetadataCache;
  }

  if (xApiMetadataPromise) {
    return xApiMetadataPromise;
  }

  xApiMetadataPromise = (async () => {
    const fallbackTweetResult = createFallbackXOperationMetadata(X_DEFAULT_TWEET_RESULT_QUERY_ID);
    const fallbackBookmarks = createFallbackXOperationMetadata(X_DEFAULT_BOOKMARKS_QUERY_ID);
    const fallbackBookmarkFolder = createFallbackXOperationMetadata(X_DEFAULT_BOOKMARK_FOLDER_QUERY_ID);
    const fallbackUserByScreenName = createFallbackXOperationMetadata(
      X_DEFAULT_USER_BY_SCREEN_NAME_QUERY_ID,
      X_DEFAULT_USER_FEATURE_SWITCHES,
      X_DEFAULT_USER_FIELD_TOGGLES
    );
    const fallbackUserMedia = createFallbackXOperationMetadata(X_DEFAULT_USER_MEDIA_QUERY_ID);
    const fallback = {
      bearerToken: decodeURIComponent(X_DEFAULT_WEB_BEARER_TOKEN),
      tweetResultQueryId: fallbackTweetResult.queryId,
      tweetResultOperation: fallbackTweetResult,
      bookmarksQueryId: fallbackBookmarks.queryId,
      bookmarksOperation: fallbackBookmarks,
      bookmarkFolderQueryId: fallbackBookmarkFolder.queryId,
      bookmarkFolderOperation: fallbackBookmarkFolder,
      userByScreenNameQueryId: fallbackUserByScreenName.queryId,
      userByScreenNameOperation: fallbackUserByScreenName,
      userMediaQueryId: fallbackUserMedia.queryId,
      userMediaOperation: fallbackUserMedia,
      cachedAt: Date.now()
    };

    try {
      const html = await fetch(`${X_HOME_URL}?mx=2`, {
        credentials: 'omit'
      }).then((response) => response.text());
      const mainScriptUrl = extractXMainScriptUrl(html);
      if (!mainScriptUrl) {
        return fallback;
      }

      const scriptText = await fetch(mainScriptUrl, {
        credentials: 'omit'
      }).then((response) => response.text());
      let bookmarksScriptText = '';
      const bookmarksScriptUrl = extractXChunkScriptUrl(html, X_BOOKMARKS_SHARED_CHUNK_NAME);
      if (bookmarksScriptUrl) {
        try {
          bookmarksScriptText = await fetch(bookmarksScriptUrl, {
            credentials: 'omit'
          }).then((response) => response.ok ? response.text() : '');
        } catch {}
      }

      const tweetResultOperation = mergeXOperationMetadata(
        fallbackTweetResult,
        extractXOperationMetadata(scriptText, 'TweetResultByRestId')
      );
      const bookmarksOperation = mergeXOperationMetadata(
        fallbackBookmarks,
        extractXOperationMetadata(bookmarksScriptText, 'Bookmarks')
      );
      const bookmarkFolderOperation = mergeXOperationMetadata(
        fallbackBookmarkFolder,
        extractXOperationMetadata(bookmarksScriptText, 'BookmarkFolderTimeline')
      );
      const userByScreenNameOperation = mergeXOperationMetadata(
        fallbackUserByScreenName,
        extractXOperationMetadata(scriptText, 'UserByScreenName')
      );
      const userMediaOperation = mergeXOperationMetadata(
        fallbackUserMedia,
        extractXOperationMetadata(scriptText, 'UserMedia')
      );

      return {
        bearerToken: extractXBearerToken(scriptText) || fallback.bearerToken,
        tweetResultQueryId: tweetResultOperation.queryId,
        tweetResultOperation,
        bookmarksQueryId: bookmarksOperation.queryId,
        bookmarksOperation,
        bookmarkFolderQueryId: bookmarkFolderOperation.queryId,
        bookmarkFolderOperation,
        userByScreenNameQueryId: userByScreenNameOperation.queryId,
        userByScreenNameOperation,
        userMediaQueryId: userMediaOperation.queryId,
        userMediaOperation,
        cachedAt: Date.now()
      };
    } catch {
      return fallback;
    } finally {
      xApiMetadataPromise = null;
    }
  })();

  xApiMetadataCache = await xApiMetadataPromise;
  return xApiMetadataCache;
}

async function getXGuestToken(bearerToken) {
  const response = await fetchJson(X_GUEST_ACTIVATE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${bearerToken}`
    }
  });

  return clampString(response?.guest_token, '');
}

function unwrapXResult(result) {
  let current = result;

  while (current && typeof current === 'object') {
    if (current.__typename === 'TweetWithVisibilityResults' && current.tweet) {
      current = current.tweet;
      continue;
    }

    if (current.result && current.result !== current && !current.legacy) {
      current = current.result;
      continue;
    }

    break;
  }

  return current || null;
}

function getXTombstoneText(result) {
  const unwrapped = unwrapXResult(result);
  return normalizeInlineWhitespace(unwrapped?.tombstone?.text?.text || '');
}

function getXRestrictionErrorMessage(result, hasSavedCookies) {
  const unwrapped = unwrapXResult(result);
  if (unwrapped?.__typename !== 'TweetTombstone') {
    return 'No downloadable media was found in that tweet.';
  }

  const tombstoneText = getXTombstoneText(result);
  if (!tombstoneText) {
    return 'That tweet is unavailable.';
  }

  if (/age-restricted|log in to x|not authorized/i.test(tombstoneText)) {
    if (hasSavedCookies) {
      return `${tombstoneText} Sign in with an X account that can open this post, then click "Connect my X account" again.`;
    }

    return `${tombstoneText} Add your X account in Setup if you want the extension to open posts that need a sign-in.`;
  }

  return tombstoneText;
}

async function fetchXTweetResult({ tweetId, guestToken = '', csrfToken = '', authenticated = false, requestTag = '' }) {
  const metadata = await getXApiMetadata();
  const apiUrl = new URL(`${X_GRAPHQL_BASE_URL}/${metadata.tweetResultQueryId}/TweetResultByRestId`);
  apiUrl.searchParams.set('variables', JSON.stringify({
    tweetId,
    withCommunity: false,
    includePromotedContent: false,
    withVoice: false
  }));
  addXGraphQLMetadataParams(apiUrl, metadata.tweetResultOperation);
  if (requestTag) {
    apiUrl.searchParams.set('ttd_x_req', requestTag);
  }

  const headers = {
    Authorization: `Bearer ${metadata.bearerToken}`,
    'x-twitter-active-user': 'yes',
    'x-twitter-client-language': 'en'
  };

  if (guestToken) {
    headers['x-guest-token'] = guestToken;
  }

  if (authenticated && csrfToken) {
    headers['x-csrf-token'] = csrfToken;
    headers['x-twitter-auth-type'] = 'OAuth2Session';
  }

  const response = await fetch(apiUrl.toString(), {
    credentials: 'omit',
    headers
  });
  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    if (authenticated && (response.status === 401 || response.status === 403)) {
      throw new Error('Your saved X account details were rejected by X. Sign in on X again, then click "Connect my X account".');
    }

    const message = data?.errors?.[0]?.message || data?.error || text || `Request failed with ${response.status}`;
    throw new Error(normalizeInlineWhitespace(message));
  }

  return data?.data?.tweetResult?.result || null;
}

function isRefreshableXSessionError(error) {
  if (error?.refreshXSession) {
    return true;
  }

  const message = normalizeInlineWhitespace(error instanceof Error ? error.message : String(error || ''));
  return /saved x account details were rejected|log in|login|sign in|not authorized|authentication credentials/i.test(message);
}

function createRefreshableXSessionError(message) {
  const error = new Error(message);
  error.refreshXSession = true;
  return error;
}

function getBookmarkExpansionUnavailableMessage(bookmarkInfo) {
  return bookmarkInfo?.folderId
    ? 'Bookmark folder downloads need verified X bookmark access before this extension can expand them safely. Paste the individual X post links for now.'
    : 'Bookmark downloads need verified X bookmark access before this extension can expand them safely. Paste the individual X post links for now.';
}

function getProfileMediaExpansionUnavailableMessage(profileInfo) {
  return `Profile media downloads need verified X access before this extension can expand @${profileInfo.username}/media safely. Paste the individual X post links for now.`;
}

function getXTimelineEntries(timeline) {
  const instructions = Array.isArray(timeline?.instructions) ? timeline.instructions : [];
  return instructions.flatMap((instruction) => {
    if (Array.isArray(instruction?.entries)) {
      return instruction.entries;
    }
    if (instruction?.entry) {
      return [instruction.entry];
    }
    if (Array.isArray(instruction?.addEntries?.entries)) {
      return instruction.addEntries.entries;
    }
    if (Array.isArray(instruction?.moduleItems)) {
      return instruction.moduleItems;
    }
    return [];
  });
}

function getTweetIdFromTimelineItemContent(itemContent) {
  const tweetResult = unwrapXResult(itemContent?.tweet_results?.result || itemContent?.tweetResult?.result || itemContent?.tweet);
  if (
    tweetResult?.rest_id
    && (tweetResult.legacy || tweetResult.core || /Tweet/i.test(tweetResult.__typename || ''))
  ) {
    return String(tweetResult.rest_id);
  }

  return '';
}

function getTimelineEntryItemContents(entry) {
  const contents = [];
  if (entry?.content?.itemContent) {
    contents.push(entry.content.itemContent);
  }
  if (entry?.item?.itemContent) {
    contents.push(entry.item.itemContent);
  }
  if (entry?.itemContent) {
    contents.push(entry.itemContent);
  }

  if (Array.isArray(entry?.content?.items)) {
    entry.content.items.forEach((item) => {
      const itemContent = item?.item?.itemContent || item?.itemContent || item?.content?.itemContent;
      if (itemContent) {
        contents.push(itemContent);
      }
    });
  }

  return contents;
}

function extractTweetIdsFromXTimeline(timeline) {
  const tweetIds = new Set();
  getXTimelineEntries(timeline).forEach((entry) => {
    const entryIdentifier = clampString(entry?.entryId || entry?.entry_id || entry?.id, '');
    const entryTweetMatch = entryIdentifier.match(/(?:tweet|conversationthread)-(\d+)/i);
    if (entryTweetMatch?.[1]) {
      tweetIds.add(entryTweetMatch[1]);
      return;
    }

    getTimelineEntryItemContents(entry).forEach((itemContent) => {
      const tweetId = getTweetIdFromTimelineItemContent(itemContent);
      if (tweetId) {
        tweetIds.add(tweetId);
      }
    });
  });
  return Array.from(tweetIds);
}

function collectBottomCursorsFromTimelineValue(value, cursors = []) {
  if (!value) {
    return cursors;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectBottomCursorsFromTimelineValue(item, cursors);
    }
    return cursors;
  }

  if (typeof value !== 'object') {
    return cursors;
  }

  const cursorType = clampString(value.cursorType || value.cursor_type, '').toLowerCase();
  const entryIdentifier = clampString(value.entryId || value.entry_id || value.id, '').toLowerCase();
  if ((cursorType === 'bottom' || entryIdentifier.includes('cursor-bottom')) && value.value) {
    cursors.push(clampString(value.value, ''));
  }

  for (const nextValue of Object.values(value)) {
    collectBottomCursorsFromTimelineValue(nextValue, cursors);
  }

  return cursors;
}

function extractBottomCursorFromXTimeline(timeline, previousCursor = '') {
  const cursors = collectBottomCursorsFromTimelineValue(timeline);
  for (let index = cursors.length - 1; index >= 0; index -= 1) {
    const cursor = cursors[index];
    if (cursor && cursor !== previousCursor) {
      return cursor;
    }
  }
  return '';
}

async function fetchXBookmarkTimeline({ bookmarkInfo, cursor = '', csrfToken = '', requestTag = '' }) {
  const metadata = await getXApiMetadata();
  const isFolder = Boolean(bookmarkInfo?.folderId);
  const operationName = isFolder ? 'BookmarkFolderTimeline' : 'Bookmarks';
  const operationMetadata = isFolder ? metadata.bookmarkFolderOperation : metadata.bookmarksOperation;
  const queryId = isFolder ? metadata.bookmarkFolderQueryId : metadata.bookmarksQueryId;
  const apiUrl = new URL(`${X_GRAPHQL_BASE_URL}/${queryId}/${operationName}`);
  const variables = isFolder
    ? {
        bookmark_collection_id: bookmarkInfo.folderId,
        cursor: cursor || undefined,
        includePromotedContent: true
      }
    : {
        count: X_BOOKMARK_PAGE_SIZE,
        cursor: cursor || undefined,
        includePromotedContent: true
      };

  Object.keys(variables).forEach((key) => {
    if (variables[key] === undefined) {
      delete variables[key];
    }
  });

  apiUrl.searchParams.set('variables', JSON.stringify(variables));
  addXGraphQLMetadataParams(apiUrl, operationMetadata);
  if (requestTag) {
    apiUrl.searchParams.set('ttd_x_req', requestTag);
  }

  const response = await fetch(apiUrl.toString(), {
    credentials: 'omit',
    headers: {
      Accept: '*/*',
      Authorization: `Bearer ${metadata.bearerToken}`,
      'x-csrf-token': csrfToken,
      'x-twitter-active-user': 'yes',
      'x-twitter-auth-type': 'OAuth2Session',
      'x-twitter-client-language': 'en'
    }
  });
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Your saved X account details were rejected by X. Sign in on X again, then click "Connect my X account".');
    }
    const message = data?.errors?.[0]?.message || data?.error || text || `Request failed with ${response.status}`;
    throw new Error(normalizeInlineWhitespace(message));
  }

  const timeline = isFolder
    ? data?.data?.bookmark_collection_timeline?.timeline
    : data?.data?.bookmark_timeline_v2?.timeline;
  if (!timeline) {
    const message = data?.errors?.[0]?.message || getBookmarkExpansionUnavailableMessage(bookmarkInfo);
    throw createRefreshableXSessionError(normalizeInlineWhitespace(message));
  }

  return timeline;
}

async function fetchXUserByScreenName({ profileInfo, csrfToken = '', requestTag = '' }) {
  const metadata = await getXApiMetadata();
  const apiUrl = new URL(`${X_GRAPHQL_BASE_URL}/${metadata.userByScreenNameQueryId}/UserByScreenName`);
  apiUrl.searchParams.set('variables', JSON.stringify({
    screen_name: profileInfo.username,
    withGrokTranslatedBio: false
  }));
  addXGraphQLMetadataParams(apiUrl, metadata.userByScreenNameOperation);
  if (requestTag) {
    apiUrl.searchParams.set('ttd_x_req', requestTag);
  }

  const response = await fetch(apiUrl.toString(), {
    credentials: 'omit',
    headers: {
      Accept: '*/*',
      Authorization: `Bearer ${metadata.bearerToken}`,
      'x-csrf-token': csrfToken,
      'x-twitter-active-user': 'yes',
      'x-twitter-auth-type': 'OAuth2Session',
      'x-twitter-client-language': 'en'
    }
  });
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Your saved X account details were rejected by X. Sign in on X again, then click "Connect my X account".');
    }
    const message = data?.errors?.[0]?.message || data?.error || text || `Request failed with ${response.status}`;
    throw new Error(normalizeInlineWhitespace(message));
  }

  const userResult = unwrapXResult(data?.data?.user?.result);
  if (!userResult?.rest_id || userResult.__typename !== 'User') {
    const message = data?.errors?.[0]?.message || `X could not find @${profileInfo.username}.`;
    throw createRefreshableXSessionError(normalizeInlineWhitespace(message));
  }

  return String(userResult.rest_id);
}

async function fetchXProfileMediaTimeline({ profileInfo, userId, cursor = '', csrfToken = '', requestTag = '' }) {
  const metadata = await getXApiMetadata();
  const apiUrl = new URL(`${X_GRAPHQL_BASE_URL}/${metadata.userMediaQueryId}/UserMedia`);
  const variables = {
    userId,
    count: X_PROFILE_MEDIA_PAGE_SIZE,
    cursor: cursor || undefined,
    includePromotedContent: false,
    withClientEventToken: false,
    withBirdwatchNotes: false,
    withVoice: false
  };

  Object.keys(variables).forEach((key) => {
    if (variables[key] === undefined) {
      delete variables[key];
    }
  });

  apiUrl.searchParams.set('variables', JSON.stringify(variables));
  addXGraphQLMetadataParams(apiUrl, metadata.userMediaOperation);
  if (requestTag) {
    apiUrl.searchParams.set('ttd_x_req', requestTag);
  }

  const response = await fetch(apiUrl.toString(), {
    credentials: 'omit',
    headers: {
      Accept: '*/*',
      Authorization: `Bearer ${metadata.bearerToken}`,
      'x-csrf-token': csrfToken,
      'x-twitter-active-user': 'yes',
      'x-twitter-auth-type': 'OAuth2Session',
      'x-twitter-client-language': 'en'
    }
  });
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Your saved X account details were rejected by X. Sign in on X again, then click "Connect my X account".');
    }
    const message = data?.errors?.[0]?.message || data?.error || text || `Request failed with ${response.status}`;
    throw new Error(normalizeInlineWhitespace(message));
  }

  const timeline = data?.data?.user?.result?.timeline?.timeline;
  if (!timeline) {
    const message = data?.errors?.[0]?.message || getProfileMediaExpansionUnavailableMessage(profileInfo);
    throw createRefreshableXSessionError(normalizeInlineWhitespace(message));
  }

  return timeline;
}

async function resolveBookmarkUrlsWithSession(bookmarkInfo, session) {
  return withTemporaryXCookieHeader(session.cookieHeader, async (requestTag) => {
    const tweetIds = [];
    const seenTweetIds = new Set();
    let cursor = '';

    for (let pageIndex = 0; pageIndex < X_MAX_BOOKMARK_EXPANSION_PAGES; pageIndex += 1) {
      const timeline = await fetchXBookmarkTimeline({
        bookmarkInfo,
        cursor,
        csrfToken: session.csrfToken,
        requestTag
      });
      const pageTweetIds = extractTweetIdsFromXTimeline(timeline);
      pageTweetIds.forEach((tweetId) => {
        if (!seenTweetIds.has(tweetId)) {
          seenTweetIds.add(tweetId);
          tweetIds.push(tweetId);
        }
      });

      const nextCursor = extractBottomCursorFromXTimeline(timeline, cursor);
      if (!nextCursor || nextCursor === cursor) {
        break;
      }
      cursor = nextCursor;
    }

    if (!tweetIds.length) {
      throw createRefreshableXSessionError(bookmarkInfo.folderId
        ? 'No downloadable posts were found in that bookmark folder.'
        : 'No downloadable posts were found in your bookmarks.');
    }

    return tweetIds.map((tweetId) => `https://x.com/i/status/${tweetId}`);
  });
}

async function resolveBookmarkUrls(inputUrl) {
  const bookmarkInfo = extractBookmarkInfo(inputUrl);
  if (!bookmarkInfo) {
    return [inputUrl];
  }

  try {
    return await resolveBookmarkUrlsWithSession(bookmarkInfo, await getSavedXSession());
  } catch (error) {
    if (!isRefreshableXSessionError(error)) {
      throw error;
    }
    return resolveBookmarkUrlsWithSession(bookmarkInfo, await refreshSavedXSessionFromBrowser());
  }
}

async function resolveProfileMediaUrlsWithSession(profileInfo, session) {
  return withTemporaryXCookieHeader(session.cookieHeader, async (requestTag) => {
    const userId = await fetchXUserByScreenName({
      profileInfo,
      csrfToken: session.csrfToken,
      requestTag
    });
    const tweetIds = [];
    const seenTweetIds = new Set();
    let cursor = '';

    for (let pageIndex = 0; pageIndex < X_MAX_PROFILE_MEDIA_EXPANSION_PAGES; pageIndex += 1) {
      const timeline = await fetchXProfileMediaTimeline({
        profileInfo,
        userId,
        cursor,
        csrfToken: session.csrfToken,
        requestTag
      });
      const pageTweetIds = extractTweetIdsFromXTimeline(timeline);
      pageTweetIds.forEach((tweetId) => {
        if (!seenTweetIds.has(tweetId)) {
          seenTweetIds.add(tweetId);
          tweetIds.push(tweetId);
        }
      });

      const nextCursor = extractBottomCursorFromXTimeline(timeline, cursor);
      if (!nextCursor || nextCursor === cursor) {
        break;
      }
      cursor = nextCursor;
    }

    if (!tweetIds.length) {
      throw createRefreshableXSessionError(`No downloadable posts were found in @${profileInfo.username}/media.`);
    }

    return tweetIds.map((tweetId) => `https://x.com/i/status/${tweetId}`);
  });
}

async function resolveProfileMediaUrls(inputUrl) {
  const profileInfo = extractProfileMediaInfo(inputUrl);
  if (!profileInfo) {
    return [inputUrl];
  }

  try {
    return await resolveProfileMediaUrlsWithSession(profileInfo, await getSavedXSession());
  } catch (error) {
    if (!isRefreshableXSessionError(error)) {
      throw error;
    }
    return resolveProfileMediaUrlsWithSession(profileInfo, await refreshSavedXSessionFromBrowser());
  }
}

async function resolveExpandableUrls(inputUrl) {
  if (extractBookmarkInfo(inputUrl)) {
    return resolveBookmarkUrls(inputUrl);
  }

  if (extractProfileMediaInfo(inputUrl)) {
    return resolveProfileMediaUrls(inputUrl);
  }

  return [inputUrl];
}

async function getDropboxAccount(accessToken) {
  return fetchJson(DROPBOX_ACCOUNT_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
}

async function getGoogleDriveAbout(accessToken) {
  return fetchJson(GOOGLE_DRIVE_ABOUT_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
}

function getChromeAuthToken(details) {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken(details, (token) => {
      const runtimeError = chrome.runtime.lastError;
      if (runtimeError) {
        reject(new Error(runtimeError.message));
        return;
      }

      resolve(typeof token === 'string' ? token : clampString(token?.token, ''));
    });
  });
}

function removeChromeCachedAuthToken(token) {
  return new Promise((resolve, reject) => {
    chrome.identity.removeCachedAuthToken({ token }, () => {
      const runtimeError = chrome.runtime.lastError;
      if (runtimeError) {
        reject(new Error(runtimeError.message));
        return;
      }

      resolve();
    });
  });
}

function launchChromeWebAuthFlow(details) {
  return new Promise((resolve, reject) => {
    chrome.identity.launchWebAuthFlow(details, (responseUrl) => {
      const runtimeError = chrome.runtime.lastError;
      if (runtimeError) {
        reject(new Error(runtimeError.message));
        return;
      }

      resolve(responseUrl || '');
    });
  });
}

function withTimeout(promise, timeoutMs, message) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(message));
    }, timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timeoutId);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

async function getGoogleDriveAccessToken({ interactive }) {
  if (!isGoogleOAuthConfigured()) {
    throw new Error('Google Drive session expired. Reconnect Google Drive and try again.');
  }

  const accessToken = await withTimeout(
    getChromeAuthToken({
      interactive,
      enableGranularPermissions: true,
      scopes: getGoogleOAuthScopes()
    }),
    GOOGLE_IDENTITY_TIMEOUT_MS,
    interactive
      ? 'Google Drive sign-in did not finish. Reload the extension and try again.'
      : 'Google Drive sign-in did not respond.'
  );

  if (!accessToken) {
    throw new Error('Google Drive did not return an access token.');
  }

  return accessToken;
}

async function invalidateGoogleDriveToken(accessToken) {
  const token = clampString(accessToken, '');
  if (!token) {
    return;
  }

  try {
    await removeChromeCachedAuthToken(token);
  } catch (error) {
    console.warn('Could not remove cached Google Drive token:', error);
  }
}

function parseGoogleOAuthCallbackUrl(callbackUrl) {
  const parsed = new URL(callbackUrl);
  const fragmentParams = new URLSearchParams(parsed.hash.replace(/^#/, ''));
  const getParam = (name) => parsed.searchParams.get(name) || fragmentParams.get(name) || '';
  const expiresIn = Number(getParam('expires_in'));

  return {
    code: clampString(getParam('code'), ''),
    accessToken: clampString(getParam('access_token'), ''),
    error: clampString(getParam('error_description') || getParam('error'), ''),
    state: clampString(getParam('state'), ''),
    expiresIn: Number.isFinite(expiresIn) && expiresIn > 0 ? expiresIn : null
  };
}

async function exchangeGoogleCode({ clientId, code, codeVerifier, redirectUrl }) {
  const body = new URLSearchParams({
    client_id: clientId,
    code,
    code_verifier: codeVerifier,
    grant_type: 'authorization_code',
    redirect_uri: redirectUrl
  });

  return fetchJson(GOOGLE_OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  });
}

async function refreshGoogleDriveToken({ clientId, refreshToken }) {
  const body = new URLSearchParams({
    client_id: clientId,
    refresh_token: refreshToken,
    grant_type: 'refresh_token'
  });

  return fetchJson(GOOGLE_OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  });
}

async function getGoogleDriveWebAuthToken() {
  if (!(await isGoogleBrowserOAuthConfigured())) {
    const redirectUrl = chrome.identity.getRedirectURL();
    throw new Error(`Google Drive browser sign-in is not configured. Create a Google OAuth Web Application client with this redirect URI, then save its public client ID in Advanced setup: ${redirectUrl}`);
  }

  const clientId = await getGoogleBrowserOAuthClientId();
  const redirectUrl = chrome.identity.getRedirectURL();
  const state = createCodeVerifier();
  const authUrl = buildGoogleDriveAuthUrl({
    clientId,
    redirectUrl,
    responseType: 'token',
    state
  });
  const responseUrl = await withTimeout(
    launchChromeWebAuthFlow({
      url: authUrl,
      interactive: true
    }),
    GOOGLE_WEB_AUTH_TIMEOUT_MS,
    `Google Drive browser sign-in did not finish. Add this Redirect URI to your Google Web OAuth client, then try again: ${redirectUrl}`
  );

  if (!responseUrl) {
    throw new Error('Google Drive sign-in did not complete.');
  }

  const parsed = assertExpectedOAuthCallbackUrl(responseUrl, redirectUrl);
  const callback = parseGoogleOAuthCallbackUrl(parsed.toString());
  if (callback.state !== state) {
    throw new Error('Google Drive returned an invalid sign-in state. Try again.');
  }
  if (callback.error) {
    throw new Error(callback.error);
  }
  if (callback.accessToken) {
    return {
      accessToken: callback.accessToken,
      refreshToken: '',
      expiresAt: callback.expiresIn ? Date.now() + (callback.expiresIn * 1000) : null,
      mode: 'oauth-browser'
    };
  }
  throw new Error('Google Drive did not return an access token.');
}

async function exchangeDropboxCode({ appKey, code, codeVerifier, redirectUrl }) {
  const body = new URLSearchParams({
    code,
    grant_type: 'authorization_code',
    client_id: appKey,
    code_verifier: codeVerifier,
    redirect_uri: redirectUrl
  });

  return fetchJson(DROPBOX_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  });
}

async function refreshDropboxToken({ appKey, refreshToken }) {
  const body = new URLSearchParams({
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
    client_id: appKey
  });

  return fetchJson(DROPBOX_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  });
}

function escapeGoogleDriveQueryValue(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function getGoogleDriveFolderSegments(folderName) {
  return normalizeGoogleDriveFolderName(folderName)
    .split('/')
    .map((segment) => clampString(segment, ''))
    .filter(Boolean);
}

function googleDriveParentQuery(parentId) {
  return `'${escapeGoogleDriveQueryValue(parentId || 'root')}' in parents`;
}

async function listGoogleDriveFiles(accessToken, query, fields) {
  const url = new URL(GOOGLE_DRIVE_FILES_URL);
  url.searchParams.set('q', query);
  url.searchParams.set('spaces', 'drive');
  url.searchParams.set('pageSize', '10');
  url.searchParams.set('fields', fields || 'files(id,name)');

  const data = await fetchJson(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return Array.isArray(data?.files) ? data.files : [];
}

async function findGoogleDriveFolderInParent(accessToken, { parentId, name }) {
  const query = [
    googleDriveParentQuery(parentId),
    `name='${escapeGoogleDriveQueryValue(name)}'`,
    "mimeType='application/vnd.google-apps.folder'",
    'trashed=false'
  ].join(' and ');
  const files = await listGoogleDriveFiles(accessToken, query, 'files(id,name,mimeType)');
  return files[0] || null;
}

async function createGoogleDriveFolderInParent(accessToken, { parentId, name }) {
  const metadata = {
    name,
    mimeType: 'application/vnd.google-apps.folder'
  };
  if (parentId && parentId !== 'root') {
    metadata.parents = [parentId];
  }

  return fetchJson(`${GOOGLE_DRIVE_FILES_URL}?fields=id,name,mimeType`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(metadata)
  });
}

async function ensureGoogleDriveFolder(accessToken, settings) {
  const segments = getGoogleDriveFolderSegments(settings.googleDriveFolderName);
  let parentId = 'root';

  for (const name of segments) {
    let folder = await findGoogleDriveFolderInParent(accessToken, { parentId, name });
    if (!folder?.id) {
      folder = await createGoogleDriveFolderInParent(accessToken, { parentId, name });
    }
    parentId = folder.id;
  }

  return {
    id: parentId,
    name: segments.join('/')
  };
}

async function findGoogleDriveFileInFolder(accessToken, { folderId, filename }) {
  const query = [
    googleDriveParentQuery(folderId),
    `name='${escapeGoogleDriveQueryValue(filename)}'`,
    'trashed=false'
  ].join(' and ');
  const files = await listGoogleDriveFiles(
    accessToken,
    query,
    'files(id,name,size,mimeType,webViewLink,webContentLink)'
  );
  return files.find((file) => file?.mimeType !== 'application/vnd.google-apps.folder') || null;
}

async function connectDropbox() {
  const primaryAppKey = await getDropboxAppKey();
  if (!primaryAppKey) {
    throw new Error('Add your Dropbox app key in Options before connecting.');
  }

  let lastAuthError = null;
  const forceReauthentication = await shouldForceDropboxReauthentication();

  for (const { appKey, redirectUrl } of getDropboxAuthAttempts(primaryAppKey)) {
    const codeVerifier = createCodeVerifier();
    const codeChallenge = await createCodeChallenge(codeVerifier);
    const state = createCodeVerifier();
    const authUrl = buildDropboxAuthUrl(appKey, redirectUrl, codeChallenge, {
      forceReauthentication,
      state
    });

    try {
      const responseUrl = await chrome.identity.launchWebAuthFlow({
        url: authUrl,
        interactive: true
      });

      if (!responseUrl) {
        throw new Error('Dropbox login did not complete.');
      }

      const parsed = assertExpectedOAuthCallbackUrl(responseUrl, redirectUrl);
      const authCode = parsed.searchParams.get('code');
      const authError = parsed.searchParams.get('error_description') || parsed.searchParams.get('error');
      const returnedState = parsed.searchParams.get('state') || '';

      if (authError) {
        throw new Error(authError);
      }

      if (returnedState !== state) {
        throw new Error('Dropbox returned an invalid sign-in state. Try connecting again.');
      }

      if (!authCode) {
        throw new Error('Dropbox did not return an authorization code.');
      }

      const tokenData = await exchangeDropboxCode({
        appKey,
        code: authCode,
        codeVerifier,
        redirectUrl
      });

      const account = await getDropboxAccount(tokenData.access_token);
      const auth = {
        provider: PROVIDER_DROPBOX,
        mode: 'oauth',
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || '',
        expiresAt: Date.now() + (Number(tokenData.expires_in || 0) * 1000),
        accountName: account.name?.display_name || '',
        accountEmail: account.email || ''
      };

      await setAuth(auth);
      await setDropboxForceReauthentication(false);
      return authSummary(auth);
    } catch (error) {
      lastAuthError = error;
      if (!isRetryableDropboxAuthError(error)) {
        throw error;
      }
    }
  }

  throw lastAuthError || new Error('Dropbox login did not complete.');
}

async function connectGoogleDrive() {
  const browserAuth = await getGoogleDriveWebAuthToken();
  const accessToken = browserAuth.accessToken;
  const refreshToken = browserAuth.refreshToken;
  const expiresAt = browserAuth.expiresAt;
  const mode = browserAuth.mode;

  if (!accessToken) {
    throw new Error('Google Drive did not return an access token.');
  }

  const about = await getGoogleDriveAbout(accessToken).catch(() => null);
  const auth = {
    provider: PROVIDER_GOOGLE_DRIVE,
    mode,
    accessToken,
    refreshToken,
    expiresAt,
    accountName: clampString(about?.user?.displayName, ''),
    accountEmail: clampString(about?.user?.emailAddress, '')
  };

  await setAuth(auth);
  return authSummary(auth);
}

async function ensureDropboxAccessToken() {
  const auth = await getAuth(PROVIDER_DROPBOX);
  if (!auth?.accessToken) {
    throw new Error('Connect Dropbox first.');
  }

  if (auth.mode !== 'oauth') {
    return auth.accessToken;
  }

  const appKey = await getDropboxAppKey();
  if (!appKey) {
    throw new Error('Dropbox app key is missing. Reconnect from Options.');
  }

  if (Number.isFinite(auth.expiresAt) && auth.expiresAt > Date.now() + TOKEN_REFRESH_BUFFER_MS) {
    return auth.accessToken;
  }

  if (!auth.refreshToken) {
    throw new Error('Dropbox refresh token is missing. Reconnect Dropbox.');
  }

  let refreshed = null;
  try {
    refreshed = await refreshDropboxToken({
      appKey,
      refreshToken: auth.refreshToken
    });
  } catch (error) {
    if (isDropboxAuthError(error)) {
      await clearDropboxAuth({ forceNextReauthentication: true });
      throw new Error('Dropbox session expired. Reconnect Dropbox and try again.');
    }
    throw error;
  }

  const nextAuth = {
    ...auth,
    accessToken: refreshed.access_token,
    expiresAt: Date.now() + (Number(refreshed.expires_in || 0) * 1000)
  };

  await setAuth(nextAuth);
  return nextAuth.accessToken;
}

async function ensureGoogleDriveAccessToken() {
  const auth = await getAuth(PROVIDER_GOOGLE_DRIVE);
  if (!auth?.accessToken) {
    throw new Error('Connect Google Drive first.');
  }

  if (auth.mode === 'oauth-browser') {
    if (Number.isFinite(auth.expiresAt) && auth.expiresAt > Date.now() + TOKEN_REFRESH_BUFFER_MS) {
      return auth.accessToken;
    }

    if (!auth.refreshToken) {
      await clearAuth(PROVIDER_GOOGLE_DRIVE);
      throw new Error('Google Drive session expired. Reconnect Google Drive and try again.');
    }

    try {
      const refreshed = await refreshGoogleDriveToken({
        clientId: (await isGoogleBrowserOAuthConfigured())
          ? await getGoogleBrowserOAuthClientId()
          : getGoogleOAuthClientId(),
        refreshToken: auth.refreshToken
      });
      const nextAuth = {
        ...auth,
        accessToken: clampString(refreshed?.access_token, ''),
        refreshToken: clampString(refreshed?.refresh_token, '') || auth.refreshToken,
        expiresAt: Number(refreshed?.expires_in) > 0
          ? Date.now() + (Number(refreshed.expires_in) * 1000)
          : auth.expiresAt
      };

      if (!nextAuth.accessToken) {
        throw new Error('Google Drive refresh did not return an access token.');
      }

      await setAuth(nextAuth);
      return nextAuth.accessToken;
    } catch (error) {
      await clearAuth(PROVIDER_GOOGLE_DRIVE);
      throw new Error('Google Drive session expired. Reconnect Google Drive and try again.');
    }
  }

  if (!isGoogleOAuthConfigured()) {
    throw new Error('Google Drive session expired. Reconnect Google Drive and try again.');
  }

  try {
    const accessToken = await getGoogleDriveAccessToken({ interactive: false });
    if (accessToken !== auth.accessToken) {
      await setAuth({
        ...auth,
        accessToken
      });
    }
    return accessToken;
  } catch (error) {
    await invalidateGoogleDriveToken(auth.accessToken);
    await clearAuth(PROVIDER_GOOGLE_DRIVE);
    throw new Error('Google Drive session expired. Reconnect Google Drive and try again.');
  }
}

async function getValidatedAuthSummary(provider) {
  const normalizedProvider = normalizeStorageProvider(provider);
  const auth = await getAuth(normalizedProvider);
  if (!auth?.accessToken) {
    return authSummary(null);
  }

  if (normalizedProvider === PROVIDER_GOOGLE_DRIVE) {
    return authSummary(auth);
  }

  if (auth.mode !== 'manual') {
    return authSummary(auth);
  }

  try {
    await getDropboxAccount(auth.accessToken);
    return authSummary(auth);
  } catch (error) {
    if (isDropboxAuthError(error)) {
      await clearDropboxAuth();
      return authSummary(null);
    }
    return authSummary(auth);
  }
}

async function getValidatedAuthSummaries() {
  const summaries = {};
  for (const provider of CLOUD_STORAGE_PROVIDERS) {
    summaries[provider] = await getValidatedAuthSummary(provider);
  }
  return summaries;
}

async function getStoredAuthSummaries() {
  const summaries = {};
  for (const provider of CLOUD_STORAGE_PROVIDERS) {
    summaries[provider] = authSummary(await getAuth(provider));
  }
  return summaries;
}

function withOriginalTwitterQuality(mediaUrl) {
  const parsed = new URL(mediaUrl);
  if (parsed.hostname.endsWith('twimg.com')) {
    parsed.searchParams.set('name', 'orig');
  }
  return parsed.toString();
}

function uniqueBy(list, keyFn) {
  const seen = new Set();
  return list.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function bestVideoVariant(variants) {
  if (!Array.isArray(variants)) return null;
  const playable = variants
    .filter((variant) => variant?.url && String(variant.content_type || '').includes('mp4'))
    .sort((left, right) => Number(right.bitrate || 0) - Number(left.bitrate || 0));

  return playable[0] || null;
}

function inferTweetMediaItems(tweetData, tweetId) {
  const screenName = sanitizeFileName(tweetData.user?.screen_name || 'tweet');
  const items = [];

  const photoEntries = [];
  if (Array.isArray(tweetData.photos)) {
    for (const photo of tweetData.photos) {
      if (photo?.url) {
        photoEntries.push({
          sourceUrl: withOriginalTwitterQuality(photo.url),
          expandedUrl: photo.expandedUrl || '',
          kind: 'photo'
        });
      }
    }
  }

  if (Array.isArray(tweetData.mediaDetails)) {
    for (const media of tweetData.mediaDetails) {
      if (media?.type === 'photo' && media.media_url_https) {
        photoEntries.push({
          sourceUrl: withOriginalTwitterQuality(media.media_url_https),
          expandedUrl: media.expanded_url || '',
          kind: 'photo'
        });
      }

      if ((media?.type === 'video' || media?.type === 'animated_gif') && media.video_info?.variants) {
        const variant = bestVideoVariant(media.video_info.variants);
        if (variant?.url) {
          items.push({
            sourceUrl: stripQueryAndHash(variant.url),
            kind: media.type,
            filename: '',
            label: `${screenName}/${tweetId} video`
          });
        }
      }
    }
  }

  if (tweetData.video?.variants) {
    const variant = bestVideoVariant(tweetData.video.variants);
    if (variant?.url) {
      items.push({
        sourceUrl: stripQueryAndHash(variant.url),
        kind: tweetData.video.type || 'video',
        filename: '',
        label: `${screenName}/${tweetId} video`
      });
    }
  }

  const uniquePhotos = uniqueBy(photoEntries, (item) => item.sourceUrl);
  uniquePhotos.forEach((entry) => items.push(entry));

  const uniqueItems = uniqueBy(items, (item) => item.sourceUrl);
  return uniqueItems.map((item, index) => {
    const ext = extractExtensionFromUrl(item.sourceUrl, item.kind === 'photo' ? 'jpg' : 'mp4');
    return {
      sourceUrl: item.sourceUrl,
      kind: item.kind,
      filename: `${screenName}_${tweetId}_${index + 1}.${ext}`,
      label: `${screenName}/${tweetId}/${index + 1}`
    };
  });
}

function inferAuthenticatedTweetMediaItems(tweetResult, tweetId) {
  const unwrapped = unwrapXResult(tweetResult);
  const legacy = unwrapped?.legacy || {};
  const userResult = unwrapXResult(unwrapped?.core?.user_results?.result || unwrapped?.core?.user_results);
  const screenName = sanitizeFileName(userResult?.legacy?.screen_name || userResult?.core?.screen_name || 'tweet');
  const mediaEntries = Array.isArray(legacy?.extended_entities?.media)
    ? legacy.extended_entities.media
    : Array.isArray(legacy?.entities?.media)
      ? legacy.entities.media
      : [];
  const items = [];

  for (const media of mediaEntries) {
    if (media?.type === 'photo' && media.media_url_https) {
      items.push({
        sourceUrl: withOriginalTwitterQuality(media.media_url_https),
        kind: 'photo'
      });
      continue;
    }

    if ((media?.type === 'video' || media?.type === 'animated_gif') && media.video_info?.variants) {
      const variant = bestVideoVariant(media.video_info.variants);
      if (variant?.url) {
        items.push({
          sourceUrl: stripQueryAndHash(variant.url),
          kind: media.type
        });
      }
    }
  }

  const uniqueItems = uniqueBy(items, (item) => item.sourceUrl);
  return uniqueItems.map((item, index) => {
    const ext = extractExtensionFromUrl(item.sourceUrl, item.kind === 'photo' ? 'jpg' : 'mp4');
    return {
      sourceUrl: item.sourceUrl,
      kind: item.kind,
      filename: `${screenName}_${tweetId}_${index + 1}.${ext}`,
      label: `${screenName}/${tweetId}/${index + 1}`
    };
  });
}

async function resolveTweetMediaWithSavedXSession(tweetId) {
  async function runWithSession(session) {
    return withTemporaryXCookieHeader(session.cookieHeader, async (requestTag) => fetchXTweetResult({
      tweetId,
      csrfToken: session.csrfToken,
      authenticated: true,
      requestTag
    }));
  }

  let tweetResult;
  try {
    tweetResult = await runWithSession(await getSavedXSession());
  } catch (error) {
    if (!isRefreshableXSessionError(error)) {
      throw error;
    }

    tweetResult = await runWithSession(await refreshSavedXSessionFromBrowser());
  }

  const mediaItems = inferAuthenticatedTweetMediaItems(tweetResult, tweetId);

  if (!mediaItems.length) {
    throw new Error(getXRestrictionErrorMessage(tweetResult, true));
  }

  return mediaItems;
}

async function explainUnavailableTweet(tweetId, hasSavedCookies) {
  try {
    const metadata = await getXApiMetadata();
    const guestToken = await getXGuestToken(metadata.bearerToken);
    const tweetResult = await fetchXTweetResult({
      tweetId,
      guestToken
    });

    if (unwrapXResult(tweetResult)?.__typename === 'TweetTombstone') {
      return getXRestrictionErrorMessage(tweetResult, hasSavedCookies);
    }

    return '';
  } catch (error) {
    return '';
  }
}

async function resolveTweetMedia(tweetUrl) {
  const tweetId = extractTweetId(tweetUrl);
  if (!tweetId) {
    throw new Error('Could not find a tweet ID in that URL.');
  }

  let publicError = new Error('That tweet is unavailable.');

  try {
    const apiUrl = new URL(TWITTER_SYNDICATION_URL);
    apiUrl.searchParams.set('id', tweetId);
    apiUrl.searchParams.set('lang', 'en');
    apiUrl.searchParams.set('token', getTweetToken(tweetId));

    const tweetData = await fetchJson(apiUrl.toString());
    if (tweetData.__typename !== 'TweetTombstone') {
      const mediaItems = inferTweetMediaItems(tweetData, tweetId);
      if (mediaItems.length) {
        return mediaItems;
      }
    }

    const publicTombstoneText = normalizeInlineWhitespace(tweetData?.tombstone?.text?.text || '');
    publicError = new Error(publicTombstoneText || 'No downloadable media was found in that tweet.');
  } catch (error) {
    publicError = error instanceof Error ? error : new Error(String(error));
  }

  const savedXCookies = await getUsableXCookieHeader();
  if (savedXCookies) {
    return resolveTweetMediaWithSavedXSession(tweetId);
  }

  const explanation = await explainUnavailableTweet(tweetId, false);
  if (explanation) {
    throw new Error(explanation);
  }

  throw publicError;
}

function extractInstagramMediaId(oembedData) {
  const mediaId = clampString(oembedData?.media_igid || oembedData?.media_id, '');
  if (!mediaId) {
    return '';
  }

  return mediaId.split('_')[0];
}

function extractInstagramMediaIdFromHtml(html) {
  const patterns = [
    /\\"media_id\\":\\"(\d+)(?:_\d+)?\\"/i,
    /"media_id":"(\d+)(?:_\d+)?"/i,
    /\\"post_id\\":\\"(\d+)\\"/i,
    /"post_id":"(\d+)"/i,
    /instagram:\/\/media\?id=(\d+)/i
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    const mediaId = clampString(match?.[1], '');
    if (mediaId) {
      return mediaId;
    }
  }

  return '';
}

function getInstagramRestrictionErrorMessage(oembedData, hasSavedCookies) {
  const message = normalizeInlineWhitespace(
    oembedData?.alert_title
    || oembedData?.alert_description
    || oembedData?.description
    || oembedData?.title
    || oembedData?.message
    || ''
  );

  if (/geoblock_required|can'?t see this post|isn'?t available to everyone/i.test(message)) {
    if (hasSavedCookies) {
      return `${message} Sign in with an Instagram account that can open this post, then click "Connect my Instagram account" again.`;
    }

    return `${message} Sign in on instagram.com in this browser, then click "Connect my Instagram account" in Setup.`;
  }

  if (message) {
    if (hasSavedCookies) {
      return `${message} Try reconnecting your Instagram account in Setup.`;
    }

    return `${message} Sign in on instagram.com in this browser, then click "Connect my Instagram account" in Setup.`;
  }

  return hasSavedCookies
    ? 'Instagram rejected this post for your saved account. Try reconnecting your Instagram account in Setup.'
    : 'Instagram links need your Instagram account in Setup first. Sign in on instagram.com in this browser, then click "Connect my Instagram account".';
}

function bestInstagramVideoVariant(variants) {
  if (!Array.isArray(variants)) return null;
  const playable = variants
    .filter((variant) => clampString(variant?.url, ''))
    .sort((left, right) => {
      const leftArea = Number(left?.width || 0) * Number(left?.height || 0);
      const rightArea = Number(right?.width || 0) * Number(right?.height || 0);
      return rightArea - leftArea;
    });

  return playable[0] || null;
}

function bestInstagramImageCandidate(candidates) {
  if (!Array.isArray(candidates)) return null;
  const ordered = candidates
    .filter((candidate) => clampString(candidate?.url, ''))
    .sort((left, right) => {
      const leftArea = Number(left?.width || 0) * Number(left?.height || 0);
      const rightArea = Number(right?.width || 0) * Number(right?.height || 0);
      return rightArea - leftArea;
    });

  return ordered[0] || null;
}

function inferInstagramMediaItems(instagramMedia) {
  const baseItem = instagramMedia && typeof instagramMedia === 'object' ? instagramMedia : {};
  const username = sanitizeFileName(baseItem.user?.username || 'instagram');
  const mediaId = sanitizeFileName(baseItem.code || baseItem.id || baseItem.pk || 'instagram');
  const mediaNodes = Array.isArray(baseItem.carousel_media) && baseItem.carousel_media.length
    ? baseItem.carousel_media
    : [baseItem];
  const items = [];

  for (const media of mediaNodes) {
    if (!media || typeof media !== 'object') {
      continue;
    }

    if (Number(media.media_type) === 2 && Array.isArray(media.video_versions)) {
      const video = bestInstagramVideoVariant(media.video_versions);
      if (video?.url) {
        items.push({
          sourceUrl: video.url,
          kind: 'video'
        });
        continue;
      }
    }

    const image = bestInstagramImageCandidate(media.image_versions2?.candidates);
    if (image?.url) {
      items.push({
        sourceUrl: image.url,
        kind: 'photo'
      });
    }
  }

  const uniqueItems = uniqueBy(items, (item) => item.sourceUrl);
  return uniqueItems.map((item, index) => {
    const ext = extractExtensionFromUrl(item.sourceUrl, item.kind === 'photo' ? 'jpg' : 'mp4');
    return {
      sourceUrl: item.sourceUrl,
      kind: item.kind,
      filename: `${username}_${mediaId}_${index + 1}.${ext}`,
      label: `${username}/${mediaId}/${index + 1}`
    };
  });
}

function decodeEscapedJsonString(value) {
  const input = String(value || '');
  if (!input) {
    return '';
  }

  try {
    return JSON.parse(`"${input}"`).replace(/\\\//g, '/');
  } catch {
    return input
      .replace(/\\u0026/gi, '&')
      .replace(/\\\//g, '/')
      .replace(/\\"/g, '"');
  }
}

function getInstagramPublicEmbedSection(embedHtml) {
  const start = embedHtml.indexOf('\\"gql_data\\":');
  if (start < 0) {
    return '';
  }

  const end = embedHtml.indexOf('\\"taken_at_timestamp\\":', start);
  return end > start ? embedHtml.slice(start, end) : embedHtml.slice(start);
}

function bestInstagramEmbedDisplayResource(section) {
  const displayResourcesMatch = section.match(/\\"display_resources\\":\[(.*?)\],\\"is_video\\":/s);
  if (displayResourcesMatch?.[1]) {
    const displaySources = Array.from(
      displayResourcesMatch[1].matchAll(/\\"src\\":\\"([^"]+)\\"/g),
      (match) => decodeEscapedJsonString(match[1])
    ).filter(Boolean);

    if (displaySources.length) {
      return displaySources[displaySources.length - 1];
    }
  }

  return decodeEscapedJsonString(section.match(/\\"display_url\\":\\"([^"]+)\\"/)?.[1] || '');
}

function inferInstagramPublicEmbedMedia(embedHtml, oembedData = null) {
  const section = getInstagramPublicEmbedSection(embedHtml);
  if (!section) {
    return {
      type: '',
      mediaItems: []
    };
  }

  const type = section.match(/\\"__typename\\":\\"([^"\\]+)\\"/)?.[1] || '';
  const username = sanitizeFileName(oembedData?.author_name || 'instagram');
  const mediaId = sanitizeFileName(extractInstagramMediaId(oembedData) || 'instagram');

  if (type === 'GraphVideo') {
    const videoUrl = decodeEscapedJsonString(section.match(/\\"video_url\\":\\"([^"]+)\\"/)?.[1] || '');
    if (videoUrl) {
      return {
        type,
        mediaItems: [{
          sourceUrl: videoUrl,
          kind: 'video',
          filename: `${username}_${mediaId}_1.mp4`,
          label: `${username}/${mediaId}/1`
        }]
      };
    }
  }

  if (type === 'GraphImage') {
    const imageUrl = bestInstagramEmbedDisplayResource(section);
    if (imageUrl) {
      const ext = extractExtensionFromUrl(imageUrl, 'jpg');
      return {
        type,
        mediaItems: [{
          sourceUrl: imageUrl,
          kind: 'photo',
          filename: `${username}_${mediaId}_1.${ext}`,
          label: `${username}/${mediaId}/1`
        }]
      };
    }
  }

  return {
    type,
    mediaItems: []
  };
}

async function fetchInstagramPublicEmbedMedia(postUrl, oembedData = null) {
  const embedUrl = new URL('embed/captioned/', postUrl);

  try {
    const response = await fetch(embedUrl.toString(), {
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    const html = await response.text();

    if (!response.ok) {
      return {
        type: '',
        mediaItems: []
      };
    }

    return inferInstagramPublicEmbedMedia(html, oembedData);
  } catch {
    return {
      type: '',
      mediaItems: []
    };
  }
}

async function fetchInstagramOembed(postUrl) {
  const apiUrl = new URL(INSTAGRAM_OEMBED_URL);
  apiUrl.searchParams.set('url', postUrl);

  const { response, data, text } = await fetchJsonResponse(apiUrl.toString(), {
    headers: {
      Accept: 'application/json',
      'x-ig-app-id': INSTAGRAM_WEB_APP_ID,
      'x-requested-with': 'XMLHttpRequest'
    }
  });

  return {
    ok: response.ok && data?.status !== 'fail',
    status: response.status,
    data,
    text
  };
}

async function fetchInstagramMediaInfo({ mediaId, csrfToken = '', requestTag = '' }) {
  const apiUrl = new URL(`${INSTAGRAM_MEDIA_INFO_BASE_URL}/${encodeURIComponent(mediaId)}/info/`);
  if (requestTag) {
    apiUrl.searchParams.set('ttd_ig_req', requestTag);
  }

  const { response, data, text } = await fetchJsonResponse(apiUrl.toString(), {
    credentials: 'omit',
    referrer: INSTAGRAM_HOME_URL,
    headers: {
      Accept: '*/*',
      'x-asbd-id': INSTAGRAM_ASBD_ID,
      'x-csrftoken': csrfToken,
      'x-ig-app-id': INSTAGRAM_WEB_APP_ID,
      'x-ig-www-claim': '0',
      'x-requested-with': 'XMLHttpRequest'
    }
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Your saved Instagram account details were rejected by Instagram. Sign in on Instagram again, then click "Connect my Instagram account".');
    }

    const message = data?.message || data?.error_type || text || `Request failed with ${response.status}`;
    throw new Error(normalizeInlineWhitespace(message));
  }

  if (data?.status === 'fail') {
    const message = data?.message || data?.error_type || text || 'Instagram could not open that post.';
    throw new Error(normalizeInlineWhitespace(message));
  }

  return Array.isArray(data?.items) ? data.items[0] || null : null;
}

async function fetchInstagramMediaIdFromSavedSession(postInfo, cookieHeader) {
  return withTemporaryInstagramCookieHeader(cookieHeader, async (requestTag) => {
    const postUrl = new URL(postInfo.canonicalUrl);
    postUrl.searchParams.set('ttd_ig_req', requestTag);

    const response = await fetch(postUrl.toString(), {
      credentials: 'omit',
      referrer: INSTAGRAM_HOME_URL,
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    const html = await response.text();

    if (!response.ok) {
      throw new Error(`Instagram could not open that post with your saved account (${response.status}).`);
    }

    return extractInstagramMediaIdFromHtml(html);
  });
}

async function resolveInstagramMediaWithSavedSession(mediaId, oembedData = null) {
  const session = await getSavedInstagramSession();
  const instagramMedia = await withTemporaryInstagramCookieHeader(session.cookieHeader, async (requestTag) => fetchInstagramMediaInfo({
    mediaId,
    csrfToken: session.csrfToken,
    requestTag
  }));
  const mediaItems = inferInstagramMediaItems(instagramMedia);

  if (!mediaItems.length) {
    throw new Error(getInstagramRestrictionErrorMessage(oembedData, true));
  }

  return mediaItems;
}

async function resolveInstagramMedia(inputUrl) {
  const postInfo = extractInstagramPostInfo(inputUrl);
  if (!postInfo) {
    throw new Error('Could not find an Instagram post in that URL.');
  }

  const oembed = await fetchInstagramOembed(postInfo.canonicalUrl);
  let mediaId = extractInstagramMediaId(oembed.data);
  const publicEmbed = await fetchInstagramPublicEmbedMedia(postInfo.canonicalUrl, oembed.data);
  const savedInstagramCookies = await getUsableInstagramCookieHeader();

  if (savedInstagramCookies && !mediaId) {
    try {
      mediaId = await fetchInstagramMediaIdFromSavedSession(postInfo, savedInstagramCookies);
    } catch (error) {
      if (!publicEmbed.mediaItems.length) {
        throw error;
      }
    }
  }

  if (savedInstagramCookies && mediaId) {
    try {
      return await resolveInstagramMediaWithSavedSession(mediaId, oembed.data);
    } catch (error) {
      if (!publicEmbed.mediaItems.length) {
        throw error;
      }
    }
  }

  if (publicEmbed.mediaItems.length) {
    return publicEmbed.mediaItems;
  }

  if (publicEmbed.type === 'GraphSidecar') {
    throw new Error('Instagram multi-item posts currently need your Instagram account in Setup. Sign in on instagram.com in this browser, then click "Connect my Instagram account".');
  }

  if (!mediaId) {
    throw new Error('Instagram did not return a media ID for that post. Try reconnecting your Instagram account in Setup.');
  }

  throw new Error(getInstagramRestrictionErrorMessage(oembed.data, false));
}

function decodeHtmlAttributeValue(value) {
  return String(value || '')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function extractGenericAlbumAlbumSection(html, albumId) {
  const input = String(html || '');
  const albumMarker = `id="album_${albumId}"`;
  const markerIndex = input.indexOf(albumMarker);
  if (markerIndex < 0) {
    return input;
  }

  const start = input.lastIndexOf('<div', markerIndex);
  const endMarkers = [
    '<div class="comments',
    '<div class="clearfix"></div>'
  ];
  const end = endMarkers
    .map((marker) => input.indexOf(marker, markerIndex))
    .filter((index) => index > markerIndex)
    .sort((left, right) => left - right)[0];
  return input.slice(start >= 0 ? start : markerIndex, end || undefined);
}

function getGenericAlbumMediaUrlInfo(rawUrl, albumInfo) {
  let parsed;
  try {
    parsed = new URL(decodeHtmlAttributeValue(rawUrl), albumInfo.canonicalUrl);
  } catch {
    return null;
  }

  if (parsed.protocol !== 'https:' || !hostMatchesDomain(parsed.hostname, 'generic_album.com')) {
    return null;
  }

  const extension = extractExtensionFromUrl(parsed.toString(), '').toLowerCase();
  if (!GENERIC_ALBUM_MEDIA_FILE_EXTENSIONS.has(extension)) {
    return null;
  }

  if (!parsed.pathname.includes(`/${albumInfo.albumId}/`) || parsed.pathname.includes('/thumbs/')) {
    return null;
  }

  const kind = GENERIC_ALBUM_VIDEO_FILE_EXTENSIONS.has(extension) ? 'video' : 'photo';
  return {
    url: parsed.toString(),
    extension,
    kind
  };
}

function getGenericAlbumMediaStem(inputUrl) {
  try {
    const parsed = new URL(inputUrl);
    const basename = parsed.pathname.split('/').pop() || '';
    return basename
      .replace(/\.[a-z0-9]{2,5}$/i, '')
      .replace(/_(?:\d+p|source|mobile)$/i, '');
  } catch {
    return inputUrl;
  }
}

function getGenericAlbumVideoResolution(inputUrl) {
  try {
    const basename = new URL(inputUrl).pathname.split('/').pop() || '';
    return Number(basename.match(/_(\d+)p\.[a-z0-9]+$/i)?.[1] || 0);
  } catch {
    return 0;
  }
}

function extractGenericAlbumMediaItemsFromHtml(html, albumInfo) {
  const section = extractGenericAlbumAlbumSection(html, albumInfo.albumId);
  const attributePattern = /\b(?:src|data-src|data-original|href|poster)=["']([^"']+)["']/gi;
  const videosByStem = new Map();
  const images = [];
  const seenImages = new Set();
  let match;

  while ((match = attributePattern.exec(section))) {
    const media = getGenericAlbumMediaUrlInfo(match[1], albumInfo);
    if (!media) {
      continue;
    }

    const stem = getGenericAlbumMediaStem(media.url);
    if (media.kind === 'video') {
      const current = videosByStem.get(stem);
      if (!current || getGenericAlbumVideoResolution(media.url) > getGenericAlbumVideoResolution(current.url)) {
        videosByStem.set(stem, media);
      }
      continue;
    }

    if (!seenImages.has(media.url)) {
      seenImages.add(media.url);
      images.push({
        ...media,
        stem
      });
    }
  }

  const videos = Array.from(videosByStem.values());
  const videoStems = new Set(videos.map((item) => getGenericAlbumMediaStem(item.url)));
  const mediaItems = [
    ...videos,
    ...images.filter((item) => !videoStems.has(item.stem))
  ];

  return mediaItems.map((item, index) => {
    const ext = extractExtensionFromUrl(item.url, item.extension || (item.kind === 'photo' ? 'jpg' : 'mp4'));
    const rawName = item.url ? new URL(item.url).pathname.split('/').pop() || '' : '';
    const baseName = sanitizeFileName(rawName || `generic_album_${albumInfo.albumId}_${index + 1}.${ext}`);
    return {
      sourceUrl: item.url,
      referrerUrl: albumInfo.canonicalUrl,
      kind: item.kind,
      filename: baseName.includes('.') ? baseName : `${baseName}.${ext}`,
      label: `GenericAlbum/${albumInfo.albumId}/${index + 1}`
    };
  });
}

async function getRemoteMediaContentLength(sourceUrl, referrerUrl) {
  return withTemporaryReferrerHeader(sourceUrl, referrerUrl, async () => {
    const response = await fetch(sourceUrl, {
      method: 'HEAD',
      credentials: 'omit',
      referrer: referrerUrl,
      referrerPolicy: 'origin',
      headers: {
        Accept: 'video/*,*/*;q=0.8',
        Referer: referrerUrl
      }
    });

    if (response.ok && isAllowedMediaContentType(response.headers.get('content-type') || '')) {
      const contentLength = Number(response.headers.get('content-length') || 0);
      if (Number.isFinite(contentLength) && contentLength > 0) {
        return contentLength;
      }
    }

    const probeResponse = await fetch(sourceUrl, {
      credentials: 'omit',
      referrer: referrerUrl,
      referrerPolicy: 'origin',
      headers: {
        Accept: 'video/*,*/*;q=0.8',
        Range: 'bytes=0-0',
        Referer: referrerUrl
      }
    });
    try {
      if (probeResponse.status === 206 && isAllowedMediaContentType(probeResponse.headers.get('content-type') || '')) {
        return parseContentRangeTotalBytes(probeResponse.headers.get('content-range'));
      }
    } finally {
      try {
        await probeResponse.body?.cancel?.();
      } catch {}
    }

    return 0;
  });
}

async function annotateRemoteStreamMediaItems(mediaItems) {
  return Promise.all(mediaItems.map(async (item) => {
    if (item.kind !== 'video' || !item.referrerUrl) {
      return item;
    }

    let contentLength = 0;
    try {
      contentLength = await getRemoteMediaContentLength(item.sourceUrl, item.referrerUrl);
    } catch {}

    if (!contentLength || contentLength <= MAX_REMOTE_DOWNLOAD_BYTES) {
      return item;
    }

    return {
      ...item,
      contentLength,
      contentType: guessContentTypeFromExtension(extractExtensionFromUrl(item.sourceUrl, 'mp4'), 'video/mp4'),
      streamUpload: true
    };
  }));
}

async function resolveGenericAlbumMedia(inputUrl) {
  const albumInfo = extractGenericAlbumAlbumInfo(inputUrl);
  if (!albumInfo) {
    throw new Error('Could not find an GenericAlbum album in that URL.');
  }

  const response = await fetch(albumInfo.canonicalUrl, {
    credentials: 'omit',
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
  });
  const html = await response.text();

  if (!response.ok) {
    throw new Error(`GenericAlbum could not open that album (${response.status}).`);
  }

  const mediaItems = extractGenericAlbumMediaItemsFromHtml(html, albumInfo);
  if (!mediaItems.length) {
    throw new Error('No downloadable media was found in that GenericAlbum album.');
  }

  return annotateRemoteStreamMediaItems(mediaItems);
}

function extractGenericVideoPlayerValue(html, key) {
  const pattern = new RegExp(`EP\\.video\\.player\\.${escapeRegex(key)}\\s*=\\s*(['"])(.*?)\\1`, 'i');
  const match = String(html || '').match(pattern);
  return match ? decodeHtmlAttributeValue(match[2]) : '';
}

function buildGenericVideoHashToken(hash) {
  const normalized = String(hash || '').trim().toLowerCase();
  if (!/^[a-f0-9]{32}$/.test(normalized)) {
    return '';
  }

  let token = '';
  for (let index = 0; index < normalized.length; index += 8) {
    token += parseInt(normalized.slice(index, index + 8), 16).toString(36);
  }
  return token;
}

function buildGenericVideoVideoApiUrl(videoInfo, hash) {
  const url = new URL(`xhr/video/${encodeURIComponent(videoInfo.videoId)}`, GENERIC_VIDEO_HOME_URL);
  url.searchParams.set('hash', buildGenericVideoHashToken(hash));
  url.searchParams.set('domain', 'www.generic_video.com');
  url.searchParams.set('pixelRatio', '1');
  url.searchParams.set('playerWidth', '1920');
  url.searchParams.set('playerHeight', '1080');
  url.searchParams.set('fallback', 'false');
  url.searchParams.set('embed', 'false');
  url.searchParams.set('supportedFormats', 'mp4');
  url.searchParams.set('_', String(Date.now()));
  return url.toString();
}

function getGenericVideoSourceResolution(source) {
  const label = `${source?.labelShort || ''} ${source?.label || ''}`;
  const resolution = Number(label.match(/(\d+)\s*p/i)?.[1] || 0);
  return Number.isFinite(resolution) ? resolution : 0;
}

function extractGenericVideoMp4Sources(videoJson) {
  const sources = videoJson?.sources?.mp4 || {};
  return Object.entries(sources)
    .map(([label, source]) => {
      let parsed;
      try {
        parsed = new URL(source?.src || '');
      } catch {
        return null;
      }

      const extension = extractExtensionFromUrl(parsed.toString(), '').toLowerCase();
      if (
        parsed.protocol !== 'https:'
        || !hostMatchesDomain(parsed.hostname, 'generic_video.com')
        || !GENERIC_VIDEO_VIDEO_FILE_EXTENSIONS.has(extension)
      ) {
        return null;
      }

      const labelShort = clampString(source?.labelShort, label);
      const resolution = getGenericVideoSourceResolution({
        label,
        labelShort
      });
      return {
        url: parsed.toString(),
        label,
        labelShort,
        resolution,
        isDefault: Boolean(source?.default),
        extension
      };
    })
    .filter(Boolean)
    .sort((left, right) => {
      const resolutionDelta = right.resolution - left.resolution;
      if (resolutionDelta) {
        return resolutionDelta;
      }
      return Number(right.isDefault) - Number(left.isDefault);
    });
}

async function chooseGenericVideoMp4Source(sources, referrerUrl) {
  const selected = sources[0] || null;
  if (!selected) {
    throw new Error('No downloadable MP4 source was found for that GenericVideo video.');
  }

  let contentLength = 0;
  try {
    contentLength = await getRemoteMediaContentLength(selected.url, referrerUrl);
  } catch {}

  return {
    ...selected,
    contentLength
  };
}

async function resolveGenericVideoMedia(inputUrl) {
  const videoInfo = extractGenericVideoVideoInfo(inputUrl);
  if (!videoInfo) {
    throw new Error('Could not find an GenericVideo video in that URL.');
  }

  const pageResponse = await fetch(videoInfo.canonicalUrl, {
    credentials: 'omit',
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
  });
  const html = await pageResponse.text();
  if (!pageResponse.ok) {
    throw new Error(`GenericVideo could not open that video (${pageResponse.status}).`);
  }

  const pageVideoId = extractGenericVideoPlayerValue(html, 'vid') || videoInfo.videoId;
  const hash = extractGenericVideoPlayerValue(html, 'hash');
  const hashToken = buildGenericVideoHashToken(hash);
  if (!hashToken || pageVideoId !== videoInfo.videoId) {
    throw new Error('GenericVideo did not expose a playable video token for that page.');
  }

  const apiUrl = buildGenericVideoVideoApiUrl(videoInfo, hash);
  const apiText = await withTemporaryReferrerHeader(apiUrl, videoInfo.canonicalUrl, async () => {
    const apiResponse = await fetch(apiUrl, {
      credentials: 'omit',
      referrer: videoInfo.canonicalUrl,
      referrerPolicy: 'origin',
      headers: {
        Accept: 'application/json,text/plain,*/*',
        Referer: videoInfo.canonicalUrl
      }
    });
    const text = await apiResponse.text();
    if (!apiResponse.ok) {
      throw new Error(`GenericVideo could not resolve that video (${apiResponse.status}).`);
    }
    return text;
  });

  let videoJson = null;
  try {
    videoJson = JSON.parse(apiText);
  } catch {
    throw new Error('GenericVideo returned an unreadable video response.');
  }

  if (videoJson?.available === false) {
    throw new Error(videoJson.message || 'That GenericVideo video is not available.');
  }

  const sources = extractGenericVideoMp4Sources(videoJson);
  if (!sources.length) {
    throw new Error('No downloadable MP4 source was found for that GenericVideo video.');
  }

  const selected = await chooseGenericVideoMp4Source(sources, videoInfo.canonicalUrl);
  const quality = selected.labelShort || selected.label || 'video';
  const filenameQuality = sanitizeFileName(String(quality).toLowerCase().replace(/\s+/g, '_')) || 'video';

  return [{
    sourceUrl: selected.url,
    referrerUrl: videoInfo.canonicalUrl,
    kind: 'video',
    filename: `generic_video_${videoInfo.videoId}_${filenameQuality}.${selected.extension || 'mp4'}`,
    label: `GenericVideo/${videoInfo.videoId}/${quality}`,
    contentLength: selected.contentLength || 0,
    contentType: 'video/mp4',
    streamUpload: true
  }];
}

function resolveDirectMedia(inputUrl) {
  const parsed = assertAllowedDownloadUrl(inputUrl);
  const extension = extractExtensionFromUrl(parsed.toString());
  const rawName = parsed.pathname.split('/').pop() || `download.${extension}`;

  return [{
    sourceUrl: parsed.toString(),
    kind: 'direct',
    filename: sanitizeFileName(rawName),
    label: parsed.hostname
  }];
}

async function resolveMediaItems(inputUrl) {
  const tweetId = extractTweetId(inputUrl);
  if (tweetId) {
    return resolveTweetMedia(inputUrl);
  }

  const instagramPost = extractInstagramPostInfo(inputUrl);
  if (instagramPost) {
    return resolveInstagramMedia(inputUrl);
  }

  const generic_albumAlbum = extractGenericAlbumAlbumInfo(inputUrl);
  if (generic_albumAlbum) {
    return resolveGenericAlbumMedia(inputUrl);
  }

  const generic_videoVideo = extractGenericVideoVideoInfo(inputUrl);
  if (generic_videoVideo) {
    return resolveGenericVideoMedia(inputUrl);
  }

  return resolveDirectMedia(inputUrl);
}

function buildDropboxCommitInfo(filePath, overwriteExisting) {
  return {
    path: filePath,
    mode: overwriteExisting ? 'overwrite' : 'add',
    autorename: !overwriteExisting,
    mute: false,
    strict_conflict: false
  };
}

async function fetchDropboxContentJson(url, { accessToken, apiArg, bytes }) {
  return fetchJson(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/octet-stream',
      'Dropbox-API-Arg': JSON.stringify(apiArg)
    },
    body: bytes
  });
}

async function createDropboxFolder(accessToken, folderPath) {
  try {
    await fetchJson(DROPBOX_CREATE_FOLDER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        path: folderPath,
        autorename: false
      })
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!/path\/conflict\/folder/i.test(message)) {
      throw error;
    }
  }
}

async function ensureDropboxFolder(accessToken, folder) {
  const segments = getDropboxFolderSegments(folder);
  let currentPath = '';
  for (const segment of segments) {
    currentPath = `${currentPath}/${segment}`.replace(/\/+/g, '/');
    await createDropboxFolder(accessToken, currentPath);
  }
}

async function uploadToDropboxSession({ accessToken, filePath, bytes, overwriteExisting }) {
  const totalBytes = bytes.byteLength || 0;
  let offset = Math.min(DROPBOX_UPLOAD_CHUNK_BYTES, totalBytes);
  const startResult = await fetchDropboxContentJson(DROPBOX_UPLOAD_SESSION_START_URL, {
    accessToken,
    apiArg: { close: false },
    bytes: bytes.slice(0, offset)
  });
  const sessionId = clampString(startResult?.session_id, '');
  if (!sessionId) {
    throw new Error('Dropbox did not return an upload session.');
  }

  while ((totalBytes - offset) > DROPBOX_UPLOAD_CHUNK_BYTES) {
    const nextOffset = offset + DROPBOX_UPLOAD_CHUNK_BYTES;
    await fetchDropboxContentJson(DROPBOX_UPLOAD_SESSION_APPEND_URL, {
      accessToken,
      apiArg: {
        cursor: {
          session_id: sessionId,
          offset
        },
        close: false
      },
      bytes: bytes.slice(offset, nextOffset)
    });
    offset = nextOffset;
  }

  return fetchDropboxContentJson(DROPBOX_UPLOAD_SESSION_FINISH_URL, {
    accessToken,
    apiArg: {
      cursor: {
        session_id: sessionId,
        offset
      },
      commit: buildDropboxCommitInfo(filePath, overwriteExisting)
    },
    bytes: bytes.slice(offset)
  });
}

async function uploadToDropbox({ accessToken, filePath, bytes, overwriteExisting }) {
  if ((bytes.byteLength || 0) > DROPBOX_SIMPLE_UPLOAD_MAX_BYTES) {
    return uploadToDropboxSession({ accessToken, filePath, bytes, overwriteExisting });
  }

  return fetchDropboxContentJson(DROPBOX_UPLOAD_URL, {
    accessToken,
    apiArg: buildDropboxCommitInfo(filePath, overwriteExisting),
    bytes
  });
}

async function createGoogleDriveUploadSession({ accessToken, settings, filename, contentType, contentLength, overwriteExisting }) {
  const folder = await ensureGoogleDriveFolder(accessToken, settings);
  const existingFile = overwriteExisting
    ? await findGoogleDriveFileInFolder(accessToken, {
        folderId: folder.id,
        filename
      })
    : null;
  const metadata = {
    name: filename
  };

  if (!existingFile?.id && folder.id) {
    metadata.parents = [folder.id];
  }

  const uploadUrl = existingFile?.id
    ? `${GOOGLE_DRIVE_UPLOAD_URL}/${encodeURIComponent(existingFile.id)}?uploadType=resumable&fields=id,name,size,webViewLink,webContentLink`
    : `${GOOGLE_DRIVE_UPLOAD_URL}?uploadType=resumable&fields=id,name,size,webViewLink,webContentLink`;
  const sessionResponse = await fetch(uploadUrl, {
    method: existingFile?.id ? 'PATCH' : 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Upload-Content-Type': contentType || 'application/octet-stream',
      'X-Upload-Content-Length': String(Math.max(0, Number(contentLength || 0)))
    },
    body: JSON.stringify(metadata)
  });
  const sessionText = await sessionResponse.text();
  if (!sessionResponse.ok) {
    throw new Error(sessionText || `Google Drive upload session failed with ${sessionResponse.status}`);
  }

  const uploadLocation = sessionResponse.headers.get('Location');
  if (!uploadLocation) {
    throw new Error('Google Drive did not return an upload session.');
  }

  return {
    uploadLocation,
    folderName: folder.name || settings.googleDriveFolderName
  };
}

async function uploadToGoogleDrive({ accessToken, settings, filename, bytes, contentType, overwriteExisting }) {
  const session = await createGoogleDriveUploadSession({
    accessToken,
    settings,
    filename,
    contentType,
    contentLength: bytes.byteLength || 0,
    overwriteExisting
  });

  const uploadResponse = await fetch(session.uploadLocation, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType || 'application/octet-stream'
    },
    body: bytes
  });
  const uploadText = await uploadResponse.text();
  let uploadData = null;
  try {
    uploadData = uploadText ? JSON.parse(uploadText) : null;
  } catch {
    uploadData = null;
  }

  if (!uploadResponse.ok) {
    throw new Error(uploadData?.error?.message || uploadText || `Google Drive upload failed with ${uploadResponse.status}`);
  }

  return {
    metadata: uploadData || {},
    folderName: session.folderName
  };
}

function isAllowedMediaContentType(contentType) {
  const normalized = String(contentType || '').split(';')[0].trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  return ALLOWED_MEDIA_CONTENT_TYPE_PREFIXES.some((prefix) => normalized.startsWith(prefix))
    || ALLOWED_MEDIA_CONTENT_TYPES.has(normalized);
}

function assertAllowedDownloadResponse(response) {
  const contentLength = Number(response.headers.get('content-length') || 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_REMOTE_DOWNLOAD_BYTES) {
    throw new Error('That media file is too large to download.');
  }

  const contentType = response.headers.get('content-type') || '';
  if (!isAllowedMediaContentType(contentType)) {
    throw new Error('That URL did not return an image or video file.');
  }
}

async function readLimitedArrayBuffer(response, { onProgress = null, onChunk = null } = {}) {
  const expectedBytes = Number(response.headers.get('content-length') || 0);
  const totalExpectedBytes = Number.isFinite(expectedBytes) && expectedBytes > 0 ? expectedBytes : 0;

  async function reportProgress(loadedBytes, force = false) {
    if (typeof onProgress !== 'function') {
      return;
    }
    await onProgress({
      loadedBytes,
      totalBytes: totalExpectedBytes,
      force
    });
  }

  if (!response.body?.getReader) {
    const buffer = await response.arrayBuffer();
    if (buffer.byteLength > MAX_REMOTE_DOWNLOAD_BYTES) {
      throw new Error('That media file is too large to download.');
    }
    if (typeof onChunk === 'function') {
      onChunk(buffer.byteLength);
    }
    await reportProgress(buffer.byteLength, true);
    return buffer;
  }

  const reader = response.body.getReader();
  const chunks = [];
  let totalBytes = 0;
  let lastProgressAt = 0;
  let lastProgressBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      if (!value?.byteLength) {
        continue;
      }

      totalBytes += value.byteLength;
      if (totalBytes > MAX_REMOTE_DOWNLOAD_BYTES) {
        await reader.cancel();
        throw new Error('That media file is too large to download.');
      }
      if (typeof onChunk === 'function') {
        onChunk(totalBytes);
      }
      chunks.push(value);

      const now = Date.now();
      if (
        now - lastProgressAt >= DOWNLOAD_PROGRESS_MIN_INTERVAL_MS
        || totalBytes - lastProgressBytes >= DOWNLOAD_PROGRESS_MIN_BYTES
        || totalBytes === totalExpectedBytes
      ) {
        lastProgressAt = now;
        lastProgressBytes = totalBytes;
        await reportProgress(totalBytes, totalBytes === totalExpectedBytes);
      }
    }
  } finally {
    reader.releaseLock();
  }

  await reportProgress(totalBytes, true);

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes.buffer;
}

function isGenericAlbumAlbumReferrer(referrerUrl) {
  return Boolean(referrerUrl && extractGenericAlbumAlbumInfo(referrerUrl));
}

function isGenericAlbumVideoDownloadUrl(inputUrl) {
  try {
    const parsed = new URL(inputUrl);
    const extension = extractExtensionFromUrl(parsed.toString(), '').toLowerCase();
    return hostMatchesDomain(parsed.hostname, 'generic_album.com') && GENERIC_ALBUM_VIDEO_FILE_EXTENSIONS.has(extension);
  } catch {
    return false;
  }
}

function isGenericVideoVideoReferrer(referrerUrl) {
  return Boolean(referrerUrl && extractGenericVideoVideoInfo(referrerUrl));
}

function isGenericVideoVideoDownloadUrl(inputUrl) {
  try {
    const parsed = new URL(inputUrl);
    const extension = extractExtensionFromUrl(parsed.toString(), '').toLowerCase();
    return hostMatchesDomain(parsed.hostname, 'generic_video.com') && GENERIC_VIDEO_VIDEO_FILE_EXTENSIONS.has(extension);
  } catch {
    return false;
  }
}

function isParallelRangeDownloadCandidate(inputUrl, referrerUrl) {
  return (isGenericAlbumAlbumReferrer(referrerUrl) && isGenericAlbumVideoDownloadUrl(inputUrl))
    || (isGenericVideoVideoReferrer(referrerUrl) && isGenericVideoVideoDownloadUrl(inputUrl));
}

function parseContentRangeTotalBytes(contentRange) {
  const match = String(contentRange || '').match(/\/(\d+)\s*$/);
  const totalBytes = Number(match?.[1] || 0);
  return Number.isFinite(totalBytes) && totalBytes > 0 ? totalBytes : 0;
}

function shouldProbeParallelRangeDownload(inputUrl, referrerUrl) {
  return isParallelRangeDownloadCandidate(inputUrl, referrerUrl);
}

function shouldUseParallelRangeDownload(inputUrl, response, referrerUrl) {
  if (!isParallelRangeDownloadCandidate(inputUrl, referrerUrl)) {
    return false;
  }

  let parsed;
  try {
    parsed = new URL(inputUrl);
  } catch {
    return false;
  }

  if (!hostMatchesDomain(parsed.hostname, 'generic_album.com') && !hostMatchesDomain(parsed.hostname, 'generic_video.com')) {
    return false;
  }

  const contentLength = Number(response.headers.get('content-length') || 0);
  if (!Number.isFinite(contentLength) || contentLength < PARALLEL_RANGE_DOWNLOAD_MIN_BYTES) {
    return false;
  }

  const acceptsRanges = response.headers.get('accept-ranges') || '';
  const contentType = response.headers.get('content-type') || '';
  return acceptsRanges.toLowerCase().includes('bytes') && contentType.toLowerCase().startsWith('video/');
}

function shouldUseParallelRangeProbeResponse(inputUrl, response, referrerUrl) {
  if (!shouldProbeParallelRangeDownload(inputUrl, referrerUrl) || response.status !== 206) {
    return false;
  }

  const totalBytes = parseContentRangeTotalBytes(response.headers.get('content-range'));
  if (totalBytes < PARALLEL_RANGE_DOWNLOAD_MIN_BYTES || totalBytes > MAX_REMOTE_DOWNLOAD_BYTES) {
    return false;
  }

  const contentType = response.headers.get('content-type') || '';
  return contentType.toLowerCase().startsWith('video/');
}

async function fetchParallelRangeBinary(inputUrl, {
  baseInit,
  totalBytes,
  contentType,
  onProgress = null,
  onChunk = null,
  abortDownload = null
}) {
  if (totalBytes > MAX_REMOTE_DOWNLOAD_BYTES) {
    throw new Error('That media file is too large to download.');
  }

  const ranges = [];
  for (let start = 0; start < totalBytes; start += PARALLEL_RANGE_DOWNLOAD_CHUNK_BYTES) {
    ranges.push({
      start,
      end: Math.min(totalBytes - 1, start + PARALLEL_RANGE_DOWNLOAD_CHUNK_BYTES - 1)
    });
  }

  const output = new Uint8Array(totalBytes);
  const rangeProgress = new Array(ranges.length).fill(0);
  let loadedBytes = 0;
  let nextRangeIndex = 0;

  async function reportProgress(force = false) {
    if (typeof onProgress === 'function') {
      await onProgress({
        loadedBytes,
        totalBytes,
        force
      });
    }
  }

  async function fetchRange(range, index) {
    await acquireParallelRangeRequestSlot();
    try {
      const response = await fetch(inputUrl, {
        ...baseInit,
        headers: {
          ...(baseInit.headers || {}),
          Range: `bytes=${range.start}-${range.end}`
        }
      });

      if (response.status !== 206) {
        throw new Error(`Download failed with ${response.status}`);
      }

      const buffer = await readLimitedArrayBuffer(response, {
        onProgress: async ({ loadedBytes: rangeLoadedBytes = 0 } = {}) => {
          const safeRangeLoadedBytes = Math.max(0, Number(rangeLoadedBytes || 0));
          const delta = Math.max(0, safeRangeLoadedBytes - rangeProgress[index]);
          if (!delta) {
            return;
          }
          rangeProgress[index] = safeRangeLoadedBytes;
          loadedBytes += delta;
          await reportProgress(false);
        },
        onChunk
      });
      const bytes = new Uint8Array(buffer);
      output.set(bytes, range.start);

      const expectedLength = range.end - range.start + 1;
      const missingBytes = expectedLength - rangeProgress[index];
      if (missingBytes > 0) {
        rangeProgress[index] = expectedLength;
        loadedBytes += missingBytes;
      }
      await reportProgress(loadedBytes >= totalBytes);
    } finally {
      releaseParallelRangeRequestSlot();
    }
  }

  async function worker() {
    while (nextRangeIndex < ranges.length) {
      const index = nextRangeIndex;
      nextRangeIndex += 1;
      await fetchRange(ranges[index], index);
    }
  }

  const concurrency = Math.min(PARALLEL_RANGE_DOWNLOAD_MAX_CONCURRENCY, ranges.length);
  try {
    await Promise.all(Array.from({ length: concurrency }, () => worker()));
  } catch (error) {
    if (typeof abortDownload === 'function') {
      abortDownload();
    }
    throw error;
  }
  await reportProgress(true);

  return {
    bytes: output.buffer,
    contentType
  };
}

async function fetchBinary(inputUrl, { referrerUrl = '', isCanceled = null, onDownloadProgress = null } = {}) {
  assertAllowedDownloadUrl(inputUrl);

  const runFetch = async () => {
    const controller = new AbortController();
    let canceled = false;
    let timeoutId = null;
    const clearDownloadTimeout = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };
    const refreshDownloadTimeout = () => {
      clearDownloadTimeout();
      timeoutId = setTimeout(() => controller.abort(), REMOTE_DOWNLOAD_TIMEOUT_MS);
    };
    refreshDownloadTimeout();
    const cancelPollId = typeof isCanceled === 'function'
      ? setInterval(async () => {
          try {
            if (await isCanceled()) {
              canceled = true;
              controller.abort();
            }
          } catch {}
        }, ACTIVE_UPLOAD_PAUSE_POLL_MS)
      : null;
    const init = {
      credentials: 'omit',
      headers: {},
      signal: controller.signal
    };
    if (referrerUrl) {
      init.referrer = referrerUrl;
      init.referrerPolicy = 'origin';
      init.headers.Referer = referrerUrl;
    }

    let response;
    try {
      if (shouldProbeParallelRangeDownload(inputUrl, referrerUrl)) {
        const probeResponse = await fetch(inputUrl, {
          ...init,
          headers: {
            ...(init.headers || {}),
            Range: 'bytes=0-0'
          }
        });

        if (!probeResponse.ok) {
          clearDownloadTimeout();
          if (cancelPollId) {
            clearInterval(cancelPollId);
          }
          throw new Error(`Download failed with ${probeResponse.status}`);
        }

        if (shouldUseParallelRangeProbeResponse(inputUrl, probeResponse, referrerUrl)) {
          try {
            await probeResponse.body?.cancel?.();
          } catch {}
          const parallelResult = await fetchParallelRangeBinary(inputUrl, {
            baseInit: init,
            totalBytes: parseContentRangeTotalBytes(probeResponse.headers.get('content-range')),
            contentType: probeResponse.headers.get('content-type') || '',
            onProgress: onDownloadProgress,
            onChunk: refreshDownloadTimeout,
            abortDownload: () => controller.abort()
          });
          clearDownloadTimeout();
          if (cancelPollId) {
            clearInterval(cancelPollId);
          }
          return parallelResult;
        }

        try {
          await probeResponse.body?.cancel?.();
        } catch {}
      }

      response = await fetch(inputUrl, init);
    } catch (error) {
      clearDownloadTimeout();
      if (cancelPollId) {
        clearInterval(cancelPollId);
      }
      if (error?.name === 'AbortError') {
        throw new Error(canceled ? UPLOAD_CANCELED_MESSAGE : 'Download timed out.');
      }
      throw error;
    }

    if (!response.ok) {
      clearDownloadTimeout();
      if (cancelPollId) {
        clearInterval(cancelPollId);
      }
      throw new Error(`Download failed with ${response.status}`);
    }

    try {
      assertAllowedDownloadResponse(response);
      if (shouldUseParallelRangeDownload(inputUrl, response, referrerUrl)) {
        try {
          await response.body?.cancel?.();
        } catch {}
        return fetchParallelRangeBinary(inputUrl, {
          baseInit: init,
          totalBytes: Number(response.headers.get('content-length') || 0),
          contentType: response.headers.get('content-type') || '',
          onProgress: onDownloadProgress,
          onChunk: refreshDownloadTimeout,
          abortDownload: () => controller.abort()
        });
      }
      const buffer = await readLimitedArrayBuffer(response, {
        onProgress: onDownloadProgress,
        onChunk: refreshDownloadTimeout
      });
      return {
        bytes: buffer,
        contentType: response.headers.get('content-type') || ''
      };
    } catch (error) {
      if (error?.name === 'AbortError') {
        throw new Error(canceled ? UPLOAD_CANCELED_MESSAGE : 'Download timed out.');
      }
      throw error;
    } finally {
      clearDownloadTimeout();
      if (cancelPollId) {
        clearInterval(cancelPollId);
      }
    }
  };

  return referrerUrl
    ? withTemporaryReferrerHeader(inputUrl, referrerUrl, runFetch)
    : runFetch();
}

async function throwIfUploadCanceled(isCanceled) {
  if (typeof isCanceled === 'function' && await isCanceled()) {
    throw new Error(UPLOAD_CANCELED_MESSAGE);
  }
}

function getRemoteStreamContentLength(item) {
  const totalBytes = Number(item?.contentLength || 0);
  return Number.isFinite(totalBytes) && totalBytes > 0 ? totalBytes : 0;
}

function shouldStreamRemoteUpload(item) {
  const totalBytes = getRemoteStreamContentLength(item);
  return Boolean(item?.streamUpload && totalBytes > MAX_REMOTE_DOWNLOAD_BYTES);
}

async function fetchRemoteRangeBuffer(inputUrl, {
  referrerUrl = '',
  start,
  end,
  totalBytes,
  isCanceled = null,
  onDownloadProgress = null
}) {
  assertAllowedDownloadUrl(inputUrl);

  const rangeStart = Math.max(0, Number(start || 0));
  const rangeEnd = Math.max(rangeStart, Number(end || 0));
  const expectedLength = rangeEnd - rangeStart + 1;
  if (!Number.isFinite(expectedLength) || expectedLength <= 0 || expectedLength > MAX_REMOTE_DOWNLOAD_BYTES) {
    throw new Error('That media chunk is too large to download.');
  }

  const runFetch = async () => {
    await throwIfUploadCanceled(isCanceled);
    const controller = new AbortController();
    let canceled = false;
    let timeoutId = null;
    const clearDownloadTimeout = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };
    const refreshDownloadTimeout = () => {
      clearDownloadTimeout();
      timeoutId = setTimeout(() => controller.abort(), REMOTE_DOWNLOAD_TIMEOUT_MS);
    };
    refreshDownloadTimeout();
    const cancelPollId = typeof isCanceled === 'function'
      ? setInterval(async () => {
          try {
            if (await isCanceled()) {
              canceled = true;
              controller.abort();
            }
          } catch {}
        }, ACTIVE_UPLOAD_PAUSE_POLL_MS)
      : null;

    try {
      const headers = {
        Range: `bytes=${rangeStart}-${rangeEnd}`
      };
      if (referrerUrl) {
        headers.Referer = referrerUrl;
      }

      const response = await fetch(inputUrl, {
        credentials: 'omit',
        referrer: referrerUrl || undefined,
        referrerPolicy: referrerUrl ? 'origin' : undefined,
        headers,
        signal: controller.signal
      });

      if (response.status !== 206) {
        throw new Error(`Download failed with ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || '';
      if (!isAllowedMediaContentType(contentType)) {
        throw new Error('That URL did not return an image or video file.');
      }

      const buffer = await readLimitedArrayBuffer(response, {
        onProgress: typeof onDownloadProgress === 'function'
          ? async ({ loadedBytes = 0 } = {}) => {
              await onDownloadProgress({
                loadedBytes: Math.min(totalBytes, rangeStart + Number(loadedBytes || 0)),
                totalBytes
              });
            }
          : null,
        onChunk: refreshDownloadTimeout
      });

      if (buffer.byteLength !== expectedLength) {
        throw new Error('Download returned an incomplete media chunk.');
      }

      await throwIfUploadCanceled(isCanceled);
      return {
        bytes: buffer,
        contentType
      };
    } catch (error) {
      if (error?.name === 'AbortError') {
        throw new Error(canceled ? UPLOAD_CANCELED_MESSAGE : 'Download timed out.');
      }
      throw error;
    } finally {
      clearDownloadTimeout();
      if (cancelPollId) {
        clearInterval(cancelPollId);
      }
    }
  };

  return referrerUrl
    ? withTemporaryReferrerHeader(inputUrl, referrerUrl, runFetch)
    : runFetch();
}

function getRemoteStreamChunkEnd(offset, totalBytes) {
  return Math.min(totalBytes - 1, offset + REMOTE_STREAM_UPLOAD_CHUNK_BYTES - 1);
}

async function fetchRemoteStreamChunk(item, offset, totalBytes, options = {}) {
  return fetchRemoteRangeBuffer(item.sourceUrl, {
    referrerUrl: item.referrerUrl || '',
    start: offset,
    end: getRemoteStreamChunkEnd(offset, totalBytes),
    totalBytes,
    ...options
  });
}

function createRemoteStreamChunkPrefetcher(item, totalBytes, { isCanceled = null, onDownloadProgress = null } = {}) {
  const offsets = [];
  for (let offset = 0; offset < totalBytes; offset += REMOTE_STREAM_UPLOAD_CHUNK_BYTES) {
    offsets.push(offset);
  }

  const inFlight = new Map();
  const rangeProgress = new Map();
  let nextScheduleIndex = 0;
  let stopped = false;

  async function isPrefetchCanceled() {
    if (stopped) {
      return true;
    }
    return typeof isCanceled === 'function' && await isCanceled();
  }

  async function reportProgress(force = false) {
    if (typeof onDownloadProgress !== 'function') {
      return;
    }

    const loadedBytes = Array.from(rangeProgress.values()).reduce((total, value) => total + value, 0);
    await onDownloadProgress({
      loadedBytes: Math.min(totalBytes, loadedBytes),
      totalBytes,
      force
    });
  }

  function updateRangeProgress(offset, loadedBytes) {
    const previousLoadedBytes = rangeProgress.get(offset) || 0;
    const end = getRemoteStreamChunkEnd(offset, totalBytes);
    const chunkBytes = end - offset + 1;
    const safeLoadedBytes = Math.max(0, Math.min(chunkBytes, Number(loadedBytes || 0) - offset));
    if (safeLoadedBytes <= previousLoadedBytes) {
      return false;
    }

    rangeProgress.set(offset, safeLoadedBytes);
    return true;
  }

  async function fetchPrefetchedChunk(offset) {
    await acquireParallelRangeRequestSlot();
    try {
      return await fetchRemoteStreamChunk(item, offset, totalBytes, {
        isCanceled: isPrefetchCanceled,
        onDownloadProgress: async ({ loadedBytes = 0 } = {}) => {
          if (updateRangeProgress(offset, loadedBytes)) {
            await reportProgress(false);
          }
        }
      });
    } finally {
      releaseParallelRangeRequestSlot();
    }
  }

  function schedule() {
    while (!stopped && nextScheduleIndex < offsets.length && inFlight.size < REMOTE_STREAM_PREFETCH_CONCURRENCY) {
      const offset = offsets[nextScheduleIndex];
      nextScheduleIndex += 1;
      const promise = fetchPrefetchedChunk(offset).then(
        async (chunk) => {
          const previousLoadedBytes = rangeProgress.get(offset) || 0;
          if (chunk.bytes.byteLength > previousLoadedBytes) {
            rangeProgress.set(offset, chunk.bytes.byteLength);
            await reportProgress(offset + chunk.bytes.byteLength >= totalBytes);
          }
          return { ok: true, offset, chunk };
        },
        (error) => ({ ok: false, offset, error })
      );
      inFlight.set(offset, promise);
    }
  }

  async function take(offset) {
    schedule();
    const promise = inFlight.get(offset);
    if (!promise) {
      stopped = true;
      throw new Error('Missing prefetched media chunk.');
    }

    const result = await promise;
    inFlight.delete(offset);
    if (!result.ok) {
      stopped = true;
      throw result.error;
    }

    schedule();
    return result.chunk;
  }

  schedule();
  return {
    offsets,
    take,
    stop: () => {
      stopped = true;
    }
  };
}

async function uploadRemoteToDropbox({ accessToken, filePath, item, overwriteExisting, isCanceled = null, onDownloadProgress = null }) {
  const totalBytes = getRemoteStreamContentLength(item);
  if (!totalBytes) {
    throw new Error('That media file did not report a downloadable size.');
  }

  const prefetcher = createRemoteStreamChunkPrefetcher(item, totalBytes, {
    isCanceled,
    onDownloadProgress
  });
  try {
    const firstOffset = prefetcher.offsets[0] || 0;
    const firstChunk = await prefetcher.take(firstOffset);

    if (firstChunk.bytes.byteLength >= totalBytes && totalBytes <= DROPBOX_SIMPLE_UPLOAD_MAX_BYTES) {
      return fetchDropboxContentJson(DROPBOX_UPLOAD_URL, {
        accessToken,
        apiArg: buildDropboxCommitInfo(filePath, overwriteExisting),
        bytes: firstChunk.bytes
      });
    }

    const startResult = await fetchDropboxContentJson(DROPBOX_UPLOAD_SESSION_START_URL, {
      accessToken,
      apiArg: { close: false },
      bytes: firstChunk.bytes
    });
    const sessionId = clampString(startResult?.session_id, '');
    if (!sessionId) {
      throw new Error('Dropbox did not return an upload session.');
    }

    for (let index = 1; index < prefetcher.offsets.length; index += 1) {
      await throwIfUploadCanceled(isCanceled);
      const offset = prefetcher.offsets[index];
      const chunk = await prefetcher.take(offset);
      const isLastChunk = offset + chunk.bytes.byteLength >= totalBytes;

      if (isLastChunk) {
        return fetchDropboxContentJson(DROPBOX_UPLOAD_SESSION_FINISH_URL, {
          accessToken,
          apiArg: {
            cursor: {
              session_id: sessionId,
              offset
            },
            commit: buildDropboxCommitInfo(filePath, overwriteExisting)
          },
          bytes: chunk.bytes
        });
      }

      await fetchDropboxContentJson(DROPBOX_UPLOAD_SESSION_APPEND_URL, {
        accessToken,
        apiArg: {
          cursor: {
            session_id: sessionId,
            offset
          },
          close: false
        },
        bytes: chunk.bytes
      });
    }

    throw new Error('Dropbox upload session finished without a final chunk.');
  } finally {
    prefetcher.stop();
  }
}

async function uploadToGoogleDriveResumableChunk(uploadLocation, { bytes, start, totalBytes, contentType }) {
  const end = start + bytes.byteLength - 1;
  const uploadResponse = await fetch(uploadLocation, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType || 'application/octet-stream',
      'Content-Range': `bytes ${start}-${end}/${totalBytes}`
    },
    body: bytes
  });
  const uploadText = await uploadResponse.text();
  let uploadData = null;
  try {
    uploadData = uploadText ? JSON.parse(uploadText) : null;
  } catch {
    uploadData = null;
  }

  if (uploadResponse.status === 308) {
    return {
      done: false,
      metadata: null
    };
  }

  if (!uploadResponse.ok) {
    throw new Error(uploadData?.error?.message || uploadText || `Google Drive upload failed with ${uploadResponse.status}`);
  }

  return {
    done: true,
    metadata: uploadData || {}
  };
}

async function uploadRemoteToGoogleDrive({ accessToken, settings, filename, item, contentType, overwriteExisting, isCanceled = null, onDownloadProgress = null }) {
  const totalBytes = getRemoteStreamContentLength(item);
  if (!totalBytes) {
    throw new Error('That media file did not report a downloadable size.');
  }

  const session = await createGoogleDriveUploadSession({
    accessToken,
    settings,
    filename,
    contentType,
    contentLength: totalBytes,
    overwriteExisting
  });

  const prefetcher = createRemoteStreamChunkPrefetcher(item, totalBytes, {
    isCanceled,
    onDownloadProgress
  });
  let metadata = null;
  try {
    for (const offset of prefetcher.offsets) {
      await throwIfUploadCanceled(isCanceled);
      const chunk = await prefetcher.take(offset);
      const result = await uploadToGoogleDriveResumableChunk(session.uploadLocation, {
        bytes: chunk.bytes,
        start: offset,
        totalBytes,
        contentType
      });
      if (result.done) {
        metadata = result.metadata;
        break;
      }
    }
  } finally {
    prefetcher.stop();
  }

  if (!metadata) {
    throw new Error('Google Drive upload did not finish.');
  }

  return {
    metadata,
    folderName: session.folderName
  };
}

function startLocalDownload({ url, filename, overwriteExisting, referrerUrl = '' }) {
  return new Promise((resolve, reject) => {
    const options = {
      url,
      filename,
      saveAs: false,
      conflictAction: overwriteExisting ? 'overwrite' : 'uniquify'
    };
    if (referrerUrl) {
      options.headers = [{
        name: 'Referer',
        value: referrerUrl
      }];
    }

    chrome.downloads.download(
      options,
      (downloadId) => {
        const runtimeError = chrome.runtime.lastError;
        if (runtimeError) {
          reject(new Error(runtimeError.message));
          return;
        }

        if (!Number.isFinite(downloadId)) {
          reject(new Error('Local download could not be started.'));
          return;
        }

        resolve(downloadId);
      }
    );
  });
}

function createActiveUploadItem(inputUrl, overrides = {}) {
  return normalizeActiveUploadItem({
    id: inputUrl,
    inputUrl,
    status: 'queued',
    progress: 4,
    detail: 'Queued',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides
  });
}

function getDownloadProgressRatio(downloadProgress = null) {
  const loadedBytes = Number(downloadProgress?.loadedBytes || 0);
  const totalBytes = Number(downloadProgress?.totalBytes || 0);
  if (!Number.isFinite(loadedBytes) || !Number.isFinite(totalBytes) || loadedBytes < 0 || totalBytes <= 0) {
    return null;
  }
  return Math.max(0, Math.min(1, loadedBytes / totalBytes));
}

function formatDownloadProgressSuffix(downloadProgress = null) {
  const ratio = getDownloadProgressRatio(downloadProgress);
  if (ratio === null) {
    return '';
  }
  return ` (${Math.max(1, Math.min(100, Math.floor(ratio * 100)))}%)`;
}

function progressForStage(stage, currentFile = 0, totalFiles = 0, downloadProgress = null) {
  const safeTotalFiles = Math.max(1, Math.floor(Number(totalFiles || 0)));
  const safeCurrentFile = Math.min(safeTotalFiles, Math.max(1, Math.floor(Number(currentFile || 1))));

  switch (stage) {
    case 'expanding':
      return 12;
    case 'resolving':
      return 26;
    case 'downloading': {
      const fileStart = 34 + ((safeCurrentFile - 1) / safeTotalFiles) * 28;
      const fileEnd = 34 + (safeCurrentFile / safeTotalFiles) * 28;
      const ratio = getDownloadProgressRatio(downloadProgress);
      return Math.min(62, Math.round(ratio === null ? fileStart : fileStart + ((fileEnd - fileStart) * ratio)));
    }
    case 'uploading':
      return Math.min(94, 68 + Math.round((safeCurrentFile / safeTotalFiles) * 26));
    case 'completed':
    case 'failed':
      return 100;
    default:
      return 4;
  }
}

function detailForStage(stage, currentFile = 0, totalFiles = 0, filename = '', downloadProgress = null) {
  const safeTotalFiles = Math.max(0, Math.floor(Number(totalFiles || 0)));
  const safeCurrentFile = Math.max(0, Math.floor(Number(currentFile || 0)));
  const downloadProgressSuffix = formatDownloadProgressSuffix(downloadProgress);

  switch (stage) {
    case 'expanding':
      return 'Loading posts...';
    case 'resolving':
      return 'Opening post media...';
    case 'downloading':
      return safeTotalFiles > 1
        ? `Downloading file ${safeCurrentFile} of ${safeTotalFiles}${filename ? ` - ${filename}` : ''}${downloadProgressSuffix}`
        : `Downloading${filename ? ` - ${filename}` : ''}${downloadProgressSuffix}`;
    case 'uploading':
      return safeTotalFiles > 1
        ? `Saving file ${safeCurrentFile} of ${safeTotalFiles}${filename ? ` - ${filename}` : ''}`
        : `Saving${filename ? ` - ${filename}` : ''}`;
    case 'completed':
      return safeTotalFiles > 1
        ? `Saved ${safeTotalFiles} file${safeTotalFiles === 1 ? '' : 's'}`
        : 'Saved';
    case 'failed':
      return 'Could not save this post';
    default:
      return 'Queued';
  }
}

async function setActiveUploadItems(sessionId, items, sessionPatch = {}) {
  await updateActiveUploadSession(sessionId, (current) => {
    const nextItems = items.map((item) => createActiveUploadItem(item.inputUrl, item));
    return {
      ...(current || {}),
      ...sessionPatch,
      id: current?.id || sessionId,
      sourceInputUrl: sessionPatch.sourceInputUrl || current?.sourceInputUrl || '',
      kind: sessionPatch.kind || current?.kind || 'link',
      label: sessionPatch.label || current?.label || '',
      status: sessionPatch.status || current?.status || 'running',
      createdAt: current?.createdAt || Date.now(),
      updatedAt: Date.now(),
      items: nextItems
    };
  });
}

async function updateActiveUploadItem(sessionId, inputUrl, patch) {
  await updateActiveUploadSession(sessionId, (current) => {
    if (!current) {
      return null;
    }

    const nextItems = current.items.map((item) => (
      item.inputUrl === inputUrl
        ? createActiveUploadItem(item.inputUrl, {
            ...item,
            ...patch,
            updatedAt: Date.now()
          })
        : item
    ));

    return {
      ...current,
      status: patch?.status === 'failed' ? 'failed' : current.status,
      updatedAt: Date.now(),
      items: nextItems
    };
  });
}

async function processSingleInput(inputUrl, settings, storage, onProgress = null, { isCanceled = null } = {}) {
  async function throwIfCanceled() {
    if (typeof isCanceled === 'function' && await isCanceled()) {
      throw new Error(UPLOAD_CANCELED_MESSAGE);
    }
  }

  await throwIfCanceled();
  if (typeof onProgress === 'function') {
    await onProgress({ stage: 'resolving', currentFile: 0, totalFiles: 0, filename: '' });
  }

  const mediaItems = await resolveMediaItems(inputUrl);
  await throwIfCanceled();
  const uploads = [];

  for (let index = 0; index < mediaItems.length; index += 1) {
    await throwIfCanceled();
    const item = mediaItems[index];
    const ext = extractExtensionFromUrl(item.sourceUrl, item.kind === 'photo' ? 'jpg' : 'mp4');
    const baseName = item.filename || `download.${ext}`;
    const provisionalFilename = baseName.includes('.') ? baseName : `${baseName}.${ext}`;
    const reportDownloadProgress = typeof onProgress === 'function'
      ? async ({ loadedBytes = 0, totalBytes = 0 } = {}) => {
          await onProgress({
            stage: 'downloading',
            currentFile: index + 1,
            totalFiles: mediaItems.length,
            filename: provisionalFilename,
            loadedBytes,
            totalBytes
          });
        }
      : null;
    let uploadStageReported = false;
    const reportUploadProgress = typeof onProgress === 'function'
      ? async (uploadFilename) => {
          uploadStageReported = true;
          await onProgress({
            stage: 'uploading',
            currentFile: index + 1,
            totalFiles: mediaItems.length,
            filename: uploadFilename || provisionalFilename
          });
        }
      : null;

    if (typeof onProgress === 'function') {
      await onProgress({
        stage: 'downloading',
        currentFile: index + 1,
        totalFiles: mediaItems.length,
        filename: provisionalFilename
      });
    }

    let remotePath = '';
    let remoteUrl = '';
    let remoteSize = 0;
    let filename = provisionalFilename;
    let mediaContentType = item.contentType || '';
    const isLocalOnly = storage.provider === PROVIDER_LOCAL;

    if (shouldStreamRemoteUpload(item)) {
      const contentType = item.contentType || 'application/octet-stream';
      mediaContentType = contentType;
      const resolvedExtension = extractExtensionFromUrl(item.sourceUrl, guessExtensionFromContentType(contentType));
      filename = baseName.includes('.') ? baseName : `${baseName}.${resolvedExtension}`;
      await throwIfCanceled();

      if (isLocalOnly) {
        remoteSize = getRemoteStreamContentLength(item);
      } else if (storage.provider === PROVIDER_GOOGLE_DRIVE) {
        const upload = await uploadRemoteToGoogleDrive({
          accessToken: storage.accessToken,
          settings,
          filename,
          item,
          contentType,
          overwriteExisting: settings.overwriteExisting,
          isCanceled,
          onDownloadProgress: reportDownloadProgress
        });
        remotePath = upload.metadata.webViewLink || joinGoogleDriveDisplayPath(upload.folderName, filename);
        remoteUrl = upload.metadata.webViewLink || upload.metadata.webContentLink || '';
        remoteSize = Number(upload.metadata.size || getRemoteStreamContentLength(item));
      } else {
        await ensureDropboxFolder(storage.accessToken, settings.dropboxFolder);
        const filePath = joinDropboxPath(settings.dropboxFolder, filename);
        const metadata = await uploadRemoteToDropbox({
          accessToken: storage.accessToken,
          filePath,
          item,
          overwriteExisting: settings.overwriteExisting,
          isCanceled,
          onDownloadProgress: reportDownloadProgress
        });
        remotePath = metadata.path_display || filePath;
        remoteUrl = buildDropboxWebUrl(remotePath);
        remoteSize = Number(metadata.size || getRemoteStreamContentLength(item));
      }
    } else if (isLocalOnly) {
      const resolvedExtension = extractExtensionFromUrl(
        item.sourceUrl,
        guessExtensionFromContentType(item.contentType || '')
      );
      filename = baseName.includes('.') ? baseName : `${baseName}.${resolvedExtension}`;
      mediaContentType = item.contentType || guessContentTypeFromExtension(resolvedExtension);
      remoteSize = getRemoteStreamContentLength(item);
      if (reportUploadProgress) {
        await reportUploadProgress(filename);
      }
    } else {
      const binary = await fetchBinary(item.sourceUrl, {
        referrerUrl: item.referrerUrl || '',
        isCanceled,
        onDownloadProgress: reportDownloadProgress
      });
      await throwIfCanceled();
      mediaContentType = binary.contentType;
      const resolvedExtension = extractExtensionFromUrl(item.sourceUrl, guessExtensionFromContentType(binary.contentType));
      filename = baseName.includes('.') ? baseName : `${baseName}.${resolvedExtension}`;
      if (reportUploadProgress) {
        await reportUploadProgress(filename);
      }
      if (storage.provider === PROVIDER_GOOGLE_DRIVE) {
        const upload = await uploadToGoogleDrive({
          accessToken: storage.accessToken,
          settings,
          filename,
          bytes: binary.bytes,
          contentType: binary.contentType,
          overwriteExisting: settings.overwriteExisting
        });
        remotePath = upload.metadata.webViewLink || joinGoogleDriveDisplayPath(upload.folderName, filename);
        remoteUrl = upload.metadata.webViewLink || upload.metadata.webContentLink || '';
        remoteSize = Number(upload.metadata.size || binary.bytes.byteLength);
      } else {
        await ensureDropboxFolder(storage.accessToken, settings.dropboxFolder);
        const filePath = joinDropboxPath(settings.dropboxFolder, filename);
        const metadata = await uploadToDropbox({
          accessToken: storage.accessToken,
          filePath,
          bytes: binary.bytes,
          overwriteExisting: settings.overwriteExisting
        });
        remotePath = metadata.path_display || filePath;
        remoteUrl = buildDropboxWebUrl(remotePath);
        remoteSize = Number(metadata.size || binary.bytes.byteLength);
      }
    }

    if (!uploadStageReported && reportUploadProgress) {
      await reportUploadProgress(filename);
    }
    await throwIfCanceled();

    let localSavedPath = '';
    let localDownloadError = '';
    if (isLocalOnly || settings.saveLocalCopies) {
      localSavedPath = joinLocalDownloadPath(settings.localDownloadFolder, filename);
      try {
        await startLocalDownload({
          url: item.sourceUrl,
          filename: localSavedPath,
          overwriteExisting: settings.overwriteExisting,
          referrerUrl: item.referrerUrl || ''
        });
      } catch (error) {
        localDownloadError = error instanceof Error ? error.message : String(error);
      }
    }

    uploads.push({
      filename,
      dropboxPath: remotePath,
      remoteUrl,
      provider: storage.provider,
      localSavedPath,
      localDownloadError,
      size: remoteSize,
      sourceUrl: item.sourceUrl,
      contentType: mediaContentType
    });
  }

  if (typeof onProgress === 'function') {
    await onProgress({
      stage: 'completed',
      currentFile: mediaItems.length,
      totalFiles: mediaItems.length,
      filename: ''
    });
  }

  return {
    inputUrl,
    uploads
  };
}

function describeInputKind(inputUrl) {
  const bookmarkInfo = extractBookmarkInfo(inputUrl);
  if (bookmarkInfo?.folderId) {
    return {
      kind: 'bookmark-folder',
      label: 'Bookmark folder'
    };
  }

  if (bookmarkInfo) {
    return {
      kind: 'bookmarks',
      label: 'Bookmarks'
    };
  }

  if (extractProfileMediaInfo(inputUrl)) {
    return {
      kind: 'profile-media',
      label: 'Profile media'
    };
  }

  if (extractGenericAlbumAlbumInfo(inputUrl)) {
    return {
      kind: 'generic_album-album',
      label: 'GenericAlbum album'
    };
  }

  if (extractGenericVideoVideoInfo(inputUrl)) {
    return {
      kind: 'generic_video-video',
      label: 'GenericVideo video'
    };
  }

  return {
    kind: 'link',
    label: ''
  };
}

function isExpandableInputUrl(inputUrl) {
  return Boolean(extractBookmarkInfo(inputUrl) || extractProfileMediaInfo(inputUrl));
}

async function runUploadUrls(rawText) {
  const sourceUrls = collectUrls(rawText);
  if (!sourceUrls.length) {
    throw new Error('Paste one or more URLs first.');
  }

  let usage = await refreshPaymentState();
  if (usage.limitReached) {
    throw new Error(buildUpgradeRequiredMessage(usage));
  }

  const settings = await getSettings();
  const provider = normalizeStorageProvider(settings.storageProvider);
  const accessToken = provider === PROVIDER_LOCAL
    ? ''
    : provider === PROVIDER_GOOGLE_DRIVE
      ? await ensureGoogleDriveAccessToken()
      : await ensureDropboxAccessToken();
  const storage = {
    provider,
    accessToken
  };
  const results = [];

  async function processInputUrl({ sourceUrl, sessionId, descriptor, inputUrl }) {
    if (await waitForActiveUploadTurn(sessionId) === 'canceled') {
      return;
    }

    await acquireUploadWorkerSlot();
    try {
      const quotaReservation = await reserveFreeUploadSlot();
      if (!quotaReservation.ok) {
        const upgradeMessage = buildUpgradeRequiredMessage(quotaReservation.usage);
        results.push({
          inputUrl,
          ok: false,
          error: upgradeMessage
        });
        await updateActiveUploadItem(sessionId, inputUrl, {
          status: 'failed',
          progress: progressForStage('failed'),
          detail: upgradeMessage,
          error: upgradeMessage
        });
        return;
      }

      try {
        const result = await processSingleInput(inputUrl, settings, storage, async ({ stage, currentFile, totalFiles, filename, loadedBytes, totalBytes }) => {
          if (await waitForActiveUploadTurn(sessionId) === 'canceled') {
            throw new Error(UPLOAD_CANCELED_MESSAGE);
          }

          const downloadProgress = { loadedBytes, totalBytes };
          await updateActiveUploadItem(sessionId, inputUrl, {
            status: stage === 'completed' ? 'completed' : 'running',
            progress: progressForStage(stage, currentFile, totalFiles, downloadProgress),
            detail: detailForStage(stage, currentFile, totalFiles, filename, downloadProgress),
            error: ''
          });
        }, {
          isCanceled: () => isActiveUploadSessionCanceled(sessionId)
        });
        results.push({
          inputUrl,
          sourceInputUrl: sourceUrl,
          sourceKind: descriptor.kind,
          sourceLabel: descriptor.label,
          ok: true,
          uploads: result.uploads
        });
        usage = await finishFreeUploadSlot(quotaReservation, true);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        usage = await finishFreeUploadSlot(quotaReservation, false);
        if (message === UPLOAD_CANCELED_MESSAGE) {
          return;
        }

        if ((provider === PROVIDER_GOOGLE_DRIVE && isGoogleDriveAuthError(error))
          || (provider === PROVIDER_DROPBOX && isDropboxAuthError(error))) {
          if (provider === PROVIDER_GOOGLE_DRIVE) {
            await invalidateGoogleDriveToken(accessToken);
          }
          await clearAuth(provider);
          throw new Error(
            provider === PROVIDER_GOOGLE_DRIVE
              ? 'Google Drive session expired. Reconnect Google Drive and try again.'
              : 'Dropbox session expired. Reconnect Dropbox and try again.'
          );
        }

        results.push({
          inputUrl,
          ok: false,
          error: message
        });
        await updateActiveUploadItem(sessionId, inputUrl, {
          status: 'failed',
          progress: progressForStage('failed'),
          detail: detailForStage('failed'),
          error: message
        });
      }
    } finally {
      releaseUploadWorkerSlot();
    }
  }

  async function processSourceUrl(sourceUrl) {
    const sessionId = crypto.randomUUID();
    const descriptor = describeInputKind(sourceUrl);

    await setActiveUploadItems(sessionId, [
      createActiveUploadItem(sourceUrl, {
        status: isExpandableInputUrl(sourceUrl) ? 'expanding' : 'queued',
        progress: isExpandableInputUrl(sourceUrl) ? progressForStage('expanding') : progressForStage('queued'),
        detail: isExpandableInputUrl(sourceUrl) ? detailForStage('expanding') : detailForStage('queued')
      })
    ], {
      sourceInputUrl: sourceUrl,
      kind: descriptor.kind,
      label: descriptor.label,
      status: 'running'
    });

    let expandedUrls = [];
    try {
      expandedUrls = await resolveExpandableUrls(sourceUrl);
      await setActiveUploadItems(
        sessionId,
        expandedUrls.map((inputUrl) => createActiveUploadItem(inputUrl)),
        {
          sourceInputUrl: sourceUrl,
          kind: descriptor.kind,
          label: descriptor.label,
          status: 'running'
        }
      );

      await runWithConcurrency(
        expandedUrls,
        MAX_CONCURRENT_EXPANDED_UPLOADS,
        (inputUrl) => processInputUrl({ sourceUrl, sessionId, descriptor, inputUrl })
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      results.push({
        inputUrl: sourceUrl,
        ok: false,
        error: message
      });
      await updateActiveUploadItem(sessionId, sourceUrl, {
        status: 'failed',
        progress: progressForStage('failed'),
        detail: message,
        error: message
      });
    } finally {
      await removeActiveUploadSession(sessionId);
    }
  }

  await runWithConcurrency(sourceUrls, MAX_CONCURRENT_SOURCE_UPLOADS, processSourceUrl);

  const successfulInputs = results.filter((entry) => entry.ok).length;
  const history = await recordHistoryEntries(results);
  usage = await getUsageState();
  return {
    totalInputs: results.length,
    successfulInputs,
    failedInputs: results.filter((entry) => !entry.ok).length,
    results,
    history,
    usage
  };
}

async function retryActiveUploadItem(sessionId, inputUrl) {
  const session = await getActiveUploadSession(sessionId);
  if (!session) {
    throw new Error('That upload is no longer active.');
  }

  const item = session.items.find((entry) => entry.inputUrl === inputUrl);
  if (!item) {
    throw new Error('That failed download could not be found.');
  }

  await refreshPaymentState();

  const settings = await getSettings();
  const provider = normalizeStorageProvider(settings.storageProvider);
  const accessToken = provider === PROVIDER_LOCAL
    ? ''
    : provider === PROVIDER_GOOGLE_DRIVE
      ? await ensureGoogleDriveAccessToken()
      : await ensureDropboxAccessToken();
  const storage = {
    provider,
    accessToken
  };

  const buildCanceledRetryResult = async () => ({
    activeUploads: await getActiveUploads(),
    history: await getHistory(),
    usage: await getUsageState(),
    canceled: true
  });

  let quotaReservation = null;
  try {
    if (await waitForRetryUploadTurn(sessionId) === 'canceled') {
      return buildCanceledRetryResult();
    }

    quotaReservation = await reserveFreeUploadSlot();
    if (!quotaReservation.ok) {
      throw new Error(buildUpgradeRequiredMessage(quotaReservation.usage));
    }

    const result = await processSingleInput(inputUrl, settings, storage, async ({ stage, currentFile, totalFiles, filename, loadedBytes, totalBytes }) => {
      if (await waitForRetryUploadTurn(sessionId) === 'canceled') {
        throw new Error(UPLOAD_CANCELED_MESSAGE);
      }

      const downloadProgress = { loadedBytes, totalBytes };
      await updateActiveUploadItem(sessionId, inputUrl, {
        status: stage === 'completed' ? 'completed' : 'running',
        progress: progressForStage(stage, currentFile, totalFiles, downloadProgress),
        detail: detailForStage(stage, currentFile, totalFiles, filename, downloadProgress),
        error: ''
      });
    }, {
      isCanceled: () => isRetryUploadSessionCanceled(sessionId)
    });
    if (await waitForRetryUploadTurn(sessionId) === 'canceled') {
      await finishFreeUploadSlot(quotaReservation, false);
      return buildCanceledRetryResult();
    }

    const history = await recordHistoryEntries([{
      inputUrl,
      sourceInputUrl: session.sourceInputUrl,
      sourceKind: session.kind,
      sourceLabel: session.label,
      ok: true,
      uploads: result.uploads
    }]);
    const nextUsage = await finishFreeUploadSlot(quotaReservation, true);
    return {
      activeUploads: await getActiveUploads(),
      history,
      usage: nextUsage
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await finishFreeUploadSlot(quotaReservation, false);
    if (message === UPLOAD_CANCELED_MESSAGE) {
      return buildCanceledRetryResult();
    }

    await updateActiveUploadItem(sessionId, inputUrl, {
      status: 'failed',
      progress: progressForStage('failed'),
      detail: detailForStage('failed'),
      error: message
    });
    throw error;
  }
}

function uploadUrls(rawText) {
  return runUploadUrls(rawText);
}

async function getState() {
  const [
    settings,
    history,
    activeUploads,
    appKey,
    customGoogleOAuthClientIdSaved,
    googleBrowserAuthConfigured,
    xCookieHeader,
    instagramCookieHeader,
    auths,
    usage
  ] = await Promise.all([
    getSettings(),
    getHistory(),
    getActiveUploads(),
    getDropboxAppKey(),
    hasCustomGoogleOAuthClientId(),
    isGoogleBrowserOAuthConfigured(),
    getUsableXCookieHeader(),
    getUsableInstagramCookieHeader(),
    getStoredAuthSummaries(),
    getPopupUsageState()
  ]);
  const storageProvider = normalizeStorageProvider(settings.storageProvider);
  const localAuth = {
    connected: true,
    provider: PROVIDER_LOCAL,
    accountLabel: 'Local downloads ready',
    expiresAt: 0
  };
  const allAuths = {
    ...auths,
    [PROVIDER_LOCAL]: localAuth
  };
  const auth = storageProvider === PROVIDER_LOCAL
    ? localAuth
    : allAuths[storageProvider] || authSummary(null);
  return {
    settings,
    auth,
    auths: allAuths,
    activeUploads,
    history,
    appKeySaved: Boolean(appKey),
    defaultDropboxAppKeyInUse: appKey === DEFAULT_DROPBOX_APP_KEY,
    customGoogleOAuthClientIdSaved,
    googleAuthConfigured: googleBrowserAuthConfigured,
    xCookiesSaved: Boolean(xCookieHeader),
    instagramCookiesSaved: Boolean(instagramCookieHeader),
    usage
  };
}

chrome.runtime.onInstalled.addListener(async () => {
  await migrateLegacyDropboxAppKey();
  const settings = await getSettings();
  await chrome.storage.sync.set({ [SETTINGS_KEY]: settings });
  await getUsageState();
});

async function openPaymentPage() {
  try {
    await createExtPayClient().openPaymentPage();
    await requestPaymentStateRefresh();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error || '');
    if (/extensionpay\.com\/home/i.test(message)) {
      throw new Error(`ExtensionPay is not set up for "${EXTPAY_EXTENSION_ID}" yet. Create that ExtensionPay project first, then try again.`);
    }
    throw error;
  }
}

async function openRestorePurchasePage() {
  try {
    await createExtPayClient().openLoginPage();
    await requestPaymentStateRefresh();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error || '');
    if (/extensionpay\.com\/home/i.test(message)) {
      throw new Error(`ExtensionPay is not set up for "${EXTPAY_EXTENSION_ID}" yet. Create that ExtensionPay project first, then try again.`);
    }
    throw error;
  }
}

async function saveSettingsPayload(payload) {
  const settings = await setSettings(payload || {});
  const nextAppKey = clampString(payload?.dropboxAppKey, '');
  if (nextAppKey) {
    await setDropboxAppKey(nextAppKey);
  }

  const nextGoogleClientId = clampString(payload?.googleOAuthClientId, '');
  if (nextGoogleClientId) {
    await setGoogleOAuthClientId(nextGoogleClientId);
    await clearAuth(PROVIDER_GOOGLE_DRIVE);
  }

  return settings;
}

function isTrustedExtensionSender(sender) {
  if (sender?.id && sender.id !== chrome.runtime.id) {
    return false;
  }

  const senderUrl = clampString(sender?.url, '');
  return !senderUrl || senderUrl.startsWith(chrome.runtime.getURL(''));
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // This handler is for extension-owned pages only. Content-script messages,
  // including ExtPay messages, are handled by their own listeners.
  if (!isTrustedExtensionSender(sender)) {
    if (message && typeof message === 'object' && message.type) {
      sendResponse({ ok: false, error: 'Unauthorized message sender.' });
    }
    return false;
  }

  (async () => {
    switch (message?.type) {
      case 'GET_STATE':
        sendResponse({ ok: true, ...(await getState()) });
        return;
      case 'SAVE_SETTINGS': {
        const saved = await saveSettingsPayload(message.settings || {});
        const appKey = await getDropboxAppKey();
        sendResponse({
          ok: true,
          settings: saved,
          appKeySaved: Boolean(appKey),
          defaultDropboxAppKeyInUse: appKey === DEFAULT_DROPBOX_APP_KEY,
          customGoogleOAuthClientIdSaved: await hasCustomGoogleOAuthClientId(),
          googleAuthConfigured: await isGoogleBrowserOAuthConfigured(),
          xCookiesSaved: Boolean(await getUsableXCookieHeader()),
          instagramCookiesSaved: Boolean(await getUsableInstagramCookieHeader())
        });
        return;
      }
      case 'CAPTURE_CURRENT_X_COOKIES': {
        await captureCurrentXCookieHeader();
        sendResponse({ ok: true, xCookiesSaved: true });
        return;
      }
      case 'CLEAR_X_COOKIES': {
        await clearXCookieHeader();
        sendResponse({ ok: true, xCookiesSaved: false });
        return;
      }
      case 'CAPTURE_CURRENT_INSTAGRAM_COOKIES': {
        await captureCurrentInstagramCookieHeader();
        sendResponse({ ok: true, instagramCookiesSaved: true });
        return;
      }
      case 'CLEAR_INSTAGRAM_COOKIES': {
        await clearInstagramCookieHeader();
        sendResponse({ ok: true, instagramCookiesSaved: false });
        return;
      }
      case 'CONNECT_DROPBOX': {
        const auth = await connectDropbox();
        sendResponse({ ok: true, auth });
        return;
      }
      case 'CONNECT_GOOGLE_DRIVE': {
        const auth = await connectGoogleDrive();
        sendResponse({ ok: true, auth });
        return;
      }
      case 'CLEAR_DROPBOX_AUTH':
        await clearDropboxAuth({ forceNextReauthentication: true });
        sendResponse({ ok: true });
        return;
      case 'CLEAR_GOOGLE_DRIVE_AUTH': {
        const auth = await getAuth(PROVIDER_GOOGLE_DRIVE);
        if (auth?.accessToken) {
          await invalidateGoogleDriveToken(auth.accessToken);
        }
        await clearAuth(PROVIDER_GOOGLE_DRIVE);
        sendResponse({ ok: true });
        return;
      }
      case 'CLEAR_HISTORY':
        await clearHistory();
        sendResponse({ ok: true, history: [] });
        return;
      case 'CLEAR_PROFILE_HISTORY_GROUP': {
        const history = await clearProfileHistoryGroup(message);
        sendResponse({ ok: true, history });
        return;
      }
      case 'PAUSE_ACTIVE_UPLOAD': {
        await pauseActiveUploadSession(message.sessionId || '');
        sendResponse({ ok: true, activeUploads: await getActiveUploads() });
        return;
      }
      case 'RESUME_ACTIVE_UPLOAD': {
        await resumeActiveUploadSession(message.sessionId || '');
        sendResponse({ ok: true, activeUploads: await getActiveUploads() });
        return;
      }
      case 'CLEAR_ACTIVE_UPLOAD': {
        await cancelActiveUploadSession(message.sessionId || '');
        sendResponse({ ok: true, activeUploads: await getActiveUploads() });
        return;
      }
      case 'RETRY_ACTIVE_UPLOAD_ITEM': {
        const result = await retryActiveUploadItem(message.sessionId || '', message.inputUrl || '');
        sendResponse({ ok: true, ...result });
        return;
      }
      case 'OPEN_PAYMENT_PAGE':
        await openPaymentPage();
        sendResponse({ ok: true });
        return;
      case 'RESTORE_PURCHASE':
        await openRestorePurchasePage();
        sendResponse({ ok: true });
        return;
      case 'REFRESH_PAYMENT_STATE': {
        const usage = await refreshPaymentState();
        if (usage.paid) {
          await clearPaymentStateRefreshRequest();
        }
        sendResponse({ ok: true, usage });
        return;
      }
      case 'UPLOAD_URLS': {
        const summary = await uploadUrls(message.text || '');
        sendResponse({ ok: true, summary });
        return;
      }
      default:
        sendResponse({ ok: false, error: 'Unknown message.' });
    }
  })().catch((error) => {
    sendResponse({
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    });
  });

  return true;
});
