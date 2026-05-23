import axios from 'axios';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
    const { client, m } = context;
    const fq = getFakeQuoted(m);
    try {
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        const { data } = await axios.get('https://catfact.ninja/fact', { timeout: 8000 });
        const fact = data?.fact;
        if (!fact) throw new Error('no fact');
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        await m.reply(`╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ CAT FACT ≪━━━\n├ \n├ ${fact}\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`);
    } catch {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        m.reply(`╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├ API down. Even the cats went offline.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`);
    }
};
