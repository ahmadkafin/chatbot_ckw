const { google } = require('googleapis');
const fs = require('fs');

const auth = new google.auth.GoogleAuth({
    keyFile: 'neat-glazing-468303-k6-02b55852a76b.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
});

async function fetchData(rangeName, outputFileName) {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const spreadsheetId = '1A7CVOYX3UUY4STslCopxwfbcAk4QsUS9nPhp4KOH-tM';
    const range = rangeName;

    const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
    });

    const rows = res.data.values;
    if (!rows || rows.length === 0) {
        console.log("data tidak ditemukan")
        return;
    }

    const headers = rows[0];
    const data = rows.slice(1).map(row =>
        Object.fromEntries(headers.map((key, i) => [key, row[i] || null]))
    );

    // Tampilkan & simpan ke file
    console.log(JSON.stringify(data, null, 2));
    fs.writeFileSync(`./data/${outputFileName}.json`, JSON.stringify(data, null, 2));
}

module.exports = { fetchData }