import { CachingEngine } from "./CachingEngine";
import { IndexedDbCache } from "./IndexedDbCache";
import { NetworkStorageDataSource } from "./NetworkDataSource";
import { IFile, IFolder, IStorageCache, IStorageDataSource } from "./StorageInterfaces";


export class StorageDataSource implements IStorageDataSource {

    private networkStorage: IStorageDataSource = new NetworkStorageDataSource();
    private cache: IStorageCache = new IndexedDbCache();

    async initialize(rootFolderId: number): Promise<void> {
        await this.cache.initialize();
        const cacheEngine = new CachingEngine(this.networkStorage, this.cache);
        await cacheEngine.cacheEntries(rootFolderId);
    }

    async getRootFolder(templateId: number) {
        return await this.networkStorage.getRootFolder(templateId);
    }

    async queryFolders(folderId: number): Promise<IFolder[]> {
        const entries = await this.cache.fetchFolderList(folderId);
        if(entries !== undefined) return entries;
        return await this.networkStorage.queryFolders(folderId);
    }

    async queryFiles(folderId: number): Promise<IFile[]> {
        const entries = await this.cache.fetchFileList(folderId);
        if(entries !== undefined) return entries;
        return await this.networkStorage.queryFiles(folderId);
    }

    async createFolder(name: string, parentId: number) {
        const folder = await this.networkStorage.createFolder(name, parentId);
        await this.refreshFolderList(folder.parentId);
        return folder;
    }

    async renameFolder(id: number, name: string) {
        const folder = await this.networkStorage.renameFolder(id, name);
        await this.refreshFolderList(folder.parentId);
        return folder;
    }

    async moveFolder(id: number, oldParentId: number, newParentId: number) {
        const folder = await this.networkStorage.moveFolder(id, oldParentId, newParentId);
        await this.refreshFolderList(oldParentId);
        await this.refreshFolderList(newParentId);
        return folder;
    }

    async deleteFolder(id: number) {
        const folder = await this.networkStorage.deleteFolder(id);
        await this.refreshFolderList(folder.parentId);
        return folder;
    }

    async createTextFile(name: string, parentId: number): Promise<IFile> {
        const file = await this.networkStorage.createTextFile(name, parentId);
        await this.refreshFileList(file.parentId);
        return file;
    }

    async createBinaryFile(name: string, parentId: number): Promise<IFile> {
        const file = await this.networkStorage.createBinaryFile(name, parentId);
        await this.refreshFileList(file.parentId);
        return file;
    }

    async renameFile(id: number, name: string): Promise<IFile> {
        const file = await this.networkStorage.renameFile(id, name);
        await this.refreshFileList(file.parentId);
        return file;
    }

    async moveFile(id: number, oldParentId: number, newParentId: number): Promise<IFile> {
        const file = await this.networkStorage.moveFile(id, oldParentId, newParentId);
        await this.refreshFileList(oldParentId);
        await this.refreshFileList(newParentId);
        return file;
    }

    async deleteFile(id: number): Promise<IFile> {
        const file = await this.networkStorage.deleteFile(id);
        await this.refreshFileList(file.parentId);
        return file;
    }

    async fetchTextContent(id: number): Promise<string> {
        return await this.networkStorage.fetchTextContent(id);
    }

    async updateTextContent(id: number, content: string): Promise<void> {
        await this.networkStorage.updateTextContent(id, content);
    }

    async fetchBinaryContent(id: number): Promise<Blob> {
        return await this.networkStorage.fetchBinaryContent(id);
    }

    async updateBinaryContent(id: number, blob: Blob) {
        await this.networkStorage.updateBinaryContent(id, blob);
    }


    private async refreshFolderList(folderId: number): Promise<void> {
        const folders = await this.networkStorage.queryFolders(folderId);
        await this.cache.storeFolderList(folderId, folders);
    }

    private async refreshFileList(folderId: number): Promise<void> {
        const folders = await this.networkStorage.queryFiles(folderId);
        await this.cache.storeFileList(folderId, folders);
    }
}
