import { TemplateBusiness } from "../business/TemplateBusiness";
import { Request, Response } from "express";
import { Delete, Get, Post, Put } from "../common/decorators";
import { TemplateContentBusiness } from "../business/TemplateContentBusiness";
import { ControllerBase } from "./ControllerBase";
import { serialize } from "../common/serialization";
import { Service, Inject } from "typedi";
import { getNumber, getString } from "../common/exceptions";

@Service()
export class TemplateController extends ControllerBase {

    @Inject(() => TemplateBusiness)
    private business: TemplateBusiness;

    @Inject(() => TemplateContentBusiness)
    private contentBusiness: TemplateContentBusiness;

    @Get("/api/templates")
    async fetchTemplates(req: Request, res: Response) {
          const templates = await this.business.getAllTemplates(); 
          const data = serialize(templates);
          this.sendContent(res, data);
    };    

    @Get("/api/templates/:id/root-folder")
    async fetchRootFolder(req: Request, res: Response) {
        const templateId = getNumber(req.params.id);
        const folder = await this.contentBusiness.getRootFolder(templateId);
        const data = serialize(folder);
        this.sendContent(res, data);
    }

    @Post("/api/templates")
    async createTemplate(req: Request, res: Response) {
        const name = getString(req.body.name);
        await this.business.createTemplate(name);
        this.sendOK(res);
    }

    @Put("/api/templates/:id")
    async renameTemplate(req: Request, res: Response) {
        const id = getNumber(req.params.id);
        const name = getString(req.body.name);
        await this.business.renameTemplate(id, name);
        this.sendOK(res);
    };

    @Delete("/api/templates/:id")
    async deleteTemplate(req: Request, res: Response) {
        const id = getNumber(req.params.id);
        await this.business.deleteTemplate(id);
        this.sendOK(res);
    }
}
