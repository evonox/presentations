import { Service } from "typedi";
import { CodeGenerationResult, CodeGeneratorBase } from "./CodeGeneratorBase";

@Service()
export class JavascriptCodeGenerator extends CodeGeneratorBase {

    private args: string[] = [
        "--format", "iife"
    ];

    public async generateCode(inputFile: string): Promise<CodeGenerationResult> {
        return await super.invokeCodeGeneration(inputFile, this.args);        
    }
}
