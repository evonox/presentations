import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../Store';


const openDocument = createAsyncThunk(
    'documents/openDocument',
    async (filename: string, thunkAPI) => {
    }
);

const closeDocument = createAsyncThunk(
    'documents/closeDocument',
    async (filename: string, thunkAPI) => {
    }
);

const createEmptyDocument = createAsyncThunk(
    'documents/createEmptyDocument',
    async (filename: string, thunkAPI) => {
    }
);

const renameDocument = createAsyncThunk(
    'documents/renameDocument',
    async (filename: string, thunkAPI) => {
    }
);

const deleteDocument = createAsyncThunk(
    'documents/deleteDocument',
    async (filename: string, thunkAPI) => {
    }
);

const updateDocumentContent = createAsyncThunk(
    'documents/deleteDocument',
    async (payload: {filename: string, content: string}, thunkAPI) => {
    }
);

export const selectOpenedDocuments = (state: RootState) => state.documents.openedDocuments;
export const selectAllDocuments = (state: RootState) => 
        state.documents.documents.map(doc => doc.filename);
        
export const selectDocumentContent = (filename: string) => (state: RootState) => {
    return state.documents.documents.find(doc => doc.filename === filename)?.content;
}

interface DocumentInfo {
    filename: string;
    content: string;
}

export interface DocumentState {
    activeDomain: string;
    openedDocuments: string[];
    documents: DocumentInfo[];
}

const initialState: DocumentState = {
    activeDomain: "",
    openedDocuments: ["Document1.txt", "Document2.txt", "Document3.txt"],
    documents: [
        { filename: "Document1.txt", content: "Lorem ipsum 1" },
        { filename: "Document2.txt", content: "Lorem ipsum 2" },
        { filename: "Document3.txt", content: "Lorem ipsum 3" },
    ]
}

export const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
        setDocumentDomain: (state, action) => {
            state.activeDomain = action.payload;
        },
        setOpenedDocuments: (state, action) => {
            state.openedDocuments = action.payload;
        }
  },
})

export const { 
    setDocumentDomain,
    setOpenedDocuments
} = documentSlice.actions

export default documentSlice.reducer