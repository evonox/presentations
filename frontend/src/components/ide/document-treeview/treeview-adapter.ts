import { IStorageDataSource } from "../../../helper/StorageInterfaces";
import { EntryNodeHelper } from "./entry-node-helper";
import { EntryNode, EntryNodeMapping, FileKind, GhostEntry } from "./model-mapping";
import { SortingHelper } from "./sorting-helper";
import * as _ from "lodash";

export class TreeViewAdapter {

    private rootEntries: EntryNode[] = [];
    private rootFolderId: number | null = null;

    constructor(private storageDataSource: IStorageDataSource) {}

    getState(): EntryNode[] {
        return _.cloneDeep(this.rootEntries);
    }

    getDataSource(): IStorageDataSource {
        return this.storageDataSource;
    }
    getRootFolderId(): number {
        if(this.rootFolderId === null)
            throw new Error("Root Folder ID is not set in the TreeViewAdapter.");
        return this.rootFolderId;
    }

    async initialize(rootFolderId: number): Promise<void> {
        this.rootFolderId = rootFolderId;
        await this.storageDataSource.initialize(rootFolderId);
    }

    async queryRootEntries(): Promise<void> {
        if(this.rootFolderId === null)
            return;
        const entries = await this.fetchEntries(this.rootFolderId);

        // Replace the root entries and reset existing node expansion
        this.rootEntries = entries;
    }

    async expandFolder(folderId: number): Promise<void> {
        const entries = await this.fetchEntries(folderId);
        this.rootEntries = EntryNodeHelper.replaceChildEntries(this.rootEntries, folderId, entries);
    }

    collapseFolder(folderId: number) {
        const folder = EntryNodeHelper.findEntryNodeById(this.rootEntries, folderId);
        if(folder !== undefined) {
            folder.expanded = false;
        }
    }

    async refreshFolderEntries(folderId: number | null): Promise<void> {
        const entries = await this.fetchEntries(folderId ?? this.getRootFolderId());
        this.rootEntries = EntryNodeHelper.substituteChildEntries(this.rootEntries, folderId, entries);
    }    

    isEntryNodeFolder(selectedKey: number): boolean {
        return EntryNodeHelper.isEntryNodeFolder(this.rootEntries, selectedKey);
    }

    getParentEntryId(entryId: number): number | null {
        return EntryNodeHelper.getParentEntryId(this.rootEntries, entryId);
    }

    createGhostFolder(parentId: number | null): GhostEntry {
        const ghostEntryNode: EntryNode = {
            icon: "fa fa-folder", 
            label: "", 
            key: "ghostFolder", 
            leaf: false,
            inEditMode: true,
            isGhost: true,
            isUpdating: false
        };
        const [rootEntries, ghostEntry] = EntryNodeHelper.attachGhostEntry(this.rootEntries, ghostEntryNode, parentId);
        this.rootEntries = [...rootEntries];
        return _.cloneDeep(ghostEntry);
    }

    createGhostFile(fileKind: FileKind, parentId: number | null): GhostEntry {
        const ghostEntryNode: EntryNode = {
            icon: "fa fa-file", 
            label: "", 
            key: "ghostFile", 
            leaf: true, 
            inEditMode: true,
            fileKind: fileKind,
            isGhost: true
        }
        const [rootEntries, ghostEntry] = EntryNodeHelper.attachGhostEntry(this.rootEntries, ghostEntryNode, parentId);
        this.rootEntries = rootEntries;
        return ghostEntry;
    }

    removeGhostEntry(ghostEntry: GhostEntry) {
        this.rootEntries = EntryNodeHelper.detachGhostEntry(this.rootEntries, ghostEntry);
        this.refreshRootItems();
    }

    turnEditModeOn(entryId: number) {
        const entryNode = EntryNodeHelper.findEntryNodeById(this.rootEntries, entryId);
        if(entryNode !== undefined) {
            entryNode.inEditMode = true;
            this.refreshRootItems();
        }
    }

    turnEditModeOff(entryId: number) {
        const entryNode = EntryNodeHelper.findEntryNodeById(this.rootEntries, entryId);
        if(entryNode !== undefined) {
            entryNode.inEditMode = false;
            this.refreshRootItems();
        }
    }

    turnUpdateFlagOn(entryId: number) {        
        const entryNode = EntryNodeHelper.findEntryNodeById(this.rootEntries, entryId);
        if(entryNode !== undefined) {            
            try {
                entryNode.isUpdating = true;
                this.refreshRootItems();   
            } catch(e) {
                console.dir(e);
            }
        }
    }

    turnUpdateFlagOff(entryId: number) {
        const entryNode = EntryNodeHelper.findEntryNodeById(this.rootEntries, entryId);
        if(entryNode !== undefined) {
            entryNode.isUpdating = false;
            this.refreshRootItems();
        }
    }

    private refreshRootItems() {
        this.rootEntries = [...this.rootEntries];
    }

    private async fetchEntries(parentId: number): Promise<EntryNode[]> {
        let folders = await this.storageDataSource.queryFolders(parentId);
        let files = await this.storageDataSource.queryFiles(parentId);
        folders = SortingHelper.sortEntries(folders);
        files = SortingHelper.sortEntries(files);
        const entries = folders.concat(files);
        const entryNodes = EntryNodeMapping.mapToEntryNodes(entries);
        return entryNodes;
    }
}
