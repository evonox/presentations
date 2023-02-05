import { Inject, Service } from "typedi";
import { StandardError, StandardOutput } from "./StreamedOutput";
import * as fs from "fs/promises";

@Service({transient: true})
export class TempFileStorage {

    @Inject(() => StandardOutput)
    private standardOutput: StandardOutput;

    @Inject(() => StandardError)
    private standardError: StandardError;

    private rootDir: string;

    private directoryStack: string[] = [];

    getRootDirectory() {
        return this.rootDir;
    }

    async initialize(rootDir: string): Promise<void> {
        try {
            await fs.access(rootDir);
            this.rootDir = rootDir;
            this.directoryStack = [];
            this.standardOutput.appendMessage(`Temporary file storage at ${rootDir} was initialized.`);
        }
        catch(e) {
            this.standardError.appendMessage(`Initialization of temp file storage failed. Path: ${rootDir}`);
            throw e;
        }
    }

    async createDirectory(name: string): Promise<void> {
        await fs.mkdir(`./${name}`);
        this.standardOutput.appendMessage(`Directory ${name} successfully created.`);
    }

    async existsDirectory(name: string): Promise<boolean>  {
        try {
            await fs.access(name);
            return true;
        }
        catch(e) {
            if(e.code === 'ENOENT') {
                return false;
            } else {
                throw e;
            }
        }        
    }

    async pushDirectory(name: string): Promise<void> {
        const workingDir = process.cwd();
        this.directoryStack.push(workingDir);
        process.chdir(`./${name}`);
        const currentWorkingDir = process.cwd();
        this.standardOutput.appendMessage(`Pushing directory and changing to ${currentWorkingDir}...`);
    }

    async popDirectory(): Promise<void> {
        if(this.directoryStack.length > 0) {
            const workingDir = this.directoryStack.pop();
            process.chdir(workingDir);
            this.standardOutput.appendMessage(`Restoring directory to ${workingDir}.`);
        } else {
            throw new Error("Cannot pop directory. Directory stack is empty.");
        }
    }

    async storeFile(name: string, content: string): Promise<void> {
        await fs.writeFile(`./${name}`, content);
        this.standardOutput.appendMessage(`Storing file ${name}...`);
    }

    async clearStorage(): Promise<void> {
        this.standardOutput.appendMessage(`Starting the clean process of temp storage at ${this.rootDir}`);
        process.chdir(this.rootDir);
        await fs.rm(`${this.rootDir}/*`, {recursive: true, force: true});
        this.directoryStack = [];
        this.standardOutput.appendMessage(`Clean process of temp storage at ${this.rootDir} successfully done.`);
    }
}
