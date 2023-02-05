import { Button } from "primereact/button";
import React from "react";
import { useDispatch } from "react-redux";
import { UploadHelper } from "../../components/ide/document-treeview/upload-helper";
import { AppDispatch } from "../../Store";
import { uploadAudioFile } from "./AudioSlice";

import "./AudioViewHeader.scss";

const AudioViewHeader = () => {

    const dispatch: AppDispatch = useDispatch();
    const handleAudioFileUpload = async () => {
        const uploadFile = await UploadHelper.triggerFileUpload("audio/*");
        if(uploadFile !== null) {
            dispatch(uploadAudioFile({
                name: uploadFile.filename, 
                content: uploadFile.content
            }));
        }
    }

    return (
        <div className="AudioViewHeader">
            <Button label="Nahrát audio soubor" onClick={handleAudioFileUpload} />
        </div>
    )

}

export default AudioViewHeader;