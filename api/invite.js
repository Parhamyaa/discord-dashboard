export default function handler(req, res) {
    const clientId = process.env.DISCORD_CLIENT_ID;

    if (!clientId) {
        return res.status(500).send("DISCORD_CLIENT_ID fehlt.");
    }

    const params = new URLSearchParams({
        client_id: clientId,
        scope: "bot applications.commands",
        permissions: "0"
    });

    const discordInvite =
        "https://discord.com/oauth2/authorize?" + params.toString();

    return res.redirect(302, discordInvite);
}