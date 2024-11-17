/* 
Cheers to ifatc.org/gates for all of the info.
Please DM me @smacklepackle on discord for commercial use.

:)

*/

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/GateAPI/:icao', async (req, res) => {
    const icao = req.params.icao;
    const url = `https://www.ifatc.org/gates?code=${icao}`;

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const gates = [];

        $('table tr').each((index, element) => {
            const name = $(element).find('td').eq(0).text().trim();
            const maxSize = $(element).find('td').eq(2).text().trim();
            
            if (name && maxSize) {
                gates.push({ name, maxSize });
            }
        });

        res.json({ icao, gates });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
