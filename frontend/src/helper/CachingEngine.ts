import { IStorageCache, IStorageDataSource } from "./StorageInterfaces";


export class CachingEngine {

    constructor(private networkStorage: IStorageDataSource, private cache: IStorageCache) {}

    async cacheEntries(rootFolderId: number): Promise<void> {
        await this.cache.cleanDatabase();
        
        let queue: number[] = [rootFolderId];
        while(queue.length > 0) {
            const folderId = queue.shift();
            if(folderId === undefined)
                throw new Error("Cannot get folderId in CachingEngine.");

            const files = await this.networkStorage.queryFiles(folderId);
            await this.cache.storeFileList(folderId, files);

            const childFolders = await this.networkStorage.queryFolders(folderId);
            await this.cache.storeFolderList(folderId, childFolders);

            const childFolderIds = childFolders.map(f => f.id);
            queue = queue.concat(childFolderIds);
        }
    }
}