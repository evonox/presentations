import React from "react";
import { IFile } from "../../helper/StorageInterfaces";
import FileContentEditor from "./FileContentEditor";
import ImageViewEditor from "./ImageViewEditor";
import VueCodeEditorWrapper from "./vue-code-editor/VueCodeEditorWrapper";

export interface DocumentEditorSelectorProps {
    file: IFile;
}

const IMAGE_EXTENSIONS = [".bmp", ".gif", ".png", ".jpg", ".jpeg", ".webp", ".tiff"];

function hasImageExtension(filename: string) {
    for(const extension of IMAGE_EXTENSIONS) {
        if(filename.endsWith(extension))
            return true;
    }
    return false;
}

const DocumentEditorSelector = (props: DocumentEditorSelectorProps) => {

    if(hasImageExtension(props.file.name)) {
        return (<ImageViewEditor file={props.file} />);
    } else if(props.file.name.endsWith(".vue")) {
        return (<VueCodeEditorWrapper file={props.file} />);
    } else {
        return (<FileContentEditor file={props.file} />);
    }
}

export default DocumentEditorSelector;
