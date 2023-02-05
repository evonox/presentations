import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from './Store';

export interface ValidationResult {
    status: boolean;
    message: string;
}

export interface ValidateValueFn {
    (value: string): Promise<ValidationResult>;
}

let onAcceptValueHandler: undefined | ((value: string) => void);
let onRejectValueHandler: undefined | (() => void);
let onValidateValueHandler: undefined | ValidateValueFn;
 

export const showInputForm = createAsyncThunk(
    'app/showInputValueForm',
    async (payload: InputValueFormOptions, thunkAPI) => {
        const { dispatch } = thunkAPI;
        
        onAcceptValueHandler = payload.onAccept;
        onRejectValueHandler = payload.onReject;
        onValidateValueHandler = payload.onValidate;
        delete payload.onAccept;
        delete payload.onReject;
        delete payload.onValidate;

        dispatch(updateInputFormOptions(payload));
        dispatch(validateInputFormValue(payload.initialValue));
        dispatch(updateInputFormVisibility(true));
    }
);

export const validateInputFormValue = createAsyncThunk(
    'app/validateInputFormValue',
    async (value: string, thunkAPI) => {
        const { dispatch } = thunkAPI;

        if(typeof onValidateValueHandler === "function") {
            dispatch(updateValidationResult(null));
            const result = await onValidateValueHandler(value);
            dispatch(updateValidationResult(result));
        } else {
            dispatch(updateValidationResult({status: true, message: ""}));            
        }
    }
)

export const triggerInputValueAccepted = createAsyncThunk(
    'app/triggerInputValueAccepted',
    async (value: string, thunkAPI) => {
        const { dispatch } = thunkAPI;
        dispatch(updateInputFormVisibility(false));

        const acceptHandler = onAcceptValueHandler;
        onAcceptValueHandler = undefined;
        onRejectValueHandler = undefined;
        onValidateValueHandler = undefined;

        if(typeof acceptHandler === "function") {
            acceptHandler(value);
        }
    }
);

export const triggerInputValueRejected = createAsyncThunk(
    'app/triggerInputValueRejected',
    async (payload: undefined, thunkAPI) => {
        const { dispatch } = thunkAPI;                
        dispatch(updateInputFormVisibility(false));

        const rejectHandler = onRejectValueHandler;
        onAcceptValueHandler = undefined;
        onRejectValueHandler = undefined;
        onValidateValueHandler = undefined;

        if(typeof rejectHandler === "function") {
            rejectHandler();
        }
    }
);

export interface InputValueFormOptions {
    header: string;
    placeholder?: string;
    acceptLabel: string;
    rejectLabel: string;
    initialValue: string;
    onAccept?: (value: string) => void;
    onReject?: () => void;
    onValidate?: ValidateValueFn;
}

export const selectInputFormVisibility = (state: RootState) => state.app.inputFormVisible;
export const selectInputFormOptions = (state: RootState) => state.app.inputFormOptions;

export const selectValidationState = (state: RootState) => {
    if(state.app.validationResult === null) {
        return null;
    } else {
        return state.app.validationResult.status;
    }
}

export const selectValidationMessage = (state: RootState) => {
    if(state.app.validationResult === null) {
        return "";
    } else {
        return state.app.validationResult.message;
    }
}

export interface AppState {
    inputFormVisible: boolean;
    inputFormOptions: InputValueFormOptions;
    validationResult: ValidationResult | null;
}

const initialState: AppState = {
    inputFormVisible: false,
    inputFormOptions: { header: "", acceptLabel: "Ok", rejectLabel: "Storno", initialValue: "" },
    validationResult: null
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        updateInputFormVisibility: (state, action) => {
            state.inputFormVisible = action.payload;
        },
        updateInputFormOptions: (state, action) => {
            state.inputFormOptions = action.payload;
        },
        updateValidationResult: (state, action) => {
            state.validationResult = action.payload;
        }
    },
  })
  
  export const { 
    updateInputFormVisibility,
    updateInputFormOptions,
    updateValidationResult
  } = appSlice.actions
  
  export default appSlice.reducer
  