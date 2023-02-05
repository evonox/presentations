import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { selectInputFormOptions, selectInputFormVisibility, selectValidationMessage, selectValidationState, triggerInputValueAccepted, triggerInputValueRejected, validateInputFormValue } from "../AppSlice";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../Store";

import  "./InputValueForm.scss";

const InputValueForm = () => {

    const refInputTextWrapper = useRef<HTMLDivElement>(null);

    const visible = useSelector(selectInputFormVisibility);
    const options = useSelector(selectInputFormOptions);   
    const validationState = useSelector(selectValidationState);
    const validationMessage = useSelector(selectValidationMessage);    

    const [value, setValue] = useState<string>("");
    const [isValueValid, setValueValidFlag] = useState(false);

    const dispatch: AppDispatch = useDispatch();
    const handleAccept = () => {
        if(value.trim().length > 0 && isValueValid === true) {
            dispatch(triggerInputValueAccepted(value));
        }
    }

    const handleReject = () => {
        dispatch(triggerInputValueRejected());
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if(event.key === "Enter") {
            handleAccept();
        }
    }

    const handleOnCnange = (value: string) => {
        setValue(value);
        dispatch(validateInputFormValue(value));
    }

    useEffect(() => {
        setValue(options.initialValue ?? "");
    }, [options]);

    useEffect(() => {
        setValueValidFlag(validationState === true);
    }, [validationState])

    const handleOnShow = () => {
        const domInputText = refInputTextWrapper.current?.querySelector("input") as HTMLInputElement;
        domInputText?.select();
    }

    const footer = () => (
        <>
            <Button label={options?.rejectLabel} className="p-button-secondary" onClick={handleReject}  />
            <Button label={options?.acceptLabel} onClick={handleAccept}  />
        </>
    )

    return (
        <Dialog  
            style={{minWidth: "550px"}}
            header={options.header}
            visible={visible}
            onShow={handleOnShow}
            onHide={handleReject}
            footer={footer}
        >
            <div ref={refInputTextWrapper}>
                <InputText
                    autoFocus
                    placeholder={options.placeholder ?? "Zadejte název položky"}
                    value={value} 
                    onKeyDown={handleKeyDown}
                    onChange={e => handleOnCnange(e.target.value)} 
                    style={{width: "calc(100% - 20px)", margin: "10px"}}
                />
                <div className="InputValueForm-ValidationMessage">
                    <span>
                        { validationMessage }
                    </span>
                </div>
            </div>
        </Dialog>
    );
}

export default InputValueForm;
