const { 
    Client, 
    GatewayIntentBits 
} = require("discord.js");


const client = new Client({

    intents: [

        GatewayIntentBits.Guilds,

        GatewayIntentBits.GuildMembers,

        GatewayIntentBits.GuildMessages,

        GatewayIntentBits.MessageContent

    ]

});



client.once("ready", () => {

    console.log(
        `Bot ist online als ${client.user.tag}`
    );

});



// Anti-Nuke Vorbereitung

client.on("channelDelete", async (channel) => {

    console.log(
        `⚠️ Channel gelöscht: ${channel.name}`
    );

});



client.login(
    process.env.DISCORD_BOT_TOKEN
);
