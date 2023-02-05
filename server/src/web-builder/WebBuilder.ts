import { Inject, Service } from "typedi";
import { StandardError, StandardOutput } from "./common/StreamedOutput";
import { PresentationBuilder } from "./presentation-builder/PresentationBuilder";
import { TemplateBuilder } from "./template-builder/TemplateBuilder";

// TODO: BuildProgressDataHolder
@Service()
export class WebBuilder {

    @Inject(() => StandardOutput)
    private standardOutput: StandardOutput;

    @Inject(() => StandardError)
    private standardError: StandardError;

    @Inject(() => TemplateBuilder)
    private templateBuilder: TemplateBuilder;

    @Inject(() => PresentationBuilder)
    private presentationBuilder: PresentationBuilder;


    async buildPresentation(presentationId: number): Promise<boolean> {
        if(await this.templateBuilder.buildPresentation(presentationId) === false) {
            return false;
        }
        if(await this.presentationBuilder.buildPresentation(presentationId) === false) {
            return false;
        }
        // TODO: Create ZIP ARCHIVE FROM THE BUILD PROJECT
        return true;
    }

    getCompiledPresentation() {

    }

    getStandardOutput() {
        return this.standardOutput;
    }

    getStandardError() {
        return this.standardError;
    }
}
