import React, { useEffect, useState } from "react";
import ImageViewer2D from "../../components/ImageViewer2D";
import { StorageDataSource } from "../../helper/StorageDataSource";
import { IFile } from "../../helper/StorageInterfaces";

const storageDataSource = new StorageDataSource();

export interface ImageViewEditorProps {
    file: IFile;
}

const ImageViewEditor = (props: ImageViewEditorProps) => {

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [currentFileId, setCurrentFileId] = useState<number | null>(null);

    useEffect(() => {
        if(props.file.id === currentFileId)
            return;
        setCurrentFileId(props.file.id);
        storageDataSource.fetchBinaryContent(props.file.id).then(contentBlob => {
            const url = URL.createObjectURL(contentBlob);
            setImageSrc(url);
        });
    }, [props.file])

    return (
        <div style={{display: "grid"}}>
            <ImageViewer2D src={imageSrc} />
        </div>
    )
}

export default ImageViewEditor;
