import { Service, Container, Inject } from "typedi";
import { TemplateContentBusiness } from "../../../business/TemplateContentBusiness";
import { CSS_FILES_EXTENSIONS } from "../../common/Constants";
import { StandardError, StandardOutput } from "../../common/StreamedOutput";
import { TempFileStorage } from "../../common/TempFileStorage";
import { ITemplateFile, ITemplateFolder, TemplateStorageCache } from "../../common/TemplateStorageCache";


@Service()
export class StyleStorageGenerator {

    @Inject(() => TemplateStorageCache)
    private storageCache: TemplateStorageCache;

    @Inject(() => TemplateContentBusiness)
    private templateContentBusiness: TemplateContentBusiness;

    @Inject(() => StandardOutput)
    private standardOutput: StandardOutput;

    @Inject(() => StandardError)
    private standardError: StandardError;

    private tempStorage: TempFileStorage;

    getTempFileStorage(): TempFileStorage {
        return this.tempStorage;
    }

    async generateStyleTempStorage(tempRootDir: string): Promise<void> {
        this.tempStorage = Container.get(TempFileStorage);
        await this.tempStorage.initialize(tempRootDir);

        const currentWorkingDir = process.cwd();
        try {
            await this.tempStorage.pushDirectory(tempRootDir);

            const rootFolder = this.storageCache.getRootFolder();
            await this.storeCssStyleFiles(rootFolder);

            for(const childFolder of rootFolder.childFolders) {
                await this.storeCssStylesInFolderRecursively(childFolder);
            }            

            await this.tempStorage.popDirectory();
        }
        catch(e) {
            this.standardError.appendMessage(`Error creating temp storage for CSS files: ${e.message}`);
            throw e;
        }
        finally {
            process.chdir(currentWorkingDir);
        }
    }

    private async storeCssStylesInFolderRecursively(folderEntry: ITemplateFolder) {
        if(await this.tempStorage.existsDirectory(folderEntry.name) === false) {
            await this.tempStorage.createDirectory(folderEntry.name);
        }
        await this.tempStorage.pushDirectory(folderEntry.name);
        await this.storeCssStyleFiles(folderEntry);

        for(const childFolder of folderEntry.childFolders) {
            await this.storeCssStylesInFolderRecursively(childFolder);
        }

        await this.tempStorage.popDirectory();
    }

    private async storeCssStyleFiles(folder: ITemplateFolder) {
        for(const fileEntry of folder.files) {
            if(this.isCssStyleFile(fileEntry)) {
                this.standardOutput.appendMessage(`Loading file ${fileEntry.name} from database.`);
                const content = await this.templateContentBusiness.getFileContent(fileEntry.id);
                await this.tempStorage.storeFile(fileEntry.name, content);
            }

        }
    }

    private isCssStyleFile(entryFile: ITemplateFile): boolean {
        const filename = entryFile.name.toLowerCase();
        return CSS_FILES_EXTENSIONS.find(ext => filename.endsWith(ext)) !== undefined;
    }
}
