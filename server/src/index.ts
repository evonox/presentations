import "reflect-metadata"
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import {getAppDataSource } from "./common/data-source";
import { useController } from "./common/decorators";
import { TemplateController } from "./controllers/TemplateController";
import { DataSource } from "typeorm";
import { TemplateContentController } from "./controllers/TemplateContentController";
import { PresentationController } from "./controllers/PresentationController";
import { AssetController } from "./controllers/AssetController";


dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(express.static('public'))

const port = process.env.PORT;
const rebuildDatabase = process.env.REBUILD_DATABASE.toLocaleLowerCase() === "true";


useController(app, TemplateController);
useController(app, TemplateContentController);
useController(app, PresentationController);
useController(app, AssetController);

getAppDataSource().initialize().then(async (ds: DataSource) => {
    if(rebuildDatabase === true) {
        await ds.runMigrations();
    }
    app.listen(port, () => {
        console.log(`[server]: Server is running at https://localhost:${port}`);
    });   
});
