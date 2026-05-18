import makeWASocket from '@whiskeysockets/baileys';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
  name: 'buttonz',
  aliases: ['btn'],
  description: 'Displays a list selection menu',
  run: async (context) => {
    const { client, m } = context;
    const fq = getFakeQuoted(m);

    try {
      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
      await client.sendMessage(m.chat, {
        text: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ Mᴇɴᴜ ≪━━━\n├ \n├ Choose an option from the list:\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`,
        footer: 'Fredi WA Bots',
        sections: [
          {
            title: 'General Commands',
            rows: [
              { title: 'Help', rowId: '.help', description: 'Get bot commands' },
              { title: 'Ping', rowId: '.ping', description: 'Check bot speed' },
              { title: 'Info', rowId: '.info', description: 'View bot details' }
            ]
          },
          {
            title: 'Fun Commands',
            rows: [
              { title: 'Random Fact', rowId: '.fact', description: 'Get a fun fact' },
              { title: 'Joke', rowId: '.joke', description: 'Hear a joke' }
            ]
          }
        ],
        buttonText: 'Open Menu',
        headerType: 1,
        viewOnce: true
      }, { quoted: fq });

    } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      console.error(`Menu command error: ${error.stack}`);
    }
  }
};
