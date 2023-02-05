import Container, { Inject, Service } from "typedi";
import { TempFileStorage } from "../common/TempFileStorage";
import { CssStyleGenerator } from "./styles/CssStyleGenerator";
import { LessStyleGenerator } from "./styles/LessStyleGenerator";
import { ScssStyleGenerator } from "./styles/ScssStyleGenerator";
import { StyleGenerationResult, StyleGeneratorBase } from "./styles/StyleGeneratorBase";
import { StylusSyleGenerator } from "./styles/StylusStyleGenerator";
import HBS from "handlebars";
import { INCLUDE_STYLE_HELPER_NAME } from "../common/Constants";

interface GeneratorConfiguration {
    extensions: string[];
    generator: new() => StyleGeneratorBase;
}

const STYLE_GENERATOR_CONFIGURATION: GeneratorConfiguration[] = [
    {
        extensions: [".css"],
        generator: CssStyleGenerator
    },
    {
        extensions: [".scss"],
        generator: ScssStyleGenerator
    },
    {
        extensions: [".less"],
        generator: LessStyleGenerator
    },
    {
        extensions: [".styl"],
        generator: StylusSyleGenerator
    }
]

@Service()
export class StyleGenerationDispatcher {

    
    private tempStorage: TempFileStorage;

    setTempFileStorage(tempStorage: TempFileStorage) {
        this.tempStorage = tempStorage;
    }

    registerHandlebarsHelper(hbsEngine: typeof HBS) {
        hbsEngine.registerHelper(INCLUDE_STYLE_HELPER_NAME, async(context, arg1) => {
            return new Promise<string>(async (resolve, reject) => {
                if(typeof arg1 !== "string") {
                    reject(`You must pass the file name as the first argument of ${INCLUDE_STYLE_HELPER_NAME} helper.`);
                }  else {
                    try {
                        const generator = this.getGeneratorForFile(arg1);
                        const generationResult = await this.generateCss(arg1, generator);
                        
                        if(generationResult.exitCode !== 0) {
                            reject(generationResult.errorMessage);
                        } else {                            
                            const styleHtml = this.generateStyleHtml(generationResult.generatedContent);
                            resolve(styleHtml);
                        }
                    }
                    catch(e) {
                        reject(e.message);
                    }
                }
            });
        });
    }

    private generateStyleHtml(style: string): string {
        return `<style>${style}</style>`;
    }

    private async generateCss(filename: string, generator: StyleGeneratorBase): Promise<StyleGenerationResult> {
        generator.setTempFileStorage(this.tempStorage);
        return await generator.generateStyle(filename);
    }

    private getGeneratorForFile(filename: string): StyleGeneratorBase {
        const generatorConfig = STYLE_GENERATOR_CONFIGURATION.find(
            config => config.extensions.find(ext => filename.endsWith(ext)) !== undefined
        )
        if(generatorConfig === undefined)
            throw new Error(`There is no registered CSS style generator for file: ${filename}`);

        return Container.get(generatorConfig.generator);
    }
}
