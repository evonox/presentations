import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../Store';
import axios from "axios";
import _ from "lodash";
import { selectOpenedPresentationId } from '../../presentations/PresentationSlice';
import { getAudioFileCache } from './AudioFileCache';

const audioCache = getAudioFileCache();

export const fetchAudioFiles = createAsyncThunk(
    'audio/fetchAudioFiles',
    async (payload: undefined, thunkAPI) => {
        const { dispatch } = thunkAPI;

        const presentationId = selectOpenedPresentationId(thunkAPI.getState() as RootState);
        if(presentationId !== null) {
            dispatch(updateAudioLoadingState(true));
            try {
                const response = await axios.get(`/api/presentations/${presentationId}/sounds`);
                const data: IAudioAsset[] = response.data.map(audioFile => {
                    let contentUrl: string | null = null;
                    const blobContent = audioCache.getContent(audioFile.id);
                    if(blobContent !== null) {
                        contentUrl = URL.createObjectURL(blobContent);
                    }
                    return {
                        id: audioFile.id,
                        name: audioFile.name,
                        contentUrl: contentUrl
                    }
                });
                dispatch(updateAudioFiles(data));
            }
            finally {
                dispatch(updateAudioLoadingState(false));
            }
        }
    }
);

export const clearAudioState = createAsyncThunk(
    'audio/clearAudioState',
    async (payload: undefined, thunkAPI) => {
        const { dispatch } = thunkAPI;
        dispatch(updateAudioFiles([]));
    }
);

export const fetchAudioFileContent = createAsyncThunk(
    'audio/fetchAudioFileContent',
    async (assetId: number, thunkAPI) => {
        const { dispatch } = thunkAPI;
        const rootState = thunkAPI.getState() as RootState;
        
        const isAlreadyDownloadingFile = isDownloadingAudioFile(rootState);
        if(isAlreadyDownloadingFile)
            return;

        dispatch(updateAudioDownloadingState(true));
        try {
            const response = await axios.get(`/api/presentations/asset/${assetId}/download`, {responseType: "blob"});
            audioCache.appendContent(assetId, response.data);
            const audioContentURL = URL.createObjectURL(response.data);

            const data = _.cloneDeep(selectAudioFiles(rootState));            
            const audioFile = data.find(f => f.id === assetId);
            if(audioFile !== undefined) {
                audioFile.contentUrl = audioContentURL;
            }

            dispatch(updateAudioDownloadingState(false));
            dispatch(updateAudioFiles(data));
        }
        finally {
            dispatch(updateAudioDownloadingState(false));
        }        
    }
);

export const uploadAudioFile = createAsyncThunk(
    'audio/uploadAudioFile',
    async (payload: {name: string, content: Blob}, thunkAPI) => {
        const { dispatch } = thunkAPI;

        const presentationId = selectOpenedPresentationId(thunkAPI.getState() as RootState);
        if(presentationId !== null) {
            dispatch(updateAudioUploadingState(true));
            try {
                const formData = new FormData();
                formData.append("name", payload.name);
                formData.append("filename", payload.content);
                await axios.post(`/api/presentations/${presentationId}/sound/upload`, formData);
            }
            finally {
                dispatch(updateAudioUploadingState(false));
                dispatch(fetchAudioFiles());
            }
        }
    }
);

export const renameAudioFile = createAsyncThunk(
    'audio/renameAudioFile',
    async (payload: {assetId: number, name: string}, thunkAPI) => {
        const { dispatch } = thunkAPI;

        dispatch(updateAudioLoadingState(true));
        try  {
            await axios.put(`/api/presentations/asset/${payload.assetId}`, {name: payload.name});
        }
        finally {
            dispatch(updateAudioLoadingState(true));
            dispatch(fetchAudioFiles());
        }
    }
);

export const deleteAudioFile = createAsyncThunk(
    'audio/deleteAudioFile',
    async (assetId: number, thunkAPI) => {
        const { dispatch } = thunkAPI;
        
        dispatch(updateAudioLoadingState(true));
        try  {
            await axios.delete(`/api/presentations/asset/${assetId}`);
        }
        finally {
            dispatch(updateAudioLoadingState(true));
            dispatch(fetchAudioFiles());
        }
    }
);

export const selectAudioFiles = (state: RootState) => state.audio.audioAssets;
export const isLoadingAudioFiles = (state: RootState) => state.audio.isLoading;
export const isUploadingAudioFile = (state: RootState) => state.audio.isUploading;
export const isDownloadingAudioFile = (state: RootState) => state.audio.isDownloadingContent;
export const isAudioForegroundLoading = (state: RootState) => isLoadingAudioFiles(state) || isUploadingAudioFile(state);

export interface IAudioAsset {
    id: number;
    name: string;
    contentUrl: string | null;
}

export interface AudioState {
    audioAssets: IAudioAsset[];
    isLoading: boolean;
    isUploading: boolean;
    isDownloadingContent: boolean;
}

const initialState: AudioState = {
    audioAssets: [],
    isLoading: false,
    isUploading: false,
    isDownloadingContent: false
}

export const audioSlice = createSlice({
    name: 'audio',
    initialState,
    reducers: {
        updateAudioFiles: (state, action) => {
            state.audioAssets = action.payload;
        },
        updateAudioLoadingState: (state, action) => {
            state.isLoading = action.payload;
        },
        updateAudioUploadingState: (state, action) => {
            state.isUploading = action.payload;
        },
        updateAudioDownloadingState: (state, action) => {
            state.isDownloadingContent = action.payload;
        }
    }
});

export const { 
    updateAudioFiles,
    updateAudioDownloadingState,
    updateAudioLoadingState,
    updateAudioUploadingState
} = audioSlice.actions
  
export default audioSlice.reducer;
