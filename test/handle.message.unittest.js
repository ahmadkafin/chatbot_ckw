const controller = require('../app/controllers')
const mcus = controller.Mcus;
const jadwal = controller.Schedules;

async function handleMessage(message, sender, param) {
    if (message.toLowerCase() === 'halo') return 'Halo Juga!'
    if (message.toLowerCase().startsWith('jadwal poli')) {
        const result = await tipePoli(param);
        return `untuk jadwal poli tersebut\n\n${result}`;
    }
    if (message.toLowerCase().startsWith('paket mcu')) {
        const result = await hargaMcus(param);
        return `untuk paket mcus bisa di lihat di sini \n\n${result}`
    }


}

async function tipePoli(param) {
    const poli = await jadwal.get(param);
    let index = 1;
    return poli.map(item => `${index++}. ${item.name} - ${item.is_leave ? "Libur" : `pada hari ${item.date.join(', ')} di pukul ${item.time_start.slice(0, 5)} WIB sampai pukul ${item.time_end.slice(0, 5)} WIB`}`).join('\n\n');
}

async function hargaMcus(param) {
    const mcu = await mcus.get(param);
    return mcu.map(item => `🔹 ${item.mcus_id}. ${item.name}`).join('\n');
}

module.exports = { handleMessage }