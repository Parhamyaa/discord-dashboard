export default async function handler(req, res) {

    const { code } = req.query;

    if (!code) {
        return res.status(400).send("Kein Discord-Code vorhanden.");
    }


    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    const redirectUri = process.env.DISCORD_REDIRECT_URI;


    if (!clientId || !clientSecret || !redirectUri) {
        return res.status(500).send(
            "Discord Umgebungsvariablen fehlen."
        );
    }


    try {

        // Code gegen Access Token tauschen

        const tokenResponse = await fetch(
            "https://discord.com/api/oauth2/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },

                body: new URLSearchParams({

                    client_id: clientId,

                    client_secret: clientSecret,

                    grant_type: "authorization_code",

                    code: code,

                    redirect_uri: redirectUri

                })
            }
        );


        const tokenData = await tokenResponse.json();


        if (!tokenResponse.ok) {

            return res.status(400).send(
                `
                <h1>Discord Login Fehler</h1>
                <pre>${JSON.stringify(tokenData,null,2)}</pre>
                `
            );

        }



        // Discord User laden

        const userResponse = await fetch(
            "https://discord.com/api/users/@me",
            {
                headers: {
                    Authorization:
                    `Bearer ${tokenData.access_token}`
                }
            }
        );


        const user = await userResponse.json();



        if (!userResponse.ok) {

            return res.status(400).send(
                "Discord User konnte nicht geladen werden."
            );

        }



        // Login erfolgreich -> zurück zum Dashboard

        return res.redirect(302, "/");


    } catch(error) {


        console.error(error);


        return res.status(500).send(
            "Fehler beim Discord Login."
        );


    }

}
