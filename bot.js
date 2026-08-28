const { 
    Client, 
    GatewayIntentBits 
} = require("discord.js");


const client = new Client({

    intents: [

        GatewayIntentBits.Guilds,

        GatewayIntentBits.GuildMembers,

        GatewayIntentBits.GuildMessages

    ]

});



client.once("ready", () => {

    console.log(
        `Bot ist online als ${client.user.tag}`
    );

});



client.login(
    process.env.DISCORD_BOT_TOKEN
);
