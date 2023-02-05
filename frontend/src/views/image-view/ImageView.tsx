import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImageListView from "./ImageListView";
import { clearPreviewedImage, selectPreviewImage } from "./ImagesSlice";
import axios from "axios";

import "./ImageView.scss";
import ImageViewer2D from "../../components/ImageViewer2D";
import { AppDispatch } from "../../Store";
import ImageViewSelector from "./ImageViewSelector";

const ImageView = () => {

    const imagePreviewId = useSelector(selectPreviewImage);
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        if(imagePreviewId === null) {
            setImageSrc(null);
        } else {
            axios.get(`/api/presentations/asset/${imagePreviewId}/download`, {responseType: "blob"}).then((response) => {
                const blob = new Blob([response.data]);
                const url = URL.createObjectURL(blob);
                setImageSrc(url);
            });   
        }
    }, [imagePreviewId]);

    useEffect(() => {
        dispatch(clearPreviewedImage());
        return () => {
            dispatch(clearPreviewedImage());
        }
    }, []);

    return (
        <div className="ImageView">
            <div style={{display: "grid"}}>
                <ImageViewSelector src={imageSrc} />
            </div>
            <ImageListView />
        </div>
    )
}

export default ImageView;