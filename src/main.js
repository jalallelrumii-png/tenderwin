export default async ({ req, res, log, error }) => {
  const GROQ_KEY = process.env.GROQ_API_KEY;

  if (req.method !== 'POST') return res.json({ success: false, error: 'Wajib POST!' });

  try {
    const { title, brief } = JSON.parse(req.body);

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [
          { 
            role: "system", 
            content: `Anda adalah Chief Strategy Officer & Pakar Tender Senior. 
            Tugas: Mengonversi draf kasar menjadi proposal bisnis pemenang tender.
            Prinsip: Gunakan bahasa persuasif, otoritatif, dan high-level business Indonesian.
            Struktur: 
            1. Executive Summary (High impact).
            2. Value Proposition & Analisis Masalah.
            3. Metodologi Eksekusi (Langkah teknis detail).
            4. Mitigasi Risiko & Quality Assurance.
            5. Timeline Strategis & Penutup.
            Larangan: Jangan sebut Anda AI. Langsung hasilkan dokumen siap cetak.` 
          },
          { role: "user", content: `PROYEK: ${title}\nRINCIAN: ${brief}` }
        ],
        temperature: 0.65
      })
    });

    const data = await groqRes.json();
    return res.json({ success: true, proposal: data.choices[0].message.content });
  } catch (err) {
    return res.json({ success: false, error: err.message });
  }
};
