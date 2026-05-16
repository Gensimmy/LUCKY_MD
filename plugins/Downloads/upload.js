import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';
  import { uploadToUrl } from '../../lib/toUrl.js';
  import { getFakeQuoted } from '../../lib/fakeQuoted.js';

  export default async (context) => {
      const { client, m } = context;
      const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

      try {
          const q = m.quoted ? m.quoted : m;
          const mime = (q.msg || q).mimetype || '';

          if (!mime) {
              await client.sendMessage(m.chat, { react: { text: '', key: m.reactKey } }).catch(() => {});
              return m.reply("╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ Eʀʀᴏʀ ≪━━━\n├ \n├ Quote or send a media file to upload.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆");
          }

          const mediaBuffer = await q.download();

          if (mediaBuffer.length > 256 * 1024 * 1024) {
              await client.sendMessage(m.chat, { react: { text: '', key: m.reactKey } }).catch(() => {});
              return m.reply("╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ Eʀʀᴏʀ ≪━━━\n├ \n├ File too large! Max 256MB.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆");
          }

          await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

          const ext = mime.split('/')[1] || 'bin';
          const link = await uploadToUrl(mediaBuffer, ext);
          const fileSizeMB = (mediaBuffer.length / (1024 * 1024)).toFixed(2);

          await client.sendMessage(m.chat, { react: { text: '', key: m.reactKey } });

          const resultText =
              `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n` +
              `├━━━≫ Uᴘʟᴏᴀᴅ Dᴏɴᴇ ≪━━━\n` +
              `├ \n` +
              `├ 🔗 *Link:* ${link}\n` +
              `├ 📁 *Size:* ${fileSizeMB} MB\n` +
              `╰━━━━━━━━━━━━━━━━ᕗ\n` +
              `> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`;

          try {
              const msg = await generateWAMessageFromContent(m.chat, proto.Message.fromObject({
                  interactiveMessage: {
                      body: { text: resultText },
                      footer: { text: '' },
                      nativeFlowMessage: {
                          messageVersion: 1,
                          buttons: [{
                              name: 'cta_copy',
                              buttonParamsJson: JSON.stringify({ display_text: 'Copy Link', copy_code: link })
                          }],
                          messageParamsJson: ''
                      }
                  }
              }), { quoted: fq, userJid: client.user.id });
              await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

              await client.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
          } catch {
              await m.reply(resultText);
          }

      } catch (err) {
          await client.sendMessage(m.chat, { react: { text: '', key: m.reactKey } });
          m.reply(`╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ Uᴘʟᴏᴀᴅ Eʀʀᴏʀ ≪━━━\n├ \n├ Upload failed, try again.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`);
      }
  };