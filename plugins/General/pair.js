import Fredi_Tech, { useMultiFileAuthState, delay, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import path from 'path';
import pino from 'pino';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

                import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';
function cleanNumber(input) {
    let num = input.replace(/[\s\-\(\)\+\.]/g, '');
    num = num.replace(/[^0-9]/g, '');
    if (num.startsWith('00')) {
        num = num.slice(2);
    }
    return num;
}

function makeid(len = 6) {
    let result = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export default {
    name: 'pair',
    aliases: ['getcode', 'paircode', 'pairingcode', 'connect'],
    description: 'Generates a pairing code for WhatsApp multi-device linking',
    run: async (context) => {
        const { client, m, text, prefix } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        try {
            if (!text) {
                return await client.sendMessage(m.chat, {
                    text: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ Pᴀɪʀɪɴɢ ≪━━━\n├ \n├ Oi genius, give me a number\n├ to pair with. You think I can\n├ read your mind?\n├ \n├ Usage: *${prefix}pair <number>*\n├ Example: *${prefix}pair 255752593977*\n├ Example: *${prefix}pair +255 752 593 977*\n├ \n├ Spaces, dashes, plus signs...\n├ I'll clean that mess up for you.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
                }, { quoted: fq });
            }

            const number = cleanNumber(text);

            if (number.length < 6 || number.length > 15) {
                return await client.sendMessage(m.chat, {
                    text: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ Iɴᴠᴀʟɪᴅ Nᴜᴍʙᴇʀ ≪━━━\n├ \n├ That number is garbage.\n├ Cleaned: ${number}\n├ Need 6-15 digits with country code.\n├ Try again with a real number.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
                }, { quoted: fq });
            }

            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

            await client.sendMessage(m.chat, {
                text: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ Pᴀɪʀɪɴɢ ≪━━━\n├ \n├ Generating code for: ${number}\n├ Hold on, this takes a sec...\n├ Don't spam the command, idiot.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
            }, { quoted: fq });

            const sessionId = makeid(8);
            let tempPath;
            try {
                const basePath = path.join(__dirname, '..', '..', 'features', 'feexmd', 'temp');
                if (fs.existsSync(basePath) && !fs.statSync(basePath).isDirectory()) {
                    fs.unlinkSync(basePath);
                }
                const feexmdPath = path.join(__dirname, '..', '..', 'features', 'feexmd');
                if (fs.existsSync(feexmdPath) && !fs.statSync(feexmdPath).isDirectory()) {
                    fs.unlinkSync(feexmdPath);
                }
                tempPath = path.join(basePath, sessionId);
                fs.mkdirSync(tempPath, { recursive: true });
            } catch (dirErr) {
                tempPath = path.join('/tmp', 'fee-pair-' + sessionId);
                fs.mkdirSync(tempPath, { recursive: true });
            }

            const { version } = await fetchLatestBaileysVersion();
            const { state, saveCreds } = await useMultiFileAuthState(tempPath);

            const pairSocket = Fredi_Tech({
                version,
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
                },
                printQRInTerminal: false,
                logger: pino({ level: 'silent' }),
                browser: ["Ubuntu", "Chrome", "20.0.04"],
                syncFullHistory: false,
                generateHighQualityLinkPreview: true,
                shouldIgnoreJid: jid => !!jid?.endsWith('@g.us'),
                getMessage: async () => undefined,
                markOnlineOnConnect: true,
                connectTimeoutMs: 120000,
                keepAliveIntervalMs: 30000,
                defaultQueryTimeoutMs: 60000,
                transactionOpts: { maxCommitRetries: 10, delayBetweenTriesMs: 3000 },
                retryRequestDelayMs: 10000
            });

            pairSocket.ev.on('creds.update', saveCreds);

            await delay(3000);
            const code = await pairSocket.requestPairingCode(number);

            if (!code) throw new Error("Pairing code generation failed. The number might not be on WhatsApp.");

            await client.sendMessage(m.chat, { react: { text: '', key: m.reactKey } });

            const formattedCode = code.match(/.{1,4}/g)?.join('-') || code;

            try {

                const ctaMsg = generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            interactiveMessage: proto.Message.InteractiveMessage.create({
                                body: proto.Message.InteractiveMessage.Body.create({
                                    text: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ Pᴀɪʀɪɴɢ Cᴏᴅᴇ ≪━━━\n├ \n├ Number: ${number}\n├ Code: *${formattedCode}*\n├ \n├ Copy the code and paste it\n├ in your WhatsApp linked\n├ devices section.\n├ \n├ The code expires quickly so\n├ move your slow ass.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
                                }),
                                footer: proto.Message.InteractiveMessage.Footer.create({
                                    text: 'Fee-XMD Pairing System'
                                }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: [
                                        {
                                            name: 'cta_copy',
                                            buttonParamsJson: JSON.stringify({
                                                display_text: 'Copy Pairing Code',
                                                id: 'copy_code',
                                                copy_code: formattedCode
                                            })
                                        }
                                    ]
                                })
                            })
                        }
                    }
                }, { quoted: fq });

                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });


                await client.relayMessage(m.chat, ctaMsg.message, { messageId: ctaMsg.key.id });

            } catch (btnErr) {
    await client.sendMessage(m.chat, { react: { text: '', key: m.reactKey } }).catch(() => {});
                await client.sendMessage(m.chat, {
                    text: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ Pᴀɪʀɪɴɢ Cᴏᴅᴇ ≪━━━\n├ \n├ Number: ${number}\n├ Code: *${formattedCode}*\n├ \n├ Copy the code above and paste\n├ it in your WhatsApp linked\n├ devices section. Hurry up,\n├ it expires quick.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
                }, { quoted: fq });
            }

            setTimeout(async () => {
                try {
                    await pairSocket.ws.close();
                } catch (e) {}
                setTimeout(() => {
                    if (fs.existsSync(tempPath)) fs.rmSync(tempPath, { recursive: true, force: true });
                }, 5000);
            }, 10000);

        } catch (error) {
            console.error("Error in pair command:", error);
            await client.sendMessage(m.chat, { react: { text: '', key: m.reactKey } });
            await client.sendMessage(m.chat, {
                text: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ Pᴀɪʀɪɴɢ Fᴀɪʟᴇᴅ ≪━━━\n├ \n├ Couldn't generate the code.\n├ ${error.message || 'Unknown error'}\n├ \n├ Make sure the number is valid\n├ and actually on WhatsApp.\n├ Then try again, if you can\n├ manage that.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
            }, { quoted: fq });
        }
    }
};
