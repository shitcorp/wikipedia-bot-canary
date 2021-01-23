import wiki from '../../wiki/functions';

export const raw = {
    name: "wiki",
    description: "Returns the summary of a wikipedia article",
    options: [
        {
            name: "Search-Term",
            description: "The search term you want to search for",
            required: true,
            type: 3
        },
        {
            name: "Language",
            description: "The language in which you want to search",
            type: 3,
            choices: [
                {
                    name: "English",
                    value: "en"
                },
                {
                    name: "German",
                    value: "de"
                },
                {
                    name: "Spanish",
                    value: "es"
                },
                {
                    name: "French",
                    value: "fr"
                },
                {
                    name: "Russian",
                    value: "ru"
                },
                {
                    name: "Slovak",
                    value: "sl"
                },
                {
                    name: "Turkish",
                    value: "tr"
                },
                {
                    name: "Yiddish",
                    value: "yi"
                }
            ]
        }
    ]
}

export const command = {
    // the id that discord returned us, we will need this
    // for the interaction handler
    id: "802496465313857557",
    name: "wiki",
    execute: async (interaction:any):Promise<void> => {
        const { data } = interaction
        let searchValue;
        let searchLang = 'en';

     
        
        for(const option in data.options) {
            console.log(option, data.options[option])
            const temp = data.options[option]
            if (temp.name === 'search-term') {
                searchValue = temp.value
            }
            if (temp.name === 'language') {
                if (temp.value === '') return;
                searchLang = temp.value
            }
        }

        console.log(searchLang)

        const returnedObject = await wiki.getSummary(searchValue, searchLang)
        console.log(returnedObject)
        //await client.slash.methods.reply(interaction, returnedObject.results[3].substr(0, 900))

        if (!returnedObject.error) {
            // send the results to discord
        }



    }
};
