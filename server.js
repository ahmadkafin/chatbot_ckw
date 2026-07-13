require('dotenv').config();

const utils = require('./app/utils');
const whatsapp = utils.whatsapp;
const formatWhatsapp = utils.formatWhatsapp;
const cron = require('node-cron');
const sheets = utils.fetchData;
const express = require('express');
const fs = require('fs');
const { default: axios } = require('axios');

const app = express();
const PORT = process.env.PORT || 8181;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/', (req, res) => {
    return res.status(200).json("Hello From SIWA");
})

app.post('/webhook/whatsapp', (req, res) => {
    const { message, number } = req.body;
    whatsapp.sendWebhookMessage(message, number);
    return res.status(200).json({ status: "success" });
});

// app.get('/populate-calib', async (req, res) => {
//     const response = await axios.get('http://192.168.1.9/calib-app/kalibrasi/getClosestDate',
//         {
//             headers: { 'X-INTERNAL-SECRET': process.env.INTERNAL_SECRET }
//         }
//     );

//     const data = response.data;
//     const phones = ['081312425757', '083822252474', '081914240226'];
//     await whatsapp.sendNotificationsCalib(formatWhatsapp.formatCalibrationWhatsappMessage(data), phones).then(() => {
//         return res.status(200).json({
//             status: 200,
//             data: response.data,
//         })
//     })
// })


const pullData = async () => {
    await sheets.fetchData("Tarif", 'tarif');
    await sheets.fetchData("Edukasi Penyakit", 'edukasi_penyakit');
    await sheets.fetchData("Pengumuman", 'pengumuman');
    const time = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    const message = `📌 Tarik data Google Sheets berhasil dijalankan pada ${time}.`;

    console.log(`[${time}] ✅ Tarik data Google Sheets selesai`);
    await whatsapp.sendAdminMessage(message);
}

const checkCalib = async () => {
    // console.log("test cron calib")
    try {
        await axios.get('http://192.168.1.9/calib-app/kalibrasi/getClosestDate',
            {
                headers: { 'X-INTERNAL-SECRET': process.env.INTERNAL_SECRET }
            }
        ).then(async (response) => {
            const data = response.data;
            const phonesRaw = fs.readFileSync('./phone.json');
            const phones = JSON.parse(phonesRaw);
            await whatsapp.sendNotificationsCalib(formatWhatsapp.formatCalibrationWhatsappMessage(data), phones, 300).then(async () => {
                const time = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
                console.log(`[${time}] ✅ Kirim data berhasil`);
                await whatsapp.sendAdminMessage(`✅ Kirim data berhasil ke nomor penerima notifikasi.`);
            }).catch(async (e) => {
                await whatsapp.sendAdminMessage(`❌ Gagal kirim data ke nomor penerima notifikasi.`);
                // console.log(e.message);
            });
        });
    } catch (e) {
        console.error("Gagal cek data kalibrasi:", e.message);
    }
}

// main();

cron.schedule('0 */6 * * *', pullData, { timezone: 'Asia/Jakarta' });
cron.schedule('0 9 * * *', checkCalib, { timezone: 'Asia/Jakarta' });

whatsapp.makeWhatsappSocket();

async function main() {
    // await pullData();
    // await checkCalib();
}

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
})
