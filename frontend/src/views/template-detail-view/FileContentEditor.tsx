import _ from "lodash";
import React, { useEffect, useState } from "react";
import CodeEditor5 from "../../components/ide/CodeEditor5";
import { StorageDataSource } from "../../helper/StorageDataSource";
import { IFile } from "../../helper/StorageInterfaces";

import jsHint from "jshint";
import cssLint from "csslint";

global.JSHINT = jsHint.JSHINT;
global.CSSLint = cssLint.CSSLint;

const UPLOAD_FILE_DELAY = 3000;

const FILE_MODES = [
    {
        ext: ".hbs", 
        mode: {name: "handlebars", base: "text/html"},
        options: {}
    },
    {
        ext: ".js", 
        mode: "javascript",
        options: {
            lint: {options: {esversion: 2021}},            
            extraKeys: {"Ctrl-Q": "toggleComment"}
        }        
    },
    {
        ext: ".css", 
        mode: "css",
        options: {
            extraKeys: {"Ctrl-Space": "autocomplete"},
            lint: true
        }
    },
    {
        ext: ".scss", 
        mode: "text/x-scss",
        options: {
            extraKeys: {"Ctrl-Space": "autocomplete"}
        }
    },
    {
        ext: ".less", 
        mode: "text/x-less",
        options: {
            extraKeys: {"Ctrl-Space": "autocomplete"}
        }
    },
    {
        ext: ".styl", 
        mode: "text/x-styl",
        options: {
            extraKeys: {"Ctrl-Space": "autocomplete"}
        }
    }
]

function evaluateEditorMode(filename: string) {
    const editorMode = FILE_MODES.find(mode => filename.endsWith(mode.ext));
    return editorMode === undefined ? "text/plain" : editorMode.mode;
}

function evaluateEditorOptions(filename: string) {
    const editorMode = FILE_MODES.find(mode => filename.endsWith(mode.ext));
    return editorMode === undefined ? {} : editorMode.options;
}

const storage  = new StorageDataSource();

function updateContent(id: number, content: string) {
    storage.updateTextContent(id, content);
}

const debounceUpdateContent = _.debounce(updateContent, UPLOAD_FILE_DELAY, {trailing: true, leading: false});


export interface FileContentEditorProps {
    file: IFile;    
}

const FileContentEditor = (props: FileContentEditorProps) => {

    const [editorMode, setEditorMode] = useState<any>("text/plain");
    const [editorOptions, setEditorOptions] = useState<any>({});
    const [content, setContent] = useState<string | null>(null);

    useEffect(() => {
        const mode = evaluateEditorMode(props.file.name);
        setEditorMode(mode);
        const options = evaluateEditorOptions(props.file.name);
        setEditorOptions(options);

        storage.fetchTextContent(props.file.id).then(content => {
            setContent(content ?? "");
        });
    }, [props.file]);

    const handleContentChanged = (value: string) => {
        setContent(value);
        debounceUpdateContent(props.file.id, value);
    }

    useEffect(() => {
        return () => {
            debounceUpdateContent.flush();
        }
    }, [])

    return (
        <CodeEditor5 
            value={content ?? ""} 
            mode={editorMode}
            options={editorOptions} 
            onChange={handleContentChanged} 
        />
    )
}

export default FileContentEditor;
