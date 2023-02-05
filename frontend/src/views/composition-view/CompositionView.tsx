import { Splitter, SplitterPanel } from "primereact/splitter";
import React from "react";
import CompositionHeader from "./CompositionHeader";

import "./CompositionView.scss";
import PresentationDiagram from "./PresentationDiagram";
import CompositionTemplateView from "./templates/CompositionTemplateView";

const CompositionView = () => {

    return (
        <div className="CompositionView">
            <Splitter layout="horizontal" gutterSize={6} >
                <SplitterPanel minSize={30} size={85}>
                    <div className="CompositionView-DiagramView">
                        <CompositionHeader />
                        <PresentationDiagram />
                    </div>
                </SplitterPanel>
                <SplitterPanel minSize={30} size={15}>
                    <CompositionTemplateView />
                </SplitterPanel>
            </Splitter>
        </div>
    );
}

export default CompositionView;