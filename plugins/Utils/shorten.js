import axios from 'axios';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
    name: 'shorten',
    aliases: ['shorturl', 'tinyurl', 'shrinkurl'],
    description: 'Shorten a URL',
    run: async (context) => {
        const { client, m, text } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        const url = (text || '').trim();
        if (!url || !url.startsWith('http')) {
            return client.sendMessage(m.chat, {
                text: '╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ URL Sʜᴏʀᴛᴇɴᴇʀ ≪━━━\n├\n├ Give me a valid URL to shorten.\n├ Usage: .shorten https://example.com/very/long/url\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆'
            }, { quoted: fq });
        }
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`, { timeout: 8000 });
            const short = res.data;
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            return client.sendMessage(m.chat, {
                text: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ URL Sʜᴏʀᴛᴇɴᴇʀ ≪━━━\n├\n├ 🔗 Original: ${url.slice(0,60)}${url.length>60?'...':''}\n├ ✅ Shortened: ${short}\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
            }, { quoted: fq });
        } catch {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            return client.sendMessage(m.chat, { text: '╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ URL Sʜᴏʀᴛᴇɴᴇʀ ≪━━━\n├\n├ Couldn\'t shorten that. It stays long.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆<' }, { quoted: fq });
        }
    }
};
