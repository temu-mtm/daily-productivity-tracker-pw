DAILY FOCUS — PRODUCTIVITY TRACKER PWA

FILES
- index.html: page structure
- style.css: mobile-first design
- app.js: task logic and Local Storage
- manifest.json: installable app information
- service-worker.js: offline app cache
- icons/: app icons

IMPORTANT
A PWA service worker and installation require a secure context:
- localhost while developing, or
- an HTTPS website after publishing.

Do not open index.html by double-clicking it (file://). Use a local development server.

EASIEST OPTION IN VS CODE
1. Open this folder in VS Code.
2. Install the "Live Server" extension by Ritwick Dey.
3. Right-click index.html and choose "Open with Live Server".
4. The app opens at a localhost address.

To install on Android:
1. Publish the folder to an HTTPS host (for example, GitHub Pages).
2. Open the HTTPS link in Chrome on Android.
3. Open Chrome's menu and choose "Install app" or "Add to Home screen".
4. Open Daily Focus from the home screen.

TASK DATA
Tasks are stored in the browser's Local Storage on that device/browser.
They are not synchronized to another device and are not backed up to an account.
Clearing browser site data can erase saved tasks.
