import React, { useState } from "react";
import EmptyImageView from "../../components/EmptyImageView";
import ImageViewer2D from "../../components/ImageViewer2D";
import ImageViewer360 from "../../components/ImageViewer360";

import "./ImageViewSelector.scss";
import ImageViewSwitch, { ImageViewKind } from "./ImageViewSwitch";

export interface ImageViewSelectorProps {
    src: string | null;
}

const ImageViewSelector = (props: ImageViewSelectorProps) => {

    const [imageView, setImageView] = useState<ImageViewKind>("2D");

    if(props.src === null) {
        return (<EmptyImageView />);
    }

    return (
        <div className="ImageViewSelector">
            <ImageViewSwitch value={imageView} onChange={view => setImageView(view)} />
            <div style={{display: "grid"}}>
                { imageView === "2D" ? 
                    (<ImageViewer2D src={props.src} />) 
                    :
                    (<ImageViewer360 src={props.src} />)
                }
            </div>
        </div>
    );
}

export default ImageViewSelector;
