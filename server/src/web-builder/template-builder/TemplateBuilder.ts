import { Inject, Service } from "typedi";
import { PresentationBusiness } from "../../business/PresentationBusiness";
import { Template } from "../../entity/Template";
import { StandardError } from "../common/StreamedOutput";
import { TemplateStorageCache } from "../common/TemplateStorageCache";
import { HBSTemplateCompiler } from "./HBSTemplateCompiler";

@Service()
export class TemplateBuilder {

    @Inject(() => PresentationBusiness)
    private presentationBusiness: PresentationBusiness;

    @Inject(() => TemplateStorageCache)
    private templateStorageCache: TemplateStorageCache;

    @Inject(() => HBSTemplateCompiler)
    private hbsTemplateCompiler: HBSTemplateCompiler;

    @Inject(() => StandardError)
    private standardError: StandardError;

    async buildPresentation(presentationId: number): Promise<boolean> {
        try {            
            // Get template and cache template structure
            const template = await this.getAssociatedTemplate(presentationId);
            await this.templateStorageCache.fetchTemplateContent(template.id);

            // Create HBS Environmet and register HBS partials
            this.hbsTemplateCompiler.initialize();
            await this.hbsTemplateCompiler.registerTemplatePartials();

            // Register CSS style compilers
            
            // TODO: IMPLEMENT + GENERATE TEMP FILE STYLE STORAGE

            // Register JavaScript compiler and bundler

            // TODO: IMPLEMENT + GENERATE JS SCRIPT STYLE STORAGE

            // Trigger template compilation and store the result

            // TODO: IMPLEMENT - MUST BY ASYNC FUNCTION GENERATION

            return true;
        }
        catch(e) {
            this.standardError.appendMessage(e.message);
            return false;
        }
    
        // SCAN ALL HBS FILES - TEMPLATE STORAGE CACHE - CACHED DATA ABOUT FILES
        // READ THEIR CONTENT
        // CHECK DUPLICATE IDENTIFIERS
        // TRY TO COMPILE - REGISTER AS PARTIALS
        // CHECK INDEX.HBS DOES EXIST - 
        // INVOKE COMPILATION PROCESS

    }

    private async getAssociatedTemplate(presentationId: number): Promise<Template> {
        const presentation = await this.presentationBusiness.getPresentationById(presentationId);
        const template = await presentation.template;
        if(template === null || template === undefined)
            throw new Error("Presentation does not have associated a template");
        return template;
    }
}
