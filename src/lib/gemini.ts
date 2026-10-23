export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Ordered models: Try primary first, fallback to ultra-fast lite model on 503/high-demand
const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];

const SYSTEM_INSTRUCTION = `Anda adalah Asisten Redaksi & Kurasi AI untuk "Ruang Siar" (ruangsiar.id) — platform media dan radio siar kontemporer Indonesia.
Tugas Anda:
1. Membantu tim redaksi menulis berita musik, seni budaya, teknologi audio, dan perkembangan industri kreatif Indonesia dengan gaya bahasa jurnalistik modern yang hangat, cerdas, dan mengalir (EYD / KBBI).
2. Membantu penyiar radio menyusun narasi pembuka siaran, ulasan suasana, deskripsi episode dari tracklist/playlist YouTube, rundown lagu, dan skrip obrolan siaran radio.
3. Memberikan ide topik kreatif, sudut pandang segar, dan headline yang menarik (click-worthy tanpa clickbait murahan).
Gunakan Bahasa Indonesia yang baik, santun, hangat, dan profesional.`;

async function callGemini(payload: any): Promise<any> {
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    
    // Up to 2 attempts per model (with brief backoff on 503)
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          return data;
        }

        const status = res.status;
        const errText = await res.text();
        lastError = new Error(`HTTP ${status}: ${errText}`);

        // If 503 (High demand) or 429 (Rate limit), wait 800ms and retry or fallback
        if (status === 503 || status === 429) {
          if (attempt === 1) {
            await new Promise((resolve) => setTimeout(resolve, 800));
            continue;
          }
          // Break to next candidate model
          break;
        } else {
          // Other HTTP error, break to next model
          break;
        }
      } catch (err: any) {
        lastError = err;
        break;
      }
    }
  }

  // If all models failed
  console.error('All Gemini candidate models failed:', lastError);
  throw new Error('Layanan AI sedang mengalami lonjakan trafik tinggi. Mohon coba beberapa saat lagi.');
}

export async function askGemini(prompt: string, history: Array<{ role: string; parts: Array<{ text: string }> }> = []) {
  const contents = [
    {
      role: 'user',
      parts: [{ text: `[INSTRUKSI SISTEM: ${SYSTEM_INSTRUCTION}]\n\n` }],
    },
    ...history,
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ];

  const data = await callGemini({
    contents,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  });

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Tidak ada respon yang dihasilkan oleh Gemini');
  }
  return text;
}

export async function generateNewsWithAI(topic: string, angle?: string, playlistContext?: string) {
  const prompt = `Tolong buatkan draf artikel warta/berita lengkap untuk portal Ruang Siar dengan rincian berikut:
Topik: "${topic}"
${angle ? `Sudut Pandang / Angle Khusus: ${angle}` : ''}
${playlistContext ? `Konteks Playlist / Siaran Terkait:\n${playlistContext}` : ''}

Format output HARUS berupa JSON valid persis seperti ini (tanpa markdown backtick di luar):
{
  "title": "Judul berita yang menarik, profesional, dan padat (maksimal 70 karakter)",
  "category": "Salah satu dari: Kabar Musik, Tren Industri, Seni Budaya, Opini Kurator, Teknologi Audio",
  "excerpt": "Ringkasan berita 1-2 kalimat padat dan menarik untuk pembaca (maksimal 160 karakter)",
  "content": "Isi lengkap artikel berita 3-5 paragraf yang terstruktur rapi dengan pemisah baris ganda (\\n\\n). Gunakan gaya penulisan cerdas, berbobot, dan mengalir."
}`;

  const data = await callGemini({
    contents: [
      {
        role: 'user',
        parts: [{ text: `[INSTRUKSI SISTEM: ${SYSTEM_INSTRUCTION}]\n\n${prompt}` }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json',
    },
  });

  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('Respon artikel kosong');

  try {
    return JSON.parse(rawText);
  } catch {
    const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  }
}

export async function generateBroadcastWithAI({
  playlistTitle,
  trackList,
  customNotes,
}: {
  playlistTitle?: string;
  trackList?: string;
  customNotes?: string;
}) {
  const prompt = `Anda bertugas sebagai produser dan penyiar utama Ruang Siar.
Berdasarkan materi playlist YouTube berikut:
- Judul / Tema Playlist: "${playlistTitle || 'Kurasi Musik Ruang Siar'}"
${trackList ? `- Daftar Lagu / Tracklist dalam Playlist:\n${trackList}` : ''}
${customNotes ? `- Catatan Khusus dari Admin/Penyiar: "${customNotes}"` : ''}

Tolong buatkan paket konten siaran radio lengkap:
1. "title": Judul siaran radio yang elegan dan menarik (contoh format: "Ruang Siar Pagi: [Nama Tema]" atau "Ruang Siar Senja: [Tema]").
2. "category": Kategori siaran yang cocok (pilih salah satu: "Siaran Pagi", "Siaran Sore", "Akustik & Indie", "Gelombang Malam", "Irama Akhir Pekan", "Ruang Temu").
3. "duration": Perkiraan durasi siaran (contoh: "45 Menit", "60 Menit", "30 Menit").
4. "description": Narasi pengantar penyiar (broadcaster script & ulasan suasana) sebanyak 2-3 paragraf hangat yang mengalir indah. Narasi ini harus merangkai suasana lagu-lagu di dalam playlist menjadi satu kesatuan perjalanan audio yang menyenangkan bagi pendengar Ruang Siar.

Format output HARUS berupa JSON valid persis seperti ini (tanpa teks di luar JSON):
{
  "title": "Judul Siaran",
  "category": "Kategori Siaran",
  "duration": "45 Menit",
  "description": "Teks narasi broadcaster dan deskripsi lengkap siaran..."
}`;

  const data = await callGemini({
    contents: [
      {
        role: 'user',
        parts: [{ text: `[INSTRUKSI SISTEM: ${SYSTEM_INSTRUCTION}]\n\n${prompt}` }],
      },
    ],
    generationConfig: {
      temperature: 0.75,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json',
    },
  });

  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('Respon siaran kosong');

  try {
    return JSON.parse(rawText);
  } catch {
    const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  }
}
