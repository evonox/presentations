import { Service } from "typedi";
import { StyleGenerationResult, StyleGeneratorBase } from "./StyleGeneratorBase";

@Service()
export class CssStyleGenerator extends StyleGeneratorBase {

    private args: string[] = [
        "--use", "autoprefixer", 
        "--stringifier", "cssnano"
    ];

    public async generateStyle(inputFile: string): Promise<StyleGenerationResult> {
        return await super.invokeStyleGeneration(inputFile, this.args);
    }
}
