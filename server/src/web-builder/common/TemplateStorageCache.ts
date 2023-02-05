import { Inject, Service } from "typedi";
import { TemplateContentBusiness } from "../../business/TemplateContentBusiness";
import { File } from "../../entity/File";
import { Folder } from "../../entity/Folder";
import { StandardOutput } from "./StreamedOutput";

export interface ITemplateFile {
    id: number;
    name: string;
    isBinary: boolean;
}

export interface ITemplateFolder {
    id: number;
    name: string;
    childFolders: ITemplateFolder[];
    files: ITemplateFile[];
}

@Service()
export class TemplateStorageCache {

    @Inject(() => TemplateContentBusiness)
    private templateContentBusiness: TemplateContentBusiness;

    @Inject(() => StandardOutput)
    private standardOutput: StandardOutput;

    private templateRootFolder: ITemplateFolder;

    async fetchTemplateContent(templateId: number) {
        this.standardOutput.appendMessage("Loading template files from database...");

        const rootFolder = await this.templateContentBusiness.getRootFolder(templateId);
        this.templateRootFolder = this.mapTemplateFolder(rootFolder);
        await this.scanFolderEntries(rootFolder, this.templateRootFolder);

        this.standardOutput.appendMessage("Template files have been loaded.");
    }

    getRootFolder(): ITemplateFolder {
        return this.templateRootFolder;
    }

    searchFilesWithExtension(extension: string): ITemplateFile[] {
        const files = [];
        let queue = [this.templateRootFolder];
        while(queue.length > 0) {
            const folder = queue.shift();
            folder.files.forEach(file => {
                if(file.name.endsWith(extension)) {
                    files.push(file);
                }
            });
            queue = queue.concat(folder.childFolders);
        }
        return files;
    }

    private async scanFolderEntries(folder: Folder, templateFolder: ITemplateFolder) {
        const files = await this.templateContentBusiness.getFiles(folder.id);
        templateFolder.files = files.map(file => this.mapTemplateFile(file));
        
        const childFolders = await this.templateContentBusiness.getChildFolders(folder.id);
        templateFolder.childFolders = childFolders.map(childFolder => this.mapTemplateFolder(childFolder));

        for(let i = 0; i < childFolders.length; i++) {
            await this.scanFolderEntries(childFolders[i], templateFolder.childFolders[i]);
        }
    }

    private mapTemplateFolder(folder: Folder): ITemplateFolder {
        return {
            id: folder.id,
            name: folder.name,
            childFolders: [],
            files: []
        };
    }

    private mapTemplateFile(file: File): ITemplateFile {
        return {
            id: file.id,
            name: file.name,
            isBinary: file.isBinary
        }
    }
}
