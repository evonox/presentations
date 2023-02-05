import React, { useState } from "react";
import { useEffect, useRef } from "react";

import "./CodeEditor5.scss";



export interface CodeEditorProps {
    value: string;
    onChange: (value: string) => void;
    mode: string;
    options?: any;
}

const CodeEditor5 = (props: CodeEditorProps) => {

    const refCodeEditor = useRef<HTMLDivElement>(null);
    const [editor, setEditor] = useState<any>(null);

    useEffect(() => {
        if(refCodeEditor.current === null)
            return;
        
        const domTextArea = refCodeEditor.current.querySelector("textarea");
        let editor = global.CodeMirror.fromTextArea(domTextArea, {
            lineNumbers: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            matchTags: true,
            autoCloseTags: true,
            continueComments: "Enter",
            gutters: ["CodeMirror-lint-markers"],
            
            mode: props.mode
        });

        editor.on("change", () => {
            const code = editor.getValue();
            props.onChange(code);
        }); 

        setEditor(editor);
        
        return () => {
            setEditor(null);
            editor.toTextArea();
        }
    }, []);

    useEffect(() => {
        const code = editor?.getValue();
        if(props.value !== code) {
            editor?.setValue(props.value);
        }
    }, [props.value]);

    useEffect(() => {
        editor?.setOption("mode", props.mode);
    }, [props.mode]);

    useEffect(() => {
        if(props.options !== null && typeof props.options === "object") {
            for(const optionName in props.options) {
                editor?.setOption(optionName, props.options[optionName]);
            }
        }
    }, [props.options])

    return (
        <div className="CodeEditor5-Wrapper">
            <div className="CodeEditor5" ref={refCodeEditor} >
                <textarea></textarea>
            </div>
        </div>
    );
}

export default CodeEditor5;
