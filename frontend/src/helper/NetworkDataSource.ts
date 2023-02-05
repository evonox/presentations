import { IFile, IFolder, IStorageDataSource } from "./StorageInterfaces";
import { SynchNetworkService } from "./SynchNetworkService";

export class NetworkStorageDataSource implements IStorageDataSource {

    private synchNetService: SynchNetworkService = new SynchNetworkService();

    async initialize(rootFolderId: number): Promise<void> {}

    async getRootFolder(templateId: number): Promise<IFolder> {
        const response = await this.synchNetService.get(`/api/templates/${templateId}/root-folder`);
        return response.data;
    }

    async queryFolders(folderId: number): Promise<IFolder[]> {
        const response = await this.synchNetService.get(`/api/folder/${folderId}/folders`);
        return response.data;
    }

    async queryFiles(folderId: number): Promise<IFile[]> {
        const response = await this.synchNetService.get(`/api/folder/${folderId}/files`);
        return response.data;
    }

    async createFolder(name: string, parentId: number): Promise<IFolder> {
        const response = await this.synchNetService.post(`/api/folder`, {name, parentId});
        return response.data;
    }

    async renameFolder(id: number, name: string): Promise<IFolder> {
        const response = await this.synchNetService.put(`/api/folder/${id}`, {name});
        return response.data;
    }

    async moveFolder(id: number, oldParentId: number, newParentId: number): Promise<IFolder> {
        const response = await this.synchNetService.patch(`/api/folder/${id}`, {parentId: newParentId});
        return response.data;
    }

    async deleteFolder(id: number): Promise<IFolder> {
        const response = await this.synchNetService.delete(`/api/folder/${id}`);
        return response.data;
    }

    async createTextFile(name: string, parentId: number): Promise<IFile> {
        const response = await this.synchNetService.post(`/api/file`, { name, parentId, isBinary: false});
        return response.data;
    }

    async createBinaryFile(name: string, parentId: number): Promise<IFile> {
        const response = await this.synchNetService.post(`/api/file`, { name, parentId, isBinary: true});
        return response.data;
    }

    async renameFile(id: number, name: string): Promise<IFile> {
        const response = await this.synchNetService.put(`/api/file/${id}`, { name });
        return response.data;
    }

    async moveFile(id: number, oldParentId: number, newParentId: number): Promise<IFile> {
        const response = await this.synchNetService.patch(`/api/file/${id}`, { parentId: newParentId });
        return response.data;
    }

    async deleteFile(id: number): Promise<IFile> {
        const response = await this.synchNetService.delete(`/api/file/${id}`);
        return response.data;
    }

    async fetchTextContent(id: number): Promise<string> {
        const response = await this.synchNetService.get(`/api/file/${id}/text`);
        return response.data.content;
    }

    async updateTextContent(id: number, content: string): Promise<void> {
         await this.synchNetService.post(`/api/file/${id}/text`, {content});
    }

    async fetchBinaryContent(id: number): Promise<Blob> {
        const response = await this.synchNetService.get(`/api/file/${id}/binary`, "blob");
        return response.data;
    }

    async updateBinaryContent(id: number, blob: Blob) {
        const formData = new FormData();
        formData.append("filename", blob);
        await this.synchNetService.post(`/api/file/${id}/binary`, formData);
    }
}
