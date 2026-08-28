export default function handler(req, res) {

    const cookies = req.headers.cookie;


    if (!cookies) {
        return res.status(401).json({
            loggedIn: false
        });
    }



    const sessionCookie = cookies
        .split("; ")
        .find(row => row.startsWith("pahoyaa_session="));



    if (!sessionCookie) {
        return res.status(401).json({
            loggedIn: false
        });
    }



    try {

        const session = sessionCookie
            .split("=")[1];


        const user = JSON.parse(
            Buffer.from(session, "base64").toString()
        );



        return res.status(200).json({

            loggedIn: true,

            user: user

        });



    } catch(error) {


        return res.status(500).json({

            loggedIn: false,

            error: "Session ungültig"

        });


    }

}
