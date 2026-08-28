let settings = {};

export default function handler(req, res) {


    // Einstellungen speichern
    if(req.method === "POST"){


        const {
            serverId,
            enabled,
            duration,
            action,
            limit,
            logs
        } = req.body;



        if(!serverId){

            return res.status(400).json({
                error:"Keine Server ID"
            });

        }



        let expireTime = null;



        // 0 = dauerhaft
        if(Number(duration) !== 0){

            expireTime =
            Date.now() + (Number(duration) * 60 * 60 * 1000);

        }




        settings[serverId] = {


            enabled,

            duration,

            action,

            limit,

            logs,


            // Ablaufzeit speichern
            expireTime,


            updatedAt: Date.now()


        };



        return res.status(200).json({

            success:true,

            settings:settings[serverId]

        });


    }






    // Einstellungen laden
    if(req.method === "GET"){


        const serverId = req.query.serverId;



        if(!serverId){

            return res.status(400).json({

                error:"Keine Server ID"

            });

        }





        let serverSettings = settings[serverId];



        if(serverSettings){



            // Prüfen ob Zeit abgelaufen ist

            if(
                serverSettings.expireTime &&
                Date.now() > serverSettings.expireTime
            ){


                serverSettings.enabled = false;


            }



        }




        return res.status(200).json({

            settings: serverSettings || null

        });



    }





    return res.status(405).json({

        error:"Methode nicht erlaubt"

    });



}
