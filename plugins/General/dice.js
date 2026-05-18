import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
    name: 'dice',
    aliases: ['roll', 'rolldice', 'd6'],
    description: 'Roll one or more dice',
    run: async (context) => {
        const { client, m, text } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        const count = Math.min(parseInt(text || '1') || 1, 10);
        const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1);
        const total = rolls.reduce((a, b) => a + b, 0);
        const diceDisplay = rolls.map(r => ['⚀','⚁','⚂','⚃','⚄','⚅'][r-1]).join(' ');
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        return client.sendMessage(m.chat, {
            text: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ Dɪᴄᴇ Rᴏʟʟ ≪━━━\n├\n├ 🎲 ${diceDisplay}\n├ 🔢 Rolls: [${rolls.join(', ')}]\n├ ➕ Total: ${total}\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
        }, { quoted: fq });
    }
};
