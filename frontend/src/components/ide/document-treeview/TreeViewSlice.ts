import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { confirmDialog } from 'primereact/confirmdialog';
import { IStorageDataSource } from '../../../helper/StorageInterfaces';
import { RootState } from '../../../Store';
import { EntryNode, FileKind, GhostEntry } from './model-mapping';
import { NamingHelper } from './naming-helper';
import { TreeViewAdapter } from './treeview-adapter';
import { UploadHelper } from './upload-helper';

let treeViewAdapter: TreeViewAdapter | null = null;

 // Public API for working with the treeview the storage data source
//////////////////////////////////////////////////////////////////////////

export function setStorageDataSource(storageDataSource: IStorageDataSource) {
    treeViewAdapter = new  TreeViewAdapter(storageDataSource);
}

export const initializeTreeViewAdapter = createAsyncThunk(
    'treeview/initializeTreeViewAdapter',
    async (rootFolderId: number, thunkAPI) => {
        if(treeViewAdapter === null)
            throw new Error("TreeViewAdapter is not set.");

        const { dispatch } = thunkAPI;
        dispatch(setBackgroundLoading(true));
        try {
            await treeViewAdapter.initialize(rootFolderId);
            dispatch(fetchRootNodes());   
        }
        finally {
            dispatch(setBackgroundLoading(false));
        }
    }
);

export const fetchRootNodes = createAsyncThunk(
    'treeview/fetchRootNodes',
    async (payload: undefined, thunkAPI) => {
        if(treeViewAdapter === null)
            throw new Error("TreeViewAdapter is not set.");

        const { dispatch } = thunkAPI;
        dispatch(setBackgroundLoading(true))
        try {
            await treeViewAdapter.queryRootEntries();
            dispatch(updateTreeNodes(treeViewAdapter.getState()));   
        }
        finally {
            dispatch(setBackgroundLoading(false));
        }
    }
);

// TODO: CHECK
export const expandFolder = createAsyncThunk(
    'treeview/expandFolder',
    async (folderId: number, thunkAPI) => {
        if(treeViewAdapter === null)
            throw new Error("TreeViewAdapter is not set.");

        const { dispatch } = thunkAPI;
        await treeViewAdapter.expandFolder(folderId);
        dispatch(updateTreeNodes(treeViewAdapter.getState()));
    }
);

export const collapseFolder = createAsyncThunk(
    'treeview/collapseFolder',
    async (folderId: number, thunkAPI) => {
        if(treeViewAdapter === null)
            throw new Error("TreeViewAdapter is not set.");

        const { dispatch } = thunkAPI;
        await treeViewAdapter.collapseFolder(folderId);
        dispatch(updateTreeNodes(treeViewAdapter.getState()));
    }
);


// TODO: CHECK
export const triggerCreateNewFolder = createAsyncThunk(
    'treeview/triggerCreateNewFolder',
    async (payload: undefined, thunkAPI) => {
        if(treeViewAdapter === null)
            throw new Error("TreeViewAdapter is not set.");
        const { dispatch } = thunkAPI;

        const rootState = thunkAPI.getState() as RootState;
        const parentFolderId = getSelectedEntryId(rootState);

        if(parentFolderId !== null) {
            await treeViewAdapter.expandFolder(parentFolderId);
            dispatch(updateTreeNodes(treeViewAdapter.getState()));  
        }        
        const ghostEntry = treeViewAdapter.createGhostFolder(parentFolderId);

        dispatch(updateActiveGhostEntry(ghostEntry));
        dispatch(updateTreeNodes(treeViewAdapter.getState()));  
    }
);

// TODO: CHECK
export const triggerCreateNewFile = createAsyncThunk(
    'treeview/triggerCreateNewFile',
    async (fileKind: FileKind, thunkAPI) => {
        if(treeViewAdapter === null)
            throw new Error("TreeViewAdapter is not set.");

        const { dispatch } = thunkAPI;
        if(treeViewAdapter === null)
            return;

        const rootState = thunkAPI.getState() as RootState;
        const parentFolderId = getSelectedFolderId(rootState);
        if(parentFolderId === null || parentFolderId === undefined)
            return;

        if(parentFolderId !== treeViewAdapter.getRootFolderId()) {
            await treeViewAdapter.expandFolder(parentFolderId);
        }

        const ghostEntry = treeViewAdapter.createGhostFile(fileKind, parentFolderId);

        dispatch(updateActiveGhostEntry(ghostEntry));
        dispatch(updateTreeNodes(treeViewAdapter.getState()));
    }
);

// TODO: CHECK
export const triggerRenameEntry = createAsyncThunk(
    'treeview/triggerRenameEntry',
    async (payload: undefined, thunkAPI) => {
        if(treeViewAdapter === null)
            throw new Error("TreeViewAdapter is not set.");

        const { dispatch } = thunkAPI;
        if(treeViewAdapter === null)
            return;

        const rootState = thunkAPI.getState() as RootState;
        const selectedEntryId = getSelectedEntryId(rootState);
        if(selectedEntryId === null || selectedEntryId === undefined)
            return;

        treeViewAdapter.turnEditModeOn(selectedEntryId);
        dispatch(updateTreeNodes(treeViewAdapter.getState()));
    }
);

// TODO: CHECK
export const handleAcceptLabelChange = createAsyncThunk(
    'treeview/handleAcceptLabelChange',
    async (label: string, thunkAPI) => {
        if(treeViewAdapter === null)
            throw new Error("TreeViewAdapter is not set.");
        const { dispatch } = thunkAPI;

        const rootState = thunkAPI.getState() as RootState;
        const activeGhostEntry = selectActiveGhostEntry(rootState);

        if(activeGhostEntry !== null) {
            // treeViewAdapter.removeGhostEntry(activeGhostEntry);
            // dispatch(updateActiveGhostEntry(null));
            treeViewAdapter.turnUpdateFlagOn(activeGhostEntry.ghostNode.key as any);
            dispatch(updateTreeNodes(treeViewAdapter.getState()));
            console.log("OK");

            const dataSource = treeViewAdapter.getDataSource();
            const parentNodeId = activeGhostEntry.parentNodeId ?? treeViewAdapter.getRootFolderId();

            dispatch(setBackgroundLoading(true));
            try {
                if(activeGhostEntry.ghostNode.fileKind === undefined) {
                    label = NamingHelper.validateRegularName(label);
                    await dataSource.createFolder(label, parentNodeId);
                } else {
                    label = NamingHelper.validateFileName(label, activeGhostEntry.ghostNode.fileKind);
                    await dataSource.createTextFile(label, parentNodeId);
                }
                await treeViewAdapter.refreshFolderEntries(activeGhostEntry.parentNodeId);
            }
            finally {
                treeViewAdapter.removeGhostEntry(activeGhostEntry);
                dispatch(updateActiveGhostEntry(null));   
                dispatch(setBackgroundLoading(false));
            }

        } else {
            // TODO: RETURN NULL IF NOTHING IS SELECTED
            const selectedEntryId = getSelectedEntryId(rootState);
            if(selectedEntryId === null || selectedEntryId === undefined)
                return;
            treeViewAdapter.turnEditModeOff(selectedEntryId);

            const dataSource = treeViewAdapter.getDataSource();
            label = NamingHelper.validateRegularName(label);
            if(treeViewAdapter.isEntryNodeFolder(selectedEntryId)) {
                await dataSource.renameFolder(selectedEntryId, label);
            } else {
                await dataSource.renameFile(selectedEntryId, label);
            }

            const parentId = treeViewAdapter.getParentEntryId(selectedEntryId);
            await treeViewAdapter.refreshFolderEntries(parentId);
        }

        dispatch(updateTreeNodes(treeViewAdapter.getState()));
    }
);

// TODO: CHECK
export const handleRejectLabelChange = createAsyncThunk(
    'treeview/handleRejectLabelChange',
    async (payload: undefined, thunkAPI) => {
        if(treeViewAdapter === null)
            throw new Error("TreeViewAdapter is not set.");
        const { dispatch } = thunkAPI;

        const rootState = thunkAPI.getState() as RootState;
        const activeGhostEntry = selectActiveGhostEntry(rootState);

        if(activeGhostEntry !== null) {
            dispatch(updateActiveGhostEntry(null));
            treeViewAdapter.removeGhostEntry(activeGhostEntry);
        } else {
            const selectedEntryId = getSelectedEntryId(rootState);
            if(selectedEntryId === null || selectedEntryId === undefined)
                return;
            treeViewAdapter.turnEditModeOff(selectedEntryId);
        }

        dispatch(updateTreeNodes(treeViewAdapter.getState()));
    }
);

// TODO: CHECK
export const triggerFileUpload = createAsyncThunk(
    'treeview/triggerFileUpload',
    async (payload: undefined, thunkAPI) => {
        if(treeViewAdapter === null)
            throw new Error("TreeViewAdapter is not set.");
        const { dispatch } = thunkAPI;
        if(treeViewAdapter === null)
            return;

        const rootState = thunkAPI.getState() as RootState;
        const parentFolderId = getSelectedFolderId(rootState);
        if(parentFolderId === null || parentFolderId === undefined)
            return;

        const uploadFile = await UploadHelper.triggerFileUpload();
        if(uploadFile !== null) {
            const dataSource = treeViewAdapter.getDataSource();
            const file = await dataSource.createBinaryFile(uploadFile.filename, parentFolderId);
            await dataSource.updateBinaryContent(file.id, uploadFile.content);
            await treeViewAdapter.refreshFolderEntries(parentFolderId);
            dispatch(updateTreeNodes(treeViewAdapter.getState()));
        }
    }
);

// TODO: CHECK
export const processMoveEntry = createAsyncThunk(
    'treeview/processMoveEntry',
    async (payload: {entryId: number, targetParentId: number}, thunkAPI) => {
        if(treeViewAdapter === null)
            throw new Error("TreeViewAdapter is not set.");
        const { dispatch } = thunkAPI;
        if(treeViewAdapter === null)
            throw new Error("DataSource Adapter is not defined.");
        
        const entryId = payload.entryId;
        const oldParentId = treeViewAdapter.getParentEntryId(entryId) ?? treeViewAdapter.getRootFolderId();
        const newParentId = payload.targetParentId;

        const dataSource = treeViewAdapter.getDataSource();
        if(treeViewAdapter.isEntryNodeFolder(payload.entryId)) {
            await dataSource.moveFolder(entryId, oldParentId, newParentId);
        } else {
            await dataSource.moveFile(entryId, oldParentId, newParentId);
        }

        await treeViewAdapter.refreshFolderEntries(oldParentId);
        await treeViewAdapter.refreshFolderEntries(newParentId);
        dispatch(updateTreeNodes(treeViewAdapter.getState()));
    }
);

// TODO: CHECK
export const triggerDeleteEntry = createAsyncThunk(
    'treeview/triggerDeleteEntry',
    async (payload: undefined, thunkAPI) => {
        if(treeViewAdapter === null)
            throw new Error("TreeViewAdapter is not set.");
        const { dispatch } = thunkAPI;
        if(treeViewAdapter === null)
            throw new Error("DataSource Adapter is not defined.");

        const rootState = thunkAPI.getState() as RootState;
        const selectedEntryId = getSelectedEntryId(rootState);
        if(selectedEntryId === null)
            return;

        const isSelectedFolder = treeViewAdapter.isEntryNodeFolder(selectedEntryId);
        const parentId = treeViewAdapter.getParentEntryId(selectedEntryId);
        const dataSource = treeViewAdapter.getDataSource();

        const message = isSelectedFolder ? "Opravdu chcete vymazat tuto složku?"
            : "Opravdu chcete vymazat tento soubor?"
        confirmDialog({
            header: "Vymazat záznam",
            message: message,
            acceptLabel: "Vymazat",
            rejectLabel: "Storno",
            acceptClassName: "p-button-danger",
            accept: async () => {
                if(isSelectedFolder) {
                    await dataSource.deleteFolder(selectedEntryId);
                } else {
                    await dataSource.deleteFile(selectedEntryId);
                }
                await treeViewAdapter?.refreshFolderEntries(parentId);
                dispatch(updateTreeNodes(treeViewAdapter?.getState()));
            }
        });
    }
);

export const handleSelectNode = createAsyncThunk(
    'treeview/handleSelectNode',
    async (entryId: number, thunkAPI) => {
        const { dispatch } = thunkAPI;
        dispatch(updateTreeViewSelection(entryId));
    }
);

export const handleUnselectAll = createAsyncThunk(
    'treeview/handleUnselectAll',
    async (payload: undefined, thunkAPI) => {
        const { dispatch } = thunkAPI;
        dispatch(updateTreeViewSelection(null));
    }
);

 // State-Query Functions
//////////////////////////////////////////////////////////////////////

export const isSelectedFolderInTreeView = (state: RootState) => {
    if(treeViewAdapter === null) return false;
    const selectedKey = state.treeview.selectionKeys;
    if(selectedKey === null)
        return false;
    return treeViewAdapter.isEntryNodeFolder(selectedKey) === true;
}

export const isSelectedFileInTreeView = (state: RootState) => {
    if(treeViewAdapter === null) return false;
    const selectedKey = state.treeview.selectionKeys;
    if(selectedKey === null)
        return false;
    return treeViewAdapter.isEntryNodeFolder(selectedKey) === false;
}

export const isTreeViewSelectionEmpty = (state: RootState) => state.treeview.selectionKeys === null;
export const selectTreeNodeSelection = (state: RootState) => state.treeview.selectionKeys;

export const selectIsBlockingLoading = (state: RootState) => state.treeview.isForegroundLoading;
export const selectIsNonBlockingLoading = (state: RootState) => state.treeview.isBackgroundLoading;

export const selectTreeNodes = (state: RootState) => state.treeview.treeNodes;
export const selectActiveGhostEntry = (state: RootState) => state.treeview.activeGhostEntry;

export const getSelectedEntryId = (state: RootState) => {
    if(treeViewAdapter === null) return null;
    if(isTreeViewSelectionEmpty(state)) return null;
    const selectedKey = state.treeview.selectionKeys;
    return selectedKey;
}

export const getSelectedFolderId = (state: RootState) => {
    return getSelectedEntryId(state) ?? treeViewAdapter?.getRootFolderId();    
}

export interface TreeViewState {
    isForegroundLoading: boolean;
    isBackgroundLoading: boolean;
    treeNodes: EntryNode[];
    selectionKeys: number | null;
    activeGhostEntry: GhostEntry | null;
}

const initialState: TreeViewState = {
    isBackgroundLoading: false,
    isForegroundLoading: false,
    treeNodes: [],
    selectionKeys: null,
    activeGhostEntry: null
}

export const treeViewSlice = createSlice({
    name: 'treeview',
    initialState,
    reducers: {
        setForegroundLoading: (state, action) => {
            state.isForegroundLoading = action.payload;
        },
        setBackgroundLoading: (state, action) => {
            state.isBackgroundLoading = action.payload;
        },
        updateTreeNodes: (state, action) => {
            state.treeNodes = action.payload;
        },
        updateTreeViewSelection: (state, action) => {
            state.selectionKeys = action.payload;
        },
        updateActiveGhostEntry: (state, action) => {
            state.activeGhostEntry = action.payload;
        }
    },
})
  
export const { 
    setBackgroundLoading,
    setForegroundLoading,
    updateTreeViewSelection,
    updateTreeNodes,
    updateActiveGhostEntry
} = treeViewSlice.actions
  
export default treeViewSlice.reducer
  
