export default async function handler(req, res) {

    // ==========================================
    // NUR POST
    // ==========================================

    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            error: "Nur POST erlaubt."
        });
    }


    // ==========================================
    // SESSION PRÜFEN
    // ==========================================

    const cookies = req.headers.cookie || "";

    const sessionCookie = cookies
        .split("; ")
        .find(row => row.startsWith("pahoyaa_session="));

    if (!sessionCookie) {
        return res.status(401).json({
            success: false,
            error: "Nicht angemeldet."
        });
    }


    try {

        const session = sessionCookie
            .split("=")
            .slice(1)
            .join("=");

        const user = JSON.parse(
            Buffer.from(session, "base64").toString()
        );


        // ==========================================
        // OWNER PRÜFEN
        // ==========================================

        const OWNER_ID = "1394076601397940387";

        if (user.id !== OWNER_ID) {
            return res.status(403).json({
                success: false,
                error: "Keine Owner-Berechtigung."
            });
        }


        // ==========================================
        // NACHRICHT PRÜFEN
        // ==========================================

        const message = req.body?.message;

        if (!message || typeof message !== "string") {
            return res.status(400).json({
                success: false,
                error: "Keine Nachricht angegeben."
            });
        }

        if (message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: "Die Nachricht darf nicht leer sein."
            });
        }

        if (message.length > 2000) {
            return res.status(400).json({
                success: false,
                error: "Die Nachricht darf maximal 2000 Zeichen haben."
            });
        }


        // ==========================================
        // BOT TOKEN
        // ==========================================

        const botToken = process.env.DISCORD_BOT_TOKEN;

        if (!botToken) {
            return res.status(500).json({
                success: false,
                error: "DISCORD_BOT_TOKEN fehlt in Vercel."
            });
        }


        // ==========================================
        // DISCORD SERVER DES BOTS LADEN
        // ==========================================

        const guildResponse = await fetch(
            "https://discord.com/api/v10/users/@me/guilds",
            {
                headers: {
                    Authorization: `Bot ${botToken}`
                }
            }
        );


        if (!guildResponse.ok) {

            const errorText = await guildResponse.text();

            console.error(
                "Guild Fehler:",
                errorText
            );

            return res.status(500).json({
                success: false,
                error: "Discord-Server konnten nicht geladen werden."
            });
        }


        const guilds = await guildResponse.json();


        // ==========================================
        // NACHRICHT AN SERVER SENDEN
        // ==========================================

        let sent = 0;
        let failed = 0;


        for (const guild of guilds) {

            try {

                // Kanäle des Servers laden

                const channelResponse = await fetch(
                    `https://discord.com/api/v10/guilds/${guild.id}/channels`,
                    {
                        headers: {
                            Authorization: `Bot ${botToken}`
                        }
                    }
                );


                if (!channelResponse.ok) {
                    failed++;
                    continue;
                }


                const channels =
                    await channelResponse.json();


                // Geeignete Textkanäle suchen

                const textChannels =
                    channels.filter(channel =>
                        channel.type === 0
                    );


                if (textChannels.length === 0) {
                    failed++;
                    continue;
                }


                let messageSent = false;


                // Kanäle nacheinander probieren

                for (const channel of textChannels) {

                    const sendResponse = await fetch(
                        `https://discord.com/api/v10/channels/${channel.id}/messages`,
                        {
                            method: "POST",

                            headers: {
                                "Authorization":
                                    `Bot ${botToken}`,

                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                content: message
                            })
                        }
                    );


                    if (sendResponse.ok) {

                        sent++;

                        messageSent = true;

                        break;

                    }

                }


                if (!messageSent) {
                    failed++;
                }


            } catch (error) {

                console.error(
                    `Fehler bei Server ${guild.id}:`,
                    error
                );

                failed++;

            }

        }


        // ==========================================
        // ERGEBNIS
        // ==========================================

        return res.status(200).json({

            success: true,

            message: "Globale Nachricht verarbeitet.",

            statistics: {

                servers: guilds.length,

                sent: sent,

                failed: failed

            }

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            error: "Interner Fehler beim Senden."

        });

    }

}
