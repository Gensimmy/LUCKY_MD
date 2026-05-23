import { getBuffer } from '../../lib/botFunctions.js';
import links from './links.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

const getTarget = (m) => {
    const jid = (m.mentionedJid && m.mentionedJid[0]) || (m.quoted && m.quoted.sender) || null;
    if (!jid) return null;
    if (!jid.includes('@s.whatsapp.net') && !jid.includes('@lid')) return null;
    return jid;
};

function resolveDisplayJid(jid) {
    if (!jid) return jid;
    if (!jid.endsWith('@lid')) return jid;
    if (globalThis.resolvePhoneFromLid) {
        const phone = globalThis.resolvePhoneFromLid(jid);
        if (phone) return phone + '@s.whatsapp.net';
    }
    if (globalThis.lidPhoneCache) {
        const lid = jid.split('@')[0].split(':')[0];
        const phone = globalThis.lidPhoneCache.get(lid);
        if (phone) return phone + '@s.whatsapp.net';
    }
    return jid;
}

export default {
    name: 'kiss',
    aliases: ['smooch', 'peck'],
    description: 'Kiss a tagged or quoted user',
    run: async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        await client.sendMessage(m.chat, { react: { text: '💋', key: m.reactKey } });
        try {
            const target = getTarget(m);
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            if (!target) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return m.reply(`╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├ Tag or quote someone to kiss.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`);
            }
            const resolvedTarget = resolveDisplayJid(target);
            const tNum = resolvedTarget.split('@')[0];
            const sNum = resolveDisplayJid(m.sender).split('@')[0];
            if (links.kiss) {
                try {
                    const buf = await getBuffer(links.kiss);
                    await client.sendMessage(m.chat, { sticker: buf }, { quoted: fq });
                    await client.sendMessage(m.chat, { text: `@${sNum} kissed @${tNum} 💋`, mentions: [m.sender, resolvedTarget] }, { quoted: fq });
                    return;
                } catch {}
            }
            const lines = [
                `@${sNum} kissed @${tNum} and nobody asked. 💋`,
                `@${sNum} planted one right on @${tNum}. Bold move. 😘`,
                `@${sNum} kissed @${tNum}. The group just got awkward. 💋`,
            ];
            await client.sendMessage(m.chat, {
                text: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├ ${lines[Math.floor(Math.random() * lines.length)]}\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`,
                mentions: [m.sender, resolvedTarget]
            }, { quoted: fq });
        } catch {
            await m.reply(`╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├ Kiss failed. Try again.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`);
        }
    }
};
