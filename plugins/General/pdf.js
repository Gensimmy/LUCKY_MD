import { makePDF } from '../../lib/frediApi.js';
  import { getFakeQuoted } from '../../lib/fakeQuoted.js';
  import { getSettings } from '../../database/config.js';

  export default {
      name: 'pdf',
      aliases: ['topdf', 'createpdf', 'makepdf'],
      description: 'Create a PDF from text',
      category: 'General',
      run: async (context) => {
          const { client, m } = context;
          const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
          const settings = await getSettings();
          const prefix = settings.prefix || '.';

          const query = (m.text || '').replace(/^\S+\s*/, '').trim();

          if (!query) {
              return client.sendMessage(m.chat, {
                  text: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ Eʀʀᴏʀ ≪━━━\n├ \n├ Give me some text to convert.\n├ Example: ${prefix}pdf Hello world this is my document\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
              }, { quoted: fq });
          }

          await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

          try {
              const pdfBuf = await makePDF(query);

              await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
              await client.sendMessage(m.chat, {
                  document: pdfBuf,
                  mimetype: 'application/pdf',
                  fileName: `document_${Date.now()}.pdf`,
                  caption: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ PDF Cʀᴇᴀᴛᴇᴅ ≪━━━\n├ \n├ Here's your document.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
              }, { quoted: fq });
          } catch {
              await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
              await client.sendMessage(m.chat, {
                  text: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ Eʀʀᴏʀ ≪━━━\n├ \n├ PDF creation failed. Try again.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
              }, { quoted: fq });
          }
      }
  };
  