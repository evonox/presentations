import { spawn  } from "child_process";
import { Inject } from "typedi";
import { POST_CSS_CLI_COMMAND } from "../../common/Constants";
import { StandardError, StandardOutput } from "../../common/StreamedOutput";
import { TempFileStorage } from "../../common/TempFileStorage";

export interface StyleGenerationResult {
    exitCode: number;
    errorMessage?: string;
    generatedContent?: string;
}

export abstract class StyleGeneratorBase {

    @Inject(() => StandardOutput)
    private standardOutput: StandardOutput;

    @Inject(() => StandardError)
    private standardError: StandardError;

    private tempStorage: TempFileStorage;

    setTempFileStorage(tempStorage: TempFileStorage) {
        this.tempStorage = tempStorage;
    }

    public abstract generateStyle(inputFile: string): Promise<StyleGenerationResult>;

    protected invokeStyleGeneration(inputFile: string, args: string[]): Promise<StyleGenerationResult> {
        return new Promise<StyleGenerationResult>((resolve, reject) => {
            if(this.tempStorage === undefined || this.tempStorage === null) {
                reject("StyleGeneratorBase does not have TempFileStorage set.");
                return;
            }

            const originalWorkingDir = process.cwd();
            process.chdir(this.tempStorage.getRootDirectory());

            this.standardOutput.appendMessage(`Trying to run PostCSS on file: ${inputFile}`);
            
            const cliArgs = [inputFile].concat(args);
            const postCssProcess = spawn(POST_CSS_CLI_COMMAND, cliArgs);

            let generatedOutput = "";

            postCssProcess.on("spawn", () => {
                this.standardOutput.appendMessage("PostCSS successfully started.");
            });

            postCssProcess.stdout.on("data", (chunk) => {
                generatedOutput = generatedOutput + chunk;
            });

            postCssProcess.stderr.on("data", (chunk) => {
                this.standardError.appendMessage(chunk);
            });

            postCssProcess.on("error", (err) => {
                process.chdir(originalWorkingDir);
                this.standardError.appendMessage(`Error running PostCSS command: ${err.message}`);
                reject(err);
            });

            postCssProcess.on("exit", (code, signal) => {
                process.chdir(originalWorkingDir);
                let errorMessage = "";
                if(code === 0) {
                    this.standardOutput.appendMessage("The CSS file was successfully generated.");
                } else {
                    this.standardError.appendMessage(`PostCSS exited with error code: ${code}`);      
                    errorMessage = "Running PostCSS failed.";
                }
                resolve({exitCode: code, generatedContent: generatedOutput, errorMessage: errorMessage});
            });
        });
    }
}
