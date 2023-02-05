import { Folder } from "../entity/Folder";
import { Template } from "../entity/Template";
import { TemplateContentBusiness } from "./TemplateContentBusiness";
import { Transactional } from "../common/decorators";
import { checkResource } from "../common/exceptions";
import { Service, Inject } from "typedi";

@Service()
export class TemplateBusiness {

    @Inject(() => TemplateContentBusiness)
    private contentBusiness: TemplateContentBusiness;

    async getAllTemplates() {
        return await Template.createQueryBuilder().getMany()
    }

    async getTemplateById(id: number) {
        return checkResource(await Template.findOneBy({id: id}));
    }

    @Transactional
    async createTemplate(name: string) {       
        const rootFolder = new Folder();
        rootFolder.name = "ROOT";
        await rootFolder.save();

        const template = new Template();
        template.name = name;
        template.rootFolder = rootFolder;
        await template.save();
    }

    async renameTemplate(id: number, name: string) {
        let template = checkResource(await Template.findOneBy({id: id}));
        template.name = name;
        await template.save();
    }

    @Transactional
    async deleteTemplate(id: number) {
        const template = checkResource(await Template.findOneBy({id: id}));
        const rootFolder = checkResource(await template.rootFolder);        
        await template.remove();
        await this.contentBusiness.deleteFolder(rootFolder.id);
    }
}
