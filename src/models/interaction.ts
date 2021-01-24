interface snowflake {
    snowflake:String
}



interface InteractionType {
    InteractionType:Number
}



interface GuildMember {
    user: {
        username:String,
        public_flags:String,
        id:snowflake,
        discriminator:String,
        avatar:String
    }
    roles:String[],
    premium_since:String,
    permissions:String,
    pending: Boolean,
    nick: String,
    mute: Boolean,
    joined_at: Date,
    is_pending: Boolean,
    deaf: Boolean
}


interface ApplicationCommandInteractionDataOption {
    name:String,
    value?:any,
    options?:Object[]
}


interface ApplicationCommandInteractionData {
    id:snowflake,
    name:String,
    options?:ApplicationCommandInteractionDataOption[]
}


export interface interaction {
    id:snowflake,
    type:InteractionType, // InteractionType (1-2)
    token:String,
    guild_id:String,
    channel_id:String,
    member:GuildMember,
    data?: ApplicationCommandInteractionData
}