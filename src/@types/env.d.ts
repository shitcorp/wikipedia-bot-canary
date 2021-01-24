declare namespace NodeJS {
  export interface ProcessEnv {
    TOKEN: string;
    APPLICATION_ID: string;
    PUBLIC_KEY: string;
    SERVER_NAME?: string;
  }
}
