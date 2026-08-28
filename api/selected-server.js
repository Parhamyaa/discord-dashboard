export default function handler(req, res) {

    if (req.method === "POST") {

        const { serverId } = req.body;


        if (!serverId) {

            return res.status(400).json({
                error: "Keine Server-ID vorhanden"
            });

        }


        res.setHeader(
            "Set-Cookie",
            `selected_server=${serverId}; Path=/; SameSite=Lax; Max-Age=86400`
        );


        return res.status(200).json({
            success: true,
            serverId
        });

    }



    if (req.method === "GET") {


        const cookie = req.headers.cookie || "";


        const match = cookie.match(
            /selected_server=([^;]+)/
        );


        if (!match) {

            return res.status(200).json({
                serverId: null
            });

        }


        return res.status(200).json({
            serverId: match[1]
        });


    }



    return res.status(405).json({
        error: "Methode nicht erlaubt"
    });

}
