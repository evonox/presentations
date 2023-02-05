import { Service } from "typedi";
import { StyleGenerationResult, StyleGeneratorBase } from "./StyleGeneratorBase";

@Service()
export class LessStyleGenerator extends StyleGeneratorBase {

    private args: string[] = [
        "--parser", "postcss-less", 
        "--use", "autoprefixer", 
        "--stringifier", "cssnano"
    ];

    public async generateStyle(inputFile: string): Promise<StyleGenerationResult> {
        return await super.invokeStyleGeneration(inputFile, this.args);
    }
}
