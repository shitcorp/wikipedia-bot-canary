import { Request, Response } from "express";
import handler from '../../../../modules/interactions/handler';
import tweetnacl from "tweetnacl";

export const route = {
    name: "interaction",
    method: "POST",
    route: async (req: any, res: Response, commands: Map<String, any>): Promise<void> => {
        // Your public key can be found on your application in the Developer Portal
        const PUBLIC_KEY = "APPLICATION_PUBLIC_KEY";

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
        } else {
            handler.interactionhandler(req, res)
        }
    },
};
