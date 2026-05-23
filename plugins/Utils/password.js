import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';
  import { getFakeQuoted } from '../../lib/fakeQuoted.js';

  export default {
      name: 'password',
      aliases: ['genpass', 'passgen', 'strongpass'],
      description: 'Generate a strong random password',
      run: async (context) => {
          const { client, m, text } = context;
          const fq = getFakeQuoted(m);
          await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
          const len = Math.min(Math.max(parseInt(text || '16') || 16, 8), 64);
          const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
          let pass = '';
          for (let i = 0; i < len; i++) pass += chars[Math.floor(Math.random() * chars.length)];
          const resultText = `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ Pᴀssᴡᴏʀᴅ Gᴇɴ ≪━━━\n├\n├ 🔐 Length: ${len} chars\n├\n├ ${pass}\n├\n├ Save it. I won't regenerate it for you.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`;
          try {
              const msg = await generateWAMessageFromContent(m.chat, proto.Message.fromObject({
                  interactiveMessage: {
                      body: { text: resultText },
                      footer: { text: '' },
                      nativeFlowMessage: {
                          buttons: [{ name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Copy Password', copy_code: pass }) }],
                          messageParamsJson: ''
                      }
                  }
              }), { quoted: fq, userJid: client.user.id });
              await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

              await client.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
          } catch {
              await client.sendMessage(m.chat, { text: resultText }, { quoted: fq });
          }
      }
  };
  