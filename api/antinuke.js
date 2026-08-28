let settings = {};

export default function handler(req, res) {


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



        settings[serverId] = {

            enabled,
            duration,
            action,
            limit,
            logs,

            updatedAt: Date.now()

        };



        return res.status(200).json({

            success:true,
            settings:settings[serverId]

        });


    }





    if(req.method === "GET"){


        const serverId = req.query.serverId;



        if(!serverId){

            return res.status(400).json({
                error:"Keine Server ID"
            });

        }



        return res.status(200).json({

            settings: settings[serverId] || null

        });


    }





    return res.status(405).json({

        error:"Methode nicht erlaubt"

    });


}
