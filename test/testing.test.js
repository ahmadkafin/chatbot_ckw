const { handleMessage } = require('./handle.message.unittest');

describe('Chatbot Handler', () => {
    it('balas pesan halo dengan Halo juga!', async () => {
        const result = await handleMessage('halo', '6281312435858', '');
        expect(result).toBe('Halo Juga!');
    });

    it('balas pesan berisi jadwal dokter dengan info jadwal', async () => {
        const result = await handleMessage('jadwal poli P001', '6281312435858', 'P001');
        expect(result).toMatch(/untuk jadwal poli tersebut/i);
    });

    it('balas pesan berisi paket mcu', async () => {
        const result = await handleMessage('paket mcu', '6281312435858', 'MCU001');
        expect(result).toMatch(/untuk paket mcus bisa di lihat di sini/i);
    });
});
