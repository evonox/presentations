import React, { useEffect, useState } from "react";
import CodeEditor5 from "../../../components/ide/CodeEditor5";
import VueComponentPreview from "./VueComponentPreview";

import "./VueCodeEditor.scss";

export interface VueCodeEditorProps {
    value: string;
    componentName: string;
    onChange: (value: string) => void;
}

function makeInitialTemplate(componentName: string) {
    return `<${componentName}>\n</${componentName}>`
}

const VueCodeEditor = (props: VueCodeEditorProps) => {

    const [template, setTemplate] = useState("");

    const handleCodeChanged = (code: string) => {
        props.onChange(code);
    }

    useEffect(() => {
        const template = makeInitialTemplate(props.componentName);
        setTemplate(template);
    }, [props.componentName]);

    return (
        <div className="VueCodeEditor">
            <CodeEditor5 value={props.value} onChange={handleCodeChanged} mode="vue" />
            <div className="VueCodeEditor-Preview">
                <VueComponentPreview 
                    template={template} 
                    componentName={props.componentName} 
                    componentCode={props.value} 
                />
                <CodeEditor5 value={template} onChange={value => setTemplate(value)} mode="vue" />
            </div>
        </div>
    )

}

export default VueCodeEditor;


