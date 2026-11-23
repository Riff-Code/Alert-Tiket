// /pages/api/lapor.js
// Serverless function di Vercel — menerima form dari frontend lalu kirim ke Fonnte.
// Token Fonnte HANYA ada di sini (via env var), tidak pernah ter-expose ke browser.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { tipe, nama, lokasi, urgensi, deskripsi } = req.body || {};

    // Validasi
    if (!tipe || !nama || !deskripsi) {
      return res
        .status(400)
        .json({ ok: false, error: "Tipe, nama, dan deskripsi wajib diisi." });
    }
    if (!["incident", "request"].includes(tipe)) {
      return res.status(400).json({ ok: false, error: "Tipe tidak valid." });
    }

    const URGENSI = {
      low: { label: "🟢 LOW" },
      medium: { label: "🟡 MEDIUM" },
      high: { label: "🟠 HIGH" },
      critical: { label: "🔴 CRITICAL" },
    };
    const urg = URGENSI[urgensi] || URGENSI.medium;

    const token = process.env.FONNTE_TOKEN;
    const targetRaw = process.env.ENGINEER_WA; // 1 atau lebih nomor, pisahkan dengan koma
    // Bersihkan spasi & nomor kosong: "628xxx, 628yyy ,628zzz" -> "628xxx,628yyy,628zzz"
    const target = (targetRaw || "")
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean)
      .join(",");

    if (!token || !target) {
      return res
        .status(500)
        .json({ ok: false, error: "Server belum dikonfigurasi (FONNTE_TOKEN / ENGINEER_WA)." });
    }

    // Format waktu Jakarta
    const now = new Date();
    const waktu = now.toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Generate Ticket ID sederhana berdasarkan timestamp
    const ticketId =
      (tipe === "incident" ? "INC" : "REQ") +
      "-" +
      now.getTime().toString().slice(-6);

    const header =
      tipe === "incident" ? "🚨 *LAPORAN INCIDENT*" : "📝 *PERMINTAAN / REQUEST*";

    // Susun pesan WhatsApp
    let message = `${header}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `🎫 *Ticket ID*  : ${ticketId}\n`;
    message += `🕒 *Waktu*      : ${waktu} WIB\n`;
    message += `👤 *Pelapor*    : ${nama}\n`;
    if (lokasi) message += `📍 *Lokasi*     : ${lokasi}\n`;
    message += `⚡ *Urgensi*    : ${urg.label}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📄 *Deskripsi:*\n${deskripsi}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `✅ *Cara penyelesaian tiket:*\n`;
    message += `-`;

    // Kirim ke Fonnte
    const formData = new URLSearchParams();
    formData.append("target", target);
    formData.append("message", message);
    formData.append("countryCode", "62");

    const fonnteRes = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const fonnteData = await fonnteRes.json().catch(() => ({}));

    if (!fonnteRes.ok || fonnteData.status === false) {
      console.error("Fonnte error:", fonnteData);
      return res.status(502).json({
        ok: false,
        error: `Gagal mengirim ke WhatsApp${
          fonnteData.reason ? ": " + fonnteData.reason : fonnteRes.ok ? "" : " (HTTP " + fonnteRes.status + ")"
        }.`,
        detail: fonnteData,
      });
    }

    return res.status(200).json({ ok: true, ticketId });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ ok: false, error: "Terjadi kesalahan server." });
  }
}
