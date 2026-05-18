import axios from 'axios';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
    name: 'weather',
    aliases: ['wthr', 'forecast', 'temp'],
    description: 'Get current weather for any city',
    run: async (context) => {
        const { client, m, text } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        const city = (text || '').trim();
        if (!city) {
            return client.sendMessage(m.chat, {
                text: '╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ Wᴇᴀᴛʜᴇʀ ≪━━━\n├\n├ Give me a city name, genius.\n├ Usage: .weather Nairobi\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆'
            }, { quoted: fq });
        }
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            const res = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, { timeout: 10000 });
            const w = res.data.current_condition?.[0];
            const area = res.data.nearest_area?.[0];
            if (!w) throw new Error('No data');
            const areaName = area?.areaName?.[0]?.value || city;
            const country = area?.country?.[0]?.value || '';
            const desc = w.weatherDesc?.[0]?.value || '';
            const tempC = w.temp_C || '?';
            const feelsC = w.FeelsLikeC || '?';
            const humidity = w.humidity || '?';
            const wind = w.windspeedKmph || '?';
            const visibility = w.visibility || '?';
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            return client.sendMessage(m.chat, {
                text: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ Wᴇᴀᴛʜᴇʀ ≪━━━\n├\n├ 📍 ${areaName}, ${country}\n├ ☁️ ${desc}\n├ 🌡️ Temp: ${tempC}°C (Feels ${feelsC}°C)\n├ 💧 Humidity: ${humidity}%\n├ 💨 Wind: ${wind} km/h\n├ 👁️ Visibility: ${visibility} km\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
            }, { quoted: fq });
        } catch (e) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            return client.sendMessage(m.chat, { text: '╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ Wᴇᴀᴛʜᴇʀ ≪━━━\n├\n├ Weather API is throwing a tantrum. Try again.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆' }, { quoted: fq });
        }
    }
};
