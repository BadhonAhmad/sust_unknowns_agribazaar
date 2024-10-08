import type { NextApiRequest, NextApiResponse } from 'next'

import axios from 'axios';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
 
  const method = req.method;
    switch(method)
    {
        case 'POST':
        const {email,password,role} = (req.body) ;
        const body = {
            "email":email,
            "password":password,
            
        }
        const url = "http://localhost:8080/userservices/api/agents/login";
        try{
            const axiosRes = await axios.post(url,body,{
                headers: {
                    "Content-Type": "application/json",
                    },
                    
            },
           
        );
            const token = axiosRes.data;
            res.status(201).json({
                "token":token,
            });
        }
        catch(err){
            console.log(err)
            res.status(500).end();
        }
        
            break;
        
        default:
         res.status(405).end();
        break;
    }
}
