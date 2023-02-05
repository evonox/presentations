import { EntryNodeMerger } from "./EntryNodeMerger";
import { EntryNode, EntryNodeList, GhostEntry } from "./model-mapping";
import { SortingHelper } from "./sorting-helper";

export class EntryNodeHelper {

    static substituteChildEntries(rootEntries: EntryNode[], folderId: number | null, childEntries : EntryNode[]): EntryNode[] {
        rootEntries = [...rootEntries];
        let targetCollection: EntryNode[] = [];
        let parentFolder: EntryNode | undefined =  undefined;

        if(folderId === null) {
            targetCollection = rootEntries;
        } else {
            parentFolder = this.findEntryNodeById(rootEntries, folderId);
            if(parentFolder === undefined)
                return rootEntries;
            parentFolder.expanded = true;
            targetCollection = parentFolder.children as EntryNode[] ?? [];
        }

        const merger = new EntryNodeMerger();
        targetCollection = merger.mergeEntryNodeLists(targetCollection, childEntries);
        targetCollection = SortingHelper.sortEntryNodes(targetCollection);

        if(parentFolder !== undefined) {
            parentFolder.children = targetCollection;
            return rootEntries;
        } else {
            return targetCollection;
        }
    }

    static replaceChildEntries(rootEntries: EntryNode[], folderId: number, childEntries : EntryNode[]): EntryNode[] {
        rootEntries = [...rootEntries];
        const oldEntry = this.findEntryNodeById(rootEntries, folderId);
        if(oldEntry === undefined)
            return rootEntries;
        const newEntry = {...oldEntry};
        newEntry.children = childEntries;
        newEntry.expanded = true;

        const merger = new EntryNodeMerger();
        rootEntries = merger.replaceEntryInTree(rootEntries, oldEntry, newEntry);
        return rootEntries;
    }

    static findEntryNodeById(rootEntries: EntryNode[], id: number) {
        let queue: EntryNode[] = [...rootEntries];
        while(queue.length > 0) {
            const node = queue.shift();
            if(node === undefined)
                return undefined;
            if(node.key === id)
                return node;
            if(Array.isArray(node.children)) {
                queue = queue.concat(node.children as EntryNode[]);
            }
        }
        return undefined;
    }

    static getParentEntryId(rootEntries: EntryNode[], entryId: number): number | null {
        const entryNode = this.findEntryNodeById(rootEntries, entryId);
        if(entryNode === undefined) return null;
        return entryNode.data?.parentId;
    }

    static attachGhostEntry(rootEntries: EntryNodeList, ghostEntryNode: EntryNode, parentId: number | null): [EntryNodeList, GhostEntry] {
        rootEntries = [...rootEntries];
        let ghostEntry: GhostEntry | null = null;
        if(parentId === null) {
            rootEntries.push(ghostEntryNode);
            ghostEntry = {ghostNode: ghostEntryNode, parentNodeId: null};
        } else {
            const parentNode = this.findEntryNodeById(rootEntries, parentId);
            if(parentNode === undefined) {
                rootEntries.push(ghostEntryNode);
                ghostEntry = {ghostNode: ghostEntryNode, parentNodeId: null};
            } else {
                parentNode.children?.push(ghostEntryNode);
                ghostEntry = {ghostNode: ghostEntryNode, parentNodeId: parentId};
            }
        }
        return [rootEntries, ghostEntry];
    }

    static detachGhostEntry(rootEntries: EntryNode[], ghostEntry: GhostEntry): EntryNode[] {
        rootEntries = [...rootEntries];
        let collection: EntryNode[] = [];
        if(ghostEntry.parentNodeId === null) {
            collection = rootEntries;
        } else {
            const parentNode = this.findEntryNodeById(rootEntries, ghostEntry.parentNodeId);
            if(parentNode === undefined)
                return rootEntries;
            collection = parentNode.children as EntryNode[];
        }

        const index = collection.indexOf(ghostEntry.ghostNode);
        if(index >= 0) {
            collection.splice(index, 1);
        }

        return rootEntries;
    }
   

    static isEntryNodeFolder(rootEntries: EntryNode[], entryId: number): boolean {
        const node = this.findEntryNodeById(rootEntries, entryId);
        if(node === undefined)
            return false;
        return this.isFolder(node);
    }

    static isFolder(entryNode: EntryNode): boolean {
        return entryNode?.leaf === false;
    }
}
