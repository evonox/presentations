import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../Store';
import axios from "axios";

export const fetchTemplates = createAsyncThunk(
    'templates/fetchTemplates',
    async (payload: undefined, thunkAPI) => {
        const { dispatch } = thunkAPI;
        const response = await axios.get("/api/templates");
        dispatch(updateTemplates(response.data));
    }
);

export const createTemplate = createAsyncThunk(
    'templates/createTemplate',
    async (name: string, thunkAPI) => {
        const { dispatch } = thunkAPI;
        await axios.post("/api/templates", { name });
        dispatch(fetchTemplates());
    }
);

export const renameTemplate = createAsyncThunk(
    'templates/renameTemplate',
    async (payload: {id: number, name: string }, thunkAPI) => {
        const { dispatch } = thunkAPI;
        await axios.put("/api/templates/" + payload.id, { name: payload.name });
        dispatch(fetchTemplates());
    }
);

export const deleteTemplate = createAsyncThunk(
    'templates/deleteTemplate',
    async (id: number, thunkAPI) => {
        const { dispatch } = thunkAPI;
        await axios.delete("/api/templates/" +id);
        dispatch(fetchTemplates());
    }
);

export const selectTemplates = (state: RootState) => state.templates.templates;

interface TemplateInfo {
    id: number;
    name: string;
}

export interface TemplatesState {
    templates: TemplateInfo[];
}

const initialState: TemplatesState = {
    templates: []
}

export const templatesSlice = createSlice({
    name: 'templates',
    initialState,
    reducers: {
        updateTemplates: (state, action) => {
            state.templates = action.payload;
        }
    },
  })
  
  export const { 
    updateTemplates
  } = templatesSlice.actions
  
  export default templatesSlice.reducer
  