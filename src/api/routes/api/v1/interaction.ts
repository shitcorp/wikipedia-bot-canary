import { interaction } from '../../../../@types/interaction';
import tweetnacl from 'tweetnacl';
import { logger } from '../../../../utils';
import * as Sentry from '@sentry/node';
import { Command } from '../../../../@types/cmd';
import { APIRoute } from '../../../../@types/api';

export const route: APIRoute = {
  name: 'interaction',
  method: 'POST',
  route: async (req, res, commands) => {
    // Your public key can be found on your application in the Developer Portal
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const PUBLIC_KEY = process.env.PUBLIC_KEY;

    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const body = req.rawBody; // rawBody is expected to be a string, not raw bytes

    const isVerified = tweetnacl.sign.detached.verify(
      Buffer.from(timestamp + body),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Buffer.from(signature, 'hex'),
      Buffer.from(PUBLIC_KEY, 'hex'),
    );

    if (!isVerified) {
      return res
        .status(401)
        .end('invalid request signature');
    }

    if (isVerified) {
      res.status(200);

      const interaction: interaction = req.body;

      if (!interaction.data) return;

      if (commands.has(interaction.data.id)) {
        Sentry.setUser({
          username: `${interaction.member.user.username}#${interaction.member.user.discriminator}`,
          id: interaction.member.user.id,
        });

        const commandTrans = Sentry.startTransaction({
          op: 'cmd run',
          name: 'Ran command',
        });

        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const cmd: Command = <Command>(
            commands.get(interaction.data.id)
          );

          Sentry.addBreadcrumb({
            category: 'cmd',
            message: 'Ran the command ' + cmd.name,
            level: Sentry.Severity.Info,
          });

          // run cmd
          await cmd.execute(interaction);

          logger.info(
            `[INTERACTION] Received interaction: '${interaction.data.name}'; by user: '${interaction.member.user.username}#${interaction.member.user.discriminator}';`,
          );
        } catch (e) {
          Sentry.captureException(e);
          logger.error(e);
        } finally {
          commandTrans.finish();
        }
      }
    }
  },
};
