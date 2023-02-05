import React from "react";
import { useDispatch, useSelector } from "react-redux";
import DocumentView from "../../components/ide/DocumentView";
import { AppDispatch } from "../../Store";
import DocumentEditorSelector from "./DocumentEditorSelector";
import { closeDocument, selectActiveDocumentIndex, selectOpenedDocuments, setActiveDocument } from "./TemplateDocumentSlice";


const TemplateDocumentView = () => {

    const openedDocuments = useSelector(selectOpenedDocuments);
    const activeDocumentIndex = useSelector(selectActiveDocumentIndex) ?? 0;

    const dispatch: AppDispatch = useDispatch();
    const handleActiveDocumentChanged = (index: number) => {        
        const docId = openedDocuments[index]?.id;
        if(docId === undefined)
            return;
        dispatch(setActiveDocument(docId));
    }

    const handleDocumentClosed = (index: number) => {
        const docId = openedDocuments[index]?.id;
        if(docId === undefined)
            return;
        dispatch(closeDocument(docId));
    }

    return (
        <DocumentView 
            documents={openedDocuments} 
            activeIndex={activeDocumentIndex}  
            onChangeActiveDocument={handleActiveDocumentChanged}
            onCloseDocument={handleDocumentClosed}
            renderEditor={editorProps => {
                return (<DocumentEditorSelector file={editorProps.file} />)
            }}  
        />        
    )
}

export default TemplateDocumentView;
