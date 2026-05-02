![Tweet Media Archive banner](assets/readme-banner.png)

# Tweet Media Archive

Tweet Media Archive is a Chrome MV3 extension for saving social media and direct media links into your own cloud storage. Connect Dropbox or Google Drive once, paste supported URLs into the popup, and the extension resolves the media files, uploads them, and keeps a local upload history.

The public source checkout includes 30 free successful URL uploads. Official packaged releases may include the separately distributed payment bridge used to unlock paid plans, updates, and support.

## What It Supports

- X/Twitter status URLs
- X profile media pages, such as `https://x.com/username/media`
- X bookmark and bookmark-folder expansion when a saved X session is available
- Instagram posts and reels
- Direct image and video URLs
- Dropbox uploads with OAuth and refresh-token support
- Google Drive uploads with the `drive.file` OAuth scope
- Optional signed-in X and Instagram cookie capture for posts that require account access
- Local upload history, active upload progress, pause/resume, retry, and hover previews
- Optional local Downloads copy alongside cloud upload

## How It Works

The popup and options pages send trusted extension-page messages to `background.js`. The service worker owns the core workflow:

1. Read settings, payment state, cloud auth, saved sessions, and upload history from Chrome storage.
2. Expand supported page URLs into media-bearing post URLs where needed.
3. Resolve each URL to downloadable image or video sources.
4. Download media bytes directly from the source host.
5. Upload to the selected provider, creating the target folder when needed.
6. Record successful uploads and surface live progress in the popup and history window.

No build step is required. This repo is the unpacked extension source.

## Local Setup

1. Open `chrome://extensions`.
2. Turn on `Developer mode`.
3. Click `Load unpacked`.
4. Select this project folder.
5. Open the extension `Options` page.
6. Choose Dropbox or Google Drive, save settings, and connect storage.

## Dropbox Setup

1. Create an app in the [Dropbox App Console](https://www.dropbox.com/developers/apps).
2. Choose `Scoped access`.
3. Choose `Full Dropbox`.
4. Copy the extension ID from `chrome://extensions`.
5. Add this redirect URI in Dropbox:

   ```text
   https://<your-extension-id>.chromiumapp.org/dropbox
   ```

6. Paste the Dropbox app key into the extension options.
7. Click `Connect Dropbox`.

The default Dropbox folder is `/Twitter Imports`.

## Google Drive Setup

1. Create or open a Google Cloud project.
2. Enable the Google Drive API.
3. Create an OAuth client with application type `Chrome Extension`.
4. Use the extension ID from `chrome://extensions` as the OAuth client item ID.
5. Put the client ID in `manifest.json` under `oauth2.client_id`.
6. Reload the unpacked extension.
7. Pick `Google Drive` in options and click `Connect Google Drive`.

The extension requests `https://www.googleapis.com/auth/drive.file`, which lets it create and manage files opened with or created by the extension. It does not grant broad read access to the user's whole Drive.

For production users, the Google Auth Platform audience must be `External` and the publishing status must be `In production`. If the app remains in `Testing`, non-test users can see `Error 403: access_denied`.

The default Google Drive folder is `Tweet Media Archive`.

## Optional Account Sessions

Some X/Twitter or Instagram media is unavailable without a logged-in browser session. For those cases:

1. Sign in to X/Twitter or Instagram in the same browser.
2. Open the extension popup or options page.
3. Click `Connect my X account` or `Connect my Instagram account`.

The extension stores only the allowlisted cookies needed for the resolver flow and encrypts them locally before saving them in Chrome storage.

Account-session mode is optional. The saved cookies stay in the local Chrome profile and can be removed from the popup or options page at any time. Local encryption helps prevent casual storage inspection, but it does not protect against a compromised browser profile, a malicious extension update, or someone with full access to the local extension data.

## Payments

- The first 30 successful URL uploads are free.
- The public source repo does not vendor the official payment bridge.
- Official packaged releases may include payment and restore-purchase flows separately.
- Paid users can manage or restore billing from official builds.
- Payment status is separate from Dropbox or Google Drive connection status.

## Development Notes

- Main service worker: `background.js`
- Popup UI: `popup.html`, `popup.css`, `popup.js`
- Options UI: `options.html`, `options.css`, `options.js`
- Upload history window: `history.html`, `history.css`, `history.js`
- Mascot and README art: `assets/`
- Extension manifest: `manifest.json`
- Official payment bridge: not vendored in this public source checkout

Useful checks:

```sh
node --check background.js
node --check popup.js
node --check options.js
node --check history.js
python3 -m json.tool manifest.json >/dev/null
git diff --check
```

## License

Tweet Media Archive is source-available under the PolyForm Noncommercial License 1.0.0. You can inspect, study, and use the project for noncommercial purposes under the terms in [LICENSE](LICENSE).

Official packaged releases, Chrome Web Store builds, automatic update-channel access, commercial use, paid redistribution, and support require a separate paid license or subscription. See [COMMERCIAL.md](COMMERCIAL.md).

Third-party components are not relicensed by this project license. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

![Tweet Media Archive mascot surfing](assets/mascot-surfing-banner.png)
