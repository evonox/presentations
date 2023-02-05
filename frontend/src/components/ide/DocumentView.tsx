import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import {TabView, TabPanel} from "primereact/tabview";
import ReactResizeDetector from 'react-resize-detector';

import "./DocumentView.scss"
import { IFile } from "../../helper/StorageInterfaces";

export interface RenderEditorProps {
    file: IFile;
}

export interface DocumentViewProps {
    documents: IFile[];
    activeIndex: number;
    onChangeActiveDocument: (documentIndex: number) => void;
    onCloseDocument: (documentIndex: number) => void;
    renderEditor: (props: RenderEditorProps) => React.ReactNode;        
}

const DocumentView = (props: DocumentViewProps) => {

    const refTabView = useRef<TabView>(null);

    useLayoutEffect(() => {
        refTabView.current?.reset();
    }, [props.documents]);

    const handleSizeChange = () => {
    }
   
    return (
        <div className="DocumentView">
            {/* <ReactResizeDetector handleWidth handleHeight onResize={handleSizeChange}  >             */}
                <TabView 
                    ref={refTabView}
                    activeIndex={props.activeIndex} 
                    scrollable
                    onTabChange={e => props.onChangeActiveDocument(e.index)}
                    onTabClose={e => props.onCloseDocument(e.index)}
                >
                    { props.documents.map(file  => {
                        return (
                            <TabPanel 
                                key={file.id} 
                                header={file.name}                             
                                closable
                            >
                                { props.renderEditor({file}) }        
                            </TabPanel>
                        )
                    })}
                </TabView>
            {/* </ReactResizeDetector> */}
        </div>
    )
}

export default DocumentView;
