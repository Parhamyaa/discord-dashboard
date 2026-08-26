export default async function handler(req, res) {
    const { code } = req.query;

    if (!code) {
        return res.status(400).send("Kein Discord-Code vorhanden.");
    }

    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    const redirectUri = process.env.DISCORD_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
        return res.status(500).send("Discord-Umgebungsvariablen fehlen.");
    }

    try {
        const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: "authorization_code",
                code,
                redirect_uri: redirectUri
            })
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            return res.status(400).send(
                "Discord Login fehlgeschlagen: " +
                JSON.stringify(tokenData)
            );
        }

        const userResponse = await fetch("https://discord.com/api/users/@me", {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`
            }
        });

        const user = await userResponse.json();

        if (!userResponse.ok) {
            return res.status(400).send("Discord-Benutzer konnte nicht geladen werden.");
        }

        res.status(200).send(`
            <!DOCTYPE html>
            <html lang="de">
            <head>
                <meta charset="UTF-8">
                <title>Login erfolgreich</title>
                <style>
                    body {
                        background: #111827;
                        color: white;
                        font-family: Arial, sans-serif;
                        text-align: center;
                        padding-top: 100px;
                    }
                    .box {
                        background: #1f2937;
                        padding: 40px;
                        border-radius: 15px;
                        display: inline-block;
                    }
                </style>
            </head>
            <body>
                <div class="box">
                    <h1>✅ Login erfolgreich!</h1>
                    <p>Willkommen, ${user.username}!</p>
                </div>
            </body>
            </html>
        `);

    } catch (error) {
        console.error(error);
        return res.status(500).send("Interner Fehler beim Discord Login.");
    }
}
