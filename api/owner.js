export default function handler(req, res) {
    const cookies = req.headers.cookie;

    if (!cookies) {
        return res.status(401).json({
            allowed: false,
            message: "Nicht eingeloggt."
        });
    }

    const sessionCookie = cookies
        .split("; ")
        .find(row => row.startsWith("pahoyaa_session="));

    if (!sessionCookie) {
        return res.status(401).json({
            allowed: false,
            message: "Keine Session gefunden."
        });
    }

    try {
        const session = sessionCookie.split("=")[1];

        const user = JSON.parse(
            Buffer.from(session, "base64").toString()
        );

        const OWNER_ID = "1394076601397940387";

        if (user.id !== OWNER_ID) {
            return res.status(403).json({
                allowed: false,
                message: "Kein Zugriff."
            });
        }

        return res.status(200).json({
            allowed: true,
            user: user
        });

    } catch (error) {
        return res.status(500).json({
            allowed: false,
            message: "Session ungültig."
        });
    }
}
