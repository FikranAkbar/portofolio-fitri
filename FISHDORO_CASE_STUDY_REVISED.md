# Fishdoro
## A Gamified Pomodoro Timer That Makes Focus Feel Like a Cozy Game

> **Project Type:** Self-initiated exploration · UI Design + Coded MVP  
> **Platform:** Windows Desktop App  
> **Role:** UI Designer (solo project)  
> **Timeline:** [Timeline]  

---

## TL;DR

Banyak orang tahu Pomodoro itu efektif — tapi mereka tidak mau membuka timer-nya. Fishdoro menjawab ini dengan mengubah sesi fokus menjadi pengalaman memancing pixel yang menyenangkan: fleksibel, rewarding, dan tidak terasa seperti bekerja keras. Hasilnya adalah MVP desktop yang fully functional dengan sistem reward berbasis ikan yang tumbuh setiap sesi selesai.

---

## Background

### Pomodoro itu efektif. Tapi kenapa orang tetap tidak mau pakai?

Teknik Pomodoro sudah terbukti membantu orang fokus — interval pendek yang terstruktur mengurangi overwhelm dan membangun momentum. Tapi ada gap yang menarik:

> **Orang tahu teknik ini bagus. Mereka tetap tidak menggunakannya.**

Kenapa? Karena kebanyakan timer app terasa seperti alat yang *memaksa* — kaku, serius, dan tidak memberi ruang untuk cara kerja yang berbeda-beda. Format 25/5 yang rigid tidak cocok untuk semua orang, dan tidak ada alasan emosional untuk membuka appnya hari berikutnya.

**Pertanyaan desain yang muncul:**  
*Bisakah sebuah timer terasa seperti cozy mini-game — sesuatu yang ingin kamu buka, bukan yang harus kamu buka?*

---

## Research

### Apa yang sebenarnya dirasakan pengguna timer?

Karena tidak banyak akses ke consistent Pomodoro users secara langsung, research dilakukan melalui komunitas Reddit — platform yang penuh dengan candid opinions dan unfiltered experiences.

**3 fokus utama:**
- Frustrasi nyata dengan Pomodoro apps yang ada
- Apakah gamification memotivasi atau justru mendistraksi?
- Apa yang membuat orang berhenti menggunakan Forest dan apps sejenis?

---

> 💡 **[VISUAL: Screenshot clusters dari thread Reddit — annotated dengan highlight warna untuk tiap tema]**

---

### 3 Key Insights

Dari proses thematic coding, muncul 3 pola yang konsisten:

---

**🔧 Insight 1 — Rigiditas adalah dealbreaker**
> *"Longer Pomodoro sessions work better for me. I prefer 45 min focus, 15 min break."*

Banyak users menyesuaikan cycle mereka sendiri. Mereka tidak meninggalkan Pomodoro — mereka meninggalkan apps yang tidak membiarkan mereka melakukan itu.

---

**🎮 Insight 2 — Gamification harus fair, bukan kompetitif**
> *"Competition only works if everyone feels they can actually compete."*

Gamification yang mendorong kompetisi justru meningkatkan pressure. Yang diinginkan user adalah **personal progress** — merasa berkembang tanpa dibanding-bandingkan.

---

**🤖 Insight 3 — Kepercayaan itu penting**
> *"Be honest if you use AI for art, sound, or promo. People can tell, and they don't like feeling tricked."*

Autentisitas dalam cara app dipresentasikan mempengaruhi kepercayaan user secara keseluruhan.

---

## Define

### Dari insights ke masalah yang jelas

Setelah memetakan pola dari research, masalah utama bisa dirangkum menjadi:

> **"Pengguna tidak meninggalkan Pomodoro karena mereka tidak punya disiplin — mereka meninggalkan timer apps karena appnya tidak fleksibel, tidak engaging, dan tidak ada alasan emosional untuk kembali."**

---

### Ini diterjemahkan ke 3 design challenge:

---

> 💡 **[VISUAL: 3 HMW cards dengan ikon — disusun horizontal]**

---

**HMW #1 — Fleksibilitas**  
Bagaimana kita bisa membuat Pomodoro lebih fleksibel agar user bisa tetap dalam flow, bukan terpotong secara paksa?

**HMW #2 — Gamification yang Bermakna**  
Bagaimana kita bisa mendesain sistem reward yang mendukung produktivitas nyata, tanpa menambah tekanan atau distraksi?

**HMW #3 — Alasan untuk Kembali**  
Bagaimana kita bisa menciptakan progress yang terasa delightful dan meaningful secara jangka panjang?

---

### Dari challenge ke keputusan fitur

Ketiga HMW di atas menjadi filter untuk memilih fitur. Bukan semua ide dimasukkan — hanya yang langsung menjawab satu atau lebih dari challenge tersebut.

---

> 💡 **[VISUAL: MoSCoW Matrix — 2x2 grid atau tabel visual dengan label Must/Should/Could/Won't]**

---

| Fitur | Prioritas | Menjawab HMW |
|-------|-----------|--------------|
| Flexible Timer (custom duration) | ✅ Must Have | #1 |
| Fishing animation saat fokus | ✅ Must Have | #2, #3 |
| Fish rewards based on session length | ✅ Must Have | #2, #3 |
| Evolving pond (visual progress) | ✅ Must Have | #3 |
| Break animation | ✅ Must Have | #2 |
| Milestone fish untuk achievements | 🟡 Should Have | #3 |
| Session log | 🟡 Should Have | #3 |
| Sound settings, auto-start | 🔵 Could Have | — |

---

## Design

### Visual Direction: Cozy · Calm · Pixel

Sebelum ke wireframe, moodboard dibuat untuk memastikan arah visual konsisten: **pixel art + fishing + nature + cozy game aesthetics**. Bukan UI yang terlihat "produktif" — tapi UI yang terlihat seperti tempat yang ingin dituju.

---

> 💡 **[VISUAL: Moodboard grid — referensi game cozy, color palette, pixel art references]**

---

### Testing → Iterasi → Hi-Fi

Sketsa awal diuji langsung ke beberapa pengguna. Dari sesi ini, ditemukan 3 friction point yang kemudian diperbaiki di hi-fi:

---

> 💡 **[VISUAL: Side-by-side Before/After — 3 perubahan utama dengan label masalah dan solusi]**

---

**Friction #1: Entry point tidak jelas**  
*Masalah:* User tidak tahu harus memulai dari mana saat pertama membuka app.  
*Solusi:* Hierarki tombol diperjelas — satu primary CTA yang dominan di homepage.

**Friction #2: Adjustment timer membingungkan**  
*Masalah:* Cara mengubah durasi tidak intuitif, butuh beberapa klik untuk menemukan.  
*Solusi:* Kontrol timer disederhanakan jadi direct increment/decrement yang visible.

**Friction #3: Ikon bait tidak dipahami**  
*Masalah:* Metafora visual "bait" tidak dikenali tanpa label — user tidak tahu apa fungsinya.  
*Solusi:* Ikon dilengkapi dengan label teks pendek dan tooltip kontekstual.

---

## Final Design

### Setiap layar menjawab satu masalah

---

> 💡 **[VISUAL: Annotated hi-fi screens — tiap screen diberi label yang menunjukkan HMW mana yang dijawab]**

---

**🎣 Timer Screen → Menjawab HMW #1 & #2**  
User bisa set durasi bebas sebelum mulai. Saat timer berjalan, animasi memancing aktif — ikan muncul saat sesi selesai, bukan saat timer dimulai. Ini menciptakan **anticipation** yang natural: semakin lama fokus, semakin besar ikan yang muncul.

---

**🐟 Fish Reward System → Menjawab HMW #2 & #3**  
Ikan yang ditangkap tidak random — ukuran dan jenis ikan ditentukan oleh panjang sesi yang diselesaikan. Ini membuat reward terasa **earned**, bukan sekedar dekorasi.

---

> 💡 **[VISUAL: Fish reward chart — mapping antara durasi sesi → jenis ikan yang didapat]**

---

**🌊 Evolving Pond → Menjawab HMW #3**  
Kolam yang terlihat di homescreen berkembang seiring ikan-ikan yang dikumpulkan. Ini adalah **visual progress tracker** yang tidak terasa seperti spreadsheet — lebih seperti taman yang tumbuh.

---

**⏸️ Break Screen → Menjawab HMW #2**  
Saat break, animasi berbeda muncul — karakter beristirahat di tepi kolam. Ini secara visual membedakan "waktu fokus" dan "waktu istirahat" tanpa instruksi teks.

---

### Apakah ini menjawab masalah awal?

| Challenge Awal | Solusi di App | Implementasi |
|----------------|--------------|--------------|
| Timer terlalu rigid | Custom duration | User set sendiri sebelum mulai |
| Tidak ada alasan emosional untuk buka app | Fishing reward system | Ikan baru setiap sesi selesai |
| Tidak ada sense of progress | Evolving pond | Kolam berkembang seiring waktu |
| Gamification terasa seperti tekanan | Personal rewards (no competition) | Tidak ada leaderboard / comparison |

---

## Nilai Plus: Ini Bukan Hanya Desain

Fishdoro bukan sekadar mockup — **semua core functionality dibangun dan berjalan end-to-end** sebagai aplikasi desktop Windows. Sebagai UI designer yang mengambil langkah lebih jauh ke ranah development, ini membuktikan bahwa keputusan desain yang dibuat bisa diimplementasikan dalam kode nyata.

Proses ini juga memperkuat keputusan desain secara langsung: beberapa pilihan UI yang terlihat baik di mockup ternyata perlu disesuaikan saat diimplementasikan — dan itu membuat desain akhirnya lebih solid.

📥 **[Download Fishdoro 0.1.0 — MVP Build]**

---

## Refleksi

Tiga hal terbesar yang dibawa dari proyek ini:

**1. Mulai dari masalah, bukan dari solusi**  
Keinginan untuk membuat "timer yang seperti game" tidak cukup sebagai landasan desain. Proyek ini menjadi lebih kuat ketika dimulai dari pertanyaan: *kenapa orang berhenti pakai timer app?*

**2. Gamification harus earned, bukan forced**  
Reward yang terasa dipaksakan lebih merusak dari tidak ada reward sama sekali. Setiap elemen gamification di Fishdoro dirancang untuk mendukung produktivitas, bukan menggantikannya.

**3. Tools yang tepat memperluas kemampuan**  
AI digunakan sebagai partner dalam development — bukan untuk menggantikan keputusan desain, tapi untuk mempercepat eksekusi ide yang sudah dipikirkan matang.

---

*Fishdoro — Fishdoro v0.1.0 MVP · 2025*  
*By Fitri Zahwa · [fitrizahwa@gmail.com](mailto:fitrizahwa00@gmail.com)*

---

> **Note untuk revisi Framer:**  
> Semua placeholder `[VISUAL: ...]` di atas adalah panduan untuk visual yang perlu dibuat/dimasukkan di website. Prioritaskan visual untuk: (1) Research Reddit clusters, (2) HMW cards, (3) MoSCoW matrix, (4) Before/After testing, (5) Fish reward chart, (6) Annotated hi-fi screens.

