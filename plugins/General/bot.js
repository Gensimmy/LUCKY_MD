import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import { getSettings } from '../../database/config.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import { getDeviceMode } from '../../lib/deviceMode.js';

export default {
    name: 'start',
    aliases: ['alive', 'online', 'fredi', 'bot', 'status', 'active', 'check'],
    description: 'Check if bot is alive',
    run: async (context) => {
        const { client, m, mode, pict, botname, text, prefix } = context;
        const fq = getFakeQuoted(m);

        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        await client.sendMessage(m.chat, { react: { text: '🤖', key: m.reactKey } });

        const xhClintonPaths = [
            path.join(__dirname, 'fredi_med'),
            path.join(process.cwd(), 'fredi_med'),
            path.join(__dirname, '..', 'fredi_med')
        ];

        let audioFolder = null;
        for (const folderPath of xhClintonPaths) {
            if (fs.existsSync(folderPath)) { audioFolder = folderPath; break; }
        }

        if (audioFolder) {
            const possibleFiles = [];
            for (let i = 1; i <= 10; i++) {
                for (const ext of ['.mp3', '.m4a', '.ogg', '.opus', '.wav']) {
                    const fullPath = path.join(audioFolder, `menu${i}${ext}`);
                    if (fs.existsSync(fullPath)) possibleFiles.push(fullPath);
                }
            }
            if (possibleFiles.length > 0) {
                const randomFile = possibleFiles[Math.floor(Math.random() * possibleFiles.length)];
                await client.sendMessage(m.chat, {
                    audio: { url: randomFile }, ptt: true, mimetype: 'audio/mpeg', fileName: 'fredi-start.mp3'
                }, { quoted: fq });
            }
        }

        const settings = await getSettings();
        const effectivePrefix = settings.prefix || '.';
        const device = await getDeviceMode();

        const bodyText = `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ Sᴛᴀʀᴛ ≪━━━\n├ \n├ Yo @${m.sender.split('@')[0].split(':')[0]}! You actually bothered\n├ to check if I'm alive?\n├ ${botname} is active 24/7, unlike\n├ your brain cells.\n├ Stop wasting my time and pick\n├ something useful below.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`;

        if (device === 'ios') {
            await client.sendMessage(m.chat, { text: bodyText }, { quoted: fq, mentions: [m.sender] });
            return;
        }

        const msg = generateWAMessageFromContent(
            m.chat,
            {
                interactiveMessage: {
                    body: { text: bodyText },
                    nativeFlowMessage: {
                        messageVersion: 1,
                        buttons: [
                            {
                                name: 'single_select',
                                buttonParamsJson: JSON.stringify({
                                    title: 'Get Started',
                                    sections: [{
                                        title: 'Quick Actions',
                                        rows: [
                                            { title: 'Menu', description: 'View all bot commands', id: `${effectivePrefix}menu` },
                                            { title: 'Ping', description: 'Check bot speed', id: `${effectivePrefix}ping` },
                                            { title: 'Settings', description: 'Bot configuration', id: `${effectivePrefix}settings` },
                                            { title: 'Uptime', description: 'How long the bot has been running', id: `${effectivePrefix}uptime` }
                                        ]
                                    }]
                                })
                            }
                        ]
                    }
                }
            },
            { quoted: fq }
        );

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

        await client.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    },
};