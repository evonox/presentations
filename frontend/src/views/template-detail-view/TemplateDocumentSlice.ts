import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { IFile } from '../../helper/StorageInterfaces';
import { RootState } from '../../Store';
import _ from "lodash";

export const setActiveDocument = createAsyncThunk(
    'templateDocs/setActiveDocument',
    async (docId: number, thunkAPI) => {
        const { dispatch } = thunkAPI;
        const { templateDocs } = thunkAPI.getState() as RootState;

        const existsDocument = templateDocs.openedDocuments.find(doc => doc.id === docId) !== undefined;
        if(existsDocument) {
            dispatch(updateActiveDocument(docId));
        }
    }
);

export const openDocument = createAsyncThunk(
    'templateDocs/openDocument',
    async (file: IFile, thunkAPI) => {
        const { dispatch } = thunkAPI;
        const { templateDocs } = thunkAPI.getState() as RootState;

        const existsDocument = templateDocs.openedDocuments.find(doc => doc.id === file.id) !== undefined;
        if(existsDocument) {
            dispatch(updateActiveDocument(file.id));
        } else {
            let docs = _.cloneDeep(templateDocs.openedDocuments);
            docs = docs.concat([file]);
            dispatch(updateOpenedDocuments(docs));
            dispatch(updateActiveDocument(file.id));
        }
    }
);

export const closeDocument = createAsyncThunk(
    'templateDocs/closeDocument',
    async (docId: number, thunkAPI) => {
        const { dispatch } = thunkAPI;
        const { templateDocs } = thunkAPI.getState() as RootState;

        const documentIndex = templateDocs.openedDocuments.findIndex(doc => doc.id === docId);
        if(documentIndex >= 0) {
            let docs = _.cloneDeep(templateDocs.openedDocuments);
            docs.splice(documentIndex, 1);
            dispatch(updateOpenedDocuments(docs));
            
            let newActiveIndex: number | null = documentIndex;
            if(newActiveIndex >= docs.length) {
                newActiveIndex = 0;
            }
            if(docs.length === 0) {
                newActiveIndex = null;
            }
            const newActiveDocumentId = newActiveIndex === null ? null : docs[newActiveIndex].id;
            dispatch(updateActiveDocument(newActiveDocumentId));
        }
    }
);

export const selectOpenedDocuments = (state: RootState) => state.templateDocs.openedDocuments;
export const selectActiveDocumentId = (state: RootState) => state.templateDocs.activeDocumentId;

export const selectActiveDocumentIndex = (state: RootState) => {
    const activeDocId = selectActiveDocumentId(state);
    if(activeDocId === null) {
        return null;
    } else {
        const index = selectOpenedDocuments(state).findIndex(doc => doc.id === activeDocId);
        return index < 0 ? null : index;
    }
}

export interface TemplateDocumentState {
    openedDocuments: IFile[];
    activeDocumentId: number | null;
}

const initialState: TemplateDocumentState = {
    openedDocuments: [],
    activeDocumentId: null
}

export const templateDocumentSlice = createSlice({
    name: 'templateDocs',
    initialState,
    reducers: {
        updateOpenedDocuments: (state, action) => {
            state.openedDocuments = action.payload;
        },
        updateActiveDocument: (state, action) => {
            state.activeDocumentId = action.payload;
        }
    },
})
  
export const { 
        updateActiveDocument,
        updateOpenedDocuments
} = templateDocumentSlice.actions
  
export default templateDocumentSlice.reducer
  