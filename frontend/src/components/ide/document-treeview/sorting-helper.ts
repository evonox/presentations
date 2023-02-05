import { IFile, IFolder } from "../../../helper/StorageInterfaces";
import { EntryNodeHelper } from "./entry-node-helper";
import { EntryNodeList } from "./model-mapping";


export class SortingHelper {

    static sortEntryNodes(entries: EntryNodeList): EntryNodeList {
        let entryFolders = this.filterFolders(entries);
        let entryFiles = this.filterFiles(entries);
        entryFolders = this.sortEntryNodesByName(entryFolders);
        entryFiles = this.sortEntryNodesByName(entryFiles);
        return entryFolders.concat((entryFiles));
    }

    static sortEntries<T extends IFile | IFolder>(entries: T[]): T[] {
        return entries.sort((a, b) => {
            return this.compareNames(a.name, b.name);
        });
    }

    private static sortEntryNodesByName(entries: EntryNodeList): EntryNodeList {
        return entries.sort((a, b) => {
            return this.compareNames(a.label, b.label);
        });
    }

    private static filterFolders(entries: EntryNodeList): EntryNodeList {
        return entries.filter(entry => {
            return EntryNodeHelper.isFolder(entry);
        });
    }

    private static filterFiles(entries: EntryNodeList): EntryNodeList {
        return entries.filter(entry => {
            return ! EntryNodeHelper.isFolder(entry);
        });
    }

    private static compareNames(name1: string | undefined, name2: string | undefined): number {
        if(name1 === undefined) return -1;
        if(name2 === undefined) return 1;
        name1 = name1.toLocaleLowerCase();
        name2 = name2.toLocaleLowerCase();
        return name1.localeCompare(name2);
    }
}