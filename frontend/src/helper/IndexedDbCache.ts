import { IFile, IFolder, IStorageCache } from "./StorageInterfaces";

const DATABASE_NAME = "FileStorageCache";
const DATABASE_VERSION = 1;

const FOLDER_OBJECT_STORE =  "Folders";
const FILELIST_OBJECT_STORE = "Files";

export class IndexedDbCache implements IStorageCache {

    private db: IDBDatabase | null = null;

    initialize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const idb = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
        
            idb.addEventListener("upgradeneeded", async (change) => {
                if(change.oldVersion === 0) {
                    const db = idb.result;
                    await db.createObjectStore(FOLDER_OBJECT_STORE, {keyPath: "id"});
                    await db.createObjectStore(FILELIST_OBJECT_STORE, {keyPath: "id"});
                }            
            });
    
            idb.addEventListener("error", () => {
                reject("Error creating IndexedDB");
            });
    
            idb.addEventListener("success", () => {
                this.db = idb.result;
                resolve();
            });    
        });
    }

    async cleanDatabase(): Promise<void> {
        await this.cleanObjectStore(FOLDER_OBJECT_STORE);
        await this.cleanObjectStore(FILELIST_OBJECT_STORE);
    }

    private async cleanObjectStore(storeName: string): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            if(this.db === null)
                throw new Error("IndexedDB Cache is not initialized.");
            
            const transaction = await this.db.transaction(FOLDER_OBJECT_STORE, "readwrite");
            const request = transaction.objectStore(FOLDER_OBJECT_STORE).clear();

            request.addEventListener("success", () => {
                resolve();
            });
            request.addEventListener("error", () => {
                reject(`Error clearing object store ${storeName}`);
            });
        });
    }

    async containsFolderList(folderId: number): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            if(this.db === null)
                throw new Error("IndexedDB Cache is not initialized.");

            const transation = await this.db.transaction(FOLDER_OBJECT_STORE, "readonly");
            const request = transation.objectStore(FOLDER_OBJECT_STORE).get(folderId);

            request.addEventListener("success", () => {
                resolve(request.result !== undefined);
            });
            request.addEventListener("error", () => {
                reject("Error checking folder list from IndexedDB.");
            });
        });    
    }

    async fetchFolderList(folderId: number): Promise<IFolder[]> {
        return new Promise<IFolder[]>(async (resolve, reject) => {
            if(this.db === null)
                throw new Error("IndexedDB Cache is not initialized.");

            const transation = await this.db.transaction(FOLDER_OBJECT_STORE, "readonly");
            const request = transation.objectStore(FOLDER_OBJECT_STORE).get(folderId);

            request.addEventListener("success", (event) => {
                resolve(request.result?.data);
            });
            request.addEventListener("error", () => {
                reject("Error fetching folder list from IndexedDB.");
            });
        });
    }

    async storeFolderList(folderId: number, entries: IFolder[]): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            if(this.db === null)
                throw new Error("IndexedDB Cache is not initialized.");

            const record = {id: folderId, data: entries};
            const transation = await this.db.transaction(FOLDER_OBJECT_STORE, "readwrite");
            const request = transation.objectStore(FOLDER_OBJECT_STORE).put(record);

            request.addEventListener("success", () => {
                resolve();
            });
            request.addEventListener("error", () => {
                reject("Error storing folder list to IndexedDB.");
            });
        });
    }
    
    async containsFileList(folderId: number): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            if(this.db === null)
                throw new Error("IndexedDB Cache is not initialized.");

            const transation = await this.db.transaction(FILELIST_OBJECT_STORE, "readonly");
            const request = transation.objectStore(FILELIST_OBJECT_STORE).get(folderId);

            request.addEventListener("success", (event) => {
                resolve(request.result !== undefined);
            });
            request.addEventListener("error", () => {
                reject("Error checking file list from IndexedDB.");
            });
        });
    }

    async fetchFileList(folderId: number): Promise<IFile[]> {
        return new Promise<IFile[]>(async (resolve, reject) => {
            if(this.db === null)
                throw new Error("IndexedDB Cache is not initialized.");

            const transation = await this.db.transaction(FILELIST_OBJECT_STORE, "readonly");
            const request = transation.objectStore(FILELIST_OBJECT_STORE).get(folderId);

            request.addEventListener("success", (event) => {
                resolve(request.result?.data);
            });
            request.addEventListener("error", () => {
                reject("Error fetching file list from IndexedDB.");
            });
        });
    }

    async storeFileList(folderId: number, entries: IFile[]): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            if(this.db === null)
                throw new Error("IndexedDB Cache is not initialized.");

            const record = {id: folderId, data: entries};
            const transation = await this.db.transaction(FILELIST_OBJECT_STORE, "readwrite");
            const request = transation.objectStore(FILELIST_OBJECT_STORE).put(record);

            request.addEventListener("success", (event) => {
                resolve();
            });
            request.addEventListener("error", () => {
                reject("Error storing file list to IndexedDB.");
            });
        });
    }
}
