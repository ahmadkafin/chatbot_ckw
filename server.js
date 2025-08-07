const utils = require('./app/utils');
const whatsapp = utils.whatsapp;
const cron = require('node-cron');
const sheets = utils.fetchData;

const pullData = async () => {
    await sheets.fetchData("Tarif", 'tarif');
    await sheets.fetchData("Edukasi Penyakit", 'edukasi_penyakit');
    await sheets.fetchData("Pengumuman", 'pengumuman');
    const time = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    const message = `📌 Tarik data Google Sheets berhasil dijalankan pada ${time}.`;

    console.log(`[${time}] ✅ Tarik data Google Sheets selesai`);
    await whatsapp.sendAdminMessage(message);
}

main();

// db.sequelize.sync();
cron.schedule('0 */6 * * *', pullData, { timezone: 'Asia/Jakarta' });
whatsapp.makeWhatsappSocket();

async function main() {
    await pullData();
}