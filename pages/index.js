import { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [step, setStep] = useState(1);
  const [tipe, setTipe] = useState(null);
  const [form, setForm] = useState({
    nama: "",
    lokasi: "",
    kontak: "",
    deskripsi: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [ticketId, setTicketId] = useState("");

  const pilihTipe = (t) => {
    setTipe(t);
    setStep(2);
  };
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!form.nama.trim() || !form.deskripsi.trim()) {
      setErrorMsg("Nama dan Deskripsi wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/lapor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipe, ...form }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || "Gagal mengirim laporan.");
        setLoading(false);
        return;
      }
      setTicketId(data.ticketId);
      setStep(3);
    } catch {
      setErrorMsg("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setTipe(null);
    setForm({ nama: "", lokasi: "", kontak: "", deskripsi: "" });
    setErrorMsg("");
    setTicketId("");
  };

  return (
    <>
      <Head>
        <title>Lapor Kendala IT 👋</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="page">
        {/* Background decorations */}
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        <div className="container">
          <header className="header">
            <div className="logo-pill">
              <span className="logo-emoji">⚡</span>
              <span>Helpdesk IT</span>
            </div>
            <h2 className="hello">Hai, ada yang bisa kami bantu?</h2>
          </header>

          {/* STEP 1 — Pilih tipe */}
          {step === 1 && (
            <section className="card fade-in">
              <p className="card-eyebrow">Langkah 1 dari 3</p>
              <h1 className="title">Mau lapor apa hari ini?</h1>
              <p className="subtitle">
                Pilih salah satu, lalu kami sambungkan ke engineer 🚀
              </p>

              <div className="choice-grid">
                <button
                  className="choice incident"
                  onClick={() => pilihTipe("incident")}
                  type="button"
                >
                  <div className="choice-emoji">🚨</div>
                  <div className="choice-title">Incident</div>
                  <div className="choice-desc">
                    Ada yang error, gangguan, atau tidak berfungsi seperti biasa
                  </div>
                  <div className="choice-arrow">→</div>
                </button>

                <button
                  className="choice request"
                  onClick={() => pilihTipe("request")}
                  type="button"
                >
                  <div className="choice-emoji">✨</div>
                  <div className="choice-title">Request</div>
                  <div className="choice-desc">
                    Minta akses, instalasi, atau konfigurasi sesuatu yang baru
                  </div>
                  <div className="choice-arrow">→</div>
                </button>
              </div>
            </section>
          )}

          {/* STEP 2 — Form */}
          {step === 2 && (
            <section className="card fade-in">
              <div className="form-head">
                <button
                  className="back"
                  onClick={() => setStep(1)}
                  type="button"
                >
                  ← Ganti pilihan
                </button>
                <div className={`badge ${tipe}`}>
                  {tipe === "incident" ? "🚨 Incident" : "✨ Request"}
                </div>
              </div>

              <p className="card-eyebrow">Langkah 2 dari 3</p>
              <h1 className="title">Ceritakan detailnya</h1>
              <p className="subtitle">
                Semakin jelas, semakin cepat engineer bisa bantu 💪
              </p>

              <form onSubmit={submit} className="form">
                <div className="field">
                  <label htmlFor="nama">
                    Nama kamu <span className="req">*</span>
                  </label>
                  <input
                    id="nama"
                    name="nama"
                    type="text"
                    value={form.nama}
                    onChange={handleChange}
                    placeholder="Contoh: Muhammad Arif"
                    required
                  />
                </div>

                <div className="row">
                  <div className="field">
                    <label htmlFor="lokasi">Lokasi / Lantai</label>
                    <input
                      id="lokasi"
                      name="lokasi"
                      type="text"
                      value={form.lokasi}
                      onChange={handleChange}
                      placeholder="Contoh: Lantai 11"
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="kontak">No. HP</label>
                    <input
                      id="kontak"
                      name="kontak"
                      type="tel"
                      value={form.kontak}
                      onChange={handleChange}
                      placeholder="081234567890"
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="deskripsi">
                    Apa yang terjadi? <span className="req">*</span>
                  </label>
                  <textarea
                    id="deskripsi"
                    name="deskripsi"
                    rows={5}
                    value={form.deskripsi}
                    onChange={handleChange}
                    placeholder="Jelaskan masalah/permintaannya. Sertakan langkah yang sudah dicoba, pesan error, atau aplikasi yang bermasalah ✏️"
                    required
                  />
                </div>

                {errorMsg && <div className="alert error">⚠️ {errorMsg}</div>}

                <button
                  className="btn-primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner" /> Mengirim...
                    </>
                  ) : (
                    <>Kirim ke Engineer 🚀</>
                  )}
                </button>
              </form>
            </section>
          )}

          {/* STEP 3 — Done */}
          {step === 3 && (
            <section className="card fade-in done">
              <div className="confetti">
                <span>🎉</span>
                <span>✨</span>
                <span>🎊</span>
              </div>

              <div className="check-wrap">
                <svg viewBox="0 0 52 52" className="check">
                  <circle cx="26" cy="26" r="25" fill="none" />
                  <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
              </div>

              <p className="card-eyebrow">Langkah 3 dari 3 — selesai!</p>
              <h1 className="title">Yay, laporan terkirim! 🎉</h1>
              <p className="subtitle">
                Engineer kami sudah dapat notifikasi WhatsApp dan akan segera
                menindaklanjuti.
              </p>

              <div className="ticket-box">
                <div className="ticket-label">Nomor Tiket</div>
                <div className="ticket-id">{ticketId}</div>
              </div>

              <p className="hint">
                💡 Simpan nomor tiket di atas. Engineer mungkin akan menghubungi
                kamu untuk info tambahan.
              </p>

              <button className="btn-primary" onClick={reset} type="button">
                Buat Laporan Baru ✏️
              </button>
            </section>
          )}

          <footer className="footer">
            Made with ❤️ by IT Operations · 2026
          </footer>
        </div>
      </main>
    </>
  );
}
