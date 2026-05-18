import fetch from 'node-fetch';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
    name: 'npmdl',
    aliases: ['npmdownload', 'npminstall'],
    description: 'Download NPM package as .tgz file',
    run: async (context) => {
        const { client, m, text } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        try {
            let query = (text || '').trim();
            if (!query) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return m.reply(`╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ Eʀʀᴏʀ ≪━━━\n├ \n├ Provide a package name,\n├ you incompetent fool.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`);
            }

            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

            if (query.startsWith('@') && !query.includes('/')) {
                const searchRes = await fetch(`https://yaemiko-narukami.vercel.app/search/npm?text=${encodeURIComponent(query)}`);
                const searchData = await searchRes.json();
                
                const list = searchData?.result || searchData?.results || searchData?.data || [];
                if (!Array.isArray(list) || list.length === 0) {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                    return m.reply(`╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ Eʀʀᴏʀ ≪━━━\n├ \n├ No packages found in scope *${query}*\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`);
                }
                
                query = list[0]?.name || list[0]?.package?.name || query;
            }

            const npmRes = await fetch(`https://registry.npmjs.org/${encodeURIComponent(query)}`);
            const data = await npmRes.json();
            
            const latest = data["dist-tags"]?.latest;
            if (!latest) throw new Error('No latest version found');
            
            const tarball = data.versions?.[latest]?.dist?.tarball;
            if (!tarball) throw new Error('No download link found');

            const fileRes = await fetch(tarball);
            const fileBuffer = await fileRes.arrayBuffer();
            
            const fileName = `${query.replace(/\//g, '-')}-${latest}.tgz`;

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            
            await client.sendMessage(m.chat, {
                document: Buffer.from(fileBuffer),
                fileName: fileName,
                mimetype: 'application/gzip',
                caption: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ NPM ≪━━━\n├ \n├ ${query} v${latest}\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
            }, { quoted: fq });

        } catch (error) {
            console.error('NPM download error:', error);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            await m.reply(`╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ Eʀʀᴏʀ ≪━━━\n├ \n├ Download failed.\n├ Error: ${error.message}\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`);
        }
    }
};
