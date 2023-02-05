import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CrudItemActions from "../../components/ide/CrudItemActions";
import DocumentListView from "../../components/ide/DocumentListView";
import { selectOpenedPresentationId } from "../../presentations/PresentationSlice";
import { AppDispatch, RootState } from "../../Store";
import { BlockUI } from 'primereact/blockui';

import "./ImageListView.scss";
import { deleteImage, fetchAllImages, previewImage, selectAllImages, selectIsImageUploaded, triggerRenameImage, uploadImage } from "./ImagesSlice";

const ImageListView = () => {

    const presentationId = useSelector(selectOpenedPresentationId);
    const images = useSelector(selectAllImages);
    const isUploading = useSelector(selectIsImageUploaded);
    
    const dispatch: AppDispatch = useDispatch();

    const handleImageUpload = () => {
        const domFileUpload = document.createElement("input");
        domFileUpload.type = "file";
        domFileUpload.multiple = false;
        domFileUpload.accept="image/*";
        domFileUpload.addEventListener("change", async (event) => {
            if(domFileUpload.files !== null) {
                const filename = domFileUpload.files[0].name;
                const content = await domFileUpload.files[0].arrayBuffer();
                const blob = new Blob([content]);
                dispatch(uploadImage({filename: filename, content: blob}));
            }
        });
        domFileUpload.click();
    }

    const handleImagePreview = (id: number) => {
        dispatch(previewImage(id));
    }

    const handleRenameImage = (id: number) => {
        dispatch(triggerRenameImage(id));
    }

    const handleDeleteImage = (id: number) => {
        confirmDialog({
            header: "Vymazat fotografii",
            message: "Opravdu chcete vymazat tuto fotografii?",
            acceptLabel: "Vymazat",
            acceptClassName: "p-button-danger",
            rejectLabel: "Storno",
            accept: () =>  dispatch(deleteImage(id))
        })    
    }

    useEffect(() => {
        if(presentationId !== null) {
            dispatch(fetchAllImages(presentationId))
        }
    }, [presentationId])

    const ImageListViewHeader = () => (
        <div className="ImageListView-Header">
            <Button 
                label="Nahrát fotografii" 
                className="p-button-secondary p-button-sm"
                onClick={handleImageUpload}
             />
        </div>
    )

    const itemTemplate = (imageDoc) => {
        return (
            <div className="ImageListView-Item" >
                <span>{ imageDoc.name }</span>
                <CrudItemActions 
                    onView={() => handleImagePreview(imageDoc.id)}
                    tooltipView="Zobrazit fotografii"
                    onEdit={() => handleRenameImage(imageDoc.id)}
                    tooltipEdit="Změnit název fotografie"
                    onDelete={() => handleDeleteImage(imageDoc.id)}
                    tooltipDelete="Vymazat fotografii"
                    tooltipOptions={{position: "left", showDelay: 1000, hideDelay: 300}}
                />
            </div>
        )
    }

    const loaderIcon = (<i className="fa fa-cog fa-5x fa-spin ImageListView-Loader"></i>)

    return (
        <BlockUI blocked={isUploading} template={loaderIcon} >
            <DocumentListView
                title="Seznam fotografií"
                header={() => (<ImageListViewHeader />)}
                documents={images}
                itemTemplate={itemTemplate}
            />
        </BlockUI>
    )
}

export default ImageListView;
