import { translate } from '@vitalets/google-translate-api';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
    name: 'translate',
    aliases: ['tr', 'trans'],
    description: 'Translates text to different languages',
    run: async (context) => {
        const { client, m, prefix } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        const fullText = m.body.replace(new RegExp(`^[^a-zA-Z]*(translate|tr|trans)\\s*`, 'i'), '').trim();

        if (!fullText && !m.quoted?.text) {
            return client.sendMessage(m.chat, {
                text: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ Tʀᴀɴsʟᴀᴛᴇ ≪━━━\n├ \n├ Usage:\n├ ${prefix}tr ja Hello\n├ ${prefix}tr es How are you?\n├ Or reply to msg: ${prefix}tr en\n├ \n├ Codes: ja es fr de zh ar hi sw ko ru\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
            }, { quoted: fq });
        }

        let lang, text;

        if (m.quoted?.text) {
            lang = fullText || 'en';
            text = m.quoted.text;
        } else {
            const parts = fullText.split(' ');
            if (parts.length >= 2 && parts[0].length <= 3 && /^[a-z]{2,3}$/.test(parts[0])) {
                lang = parts[0];
                text = parts.slice(1).join(' ');
            } else {
                lang = 'en';
                text = fullText;
            }
        }

        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            const result = await translate(text, { to: lang });
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            await client.sendMessage(m.chat, {
                text: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ Tʀᴀɴsʟᴀᴛɪᴏɴ ≪━━━\n├ \n├ ${result.text}\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
            }, { quoted: fq });
        } catch (error) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            let errorMessage = 'Translation failed. Try again.';
            if (error.message && error.message.includes('Invalid target language')) {
                errorMessage = `Invalid language code "${lang}". Use: ja, es, fr, de, zh, ar, hi, ko, ru, etc.`;
            }
            return client.sendMessage(m.chat, {
                text: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ Eʀʀᴏʀ ≪━━━\n├ \n├ ${errorMessage}\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
            }, { quoted: fq });
        }
    }
};
