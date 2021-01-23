require('dotenv').config()

import fs from 'fs';
import path from 'path';
import prompts from 'prompts';

const { DiscordInteractions }  = require("slash-commands");

const config = {
    applicationId: process.env.APPLICATION_ID,
    authToken: process.env.TOKEN,
    publicKey: process.env.PUBLIC_KEY
}



const choices:Object[] = []

fs.readdirSync(path.join(__dirname + '/commands'))
.filter(f => !f.startsWith("_") && f.endsWith(".js"))
.forEach(f => {
        choices.push(
            { 
            title: f.replace(".js", ""),
            value: f
        })
        
    })
    

    const questions:any = [
    {
        type: 'multiselect',
        name: 'commands',
        message: 'Which command/s do you want to register?',
        choices,
    },
  ];
  
  (async () => {
      const response = await prompts(questions);

      if (!response.commands) return;
      
      const interaction = new DiscordInteractions(config)

      response.commands.forEach(async (c:any) => {

          const { raw } = require(path.join(__dirname + '/commands/' + c))
  
          await interaction
          .createApplicationCommand(raw)
          .then((data:any) => {
              //console.log(data)
              if (data.message && data.message.includes('401: Unauthorized')) {
                  // print unauthorized error
                  console.error(`
                  _________________________________

                  [401] Unauthorized

                  Failed to register the command, check
                  your .env file if you have the correct
                  token, application id and public key
                  and try again.
                  
                  _________________________________
                  `)
              }
              if (data.id) {
                  console.log(`
                  _________________________________
                  
                  Registered the following command:
                  
                  ID:          ${data.id}
                  App_ID:      ${data.application_id}
                  Name:        ${data.name}
                  Desc:        ${data.description}
                  
                  _________________________________`)
              }

            })
          .catch(console.error);

      })


  })();