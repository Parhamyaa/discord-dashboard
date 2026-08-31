export default async function handler(req, res) {
    const token = process.env.DISCORD_BOT_TOKEN;

    if (!token) {
        return res.status(500).json({
            success: false,
            error: "DISCORD_BOT_TOKEN fehlt."
        });
    }

    const start = Date.now();

    try {
        const response = await fetch(
            "https://discord.com/api/v10/users/@me/guilds?with_counts=true",
            {
                headers: {
                    Authorization: `Bot ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                success: false,
                error: "Discord API Fehler",
                details: data
            });
        }

        let totalMembers = 0;

        for (const server of data) {
            totalMembers += server.approximate_member_count || 0;
        }

        const ping = Date.now() - start;

        return res.status(200).json({
            success: true,

            bot: {
                name: "PahoyaaSecurity",
                status: "ONLINE"
            },

            statistics: {
                servers: data.length,
                members: totalMembers,
                ping: ping
            }
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            error: "Bot-Statistiken konnten nicht geladen werden."
        });
    }
}
