import middleware from '../../utils/botUtil/middleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
    await middleware(context, async () => {
        const { client, m, isBotAdmin } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        if (!m.isGroup) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return m.reply(`╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├ \n├ This command is meant for groups.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`);
        }
        if (!isBotAdmin) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return m.reply(`╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├ \n├ I need admin privileges.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`);
        }

        const normalizeJid = (jid) => {
            if (!jid) return '';
            return jid.split('@')[0].split(':')[0].replace(/\D/g, '') + '@s.whatsapp.net';
        };

        const groupMetadata = await client.groupMetadata(m.chat);
        const participants = groupMetadata.participants;
        const botJid = normalizeJid(client.user.id);
        const senderJid = normalizeJid(m.sender);

        const usersToKick = participants.filter(p => {
            const pJid = normalizeJid(p.jid || p.id);
            return pJid !== botJid && pJid !== senderJid;
        });

        await client.sendMessage(m.chat, { react: { text: '⚠️', key: m.reactKey } });
        await m.reply(`╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ TERMINATION ≪━━━\n├ \n├ GROUP TERMINATION INITIATED\n├ Removing ${usersToKick.length} participants.\n├ The group will be renamed.\n├ THIS PROCESS CANNOT BE STOPPED.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`);

        try { await client.groupUpdateSubject(m.chat, "Proven Useless🦄🚮"); } catch (e) {}
        try { await client.groupUpdateDescription(m.chat, "Terminated by Fee-Xmd\n\nA collection of digital disappointments. Your contributions were as valuable as your existence—negligible."); } catch (e) {}
        try { await client.groupRevokeInvite(m.chat); } catch (e) {}
        try { await client.groupSettingUpdate(m.chat, 'announcement'); } catch (e) {}

        for (const p of usersToKick) {
            try {
                const jid = normalizeJid(p.jid || p.id);
                await client.groupParticipantsUpdate(m.chat, [jid], 'remove');
                await new Promise(res => setTimeout(res, 500));
            } catch (e) {}
        }

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        await m.reply(`╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ COMPLETE ≪━━━\n├ \n├ TERMINATION COMPLETE\n├ All participants removed.\n├ Group secured.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`);
    });
};
