export default function handler(req, res) {
    const clientId = process.env.DISCORD_CLIENT_ID;

    if (!clientId) {
        return res.status(500).send("DISCORD_CLIENT_ID fehlt.");
    }

    const redirectUri = process.env.DISCORD_REDIRECT_URI;

    if (!redirectUri) {
        return res.status(500).send("DISCORD_REDIRECT_URI fehlt.");
    }

    const params = new URLSearchParams({
        client_id: clientId,
        response_type: "code",
        redirect_uri: redirectUri,
        scope: "identify guilds"
    });

    const discordUrl =
        "https://discord.com/oauth2/authorize?" + params.toString();

    res.redirect(302, discordUrl);
}
