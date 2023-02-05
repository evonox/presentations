import { Delete, Get, Patch, Post, Put } from "../common/decorators";
import { Request, Response} from "express";
import { TemplateContentBusiness } from "../business/TemplateContentBusiness";
import { serialize } from "../common/serialization";
import { ControllerBase } from "./ControllerBase";
import { Service, Inject } from "typedi";
import { getBoolean, getNumber, getString } from "../common/exceptions";
import fs from "fs";

@Service()
export class TemplateContentController extends ControllerBase {

    @Inject(() => TemplateContentBusiness)
    private business: TemplateContentBusiness;

    @Get("/api/folder/:id/folders")
    async getChildFolders(req: Request, res: Response) {
        const folderId = getNumber(req.params.id);
        const childFolders = await this.business.getChildFolders(folderId);
        const data = serialize(childFolders);
        this.sendContent(res, data);
    }

    @Get("/api/folder/:id/files")
    async getFiles(req: Request, res: Response) {
        const folderId = getNumber(req.params.id);
        const files = await this.business.getFiles(folderId);
        const data = serialize(files);
        this.sendContent(res, data);
    }

    @Post("/api/folder")
    async createFolder(req: Request, res: Response) {
        const name = getString(req.body.name);
        const parentId = getNumber(req.body.parentId);
        const id = await this.business.createFolder(name, parentId);
        const folder = await this.business.getFolderById(id);
        const data = serialize(folder);
        this.sendContent(res, data);
    }

    @Put("/api/folder/:id")
    async renameFolder(req: Request, res: Response) {
        const folderId = getNumber(req.params.id);
        const name = getString(req.body.name);
        await this.business.renameFolder(folderId, name);
        const folder = await this.business.getFolderById(folderId);
        const data = serialize(folder);
        this.sendContent(res, data)
    }

    @Patch("/api/folder/:id")
    async moveFolder(req: Request, res: Response) {
        const folderId = getNumber(req.params.id);
        const parentId = getNumber(req.body.parentId);
        await this.business.moveFolder(folderId, parentId);
        const folder = await this.business.getFolderById(folderId);
        const data = serialize(folder);
        this.sendContent(res, data);
    }

    @Delete("/api/folder/:id")
    async deleteFolder(req: Request, res: Response) {
        const folderId = getNumber(req.params.id);
        const folder = await this.business.getFolderById(folderId);
        await this.business.deleteFolder(folderId);
        const data = serialize(folder); 
        this.sendContent(res, data);
    }

    @Post("/api/file")
    async createFile(req: Request, res: Response) {
        const name = getString(req.body.name);
        const isBinary = getBoolean(req.body.isBinary);
        const parentId = getNumber(req.body.parentId);
        const id = await this.business.createFile(name, isBinary, parentId);
        const file = await this.business.getFileById(id);
        const data = serialize(file);
        this.sendContent(res, data);
    }

    @Put("/api/file/:id")
    async renameFile(req: Request, res: Response) {
        const fileId = getNumber(req.params.id);
        const name = getString(req.body.name);
        await this.business.renameFile(fileId, name);
        const file = await this.business.getFileById(fileId);
        const data = serialize(file);
        this.sendContent(res, data);
    }

    @Patch("/api/file/:id")
    async moveFile(req: Request, res: Response) {
        const fileId = getNumber(req.params.id);
        const parentId = getNumber(req.body.parentId);
        await this.business.moveFile(fileId, parentId);
        const file = await this.business.getFileById(fileId);
        const data = serialize(file);
        this.sendContent(res, data);
    }

    @Delete("/api/file/:id")
    async deleteFile(req: Request, res: Response) {
        const fileId = getNumber(req.params.id);
        const file = await this.business.getFileById(fileId);
        await this.business.deleteFile(fileId);
        const data = serialize(file);
        this.sendContent(res, data);
    }

    @Get("/api/file/:id/text")
    async getTextContent(req: Request, res: Response) {
        const fileId = getNumber(req.params.id);
        const content = await this.business.getFileContent(fileId);
        const data = serialize({content});
        this.sendContent(res, data);
    }

    @Post("/api/file/:id/text")
    async updateTextContent(req: Request, res: Response) {
        const fileId = getNumber(req.params.id);
        const content = getString(req.body.content);
        await this.business.updateFileContent(fileId, content);
        this.sendOK(res);
    }

    @Get("/api/file/:id/binary")
    async getBinaryContent(req: Request, res: Response) {
        const fileId = getNumber(req.params.id);
        const content = await this.business.fetchBinaryContent(fileId);
        this.invokeBufferDownload(res, content);
    }

    @Post("/api/file/:id/binary", {enabled: true, parameterName: "filename"})
    async updateBinaryContent(req: Request, res: Response) {
        return new Promise<void>((resolve, reject) => {
            const fileId = getNumber(req.params.id);
            const tmpFilename = this.getUploadedFilePath(req);

            fs.readFile(tmpFilename, async(err, buffer) => {
                if(err) {
                    reject(err.message);
                } else {
                    await this.business.storeBinaryContent(fileId, buffer);
                    const asset = await this.business.getFileById(fileId);
                    const data = serialize(asset);
                    this.sendContent(res, data);
                    resolve();
                }
            });
        });
    }
}
