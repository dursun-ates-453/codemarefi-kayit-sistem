const Discord = require('discord.js')
const db = require('quick.db')

    exports.run = (client, message, args) => {
        let user = message.mentions.members.first();


        if(user){
            let usererkekpuan = db.fetch(`erkekpuan_${user.id}_${message.guild.id}`);
            let userkadınpuan = db.fetch(`kadınpuan_${user.id}_${message.guild.id}`);
            let usertoplam = usererkekpuan + userkadınpuan;

            const puanembed = new Discord.MessageEmbed()
            .setDescription(`${user} **Kullanıcısının Kayıt Bilgileri** \n\n **Toplam Kayıt:** \`${usertoplam || "Kullanıcının Kayıt Datası Yok."}\` \n **Erkek Kayıt:** \`${usererkekpuan || 0}\` \n **Kadın Kayıt:** \`${userkadınpuan || 0}\` `)
            .setColor('BLACK')
            .setFooter('Coded By CodeMareFi')
            message.channel.send(puanembed)
        } else{
            let myerkekpuan = db.fetch(`erkekpuan_${message.author.id}_${message.guild.id}`);
            let mykadınpuan = db.fetch(`kadınpuan_${message.author.id}_${message.guild.id}`);
            let mytoplam = myerkekpuan + mykadınpuan;

            const puanembed = new Discord.MessageEmbed()
            .setDescription(`**Kayıt Bilgilerin** \n\n **Toplam Kayıt Sayın:** \`${mytoplam || "Kayıt Datan Yok."}\` \n **Erkek Kayıt Sayın:** \`${myerkekpuan || 0}\` \n **Kadın Kayıt Sayın:** \`${mykadınpuan || 0}\` `)
            .setColor('BLACK')
            message.channel.send(puanembed)
        }

    } // CODED BY CODEMAREFİ - KADİRFİ ^^

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['kayıt-say','Kayıt-say','Ks','ks','kayıt-bilgi','kayıtsay','kayıtbilgi'],
    permLevel: 0
}

exports.help = {
    name: 'kayıtsay',
    description: 'CodeMareFi',
    usage: '.kayıtsay @kişi ya da .kayıtsay'
}
