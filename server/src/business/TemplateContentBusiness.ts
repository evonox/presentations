import { Transactional } from "../common/decorators";
import { checkResource } from "../common/exceptions";
import { File } from "../entity/File";
import { Folder } from "../entity/Folder";
import { Template } from "../entity/Template";
import { Service } from "typedi";

@Service()
export class TemplateContentBusiness {

    async getRootFolder(templateId: number) {
        const template = checkResource(await Template.findOneBy({id: templateId}));
        const rootFolder = checkResource(await template.rootFolder);
        return rootFolder;
    }

    async getChildFolders(folderId: number) {
        const folder = checkResource(await Folder.findOneBy({id: folderId}));
        const children = await folder.children;       
        children.forEach(child => {
            child.parentId = folderId;
        });
        return children;
    }

    async getFiles(folderId: number) {
        const folder = checkResource(await Folder.findOneBy({id: folderId}));
        const files = await folder.files;
        files.forEach(file => {
            file.parentId = folderId;
        });
        return files;
    }

    async getFolderById(folderId: number) {
        const folder = checkResource(await Folder.findOneBy({id: folderId}));
        const parentFolder = checkResource(await folder.parent);
        folder.parentId = parentFolder.id;
        return folder;
    }

    async getFileById(fileId: number) {
        const file = checkResource(await File.findOneBy({id: fileId}));
        const parentFolder = checkResource(await file.parent);
        file.parentId = parentFolder.id;
        return file;
    }

    @Transactional
    async createFolder(name: string, parentId: number) {
        const parent = checkResource(await Folder.findOneBy({id: parentId}));
        let folder = new Folder();
        folder.name = name;
        folder.parent = parent;
        folder = await folder.save();
        return folder.id;
    }

    async renameFolder(id: number, name: string) {
        const folder = checkResource(await Folder.findOneBy({id}));
        folder.name = name;
        await folder.save();
    }

    @Transactional
    async moveFolder(folderId: number, parentFolderId: number) {
        const folder = checkResource(await Folder.findOneBy({id: folderId}));
        const parentFolder = checkResource(await Folder.findOneBy({id: parentFolderId}));
        folder.parent = parentFolder;
        await folder.save();
    }

    @Transactional
    async deleteFolder(id: number) {
        const folder = checkResource(await Folder.findOneBy({id}));
        
        const childFolders = await this.getChildFolders(folder.id);
        for(const childFolder of childFolders) {
            await this.deleteFolder(childFolder.id);
        }

        const files = await this.getFiles(folder.id);
        for(const file of files) {
            await this.deleteFile(file.id);
        }

        await folder.remove();
    }

    @Transactional
    async createFile(name: string, isBinary: boolean, parentId: number) {
        const parent = checkResource(await Folder.findOneBy({id: parentId}));
        let file = new File();
        file.name = name;
        file.isBinary = isBinary;
        file.parent = parent;
        file = await file.save();
        return file.id;
    }

    async renameFile(id: number, name: string) {
        const file = checkResource(await File.findOneBy({id}));
        file.name = name;
        await file.save();
    }

    @Transactional
    async moveFile(id: number, folderId: number) {
        const file = checkResource(await File.findOneBy({id: id}));
        const parentFolder = checkResource(await Folder.findOneBy({id: folderId}));
        file.parent = parentFolder;
        await file.save();
    }

    async deleteFile(id: number) {
        const file = checkResource(await File.findOneBy({id}));
        await file.remove();
    }

    async getFileContent(id: number) {
        const file = checkResource(
            await File.createQueryBuilder().select().addSelect("File.textContent")
                .where({id: id}).getOne()
        );
        return file.textContent;
    }

    async updateFileContent(id: number, textContent: string) {
        const file = checkResource(await File.findOneBy({id}));
        file.textContent = textContent;
        await file.save();
    }

    async fetchBinaryContent(id: number) {
        const file = checkResource(
            await File.createQueryBuilder().select().addSelect("File.binaryContent")
                .where({id: id}).getOne()
        );
        return file.binaryContent;
    }

    async storeBinaryContent(id: number, buffer: Buffer) {
        const file = checkResource(await File.findOneBy({id}));
        file.binaryContent = buffer;
        await file.save();
    }
}
