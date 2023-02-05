import Container, { Service } from "typedi";
import { TempFileStorage } from "../common/TempFileStorage";
import { CodeGenerationResult, CodeGeneratorBase } from "./code/CodeGeneratorBase";
import { JavascriptCodeGenerator } from "./code/JavascriptCodeGenerator";
import HBS from "handlebars";
import { INCLUDE_CODE_HELPER_NAME } from "../common/Constants";

interface GeneratorConfiguration {
    extensions: string[];
    generator: new() => CodeGeneratorBase;
}

const CODE_GENERATOR_CONFIGURATION: GeneratorConfiguration[] = [
    {
        extensions: [".js"],
        generator: JavascriptCodeGenerator
    }
]


@Service()
export class CodeGenerationDispatcher {

    private tempStorage: TempFileStorage;

    setTempFileStorage(tempStorage: TempFileStorage) {
        this.tempStorage = tempStorage;
    }

    registerHandlebarsHelper(hbsEngine: typeof HBS) {
        hbsEngine.registerHelper(INCLUDE_CODE_HELPER_NAME, async(context, arg1) => {
            return new Promise<string>(async (resolve, reject) => {
                if(typeof arg1 !== "string") {
                    reject(`You must pass the file name as the first argument of ${INCLUDE_CODE_HELPER_NAME} helper.`);
                }  else {
                    try {
                        const generator = this.getGeneratorForFile(arg1);
                        const generationResult = await this.generateCode(arg1, generator);
                        
                        if(generationResult.exitCode !== 0) {
                            reject(generationResult.errorMessage);
                        } else {                            
                            const codeHtml = this.generateScriptHtml(generationResult.generatedContent);
                            resolve(codeHtml);
                        }
                    }
                    catch(e) {
                        reject(e.message);
                    }
                }
            });
        });
    }

    private generateScriptHtml(coe: string): string {
        return `<script>${coe}</script>`;
    }

    private async generateCode(filename: string, generator: CodeGeneratorBase): Promise<CodeGenerationResult> {
        generator.setTempFileStorage(this.tempStorage);
        return await generator.generateCode(filename);
    }

    private getGeneratorForFile(filename: string): CodeGeneratorBase {
        const generatorConfig = CODE_GENERATOR_CONFIGURATION.find(
            config => config.extensions.find(ext => filename.endsWith(ext)) !== undefined
        );
        if(generatorConfig === undefined)
            throw new Error(`There is no registered code generator for file: ${filename}`);

        return Container.get(generatorConfig.generator);
    }
}
