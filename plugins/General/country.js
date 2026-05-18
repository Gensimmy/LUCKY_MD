import axios from 'axios';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
    name: 'country',
    aliases: ['countryinfo', 'nation', 'flag'],
    description: 'Get information about a country',
    run: async (context) => {
        const { client, m, text } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        const query = (text || '').trim();
        if (!query) {
            return client.sendMessage(m.chat, {
                text: '╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ Cᴏᴜɴᴛʀʏ Iɴғᴏ ≪━━━\n├\n├ Usage: .country Kenya\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆'
            }, { quoted: fq });
        }
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            const res = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(query)}?fullText=true`, { timeout: 8000 });
            const c = res.data?.[0];
            if (!c) throw new Error('not found');
            const name = c.name?.common || query;
            const official = c.name?.official || '';
            const capital = (c.capital || ['?'])[0];
            const region = c.region || '?';
            const sub = c.subregion || '';
            const pop = (c.population || 0).toLocaleString();
            const currencies = Object.values(c.currencies || {}).map(cu => `${cu.name} (${cu.symbol || '?'})`).join(', ') || '?';
            const langs = Object.values(c.languages || {}).join(', ') || '?';
            const flag = c.flag || '';
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            return client.sendMessage(m.chat, {
                text: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ Cᴏᴜɴᴛʀʏ Iɴғᴏ ≪━━━\n├\n├ ${flag} ${name}\n├ 📋 Official: ${official}\n├ 🏙️ Capital: ${capital}\n├ 🌍 Region: ${region}${sub ? ' / ' + sub : ''}\n├ 👥 Population: ${pop}\n├ 💰 Currency: ${currencies}\n├ 🗣️ Language(s): ${langs}\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
            }, { quoted: fq });
        } catch {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            return client.sendMessage(m.chat, { text: '╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ Cᴏᴜɴᴛʀʏ Iɴғᴏ ≪━━━\n├\n├ Country not found. Did you make it up?\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆' }, { quoted: fq });
        }
    }
};
