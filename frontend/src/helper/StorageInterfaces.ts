
export interface IFolder {
    id: number;
    name: string;
    parentId: number;
}

export interface IFile {
    id: number;
    name: string;
    isBinary: boolean;
    parentId: number;
}

export interface IStorageDataSource {
    getRootFolder(templateId: number): Promise<IFolder>;
    initialize(rootFolderId: number): Promise<void>;

    queryFolders(folderId: number): Promise<IFolder[]>;
    queryFiles(folderId: number): Promise<IFile[]>;

    createFolder(name: string, parentId: number): Promise<IFolder>;
    renameFolder(id: number, name: string): Promise<IFolder>;
    moveFolder(id: number, oldParentId: number, newParentId: number): Promise<IFolder>;
    deleteFolder(id: number): Promise<IFolder>;

    createTextFile(name: string, parentId: number): Promise<IFile>;
    createBinaryFile(name: string, parentId: number): Promise<IFile>;
    renameFile(id: number, name: string): Promise<IFile>;
    moveFile(id: number, oldParentId: number, newParentId: number): Promise<IFile>;    
    deleteFile(id: number): Promise<IFile>;

    fetchTextContent(id: number): Promise<string>;
    updateTextContent(id: number, content: string): Promise<void>;
    
    fetchBinaryContent(id: number): Promise<Blob>;
    updateBinaryContent(id: number, blob: Blob);
}

export interface IStorageCache {
    initialize(): Promise<void>;
    cleanDatabase(): Promise<void>;

    containsFolderList(folderId: number): Promise<boolean>;
    fetchFolderList(folderId: number): Promise<IFolder[]>;
    storeFolderList(folderId: number, entries: IFolder[]): Promise<void>;

    containsFileList(folderId: number): Promise<boolean>;
    fetchFileList(folderId: number): Promise<IFile[]>;
    storeFileList(folderId: number, entries: IFile[]): Promise<void>;
}
