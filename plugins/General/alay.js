import { getFakeQuoted } from '../../lib/fakeQuoted.js';
export default {
    name: 'alay',
    alias: ['leet', 'l33t'],
    description: 'Convert text to alay/leet style',
    run: async (context) => {
        const { client, m, text } = context;
        const fq = getFakeQuoted(m);
        const input = text || m.quoted?.text;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        if (!input) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return m.reply(`╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ ALAY TEXT ≪━━━\n├ \n├ Give me text to alay-ify, genius.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`);
        }
        const alay = input.split('').map(v => {
            const r = Math.random();
            const char = r > .5 ? v.toUpperCase() : v.toLowerCase();
            if (r > .6) {
                switch (v.toLowerCase()) {
                    case 'a': return '4';
                    case 'e': return '3';
                    case 'i': return '1';
                    case 'o': return '0';
                    case 's': return '5';
                    case 'g': return '9';
                    case 'b': return '8';
                    case 't': return '7';
                }
            }
            return char;
        }).join('');
        await m.reply(`╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ ALAY TEXT ≪━━━\n├ \n├ ${alay}\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`);
    }
};
