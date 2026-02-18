export default async ({ req, res, log, error }) => {
  // Ambil API Key dari Environment Variables yang lo input tadi
  const GROQ_KEY = process.env.GROQ_API_KEY;

  if (req.method !== 'POST') {
    return res.json({ success: false, error: 'Harus POST anjing!' });
  }

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
            content: `Anda adalah TenderEngine v4, Sistem Pakar Penulisan Proposal Proyek senior. 
            Tugas: Transformasi data kasar menjadi narasi profesional, otoritatif, dan persuasif. 
            Struktur: Judul, Ringkasan Eksekutif, Latar Belakang, Metodologi, Timeline, Penutup. 
            Bahasa: Formal Indonesia. Larangan: Jangan sebut Anda AI!` 
          },
          { role: "user", content: `JUDUL: ${title}\nDATA KASAR: ${brief}` }
        ],
        temperature: 0.7
      })
    });

    const data = await groqRes.json();
    
    if (!data.choices) throw new Error('API Groq bermasalah!');

    return res.json({
      success: true,
      proposal: data.choices[0].message.content
    });

  } catch (err) {
    error(err.message);
    return res.json({ success: false, error: err.message });
  }
};