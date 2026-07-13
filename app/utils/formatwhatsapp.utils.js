// format-whatsapp.js
function formatCalibrationWhatsappMessage(payload) {
    const buckets = payload.data || {};
    const sortedKeys = Object.keys(buckets)
        .map(k => parseInt(k, 10))
        .filter(k => !Number.isNaN(k))
        .sort((a, b) => a - b);

    if (sortedKeys.length === 0) return "Tidak ada data kalibrasi.";

    const lines = [];
    lines.push('Saya SIWA bekerjasama dengan SIMADU, akan mengingatkan jadwal kalibrasi alat kesehatan sebagai berikut:\n');
    lines.push('==========================================\n');
    lines.push("📢 *Notifikasi Kalibrasi Alat Kesehatan* 📢\n");
    for (const bucket of sortedKeys) {
        const items = Array.isArray(buckets[bucket]) ? buckets[bucket] : [];
        const bucketTitle = bucket === 0 ? `📅 ${bucket} hari (hari ini):` : `📅 ${bucket} hari:`;
        lines.push(bucketTitle);

        if (items.length === 0) {
            lines.push("  - (tidak ada item)\n");
            continue;
        }

        for (let i = 0; i < items.length; i++) {
            const it = items[i];
            const summary = `${i + 1}. ${it.alat_kesehatan || '-'} — SN: ${it.nomor_seri || '-'} — Ruang: ${it.nama_ruangan || '-'} - Keterangan : ${it.status}\n`;
            lines.push("  " + summary);

            const diff = it.diff_days > 0
                ? `\n‣ 📆 *Jatuh tempo dalam ${it.diff_days} hari*`
                : it.diff_days === 0
                    ? `\n‣ 📆 *Jatuh tempo hari ini*`
                    : `\n‣ 📆 *Terlambat ${Math.abs(it.diff_days)} hari*`;

            lines.push(`‣ 🧾 Sertifikat: ${it.nomor_sertifikat || '-'}\n‣ 📆 Next: ${it.next_calib_date || '-'} | ⏳ ${diff}`);
            lines.push("");
        }
    }

    return lines.join("\n");
}

module.exports = { formatCalibrationWhatsappMessage };
