export default async function handler(req, res) {

    const token = req.cookies?.discord_access_token;


    if (!token) {
        return res.status(401).json({
            error: "Nicht eingeloggt"
        });
    }


    try {

        const response = await fetch(
            "https://discord.com/api/users/@me/guilds",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );


        const guilds = await response.json();


        if (!response.ok) {

            return res.status(400).json({
                error: "Server konnten nicht geladen werden"
            });

        }


        const servers = guilds.map(guild => ({
            id: guild.id,
            name: guild.name,
            icon: guild.icon
        }));


        return res.status(200).json({
            servers
        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: "Interner Fehler"
        });

    }

}
