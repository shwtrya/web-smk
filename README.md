# Website-SMK
SMK Negeri 1 Cileungsi - By Sawava

## Message Wall Online Setup

1. Isi `.env` berdasarkan `.env.example` (config Firebase + App Check + Moderation).
2. Aktifkan Anonymous Auth:
   - Firebase Console -> Authentication -> Sign-in method -> Anonymous -> Enable
3. Setup App Check Web:
   - Firebase Console -> App Check -> pilih Web App.
   - Provider: reCAPTCHA v3.
   - Daftarkan domain dev/prod yang dipakai.
   - Untuk rollout aman, mulai dari mode monitor dulu (belum enforce Firestore).
4. Rules Firestore ada di `firestore.rules`, publish rules tersebut ke Firebase Console.
5. Struktur data yang dipakai:
   - Collection: `messages`
   - Subcollection like: `messages/{messageId}/likes/{uid}`
   - Subcollection report: `messages/{messageId}/reports/{uid}`
     - report fields: `createdAt`, `reason`, `reporterUid`, `note`
   - Collection: `messageSpecials`
     - doc id: `messageId`
     - fields: `messageId`, `active`, `createdAt`, `updatedAt`, `updatedByUid`
6. Reload website. Jika config benar, Message Wall akan aktif realtime.
7. Buat composite index query list:
   - `isVisible` Asc
   - `likeCount` Desc
   - `createdAt` Desc
8. Jika memakai fitur Pesan Khusus, siapkan index tambahan:
   - collection: `messageSpecials`
   - `active` Asc
   - `updatedAt` Desc

## Message Center Pagination

1. Pagination `Load more` aktif di `pesan.html` (full mode), batch default 24 pesan.
2. Query full mode memakai timeline:
   - `isVisible` Asc
   - `createdAt` Desc
3. Klik `Load more` akan memperbesar window realtime (24 -> 48 -> 72 dst).
4. Deep-link share (`?from=share#m-...`) akan auto-fetch bertahap saat target belum termuat, maksimal 5 batch.
5. Sort `Top` di full mode dihitung dari data yang sudah termuat saat ini.

## Message Flow Stability Smoke Checklist

1. Baseline realtime:
   - buka `pesan.html`, pastikan status online muncul dan list awal termuat.
2. Search/sort/filter:
   - aktifkan kombinasi pencarian/filter yang membuat hasil kosong.
   - jika data belum habis dimuat, hint harus menyarankan klik `Load more`.
3. Load more state:
   - klik `Load more` beberapa kali.
   - validasi state tombol `loading -> idle` dan akhirnya `end` saat data habis.
4. Recoverable error:
   - simulasi gangguan jaringan saat `Load more`.
   - daftar pesan lama tetap tampil, tombol masuk state retry (`Coba lagi`).
5. Deep-link valid:
   - buka `pesan.html?from=share#m-<messageId>`, modal harus tampil.
   - klik `Buka Pesan`, target harus spotlight/focus bila ditemukan.
   - jika belum ketemu otomatis, status harus mengarahkan lanjut manual `Load more`.
6. Deep-link invalid:
   - buka `pesan.html#m-<messageId>` tanpa query marker, modal/focus tidak boleh aktif.
7. Regression aksi kartu:
   - `Like`, `Report/Unreport`, `Delete` (pemilik), dan `Share` tetap berfungsi setelah beberapa kali `Load more`.
8. Mobile viewport:
   - uji lebar <=640px, tombol `Load more` tetap nyaman disentuh dan tidak overflow.
9. Build check:
   - jalankan `npm run build`, pastikan sukses tanpa error.

## Slideshow Stability Smoke Checklist (Index + Angkatan)

1. Open gallery:
   - buka `index.html` lalu `angkatan.html`, pastikan tombol `Start Slideshow` tampil di area kontrol galeri.
   - expected: tombol terlihat jelas dan tidak menabrak filter.
2. Quick-start flow:
   - klik `Start Slideshow`.
   - expected: lightbox terbuka, tombol berubah ke `Stop Slideshow`, progress bar mulai berjalan.
3. Lightbox controls:
   - klik `▶ Play/Pause Slideshow`, `Cinematic`, `Next`, `Prev`.
   - expected: label tombol sinkron, counter berubah, progress reset saat pindah slide manual.
4. Keyboard controls:
   - fokus item galeri lalu tekan `Enter` atau `Space` untuk buka lightbox.
   - dalam lightbox uji `ArrowLeft/ArrowRight`, `Space` (play/pause), `Escape` (close), dan `Tab` bolak-balik.
   - expected: navigasi keyboard berjalan, fokus tidak keluar modal saat `Tab`.
5. Focus restore:
   - buka lightbox dari kartu galeri lalu tutup.
   - buka lightbox dari tombol `Start Slideshow` lalu tutup.
   - expected: fokus kembali ke pemicu terakhir (kartu atau tombol start).
6. Filter behavior:
   - ganti kategori filter saat slideshow sedang aktif.
   - expected: slideshow berhenti rapi, progress reset, item galeri ter-render sesuai filter.
7. Reduced-motion:
   - aktifkan `prefers-reduced-motion` di OS/DevTools.
   - expected: animasi berat (Ken Burns/shimmer) berkurang, fungsi slideshow tetap normal.
8. Mobile viewport:
   - uji lebar <=640px.
   - expected: tombol slideshow tetap mudah disentuh, lightbox controls tidak overflow horizontal.
9. Build check:
   - jalankan `npm run build`.
   - expected: build sukses tanpa error.

## Catatan

- File contoh env ada di `.env.example`.
- UI status App Check ada di `#messageSecurityHint`.
- Validasi frontend saat submit:
  - `nama` dan `jurusan`: 2-40 karakter
  - `angkatan`: format `20xx`
  - `pesan`: 5-280 karakter
- Message ownership:
  - setiap pesan baru menyimpan `ownerUid` (UID anonymous auth)
  - user hanya bisa menghapus pesan miliknya sendiri
- Like system:
  - tombol like bersifat toggle (`Like`/`Unlike`)
  - dokumen like disimpan per user (`likes/{uid}` + `likerUid`)
  - urutan list: like terbanyak dulu, kalau sama yang terbaru di atas
- Report moderation:
  - one-user-one-report per pesan (`reports/{uid}`)
  - reason preset: `spam`, `toxic`, `harassment`, `other`
  - reason `other` wajib isi `note` 10-280 karakter
  - reason selain `other` wajib kirim `note` kosong (`""`)
  - jika `reportCount >= 5`, pesan auto-hide (`isVisible=false`)
  - owner tidak bisa report pesan sendiri
  - `Unreport` hanya saat pesan masih visible
- Throttle submit:
  - cooldown 30 detik antar post per device
  - maksimal 3 post per 10 menit per device
- Pesan Khusus:
  - hanya tampil di `pesan.html` (Message Center), bukan preview beranda
  - ditampilkan maksimal 3 card pada panel khusus di kolom kanan
  - tidak ditampilkan ganda di list biasa (eksklusif tampil pada panel khusus)
  - admin mengelola Set/Hapus Khusus dari `moderation.html`
- Migrasi dari skema like lama:
  - disarankan reset data like lama sekali agar konsisten dengan skema baru.

## Develop (Vite)

1. Install dependencies:
   - `npm install`
2. Jalankan dev server:
   - `npm run dev`
3. Build production:
   - `npm run build`
4. Preview hasil build:
   - `npm run preview`

## Deploy ke Firebase Hosting

1. Install Firebase CLI dan login:
   - `npm install -g firebase-tools`
   - `firebase login`
2. Pastikan kamu berada di root project ini.
3. Build dulu:
   - `npm run build`
4. Deploy website:
   - `firebase deploy --only hosting`
5. Deploy Firestore rules:
   - `firebase deploy --only firestore:rules`
6. Jika ingin deploy semua sekaligus:
   - `firebase deploy`

Konfigurasi deploy sudah disiapkan di:
- `firebase.json`
- `.firebaserc` (default project: `website-kelas-xii`)
- `.firebaseignore`

## Pesan Khusus Setup

1. Pastikan rules terbaru `firestore.rules` sudah dipublish (termasuk `match /messageSpecials/{messageId}`).
2. Kelola status khusus dari halaman `moderation.html`:
   - tombol `Jadikan Khusus` untuk aktifkan
   - tombol `Hapus Khusus` untuk nonaktifkan
3. Batas aktif default adalah 3 pesan khusus.
4. Validasi rules:
   - write ke `messageSpecials` hanya untuk admin (`isAdminUid()`).
   - `messageId` field harus sama dengan doc id.
   - `active=true` hanya boleh untuk pesan parent yang masih `isVisible=true`.

## Rollout App Check Bertahap

1. Deploy client dengan App Check aktif, tapi `appCheckHardFail=false`.
2. Verifikasi traffic valid di Firebase App Check dashboard.
3. Aktifkan enforcement App Check untuk Firestore di Firebase Console.
4. Ubah `appCheckHardFail=true` di `.env`.
5. Matikan debug token jika sempat dipakai.

## Troubleshooting

- Error `permission-denied`:
  - cek Firestore rules, App Check enforcement, dan Anonymous Auth.
- Error `failed-precondition`:
  - biasanya index query belum dibuat atau masih status building.
- Error `unavailable`:
  - gangguan koneksi/jaringan atau service Firebase.

## Report Moderation Setup

1. Pastikan rules terbaru di `firestore.rules` sudah dipublish.
2. Pastikan pesan baru menyimpan field `reportCount: 0`.
3. UI report memakai modal alasan report dan tombol `Report/Unreport`.
   - alasan memakai custom dropdown dark (bukan native select), jadi popup putih browser tidak muncul.
   - jika pilih `Other`, textarea `note` wajib diisi (10-280 karakter).
4. Admin review via Firebase Console:
   - pesan hidden ada pada dokumen `messages` dengan `isVisible=false`.
   - detail report ada di `messages/{messageId}/reports/{uid}`.
5. Kebijakan v1:
   - tidak ada auto-unhide saat report turun di bawah threshold.
   - restore visibilitas dilakukan manual oleh admin di Console.
6. Jika dapat `PERMISSION_DENIED` saat report:
   - cek payload create report sudah mengirim field `note`.
   - pastikan `note` kosong untuk reason non-`other`, dan 10-280 karakter untuk reason `other`.
   - cek Console browser untuk log `[report-debug] permission-denied` (berisi `actorUid`, `authUid`, host, status App Check).

## Admin Moderation Queue Setup

1. Halaman admin ada di `moderation.html` (tidak ditaruh di menu publik utama).
2. Isi env di `.env`:
   - `VITE_MODERATION_ENABLED`.
   - `VITE_MODERATION_ADMIN_UIDS` (comma-separated UID admin).
   - `VITE_MODERATION_QUEUE_LIMIT`.
   - `VITE_MODERATION_REPORT_PREVIEW_LIMIT`.
   - `VITE_MODERATION_SPECIAL_CANDIDATE_LIMIT`.
3. Samakan allowlist UID di `firestore.rules` pada helper `isAdminUid()`.
4. Cara ambil UID admin:
   - buka `moderation.html` saat belum di-allowlist.
   - copy UID dari kartu status "Akses Ditolak".
   - masukkan UID ke config + rules, lalu redeploy rules.
5. Aksi admin yang tersedia:
   - `Lihat Report` untuk baca `reason`, `note`, `reporterUid`.
   - `Unhide` untuk set `isVisible=true`.
   - `Delete` untuk hapus pesan + cleanup `likes/*` dan `reports/*`.
6. Buat index queue admin:
   - collection: `messages`
   - `isVisible` Asc
   - `reportCount` Desc
   - `createdAt` Desc
7. Urutan deploy aman:
   - deploy `firestore.rules` dulu.
   - deploy frontend (`moderation.html`, build Vite, config env).
   - uji dengan 1 UID non-admin dan 1 UID admin.
8. Troubleshooting admin queue:
   - `permission-denied`: UID belum di allowlist rules/config atau App Check/Auth bermasalah.
   - `failed-precondition`: index queue hidden belum dibuat atau masih building.
   - `unavailable`: koneksi atau layanan Firebase sedang gangguan.

## Moderation Audit Log

1. Collection audit baru: `moderationAuditLogs`.
2. Aksi yang dicatat:
   - `unhide`
   - `delete`
   - `special_enable`
   - `special_disable`
3. Field dokumen audit:
   - `actionType`, `messageId`, `messageMeta`, `messagePreview`, `reason`, `actorUid`, `createdAt`.
4. Kebijakan reason:
   - `unhide` dan `delete`: reason wajib (8-200 karakter).
   - `special_enable` dan `special_disable`: reason harus string kosong (`""`).
5. Rules collection audit:
   - read hanya admin (`isAdminUid()`).
   - create hanya admin + validasi field lengkap.
   - update/delete ditolak (immutable log).
6. UI moderation menampilkan 50 log terbaru realtime pada panel **Aktivitas Admin**.
7. Setelah update ini, deploy ulang rules:
   - `firebase deploy --only firestore:rules`

## Moderation Pro Tools (Audit Filter & Export)

1. Panel **Aktivitas Admin** sekarang punya tools:
   - filter aksi (`all`, `unhide`, `delete`, `special_enable`, `special_disable`),
   - keyword,
   - rentang tanggal,
   - tombol `Terapkan`, `Reset`, `Export CSV`.
2. Default mode tetap realtime (`50 terbaru`).
3. Saat klik `Terapkan`, sistem memakai query on-demand (bukan listener realtime) dengan batas `maks 500 baris`.
4. Keyword difilter di sisi client pada field:
   - `messageMeta`, `messagePreview`, `reason`, `actorUid`, `messageId`.
5. Tombol `Export CSV` mengikuti data yang sedang tampil:
   - mode realtime: data realtime panel (maks 50),
   - mode filtered: hasil filter aktif (maks 500).
6. Default rentang tanggal filter: `30 hari terakhir`.
7. Catatan index query audit:
   - `moderationAuditLogs` + `createdAt Desc` (single-field biasanya cukup),
   - jika filter aksi + tanggal memicu `failed-precondition`, siapkan index:
     - `actionType` Asc
     - `createdAt` Desc
