# Roast My IG

Project untuk melakukan analisis akun Instagram menggunakan AI model Google Gemini dan data dari RapidAPI.

## 🔗 Repository
[https://github.com/vergatan10/roast-my-ig](https://github.com/vergatan10/roast-my-ig)

---

## ⚙️ Langkah Instalasi

1. **Clone Repository**
   ```bash
   git clone https://github.com/vergatan10/roast-my-ig.git
   cd roast-my-ig
   ```

2. **Install Dependency**
   ```bash
   npm install
   # atau
   yarn install
   ```

3. **Siapkan API Keys**

   ### 🔑 Google Gemini API Key
   - Dapatkan dari [Google AI Studio](https://aistudio.google.com/).
   - Simpan key ke dalam file `.env`.

   ### 🔑 Instagram Scraper Stable API (RapidAPI)
   - Kunjungi: [https://rapidapi.com/thetechguy32744/api/instagram-scraper-stable-api](https://rapidapi.com/thetechguy32744/api/instagram-scraper-stable-api)
   - Buat sekitar **5 API Key** untuk menghindari rate limit (digunakan untuk looping jika terjadi kegagalan fetch).
   - Simpan semua key dan detail host/url ke dalam file `.env`.

4. **Contoh `.env`**
   ```env
   # Google Gemini
   GOOGLE_API_KEY=your_google_gemini_api_key

   # RapidAPI (gunakan key ke-1 sampai ke-5)
   X_RAPIDAPI_KEY1=key1
   X_RAPIDAPI_KEY2=key2
   X_RAPIDAPI_KEY3=key3
   X_RAPIDAPI_KEY4=key4
   X_RAPIDAPI_KEY5=key5
   
   X_RAPIDAPI_HOST=instagram-scraper-stable-api.p.rapidapi.com
   NEXT_PUBLIC_API_BACKEND_V2=https://instagram-scraper-stable-api.p.rapidapi.com
   ```

5. **Jalankan Aplikasi**
   ```bash
   npm run dev
   # atau
   yarn dev
   ```

---

## 🛠️ Catatan Developer

- Jika ingin mengganti API RapidAPI atau AI model yang digunakan, kamu bisa mengubahnya di file route:
  ```
  routes/api/roast_v2.js
  ```
  Silakan sesuaikan dengan kebutuhan kamu.
