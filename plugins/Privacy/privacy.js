import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';
export default async (context) => {

    await ownerMiddleware(context, async () => {

    const { client, m } = context;
    const fq = getFakeQuoted(m);
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

const Myself = await client.decodeJid(client.user.id);
    
    const {
                readreceipts,
                profile,
                status,
                online,
                last,
                groupadd,
                calladd
        } = await client.fetchPrivacySettings(true);
        
        const fnn = `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ PRIVACY SETTINGS ≪━━━\n├ \n├ Name: ${client.user.name}\n├ Online: ${online}\n├ Profile Picture: ${profile}\n├ Last Seen: ${last}\n├ Read Receipt: ${readreceipts}\n├ Group Add: ${groupadd}\n├ Status: ${status}\n├ Call Add: ${calladd}\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`;


const avatar = await client.profilePictureUrl(Myself, 'image').catch(_ => 'https://telegra.ph/file/b34645ca1e3a34f1b3978.jpg');

await client.sendMessage(m.chat, { image: { url: avatar}, caption: fnn}, { quoted: fq }) 


})

}
        
