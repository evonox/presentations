import { EntryNode, EntryNodeList } from "./model-mapping";

export class EntryNodeMerger {

    replaceEntryInTree(rootEntries: EntryNodeList, oldEntry: EntryNode, newEntry: EntryNode): EntryNodeList {
        rootEntries = [...rootEntries];
        if(this.existsEntryInList(oldEntry, rootEntries)) {
            const index = rootEntries.indexOf(oldEntry);
            rootEntries[index] = newEntry;
        } else {
            let queue = [...rootEntries];
            while(queue.length > 0) {
                const node = queue.shift();
                if(node === undefined)
                    throw new Error("Empty Queue Error");
                if(Array.isArray(node.children)) {
                    if(this.existsEntryInList(oldEntry, node.children as EntryNodeList)) {
                        const index = node.children.indexOf(oldEntry);
                        node.children[index] = newEntry;                        
                    }
                }
            }   
        }
        return rootEntries;
    }

    mergeEntryNodeLists(originalList: EntryNodeList, newList: EntryNodeList): EntryNodeList {
        let targetList = this.removeOldEntries(originalList, newList);
        targetList = this.appendNewEntries(targetList, newList);
        targetList = this.updateExistingEntries(targetList, newList);
        return targetList;
    }

    private appendNewEntries(originalList: EntryNodeList, newList: EntryNodeList) {
        originalList = [...originalList];
        for(let newEntry of newList) {
            const existsInOriginalList = this.existsEntryInList(newEntry, originalList);
            if(! existsInOriginalList) {
                originalList.push(newEntry);
            }
        }
        return originalList;
    }

    private updateExistingEntries(originalList: EntryNodeList, newList: EntryNodeList) {
        originalList = [...originalList];
        for(const oldEntry of originalList) {
            let newEntry = this.lookupEntryInList(oldEntry, newList);
            if(newEntry !== undefined) {
                newEntry.expanded = oldEntry.expanded;
                newEntry.children = oldEntry.children;
                const index = originalList.indexOf(oldEntry);
                originalList[index] = newEntry;

            }
        }
        return originalList;
    }

    private removeOldEntries(originalList: EntryNodeList, newList: EntryNodeList) {
        originalList = [...originalList];
        for(const oldEntry of originalList) {
            const existsInNewList = this.existsEntryInList(oldEntry, newList);
            if( ! existsInNewList ) {
                const index = originalList.indexOf(oldEntry);
                originalList.splice(index, 1);
            }
        }
        return originalList;
    }

    private existsEntryInList(lookuUpEntry: EntryNode, entryList: EntryNodeList) {
        return this.lookupEntryInList(lookuUpEntry, entryList) !== undefined;
    }

    private lookupEntryInList(lookuUpEntry: EntryNode, entryList: EntryNodeList): EntryNode | undefined {
        return entryList.find(entry => this.areEntriesEqual(entry, lookuUpEntry))
    }

    private areEntriesEqual(entry1: EntryNode, entry2: EntryNode) {
        return entry1.key === entry2.key && entry1.leaf === entry2.leaf;
    }
}
