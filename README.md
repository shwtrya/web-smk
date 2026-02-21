# 🎓 Website SMK Negeri 1 Cileungsi

### Cinematic Digital Memory Platform

![Version](https://img.shields.io/badge/version-1.2.0-gold)
![Status](https://img.shields.io/badge/status-stable-success)
![Firebase](https://img.shields.io/badge/backend-Firebase-orange)
![Build](https://img.shields.io/badge/build-Vite-purple)
![License](https://img.shields.io/badge/license-private-red)

Website kenangan digital dengan pengalaman **cinematic, realtime, dan modern** untuk mengabadikan momen angkatan SMK Negeri 1 Cileungsi.

Dibuat oleh **Sawava**

---

# ✨ Preview Features

## 💬 Message Wall Realtime

* Kirim pesan kenangan realtime
* Like dan Unlike system
* Report moderation system
* Delete pesan milik sendiri
* Highlight pesan khusus oleh admin
* Anti spam protection

## 🎬 Cinematic Slideshow

* Automatic slideshow mode
* Cinematic animation & transition
* Play / Pause / Next / Previous controls
* Mobile optimized
* Keyboard navigation support

## 🛡 Admin Moderation System

* Hide / Unhide message
* Delete message
* Special message control
* Moderation audit log
* Export audit log to CSV

## ⚡ Performance Optimized

* Fast loading
* Realtime sync
* Efficient pagination
* Mobile optimized
* Stable production build

---

# 🧱 Tech Stack

Frontend

* Vite
* Vanilla JavaScript
* HTML5
* CSS3

Backend

* Firebase Authentication
* Firebase Firestore
* Firebase Hosting
* Firebase App Check

---

# 📁 Project Structure

```
project-root
│
├── index.html
├── pesan.html
├── angkatan.html
│
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
│
├── firestore.rules
├── firebase.json
├── .env
└── package.json
```

---

# 🔥 Firebase Data Structure

```
messages/
   messageId
      nama
      pesan
      angkatan
      ownerUid
      likeCount
      reportCount
      isVisible

messages/{messageId}/likes/{uid}

messages/{messageId}/reports/{uid}

messageSpecials/

moderationAuditLogs/
```

---

# ⚙️ Installation

## Install dependency

```
npm install
```

## Run development server

```
npm run dev
```

## Build production

```
npm run build
```

## Preview production

```
npm run preview
```

---

# 🚀 Deployment

## Login Firebase

```
firebase login
```

## Deploy hosting

```
firebase deploy --only hosting
```

## Deploy firestore rules

```
firebase deploy --only firestore:rules
```

## Deploy all

```
firebase deploy
```

---

# 🛡 Moderation System

Admin dapat melakukan:

* Hide message
* Delete message
* Special message highlight
* View report details
* View audit logs
* Export audit logs

Audit log collection:

```
moderationAuditLogs
```

---

# 📊 Pagination System

Initial load:

```
24 messages
```

Load more:

```
+24 messages per click
```

Realtime sync aktif.

---

# 🎬 Slideshow Controls

Keyboard support:

```
Enter    → Open slideshow
Arrow →   Next / Prev slide
Space    → Play / Pause
Escape   → Close slideshow
```

---

# 🧪 Build Check

Pastikan build berhasil:

```
npm run build
```

---

# ⚠️ Troubleshooting

permission-denied
→ Check Firestore rules, Auth, dan App Check

failed-precondition
→ Create required Firestore index

unavailable
→ Check internet atau Firebase status

---

# 👤 Author

Sawava

Cinematic memory platform created to preserve school moments digitally with immersive experience.

---

# 📜 License

Private Project
All rights reserved.
