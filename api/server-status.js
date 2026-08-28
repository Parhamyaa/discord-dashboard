export default async function handler(req, res) {

    const { serverId } = req.query;


    if (!serverId) {
        return res.status(400).json({
            error: "Keine Server-ID angegeben"
        });
    }


    try {

        const botToken = process.env.DISCORD_BOT_TOKEN;


        if (!botToken) {

            return res.status(500).json({
                error: "Bot Token fehlt"
            });

        }


        const response = await fetch(
            `https://discord.com/api/v10/guilds/${serverId}`,
            {
                headers: {
                    Authorization: `Bot ${botToken}`
                }
            }
        );


        if (response.ok) {

            const server = await response.json();


            return res.status(200).json({

                botInServer: true,

                name: server.name

            });


        } else {


            return res.status(200).json({

                botInServer: false

            });


        }


    } catch (error) {


        return res.status(500).json({

            error: error.message

        });


    }

}
