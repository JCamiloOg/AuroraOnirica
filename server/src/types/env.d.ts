declare namespace NodeJS {
    interface ProcessEnv {
        PORT: string,
        DB_HOST: string,
        DB_USER: string,
        DB_PASSWORD: string,
        DB_PORT: string,
        DB_DATABASE: string,
        NODE_ENV: "development" | "production",
        HOSTNAME: string
        CORS_ORIGIN: string,
        SECRET_KEY: string,
        API_KEY_IMGBB: string
    }
}