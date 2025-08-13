# Cafe Story — Static Website
Website statis untuk kafe remaja **Cafe Story**. Warna dasar putih & biru, lengkap dengan:
- Slider foto (hero)
- Animasi scroll & counter
- Katalog menu + keranjang belanja (localStorage)
- Halaman checkout (simulasi, tanpa backend)

## Struktur
- `index.html` — Landing page + katalog & keranjang (drawer)
- `checkout.html` — Ringkasan pesanan + form checkout
- `styles.css` — Styling
- `script.js` — Logika slider, animasi, cart, checkout
- `assets/images/*.svg` — Gambar placeholder tema biru/putih

## Cara pakai (GitHub Pages)
1. Upload semua file/folder ini ke repo GitHub kamu (misal: `cafestory`).
2. Aktifkan **Settings → Pages → Deploy from branch** (pilih branch `main` dan folder `/root`).
3. Akses halaman GitHub Pages dari URL yang diberikan (biasanya `https://username.github.io/cafestory/`).

## Catatan
- Keranjang disimpan di `localStorage` browser, jadi tetap ada saat reload.
- Checkout hanya simulasi dan akan mengosongkan keranjang + redirect ke halaman utama.
- Kamu bisa ganti gambar SVG di `assets/images` dengan foto asli kafe/produkmu.
