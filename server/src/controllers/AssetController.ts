import { ControllerBase } from "./ControllerBase";
import { Delete, Get, Post, Put } from "../common/decorators";
import { AssetBusiness } from "../business/AssetBusiness";
import { Request, Response } from "express";
import { serialize } from "../common/serialization";
import { Service, Inject } from "typedi";
import fs from "fs";
import { getNumber, getString } from "../common/exceptions";

@Service()
export class AssetController extends ControllerBase {

    @Inject(() => AssetBusiness)
    private business: AssetBusiness;

    @Get("/api/presentations/:id/images")
    async fetchImages(req: Request, res: Response) {
        const presentationId = getNumber(req.params.id);
        const images = await this.business.fetchImages(presentationId);
        const data = serialize(images);
        this.sendContent(res, data);
    }

    @Get("/api/presentations/:id/sounds")
    async fetchSounds(req: Request, res: Response) {
        const presentationId = getNumber(req.params.id);
        const sounds = await this.business.fetchSounds(presentationId);
        const data = serialize(sounds);
        this.sendContent(res, data);
    }

    @Post("/api/presentations/:id/image/upload", {enabled: true, parameterName: "filename"})
    async uploadImage(req: Request, res: Response) {
        return new Promise<void>((resolve, reject) => {
            const presentationId = getNumber(req.params.id);
            const name = getString(req.body.name);
            const tmpFilename = this.getUploadedFilePath(req);

            fs.readFile(tmpFilename, async(err, buffer) => {
                if(err) {
                    reject(err.message);
                } else {
                    const id = await this.business.uploadImage(presentationId, name, buffer);
                    const asset = await this.business.getAssetById(id);
                    const data = serialize(asset);
                    this.sendContent(res, data);
                    resolve();
                }
            });
        });
    }

    @Post("/api/presentations/:id/sound/upload", {enabled: true, parameterName: "filename"})
    async uploadSound(req: Request, res: Response) {
        return new Promise<void>((resolve, reject) => {
            const presentationId = getNumber(req.params.id);
            const name = getString(req.body.name);
            const tmpFilename = this.getUploadedFilePath(req);
    
            fs.readFile(tmpFilename, async(err, buffer) => {
                if(err) {
                    reject(err.message);
                } else {
                    const id = await this.business.uploadSound(presentationId, name, buffer);
                    const asset = await this.business.getAssetById(id);
                    const data = serialize(asset);
                    this.sendContent(res, data);
                    resolve();
                }
            });
        });
    }

    @Put("/api/presentations/asset/:id")
    async renameAsset(req: Request, res: Response) {
        const assetId = getNumber(req.params.id);
        const name = getString(req.body.name);
        await this.business.renameAsset(assetId, name);
        const asset = await this.business.getAssetById(assetId);
        const data = serialize(asset);
        this.sendContent(res, data);
    }

    @Get("/api/presentations/asset/:id/download") 
    async downloadAsset(req: Request, res: Response) {
        const assetId = getNumber(req.params.id);
        const buffer = await this.business.getAssetContent(assetId);
        this.invokeBufferDownload(res, buffer);
    }

    @Delete("/api/presentations/asset/:id") 
    async deleteAsset(req: Request, res: Response) {
        const assetId = getNumber(req.params.id);
        const asset = await this.business.getAssetById(assetId);
        await this.business.deleteAsset(assetId);
        const data = serialize(asset);
        this.sendContent(res, data);
    }
}
