import { Service } from "typedi";
import { StyleGenerationResult, StyleGeneratorBase } from "./StyleGeneratorBase";

@Service()
export class StylusSyleGenerator extends StyleGeneratorBase {

    private args: string[] = [
        "--parser", "postcss-styl", 
        "--use", "autoprefixer", 
        "--stringifier", "cssnano"
    ];

    public async generateStyle(inputFile: string): Promise<StyleGenerationResult> {
        return await super.invokeStyleGeneration(inputFile, this.args);
    }
}
