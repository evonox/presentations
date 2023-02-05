import React, { useEffect, useRef } from "react";
import AdaptHeight from "./AdaptHeight";
import EmptyImageView from "./EmptyImageView";

import "./ImageViewer360.scss";

function createMarzipano(container: HTMLElement, urlImage: string) {
    const viewer = new global.Marzipano.Viewer(container, {stage: {progressive: true}});

    const source = global.Marzipano.ImageUrlSource.fromString(
        urlImage    
    );

    // const geometry = new global.Marzipano.CubeGeometry([{ tileSize: 1024, size: 1024 }]);

    var geometry = new global.Marzipano.EquirectGeometry([{ width: 4000 }]);


    const limiter = global.Marzipano.RectilinearView.limit.traditional(4096, 100*Math.PI/180);
    const view = new global.Marzipano.RectilinearView(null, limiter);
    
    // Create scene.
    var scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true
    });

    // Display scene.
    scene.switchTo();      

    return viewer;
}

export interface ImageView360Props {
    src: string | null;
}

const ImageViewer360 = (props: ImageView360Props) => {

    const refContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(refContainer.current === null)
            return;
        if(props.src === null)
            return;

        const viewer = createMarzipano(refContainer.current, props.src);
        return () => {
            viewer.destroy();
        }
    }, [props.src]);

    if(props.src === null) return (<EmptyImageView />);

    return (        
        <AdaptHeight>
            <div className="ImageViewer360" ref={refContainer}>
            </div>
        </AdaptHeight>
    );

}

export default ImageViewer360;