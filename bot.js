// Modüller
const Discord = require('discord.js')
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const { Client, Util } = require('discord.js');
const chalk = require('chalk');
const moment = require('moment');
const fs = require('fs');

// Event Loader
require('./util/eventLoader.js')(client);

// Log'a mesaj

const log = message => {
    console.log(message)
}

// Bot.js Açılış

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Çalışan Komutlar: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

client.login(ayarlar.token);

// Komut sistemleri

// Bot Oynuyor Kısmı, Ready.js ye gerek yok artık :)
client.on('ready', () => {
  client.user.setActivity("CodeMareFi", {type : "STREAMING", url: "https://www.twitch.tv/codemarefi"})
})

// Kullanıcı Giriş Mesajı
client.on('guildMemberAdd', async(member) => {
  let aylartoplam = {
    "01": "Ocak",
        "02": "Şubat",
        "03": "Mart",
        "04": "Nisan",
        "05": "Mayıs",
        "06": "Haziran",
        "07": "Temmuz",
        "08": "Ağustos",
        "09": "Eylül",
        "10": "Ekim",
        "11": "Kasım",
        "12": "Aralık"
  }

  require('moment-duration-format') //Hesap Kontrol İçin "MDF" Modülünü Çağırdık.

  let aylar = aylartoplam 
  let kanal = "801898782073421834" //Register Kanal İD
  let kisi = client.users.cache.get(member.id);
  let kurulus = new Date().getTime() - kisi.createdAt.getTime();

  require("moment-duration-format");

  var kontrol;
    if (kurulus < 1296000000)
      kontrol = "Olamaz Tehlikeli Hesapsın";
    if (kurulus > 1296000000)
      kontrol = "Mükemmel, Güvenilir Hesap";

  client.channels.cache.get(kanal).send(`
    Sunucumuza Hoşgeldin ${member}.\n
    \t Seninle Beraber **${member.guild.memberCount}.**\n
    \t Kayıt Olabilmek İçin İsim Ve Yaş Söylemen Gerek.\n
    \t Yetkili Arkadaşlar Seninle İlgilenicektir <@&kayıt yetkilisi rolünün idsi buray>.\n
    \t Hesap Kontrollerini Yapalım: ${kontrol}.\n
    \t Tagımızı Alrak Bizlere Destek Olabilirsiniz.
  `)
  await member.roles.add('Kayıtsız Rol İD')
})
