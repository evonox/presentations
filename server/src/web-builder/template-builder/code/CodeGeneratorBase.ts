import { spawn } from "child_process";
import { Inject } from "typedi";
import { ROLLUP_CLI_COMMAND } from "../../common/Constants";
import { StandardError, StandardOutput } from "../../common/StreamedOutput";
import { TempFileStorage } from "../../common/TempFileStorage";

export interface CodeGenerationResult {
    exitCode: number;
    errorMessage?: string;
    generatedContent?: string;
}

export abstract class CodeGeneratorBase {

    @Inject(() => StandardOutput)
    private standardOutput: StandardOutput;

    @Inject(() => StandardError)
    private standardError: StandardError;

    private tempStorage: TempFileStorage;

    setTempFileStorage(tempStorage: TempFileStorage) {
        this.tempStorage = tempStorage;
    }

    public abstract generateCode(inputFile: string): Promise<CodeGenerationResult>;

    protected invokeCodeGeneration(inputFile: string, args: string[]): Promise<CodeGenerationResult> {
        return new Promise<CodeGenerationResult>((resolve, reject) => {
            if(this.tempStorage === undefined || this.tempStorage === null) {
                reject("CodeGeneratorBase does not have TempFileStorage set.");
                return;
            }

            const originalWorkingDir = process.cwd();
            process.chdir(this.tempStorage.getRootDirectory());

            this.standardOutput.appendMessage(`Trying to run Rollup on file: ${inputFile}`);
            
            const cliArgs = [inputFile].concat(args);
            const rollupProcess = spawn(ROLLUP_CLI_COMMAND, cliArgs);

            let generatedOutput = "";

            rollupProcess.on("spawn", () => {
                this.standardOutput.appendMessage("Rollup successfully started.");
            });

            rollupProcess.stdout.on("data", (chunk) => {
                generatedOutput = generatedOutput + chunk;
            });

            rollupProcess.stderr.on("data", (chunk) => {
                this.standardError.appendMessage(chunk);
            });

            rollupProcess.on("error", (err) => {
                process.chdir(originalWorkingDir);
                this.standardError.appendMessage(`Error running Rollup command: ${err.message}`);
                reject(err);
            });

            rollupProcess.on("exit", (code, signal) => {
                process.chdir(originalWorkingDir);
                let errorMessage = "";
                if(code === 0) {
                    this.standardOutput.appendMessage("The Javascript file was successfully generated.");
                } else {
                    this.standardError.appendMessage(`Rollup exited with error code: ${code}`);      
                    errorMessage = "Running Rollup failed.";
                }
                resolve({exitCode: code, generatedContent: generatedOutput, errorMessage: errorMessage});
            });
        });
    }
}
