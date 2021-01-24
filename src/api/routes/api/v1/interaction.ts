import tweetnacl from 'tweetnacl';
import { logger } from '../../../../utils';
import * as Sentry from '@sentry/node';

export const route = {
    name: "interaction",
    method: "POST",
    route: async (req: any, res:any, commands: Map<String, any>): Promise<void> => {
        
        // Your public key can be found on your application in the Developer Portal
        let PUBLIC_KEY:any = process.env.PUBLIC_KEY
        PUBLIC_KEY = PUBLIC_KEY.toString()
        

        
        const signature = req.get("X-Signature-Ed25519");
        const timestamp = req.get("X-Signature-Timestamp");
        const body = req.rawBody; // rawBody is expected to be a string, not raw bytes


      

        
        const isVerified = tweetnacl.sign.detached.verify(
            Buffer.from(timestamp + body),
            Buffer.from(signature, "hex"),
            Buffer.from(PUBLIC_KEY, "hex")
        );


        
        if (!isVerified) {
            return res.status(401).end("invalid request signature");
        }

        if (isVerified) {
            res.status(200)
            
            const interaction:any = req.body
            
            if (commands.has(interaction.data.id)) {
                let func = commands.get(interaction.data.id)
                try {
                    func.execute(interaction)
                    logger.info(`[INTERACTION] Received interaction: '${interaction.data.name}'; by user: '${interaction.member.user.username}#${interaction.member.user.discriminator}';`)
                } catch(e) {
                    logger.error(e)
                }
            } 
            
        }
      }
    }
  },
};
