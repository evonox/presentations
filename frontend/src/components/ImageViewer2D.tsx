import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import Viewer from "viewerjs";
import "viewerjs/dist/viewer.css";
import ReactResizeDetector from 'react-resize-detector';
import EmptyImageView from "./EmptyImageView";
import _ from "lodash";

export interface ImageViewer2DProps {
    src: string | null;
}

const ImageViewer2D = (props: ImageViewer2DProps, ref: any) => {

    const refImageWrapper = useRef<HTMLImageElement>(null);
    const [imageViewer, setImageViewer] = useState<any>(null);

    // useImperativeHandle(ref, () => {
    //     return {
    //         updateSize: () => imageViewer?.prototype.resize()
    //     }
    // })

    const debouncedUpdateSize = _.debounce(() => {
        imageViewer?.resize();
    }, 250, {leading: false, trailing: true});

    useEffect(() => {
        if(props.src === null)
            return;
        if(refImageWrapper.current === null)
            return;

        const imageViewer = new Viewer(refImageWrapper.current, {
            inline: true,
            title: false
        });
        setImageViewer(imageViewer);

        const domImage = document.createElement("img");
        domImage.src = props.src;
        domImage.style.width = "100%";
        domImage.style.height = "auto";
        domImage.style.opacity = "0"
        refImageWrapper.current.appendChild(domImage);
        imageViewer?.update();

        // const imageViewer = new Viewer(domImage, {
        //     inline: true,
        //     title: false
        // });
        // setImageViewer(imageViewer);
        return () => {
            // setImageViewer(null);
            // imageViewer.destroy();
            domImage.remove();
            setImageViewer(null);
            imageViewer.destroy();
            if(refImageWrapper.current !== null) {
                refImageWrapper.current.innerHTML = "";
            }
            // if(refImageWrapper.current !== null) {


            //     refImageWrapper.current.innerHTML = "";
            // }
        }
    }, [props.src]);

    if(props.src === null) return (<EmptyImageView />);

    const handleSizeChange = () => {
        if(refImageWrapper.current === null)
            return;
        const containerWidth = refImageWrapper.current.clientWidth;
        const containerHeight = refImageWrapper.current.clientHeight;
        const domImageViewer = refImageWrapper.current.parentElement?.querySelector(".viewer-container") as HTMLElement;
        if(domImageViewer !== null && domImageViewer !== undefined) {
            const cssWidth = containerWidth.toFixed(3) + "px";
            const cssHeight = containerHeight.toFixed(3) + "px";
            domImageViewer.style.width = cssWidth;
            domImageViewer.style.height = cssHeight;
        }
        debouncedUpdateSize();
    }

    return (
        <ReactResizeDetector 
            handleWidth handleHeight 
            onResize={handleSizeChange} 
            targetRef={refImageWrapper}  
        >            
            <div ref={refImageWrapper} >
            </div>        
        </ReactResizeDetector>
    )
}

export default React.forwardRef(ImageViewer2D);
