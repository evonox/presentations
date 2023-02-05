import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../Store';
import axios from "axios";
import { showInputForm } from '../AppSlice';

export const fetchPresentations = createAsyncThunk(
    'presentations/fetchPresentations',
    async (payload: undefined, thunkAPI) => {
        const { dispatch } = thunkAPI;
        const response = await axios.get("/api/presentations");
        dispatch(updatePresentations(response.data));
    }
);

export const triggerCreateNewPresentation = createAsyncThunk(
    'presentations/triggerCreateNewPresentation',
    async (payload: undefined, thunkAPI) => {
        const { dispatch } = thunkAPI;

        dispatch(showInputForm({
            header: "Název nové prezentace",
            placeholder: "Zadejte název nové prezentace...",
            initialValue: "",
            acceptLabel: "Vytvořit",
            rejectLabel: "Storno",
            onAccept: (name) => {
                dispatch(createPresentation(name.trim()));
                window.location.hash="#/kompozice"
            }
        }));
    }
);

export const openPresentation = createAsyncThunk(
    'presentations/openPresentation',
    async (id: number, thunkAPI) => {
        const { dispatch } = thunkAPI;
        dispatch(updateOpenedPresentation(id));
    }
);

export const createPresentation = createAsyncThunk(
    'presentations/createPresentation',
    async (name: string, thunkAPI) => {
        const { dispatch } = thunkAPI;
        const response = await axios.post(`/api/presentations`, {name: name});
        dispatch(fetchPresentations());
        dispatch(openPresentation(response.data.id));
    }
);

export const renamePresentation = createAsyncThunk(
    'presentations/renamePresentation',
    async (payload: {id: number, name: string}, thunkAPI) => {
        const { dispatch } = thunkAPI;
        await axios.put(`/api/presentations/${payload.id}`, {name: payload.name});
        dispatch(fetchPresentations());
    }
);

export const deletePresentation = createAsyncThunk(
    'presentations/deletePresentation',
    async (id: number, thunkAPI) => {
        const { dispatch } = thunkAPI;
        await axios.delete(`/api/presentations/${id}`);
        dispatch(fetchPresentations());
    }
);


export const selectAllPresentations = (state: RootState) => state.presentations.presentations;
export const selectOpenedPresentationId = (state: RootState) => state.presentations.openedPresentationId;
export const selectOpenedPresentationName = (state: RootState) =>
    state.presentations.presentations.find(
        p => p.id === state.presentations.openedPresentationId
    )?.name;

export interface Presentation {
    id: number;
    name: string;
}

export interface PresentationState {
    presentations: Presentation[];
    openedPresentationId: number | null;
}

const initialState: PresentationState = {
    presentations: [],
    openedPresentationId: null
}

export const presentationSlice = createSlice({
    name: 'presentations',
    initialState,
    reducers: {
        updatePresentations: (state, action) => {
            state.presentations = action.payload;
        },
        updateOpenedPresentation: (state, action) => {
            state.openedPresentationId = action.payload;
        }
    },
  })
  
  export const { 
    updateOpenedPresentation,
    updatePresentations
  } = presentationSlice.actions
  
  export default presentationSlice.reducer
  