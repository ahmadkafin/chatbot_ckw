const {
    DisconnectReason,
    useMultiFileAuthState,
    MessageType,
    MessageOptions,
    MimeType,
    delay,
    fetchLatestBaileysVersion,
} = require('@whiskeysockets/baileys');

const fs = require('fs');
const whatsappSocket = require('@whiskeysockets/baileys').default;
const qr = require('qrcode-terminal');
const controllers = require('../controllers')
const Polis = controllers.Polis;
const Schedules = controllers.Schedules;
const Mcus = controllers.Mcus;
const PriceMcu = controllers.PriceMcu;

let globalSock = null;

const makeWhatsappSocket = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
    const { version } = await fetchLatestBaileysVersion();

    const sock = whatsappSocket({
        auth: state,
        printQRInTerminal: false,
        syncFullHistory: false,
        defaultQueryTimeoutMs: undefined,
        version,
    });

    sock.ev.on("creds.update", saveCreds);
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr: qrCode } = update;

        if (qrCode) {
            qr.generate(qrCode, { small: true });
            console.log("Generate qrcode for whatsapp auth, scan with your whatsapp app");
        }

        if (connection === "open") {
            console.log("Connection Established")
        }

        if (connection === "close") {
            const reasonCode = lastDisconnect?.error?.output?.statusCode;
            if (reasonCode === DisconnectReason.loggedOut) {
                console.log("❌ Logged out from WhatsApp, please re-authenticate.");
                // kamu bisa hapus auth folder atau trigger logout manual
            } else if (reasonCode === DisconnectReason.restartRequired) {
                console.log("🔁 Restart required, reconnecting...");
                await delay(1000); // delay opsional agar koneksi bersih
                makeWhatsappSocket(); // reconnect
            } else {
                console.log(`⚠️ Connection closed. Reason code: ${reasonCode}`);
                makeWhatsappSocket(); // reconnect default jika bukan logout
            }
        }
    });

    globalSock = sock;

    sock.ev.on("messages.upsert", async ({ messages, type }) => {
        if (!messages || !messages) return;

        const msg = messages[0];
        const from = msg.key.remoteJid;
        const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
        if (!msg.message || msg.key.fromMe) return;
        if (body.startsWith('🏥')) return;
        if (from === '120363220667970029@g.us') return;
        if (body) {
            console.log(body);
            // await sock.sendMessage(from, { text: `🏥 ${reply}` });
            await handleChatMessage(body, sock, from);
        }
    });
    // return sock;
}

const sendAdminMessage = async (text) => {
    if (!globalSock) return console.log("Whatsapp Socket belum siap");
    const adminGroup = "120363220667970029@g.us"
    try {
        await globalSock.sendMessage(adminGroup, { text });
        console.log("✅ Notifikasi admin terkirim");
    } catch (err) {
        console.error("❌ Gagal kirim notifikasi ke admin:", err);
    }
}

async function handleChatMessage(text, socket, from) {
    const menuRoot = rootMenu().map(item => item.text).join('\n');
    const greetings = swGreetings(text);
    const selectedMenu = swMenus(text) || { isValidMenu: false };

    const selectedJadwal = await menuJadwalPoli(text);
    const selectedMcu = await menuPaketMcu(text);
    const selectedInfo = await menuInfoRumahSakit(text);
    const selectedLab = await priceLabs(text);
    const selectedRads = await priceRads(text);

    await socket.sendPresenceUpdate('composing', from);
    await delay(2000);

    // 🟢 Handle sapaan
    if (greetings.isGreeting) {
        const reply = `${greetings.text}\n✍️ *Silakan pilih angka pada menu dibawah dengan mengirim pesan seperti: #1, #2, atau #6 ya*\n\n${menuRoot}\n`;
        return await socket.sendMessage(from, { text: reply });
    }

    if (text === '/menu') {
        const reply = `✍️ *Silakan pilih angka pada menu dibawah dengan mengirim pesan seperti: #1, #2, atau #6 ya*\n\n${menuRoot}\n`;
        return await socket.sendMessage(from, { text: reply });
    }

    // 🟢 Handle menu pilihan utama
    if (selectedMenu.isValidMenu) {
        switch (selectedMenu.type) {
            case "jadwal": { // #1
                const polis = await getPolis();
                const reply = `${selectedMenu.text}\n(✍️ *Ketik kode poli yang ingin Anda pilih*, misalnya: P001, P002, atau P019)\n\n${polis}`;
                return await socket.sendMessage(from, { text: reply });
            }

            case "mcus": { // #2
                const mcus = await getMcus();
                const reply = `${selectedMenu.text}\n(✍️ *Silakan ketik kode MCU yang dipilih, misalnya:* MCU001, MCU005, atau MCU012)\n\n${mcus}`;
                return await socket.sendMessage(from, { text: reply });
            }

            case "lab": {
                const labs = await getLabs();
                const reply = `${selectedMenu.text}\n(✍️ *Silakan ketik kode LAB yang dipilih, misalnya: LAB001, LAB002, dst)\n\n${labs}`
                return await socket.sendMessage(from, { text: reply })
            }

            case "radiologi": {
                const rads = await getRads();
                const reply = `${selectedMenu.text}\n(✍️ *Silakan ketik kode RADIOLOGI yang dipilih, misalnya: RAD001, RAD002, dst)\n\n${rads}`
                return await socket.sendMessage(from, { text: reply });
            }

            case "infoBpjs":
            case "infoMjkn": { // #5, #6
                await socket.sendMessage(from, { text: "🏥 harap tunggu.." });
                return await socket.sendMessage(from, {
                    video: sendVideo(selectedMenu.type),
                    caption: `🏥 📹 ${selectedMenu.text}`,
                    mimetype: 'video/mp4'
                });
            }

            case "infoRumahSakit": {
                const info = await getInfo()
                return await socket.sendMessage(from, { text: `${selectedMenu.text}\n✍️ *Silakan ketik kode info yang ingin anda ketahui, misalnya INFO01, INFO02, dst. :\n\n${info}` });
            }

            default:
                // fallback jika type tidak ditangani
                return await socket.sendMessage(from, { text: "⚠️ Menu belum tersedia." });
        }
    }

    // 🟢 Handle pemilihan jadwal berdasarkan kode poli (P001–P019)
    if (selectedJadwal.isValid) {
        return await socket.sendMessage(from, { text: selectedJadwal.text });
    }

    // 🟢 Handle pemilihan paket MCU berdasarkan kode paket (MCU001-MCU012)
    if (selectedMcu.isValid) {
        return await socket.sendMessage(from, { text: selectedMcu.text });
    }

    if (selectedInfo.isValid) {
        return await socket.sendMessage(from, { text: selectedInfo.text });
    }

    if (selectedLab.isValid) {
        const reply = `🏥 Berikut list harga untuk pemeriksaan ${selectedLab.title} :\n${selectedLab.text}`
        return await socket.sendMessage(from, { text: reply })
    }

    if (selectedRads.isValid) {
        const reply = `🏥 Berikut list harga untuk pemeriksaan ${selectedRads.title} :\n${selectedRads.text}`
        return await socket.sendMessage(from, { text: reply })
    }

    // 🟡 Fallback / catch-all response
    await socket.sendMessage(from, { text: `🏥 Halo, saya dengan SIWA asisten whatsapp RSUD Cikalongwetan, untuk membuka menu silakan ketik /menu ya` });

}

function swGreetings(text) {
    const lowerCaseText = text.toLowerCase();
    let reply;

    switch (true) {
        case lowerCaseText.includes("halo"):
        case lowerCaseText.includes("hai"):
        case lowerCaseText.includes("selamat pagi"):
        case lowerCaseText.includes("selamat siang"):
        case lowerCaseText.includes("selamat malam"):
            reply = {
                isGreeting: true,
                text: "🏥 Halo, saya dengan SIWA asisten whatsapp RSUD Cikalongwetan.\n"
            };
            break;
        case lowerCaseText.includes("assalamu'alaikum"):
        case lowerCaseText.includes("assalamualaikum"):
        case lowerCaseText.includes("salam"):
            reply = {
                isGreeting: true,
                text: "🏥 Wa'alaikumsalam Warrahmatullah Wabarokatuh, saya dengan SIWA asisten whatsapp RSUD Cikalongwetan.\n"
            };
            break;
        default:
            reply = { isGreeting: false, text: "" };
    }

    return reply;
}

function swMenus(text) {
    const selectedMenu = text.replace("#", "");
    let reply;
    if (text.includes('#')) {
        switch (true) {
            case selectedMenu === "1": reply = { isValidMenu: true, type: "jadwal", text: "🏥 📋 *Beikut daftar poli yang ada di RSUD Cikalongwetan*" }; break;
            case selectedMenu === "2": reply = { isValidMenu: true, type: "mcus", text: "🏥 📋 *Berikut daftar Paket MCU yang ada di RSUD Cikalongwetan*" }; break;
            case selectedMenu === "3": reply = { isValidMenu: true, type: "lab", text: "🏥 📋 *Berikut daftar Pemeriksaan Laboratorium yang ada di RSUD Cikalongwetan*" }; break;
            case selectedMenu === "4": reply = { isValidMenu: true, type: "radiologi", text: "🏥 📋 *Berikut daftar Pemeriksaan Radiologi yang ada di RSUD Cikalongwetan*" }; break;
            case selectedMenu === "5": reply = { isValidMenu: true, type: "infoBpjs", text: "🩺 Info BPJS bisa Anda dapatkan di *Pojok BPJS* (depan Nurse Station Poli), atau cukup tonton video ini untuk penjelasan lengkapnya. 🎬" }; break;
            case selectedMenu === "6": reply = { isValidMenu: true, type: "infoMjkn", text: "📌 Informasi mengenai *MJKN* dapat diperoleh di *Pojok MJKN* yang berada di depan, dekat *Nurse Station Poli*. Anda juga dapat menonton video berikut untuk penjelasan lengkapnya. 🎬" }; break;
            case selectedMenu === "7": reply = { isValidMenu: true, type: "infoRumahSakit", text: "🏥 ℹ️ *Berikut info yang bisa di pilih*" }; break;
            default: reply = { isValidMenu: false, text: "" };
        }
        return reply;
    }
    return { isValidMenu: false };
}

async function menuJadwalPoli(text) {
    const kodePoli = text.trim().toUpperCase();
    const listKodeValid = [
        "P001", "P002", "P003", "P004", "P005", "P006", "P007",
        "P008", "P009", "P010", "P011", "P012", "P013", "P014",
        "P015", "P016", "P017", "P018", "P019"
    ];
    if (listKodeValid.includes(kodePoli)) {
        const jadwal = await getSchedules(kodePoli);
        const poli = await findPoli(kodePoli);
        return {
            isValid: true,
            text: `🏥 Untuk ${poli.name} berikut jadwal dokter nya\n\n${jadwal}`
        }
    }
    return {
        isValid: false,
        text: ""
    };
}

async function menuPaketMcu(text) {
    const kodeMcu = text.trim().toUpperCase();
    const listKodeMcu = ["MCU001", "MCU002", "MCU003", "MCU004", "MCU005", "MCU006", "MCU007", "MCU008", "MCU009", "MCU010", "MCU011", "MCU012"];
    if (listKodeMcu.includes(kodeMcu)) {
        const priceMcu = await getPriceMcu(kodeMcu);
        const mcu = await findMcu(kodeMcu);
        return {
            isValid: true,
            text: `🏥 📋 *Paket ${toTitleCase(mcu.name)}*\n\n${priceMcu.text}. ${mcu.name !== "PEMERIKSAAN PENUNJANG" ? `\n\n💰*Total ${priceMcu.total}*` : ''}`
        }
    }
    return {
        isValid: false,
        text: ""
    }
}

async function menuInfoRumahSakit(text) {
    const kodeInfo = text.trim().toUpperCase();
    const listKodeMenu = ["INFO01", "INFO02", "INFO03"]
    if (listKodeMenu.includes(kodeInfo)) {
        if (kodeInfo === "INFO01") {
            return {
                isValid: true,
                text: profilSingkatRsud(),
            }
        }

        if (kodeInfo === "INFO02") {
            return {
                isValid: true,
                text: await getEdukasiPenyakit(),
            }
        }

        if (kodeInfo === "INFO03") {
            let pengumuman = await getPengumuman();
            return {
                isValid: true,
                text: `🏥 Untuk pengumuman kali ini SIWA punya :\n${pengumuman}`,
            }
        }
    }
    return {
        isValid: false,
        text: ""
    }
}

// data
async function getPolis() {
    const p = await Polis.get();
    const poli = p.map(item => `${item.poli_id}. ${item.name}`).join('\n');
    return poli;
}

async function getSchedules(param) {
    const j = await Schedules.get(param);
    let index = 1;
    const jadwal = j.map(item => `${index++}. ${item.name} - ${item.is_leave ? "Libur" : `pada hari ${item.date.join(', ')} di pukul ${item.time_start.slice(0, 5)} WIB sampai pukul ${item.time_end.slice(0, 5)} WIB`}`).join('\n\n');
    return jadwal;
}

async function getInfo() {
    const menus = [
        {
            kode: "INFO01",
            name: "Profil RSUD"
        },
        {
            kode: "INFO02",
            name: "Edukasi"
        },
        {
            kode: "INFO03",
            name: "Pengumuman"
        },
    ]
    let index = 1;
    const menu = menus.map(item => `${index++}. ${item.kode} - ${item.name}\n`).join('\n');
    return menu;
}

async function findPoli(param) {
    const p = await Polis.find(param);
    return p;
}

async function getMcus() {
    const m = await Mcus.get();
    const mcus = m.map(item => `🔹 ${item.mcus_id}. ${toTitleCase(item.name)}`).join('\n');
    return mcus;
}

async function getLabs() {
    const rawData = fs.readFileSync('./data/tarif.json')
    const data = JSON.parse(rawData);
    const laboratoriumSet = new Set();
    const result = [];
    for (const item of data) {
        if (item.tipe === "Laboratorium" && !laboratoriumSet.has(item.jenis)) {
            laboratoriumSet.add(item.jenis);
            result.push({
                jenis: item.jenis,
                kode: item.kode,
            })
        }
    }
    let index = 1;
    return result.map(item => `${index++}. ${item.kode} - ${item.jenis}`).join('\n');
}

async function priceLabs(text) {
    const rawData = fs.readFileSync('./data/tarif.json');
    const data = JSON.parse(rawData);
    let index = 1;
    const laboratoriumSet = new Set();
    const result = [];
    for (const item of data) {
        if (item.tipe === "Laboratorium" && !laboratoriumSet.has(item.jenis)) {
            laboratoriumSet.add(item.jenis);
            result.push(item.kode);
        }
    }
    const kodeLab = text.trim().toUpperCase();

    if (result.includes(kodeLab)) {
        return {
            isValid: true,
            title: data.filter(item => item.kode === kodeLab)[0].jenis,
            text: data.filter(item => item.kode === kodeLab)
                .map((item) => `${index++}. ${item.jenis_detail} - ${item.harga} /${item.satuan}`).join('\n')
        }
    }
    return {
        isValid: false,
        text: "",
    }
}

async function getRads() {
    const rawData = fs.readFileSync('./data/tarif.json');
    const data = JSON.parse(rawData);
    const radiologiSet = new Set();
    const result = [];
    for (const item of data) {
        if (item.tipe === "Radiologi" && !radiologiSet.has(item.jenis)) {
            radiologiSet.add(item.jenis);
            result.push({
                jenis: item.jenis,
                kode: item.kode,
            })
        }
    }
    let index = 1;
    return result.map(item => `${index++}. ${item.kode} - ${item.jenis}`).join('\n');
}

async function priceRads(text) {
    const rawData = fs.readFileSync('./data/tarif.json');
    const data = JSON.parse(rawData);
    const radiologiSet = new Set();
    const result = [];
    for (const item of data) {
        if (item.tipe === "Radiologi" && !radiologiSet.has(item.jenis)) {
            radiologiSet.add(item.jenis);
            result.push(item.kode);
        }
    }
    const kodeRad = text.trim().toUpperCase();
    let index = 1;
    if (result.includes(kodeRad)) {
        return {
            isValid: true,
            title: data.filter(item => item.kode === kodeRad)[0].jenis,
            text: data.filter(item => item.kode === kodeRad)
                .map((item) => `${index++}. ${item.jenis_detail} - ${item.harga} /${item.satuan}`).join('\n')
        }
    }
    return {
        isValid: false,
        text: "",
    }
}

async function findMcu(param) {
    const m = await Mcus.find(param);
    return m;
}

async function getPriceMcu(param) {
    const pM = await PriceMcu.get(param);
    let index = 1;
    const priceMcu = pM.map(item => `${index++}. ${item.name} : ${currencyConvert(item.price)}`).join('\n');
    return {
        text: priceMcu,
        total: currencyConvert(pM.reduce((sum, item) => sum + item.price, 0)),
    };
}

async function getEdukasiPenyakit() {
    const raw = fs.readFileSync('./data/edukasi_penyakit.json');
    const data = JSON.parse(raw);
    return data.filter(item => item.is_active === "TRUE").map((item) => `🏥 Edukasi pekan ini SIWA punya informasi tentang ${item.nama_edukasi} yaitu :\n${changeToBullet(item.deskripsi_edukasi)}`).join('\n');
}

async function getPengumuman() {
    const raw = fs.readFileSync('./data/pengumuman.json');
    const data = JSON.parse(raw);
    let index = 1;
    return data.filter(item => item.is_active === "TRUE").map((item) => `${index++}. ${item.nama_pengumuman}\n${item.tanggal_mulai_acara} - ${item.tanggal_akhir_acara}\n${item.deskripsi}\n\n`).join('\n');
}


// utility
function rootMenu() {
    return [
        { "key": 1, "text": "1️⃣. *Jadwal Dokter*" },
        { "key": 2, "text": "2️⃣. *Tarif MCU*" },
        { "key": 3, "text": "3️⃣. *Tarif Lab*" },
        { "key": 4, "text": "4️⃣. *Tarif Radiologi*" },
        { "key": 5, "text": "5️⃣. *Info BPJS*" },
        { "key": 6, "text": "6️⃣. *Info MJKN*" },
        { "key": 7, "text": "7️⃣. *Info RSUD*" },
    ]
}

function sendVideo(param) {
    const bufferVideo = fs.readFileSync(`./ assets / video / ${param}.mp4`);
    return bufferVideo;
}

function toTitleCase(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function currencyConvert(number) {
    return number.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    });
}



function profilSingkatRsud() {
    return `🏥 Berikut profil singkat dari RSUD Cikalongwetan\n\n
🏥 Profil Singkat RSUD Cikalongwetan
    ‣ Nama: RSUD Cikalongwetan
    ‣ Alamat: Jl. Raya Padalarang–Purwakarta No. 290 KM 11, Cikalongwetan, 
      Kab. Bandung Barat
    ‣ Luas lahan: 24.550 m²
    ‣ Didirikan: Tahun 2015, mulai beroperasi 5 Agustus 2017
    ‣ Tipe Rumah Sakit: Tipe C (sejak 2022, sebelumnya tipe D)
    ‣ Status: BLUD (Badan Layanan Umum Daerah) sejak 2022
    ‣ Akreditasi: PARIPURNA (LARS) hingga 2027

🎯 Visi
    _Menjadi Rumah Sakit pusat layanan rujukan masyarakat Kabupaten Bandung Barat_ 
    _"AKUR" (Aspiratif, Kreatif, Unggul, Religius)_

🛠️ Misi
    1. Meningkatkan mutu pelayanan kesehatan yang terstandar
    2. Meningkatkan kualitas SDM melalui pengembangan profesi
    3. Meningkatkan kesejahteraan pegawai
    4. Menciptakan RS berwawasan pendidikan

💬 Motto
    _"Someah hade ka semah, genah merenah tur tumaninah"._ Artinya :
    _RS yang ramah, nyaman, dan tenang, dengan penanganan serius_
    _kepada pasien dan keluarga._

👥 Sumber Daya Manusia (Total: 337 orang)
    ‣ PNS: 77
    ‣ P3K: 10
    ‣ TKK BLUD: 250
    ‣ Termasuk: 
        - 20 Dokter Spesialis, 
        - 14 Dokter Umum, 
        - 2 Dokter Gigi, 
        - 69 Perawat D3, 
        - 33 Bidan, 
        - 5 Apoteker, dll.

🧾 Layanan Poli yang Tersedia
    ‣ Penyakit Dalam
    ‣ Anak
    ‣ Kulit & Kelamin
    ‣ Saraf
    ‣ Orthopedi
    ‣ THT
    ‣ Mata
    ‣ Jantung
    ‣ Bedah Umum
    ‣ Medical Check Up (MCU)
    ‣ Seruni
    ‣ Rehab Medik
    ‣ Geriatri
    ‣ Gigi & Mulut
    ‣ Kebidanan & Kandungan
    ‣ DOTS (TB)
    ‣ IGD & PONEK
    ‣ Rawat Inap

🏗️ Fasilitas Penunjang Medis
    ‣ Laboratorium
    ‣ Radiologi
    ‣ Instalasi Bedah Sentral (IBS)
    ‣ Farmasi
    ‣ Pemulasaran Jenazah
    ‣ CSSD
    ‣ Laundry
    ‣ Instalasi Gizi

🛏️ Kapasitas Tempat Tidur (Total: 101 TT)
    ‣ Gedung Burangrang: 37 TT
    ‣ Gedung Pangrango: 25 TT
    ‣ Gedung Papandayan: 10 TT
    ‣ ICU: 6 TT
    ‣ NICU: 8 TT
    ‣ Manglayang: 15 TT
    ‣ Belum memiliki: PICU & HCU → pasien dirujuk ke RS lain tipe B`;
}

function changeToBullet(text) {
    let finalText = text;
    if (finalText.includes("<bul>")) {
        finalText = finalText.replaceAll("<bul>", "‣ ")
    }
    return finalText;
}

module.exports = { makeWhatsappSocket, sendAdminMessage }