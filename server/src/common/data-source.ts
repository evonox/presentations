import { DataSource } from "typeorm";
import { Asset } from "../entity/Asset";
import { File } from "../entity/File";
import { Folder } from "../entity/Folder";
import { Presentation } from "../entity/Presentation";
import { Template } from "../entity/Template";

let appDataSource = null;

export function getAppDataSource(): DataSource {
    if(appDataSource !== null)
        return appDataSource;

    const databaseLogging = process.env.DB_LOGGING.toLocaleLowerCase() === "true";

    const dbHost = process.env.DB_HOST;
    const dbPort = parseInt(process.env.DB_PORT);
    const dbUser = process.env.DB_USER;
    const dbPassword = process.env.DB_PASSWORD;
    const dbDatabase = process.env.DB_DATABASE;


    appDataSource = new DataSource({
        type: "mysql",
        host: dbHost,
        port: dbPort,
        username: dbUser,
        password: dbPassword,
        //insecureAuth: true,
        database: dbDatabase,
        synchronize: true,
        logging: databaseLogging,
        entities: [Template, Folder, File, Presentation, Asset],
        subscribers: [], 
        migrations: [],
    });

    return appDataSource;
}

