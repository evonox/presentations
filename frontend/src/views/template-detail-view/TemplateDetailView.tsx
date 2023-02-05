import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import DocumentTreeView from "../../components/ide/document-treeview/DocumentTreeView";
import { StorageDataSource } from "../../helper/StorageDataSource";
import { IFile } from "../../helper/StorageInterfaces";
import { AppDispatch } from "../../Store";
import { Splitter, SplitterPanel } from 'primereact/splitter';

import "./TemplateDetailView.scss";
import { openDocument } from "./TemplateDocumentSlice";
import TemplateDocumentView from "./TemplateDocumentView";

const storageDataSource = new StorageDataSource();

const TemplateDetailView = () => {

    const { id } = useParams();
    const [rootFolderId, setRootFolderId] = useState<number>(0);

    useEffect(() => {
        if(id === undefined)
            return;
        const templateId = parseInt(id);
        storageDataSource.getRootFolder(templateId).then(folder => setRootFolderId(folder.id));
    }, [id]);

    const dispatch: AppDispatch = useDispatch();
    const handleOpenDocument = (file: IFile) => {
        dispatch(openDocument(file));
    }
    
    return (
        <div className="TemplateDetailView">
            <Splitter layout="horizontal" gutterSize={8} >
                <SplitterPanel size={60} minSize={40} >
                    <TemplateDocumentView />
                </SplitterPanel>
                <SplitterPanel size={40} minSize={20} >
                    <DocumentTreeView rootFolderId={rootFolderId} onOpenDocument={handleOpenDocument} />
                </SplitterPanel>
            </Splitter>            
        </div>
    );
}

export default TemplateDetailView;
