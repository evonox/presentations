import TreeNode from "primereact/treenode";
import { IFile, IFolder } from "../../../helper/StorageInterfaces";

export type FileKind = "HBS" | "JS" | "VUE" | "CSS" | "SCSS" | "LESS" | "STYL";

export interface EntryNode extends TreeNode {
    inEditMode: boolean;
    isGhost?: boolean;
    isUpdating?: boolean;
    fileKind?: FileKind;
}

export type EntryNodeList = EntryNode[];

export interface GhostEntry {
    ghostNode: EntryNode;
    parentNodeId: null | number;
}


export class EntryNodeMapping {

    public static mapToEntryNodes(entries: (IFolder | IFile)[]): EntryNode[] {    
        return entries.map(entry => {
            if(this.isEntryFile(entry)) {
                return this.mapFileToTreeNode(entry as IFile);
            } else {
                return this.mapFolderToTreeNode(entry as IFolder);
            }
        });
    }   

    private static isEntryFile(entry: IFolder | IFile) {
        return entry["isBinary"] !== undefined;
    }
    
    private static mapFolderToTreeNode(entry: IFolder): EntryNode {
        return { 
            key: entry.id, 
            label: entry.name,
            data: entry,
            icon: "fa fa-folder",
            draggable: true,
            droppable: true, 
            expanded: false,
            leaf: false,
            inEditMode: false
        };   
    }
    
    private static mapFileToTreeNode(entry: IFile): EntryNode {
        return { 
            key: entry.id, 
            label: entry.name,
            data: entry, 
            icon: "fa fa-file", 
            leaf: true,
            draggable: true,
            droppable: false,
            inEditMode: false
        };   
    }
}



