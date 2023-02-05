import { ControllerBase } from "./ControllerBase";
import { Delete, Get, Post, Put } from "../common/decorators";
import { serialize } from "../common/serialization";
import { Request, Response } from "express";
import { PresentationBusiness } from "../business/PresentationBusiness";
import { Service, Inject } from "typedi";
import { getNumber, getString } from "../common/exceptions";

@Service()
export class PresentationController extends ControllerBase {

    @Inject(() => PresentationBusiness)
    private business: PresentationBusiness;

    @Get("/api/presentations")
    async fetchPresentations(req: Request, res: Response) {
          const presentations = await this.business.fetchAllPresentations(); 
          const data = serialize(presentations);
          this.sendContent(res, data);
    } 

    @Post("/api/presentations")
    async createPresentation(req: Request, res: Response) {
        const name = getString(req.body.name);
        const id = await this.business.createPresentation(name);
        const presentation = await this.business.getPresentationById(id);
        const data = serialize(presentation);
        this.sendContent(res, data);
    }

    @Put("/api/presentations/:id")
    async renamePresentation(req: Request, res: Response) {
        const id = getNumber(req.params.id);
        const name = getString(req.body.name);
        await this.business.renamePresentation(id, name);

        const presentation = await this.business.getPresentationById(id);
        const data = serialize(presentation);
        this.sendContent(res, data);
    };

    @Delete("/api/presentations/:id")
    async deletePresentation(req: Request, res: Response) {
        const id = getNumber(req.params.id);
        const presentation = await this.business.getPresentationById(id);
        await this.business.deletePresentation(id);
        const data = serialize(presentation);
        this.sendContent(res, data);
    }
}