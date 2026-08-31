export default async function handler(req, res) {

    // Nur POST erlauben
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            error: "Nur POST erlaubt."
        });
    }

    // Session prüfen
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

        // DEINE DISCORD-ID
        const OWNER_ID = "1394076601397940387";

        if (user.id !== OWNER_ID) {
            return res.status(403).json({
                success: false,
                error: "Keine Owner-Berechtigung."
            });
        }

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

        return res.status(200).json({
            success: true,
            owner: user.username,
            message: message,
            ready: true
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            error: "Session ungültig."
        });
    }
}
