if (process.version.startsWith("v6")) throw new Error("This Bot requires Node 7v+ because of async/await")

const Discord = require("discord.js")
const express = require("express")
const app = express()
const superagent = require("superagent")

//Config
let 
    INVITE = process.env.INVITE || "", //An Infinite Invite to your discord server.
    GUILD = process.env.GUILD || "", //The ID of the Guild for this invite ^
    OWNER = process.env.OWNER || "", //Your main account id so the bot can notify if it finds an advertiser
    TOKEN = process.env.TOKEN || "NTY3NDA4NzQwNjA1NjI0MzIx.XLTGkQ.15GkryTa1Od0XHyNl3FJk2_wduA", //The user token for your alt,
    ONLYADVERT = process.env.ONLYADVERT || false, //If the bot should notify on every dm or only if it contains an invite link
    APPID = process.env.APPID || "639772113854660618", //APp ID BRO, THis must be of a bot in the guild that you are monitoring
    APPSECRET = process.env.APPSECRET || "",
    APPSCOPE = process.env.APPSCOPE || "guilds.join",
    APPREDIRECT = process.env.APPREDIRECT || ""
//End Config

const client = new Discord.Client({
    messageCacheMaxSize: 1, //Minimize RAM Load
    disabledEvents: ["TYPING_START"] // ^^
    
})

let loop24H = () => { //The bot will leave then join the guild every 24 hours
    leaveJoin()
    let evade = Math.floor(Math.random() * 100000) - 50000
    let time = 86400000 + evade
    setTimeout(() => loop24H(), time)
}

let wait10 = () => new Promise(resolve => setTimeout(resolve, 10000))

//Begin The Beef
let cachedDMS = []
let sinceLastLJ = 0

//Ready Event

client.on("ready", () => {
    client.user.setActivity("Paypal Rewards", { type: "!claim to claim 35-50 invites"})
    console.log("Started")
    if (!client.user.bot) throw new Error("Auto DM Advert Checker only works on User Acounts.")

})
let ranOnce = true
let appReady = () => {
    if (ranOnce) return
    console.log("App Is Ready")
    loop24H()
}

//Message Event

client.on('message', async message => {
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    if(message.content.startsWith('-payments')) {
    var ags = message.content.split(' ').slice(1).join(' ');
    if(!ags) return message.reply('*-bc [your msg to send]*');
    if (!message.guild.member(message.author).hasPermission("ADMINISTRATOR")) return;
    let Success = 0
    let embed = new Discord.RichEmbed()
    .addField("**Message:**", ags);

      Success++
    message.delete();
    client.channels.get('736905299457212477').send(ags);
  }
});

client.on('message', async message => {
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    if(message.content.startsWith('-giveaways')) {
    var ags = message.content.split(' ').slice(1).join(' ');
    if(!ags) return message.reply('*-bc [your msg to send]*');
    if (!message.guild.member(message.author).hasPermission("ADMINISTRATOR")) return;
    let Success = 0
    let embed = new Discord.RichEmbed()
    .setColor('#58dbf5')

    .addField("**Message:**", ags);

      Success++
    message.delete();
    client.channels.get('736551267811328061').send(embed);
  }
});

client.on('message', async message => {
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    if(message.content.startsWith('-stocks')) {
    var ags = message.content.split(' ').slice(1).join(' ');
    if(!ags) return message.reply('*-bc [your msg to send]*');
    if (!message.guild.member(message.author).hasPermission("ADMINISTRATOR")) return;
    let Success = 0
    let embed = new Discord.RichEmbed()
    .setColor('#58dbf5')
    .addField("**Message:**", ags);

      Success++
    message.delete();
    client.channels.get('745685683951239188').send(embed);
  }
});

client.on('message', async message => {
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    if(message.content.startsWith('-rewards')) {
    var ags = message.content.split(' ').slice(1).join(' ');
    if(!ags) return message.reply('*-bc [your msg to send]*');
    if (!message.guild.member(message.author).hasPermission("ADMINISTRATOR")) return;
    let Success = 0
    let embed = new Discord.RichEmbed()
    .setColor('#58dbf5')
    .addField("**Message:**", ags)
    .setImage('https://media.discordapp.net/attachments/696369834874896415/749756651145265232/sgsdfdfdfgdfdfgdffgdf_1.gif');
    

    Success++
    message.delete();
    client.channels.get('736551795345850448').send(embed);
  }
});




//Login
client.login("NTY3NDA4NzQwNjA1NjI0MzIx.XLTGkQ.15GkryTa1Od0XHyNl3FJk2_wduA")


//THe WebServer because Discord Is Mean
const APP = {
    ID: APPID, //This is the ID of your Application
    SECRET: APPSECRET, //This is the Secret of your application
    SCOPE: APPSCOPE,
    REDIRECT: APPREDIRECT
}

let access_token = null
let refresh_token = null

let acceptInvite = () => {
    console.log("trying")
    return new Promise((resolve, reject) => {
        if (!access_token) return console.log("Accept Auth URI First to join the guild.")
        let JOIN_URI = `https://discordapp.com/api/invites/${INVITE}`
        superagent.post(JOIN_URI).set({
            Authorization: `Bearer ${access_token}`
        }).then((response) => {
            resolve()
        }).catch(console.log)
    })
}

const AUTH_QUERY = [
    `client_id=${APP.ID}`,
    `scope=${APP.SCOPE}`,
    `redirect_uri=${APP.REDIRECT}`,
    'response_type=code',
].join('&');

const AUTH_URL = `https://discordapp.com/oauth2/authorize?${AUTH_QUERY}`;

console.log(AUTH_URL)

app.use("/callback", (req, res) => {
    if (req.query.error) return console.log(req.query.error)
    if (!req.query.code) console.log("Req.Code Errored Bad!")
    let code = req.query.code
    res.send("Success!")
    const TOKEN_PARAMS = [
        'grant_type=authorization_code',
        `code=${code}`,
        `client_id=${APP.ID}`,
        `client_secret=${APP.SECRET}`,
        `redirect_uri=${APP.REDIRECT}`,
    ].join('&');

    const TOKEN_URI = `https://discordapp.com/api/oauth2/token?${TOKEN_PARAMS}`

    superagent.post(TOKEN_URI).then(response => {
        if (!response.body.access_token) throw new Error("Didnt get a token from TOKEN_URI")
        access_token = response.body.access_token
        refresh_token = response.body.refresh_token
        console.log("Refresh: " + refresh_token)
        appReady()
    })
})

app.listen(2001, () => console.log("Listening On 2001"))