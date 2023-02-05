import { Inject, Service } from "typedi";
import { StandardError, StandardOutput } from "../common/StreamedOutput";
import { TemplateStorageCache } from "../common/TemplateStorageCache";
import HBS from "handlebars";
import asyncHelpers from 'handlebars-async-helpers';
import { HBS_TEMPLATE_EXTENSION, TEMPLATE_INDEX_FILE } from "../common/Constants";
import { TemplateContentBusiness } from "../../business/TemplateContentBusiness";
import { basename } from "path";

@Service()
export class HBSTemplateCompiler {

    @Inject(() => TemplateContentBusiness)
    private templateContentBusiness: TemplateContentBusiness;

    @Inject(() => TemplateStorageCache)
    private templateStorageCache: TemplateStorageCache;

    @Inject(() => StandardOutput)
    private standardOutput: StandardOutput;

    @Inject(() => StandardError)
    private standardError: StandardError;

    private hbsEngine: typeof HBS;

    initialize() {
        this.hbsEngine =  asyncHelpers(HBS.create());
    }

    async registerTemplatePartials() {
        this.standardOutput.appendMessage("Compiling HBS Partial Templates...")
        
        // Fetch all template files and exlucde the index file
        let hbsFiles = await this.templateStorageCache.searchFilesWithExtension(HBS_TEMPLATE_EXTENSION);
        hbsFiles = hbsFiles.filter(file => file.name !== TEMPLATE_INDEX_FILE);

        // Register all HBS files as HBS partials
        for(const hbsFile of hbsFiles) {
            this.standardOutput.appendMessage(`Loading HBS Template ${hbsFile.name}`);
            const hbsTemplate = await this.templateContentBusiness.getFileContent(hbsFile.id);

            this.standardOutput.appendMessage(`Registering HBS Template ${hbsFile.name}`);
            const partialName = basename(hbsFile.name);
            this.hbsEngine.registerPartial(partialName, hbsTemplate);

            this.standardOutput.appendMessage(`HBS Template ${hbsFile.name} was registered.`);
        }
        
        this.standardOutput.appendMessage("HBS Partial Templates successfully compiled.");
    }
    
    async compilePresentationTemplate(): Promise<boolean> {
        try {
            // TODO: Get Presentation Data from the SharedDataHolder
            throw new Error("NOT IMPLEMENTED");
            return true;
        }
        catch(e) {
            this.standardError.appendMessage(`Compilation failed with erorr: ${e.message}`);
            return false;
        }
    }
}
