const Discord = require('discord.js');
const db = require('quick.db')

    exports.run = (client, message, args) => {
        let user = message.mentions.members.first();
        let isim = args[1];
        let yas = args[2];

        if(!user){
            message.channel.send(`${message.author} **Lütfen Kullanıcı Belirt**`)
        }
        if(!isim){
            message.channel.send(`${message.author} **İsim Girmeyi Unuttun**`)
        }
        if(!yas){
            message.channel.send(`${message.author} **Yaş Girmen Zorunlu**`)
        }

        if(user && isim && yas){

            let erkek = db.get(`erkekpuan_${message.author.id}_${message.guild.id}`) 
            db.add(`erkekpuan_${message.author.id}_${message.guild.id}`, +1)

            const kayit = new Discord.MessageEmbed()
                .setColor('BLACK')
                .setDescription(` ${user} **Kişisi,** <@&Erkek Rol İD> **Olarak Kayıt Edildi\n Toplam Kayıt Sayın: ${erkek || 0}**`)
                .setFooter('CodeMareFi');
            message.channel.send(kayit)

            // Burda Yapacağımız İşlem Botu Kastırmasın Diye Belirli Bir Süre Vericez Rolleri Vermesi İçin
            setTimeout(() => {
                user.roles.add('ERKEK ROL İD');
                user.roles.remove('KAYITSIZ ROL İD');
                user.setNickname(isim + " " + yas)
            }, 2000) //2000 = 2 Saniye
        }
    }

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['Erkek','E','erkek','ERKEK','boy','Boy','BOY'],
    permLevel: 0
}

exports.help = {
    name: 'e',
    description: 'CodeMareFi V12 Gelişmiş Kayıt Sistemi',
    usage: '.e @user isim yaş'
}
