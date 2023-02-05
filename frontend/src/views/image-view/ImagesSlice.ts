import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../Store';
import axios from "axios";
import { selectOpenedPresentationId } from '../../presentations/PresentationSlice';
import { showInputForm } from '../../AppSlice';

// TODO: May be refactoring to Name Helper?
const isAssetNameUnique = (state: RootState, name: string) => {
    return state.images.images.find(img => img.name === name) === undefined;
}

export const checkIsAssetNameUnique = (name: string, ignoreName?: string) => (state: RootState) => {
    if(typeof ignoreName === "string") {
        if(name === ignoreName)
            return true;
    }
    return isAssetNameUnique(state, name);
}

const formatIndexedFileName = (name: string, index: number) => {
    const firstDotIndex = name.indexOf(".");
    const basename = firstDotIndex >= 0 ? name.slice(0, firstDotIndex) : name;
    const extension = firstDotIndex >= 0 ? name.slice(firstDotIndex) : "";
    return `${basename} (${index})${extension}`;
}

const generateUniqueAssetName = (state: RootState, name: string) => {
    let index = 1;
    let generatedName = name;
    while(isAssetNameUnique(state, generatedName) === false) {
        generatedName = formatIndexedFileName(name, index);
        index++;
    }
    return generatedName;
}

export const fetchAllImages = createAsyncThunk(
    'images/fetchAllImages',
    async (presentationId: number, thunkAPI) => {
        const { dispatch } = thunkAPI;
        const response = await axios.get(`/api/presentations/${presentationId}/images`);
        dispatch(updateImages(response.data));
    }
);

export const uploadImage = createAsyncThunk(
    'images/uploadImage',
    async (payload: {filename: string, content: Blob}, thunkAPI) => {
        const { dispatch } = thunkAPI;

        const rootState = thunkAPI.getState() as RootState;
        const presentationId = selectOpenedPresentationId(rootState);
        if(presentationId !== null) {

            dispatch(updateUploadingState(true));
            try {
                const filename = generateUniqueAssetName(rootState, payload.filename)
                const formData = new FormData();
                formData.append("name", filename);
                formData.append("filename", payload.content);
                await axios.post(`/api/presentations/${presentationId}/image/upload`, formData);
    
                dispatch(fetchAllImages(presentationId));    
            }
            finally {
                dispatch(updateUploadingState(false));
            }
        }
    }
);

export const previewImage = createAsyncThunk(
    'images/previewImage',
    async (imageId: number, thunkAPI) => {
        const { dispatch } = thunkAPI;
        dispatch(updatePreviewImage(imageId));
    }
); 

export const triggerRenameImage = createAsyncThunk(
    'images/triggerRenameImage',
    async (imageId: number, thunkAPI) => {
        const { dispatch } = thunkAPI;
        const rootState = thunkAPI.getState() as RootState;

        const imageAsset = selectImageById(imageId)(rootState);
        if(imageAsset !== undefined) {
            dispatch(showInputForm({
                header: "Změnit název fotografie",
                placeholder: "Zadejte nový název fotografie...",
                acceptLabel: "Přejmenovat",
                rejectLabel: "Storno",
                initialValue: imageAsset.name,
                onAccept: (name: string) =>  {
                    dispatch(renameImageFile({assetId: imageId, name }));
                },
                onValidate: async (value: string) => {
                    const result = checkIsAssetNameUnique(value, imageAsset.name)(rootState);
                    console.dir(result);
                    const message = result ? "" : "Fotografie se zadaným názvem již existuje.";
                    return {status: result, message};
                }
            }))

        }
    }
); 

export const renameImageFile = createAsyncThunk(
    'images/renameImageFile',
    async (payload: {assetId: number, name: string}, thunkAPI) => {
        const { dispatch } = thunkAPI;

        const rootState = thunkAPI.getState() as RootState;
        const presentationId = selectOpenedPresentationId(rootState);

        dispatch(updateUploadingState(true));
        try  {
            await axios.put(`/api/presentations/asset/${payload.assetId}`, {name: payload.name});
        }
        finally {
            dispatch(updateUploadingState(false));
            if(presentationId !== null) {
                dispatch(fetchAllImages(presentationId));
            }
        }
    }
);


export const clearPreviewedImage = createAsyncThunk(
    'images/clearPreviewedImage',
    async (payload: undefined, thunkAPI) => {
        const { dispatch } = thunkAPI;
        dispatch(updatePreviewImage(null));
    }
); 

export const deleteImage = createAsyncThunk(
    'images/deleteImage',
    async (imageId: number, thunkAPI) => {
        const { dispatch } = thunkAPI;
        await axios.delete(`/api/presentations/asset/${imageId}`);

        const rootState = thunkAPI.getState() as RootState
        const previewImageId = selectPreviewImage(rootState);
        if(previewImageId === imageId) {
            dispatch(clearPreviewedImage());
        }

        const presentationId = selectOpenedPresentationId(rootState);
        if(presentationId !== null) {
            dispatch(fetchAllImages(presentationId));
        }
    }
); 

export const selectAllImages = (state: RootState) => state.images.images;
export const selectPreviewImage = (state: RootState) => state.images.previewImageId;
export const selectIsImageUploaded = (state: RootState) => state.images.isUploading;

export const selectImageById = (imageId: number) => (state: RootState) => {
    return state.images.images.find(img => img.id === imageId);
}

export interface ImageRecord {
    id: number;
    name: string;
}

export interface ImagesState {
    images: ImageRecord[];
    previewImageId: number | null;
    isUploading: boolean;
}

const initialState: ImagesState = {
    images: [],
    previewImageId: null,
    isUploading: false

}

export const imagesSlice = createSlice({
    name: 'images',
    initialState,
    reducers: {
        updateImages: (state, action) => {
            state.images = action.payload;
        },
        updatePreviewImage: (state, action) => {
            state.previewImageId = action.payload;
        },
        updateUploadingState: (state, action) => {
            state.isUploading = action.payload;
        }
    },
  })
  
  export const { 
    updatePreviewImage,
    updateImages,
    updateUploadingState
  } = imagesSlice.actions
  
  export default imagesSlice.reducer
  