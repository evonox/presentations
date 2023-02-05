import React, { useEffect, useState } from "react";
import { StorageDataSource } from "../../../helper/StorageDataSource";
import { IFile } from "../../../helper/StorageInterfaces";
import _ from "lodash";
import VueCodeEditor from "./VueCodeEditor";

const UPLOAD_FILE_DELAY = 5000;

const storage  = new StorageDataSource();

export interface VueCodeEditorWrapperProps {
    file: IFile;    
}

function deriveComponentName(file: IFile): string {    
    let filename = file.name;
    const firstDotIndex = filename.indexOf(".");
    if(firstDotIndex >= 0 ) {
        filename = filename.slice(0, firstDotIndex);
    }
    filename = filename.toLocaleLowerCase();
    return `vue-${filename}`;
}

function updateContent(id: number, content: string) {
    storage.updateTextContent(id, content);
}

const debounceUpdateContent = _.debounce(updateContent, UPLOAD_FILE_DELAY, {trailing: true, leading: false});

const VueCodeEditorWrapper = (props: VueCodeEditorWrapperProps) => {

    const [content, setContent] = useState<string | null>(null);
    const [componentName, setComponentName] = useState(deriveComponentName(props.file));

    useEffect(() => {
        storage.fetchTextContent(props.file.id).then(content => {
            setContent(content ?? "");
        });
    }, [props.file]);

    useEffect(() => {
        if(content !== null) {
            debounceUpdateContent(props.file.id, content);
        }
    }, [content, props.file]);

    useEffect(() => {
        return () => {
            debounceUpdateContent.flush();
        }
    }, [])

    return (
        <VueCodeEditor 
            componentName={componentName} 
            value={content ?? ""} 
            onChange={value => setContent(value)} 
        />
    );
}

export default VueCodeEditorWrapper;
