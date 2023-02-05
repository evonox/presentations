import React from "react";

import "./AdaptHeight.scss";

export interface AdaptHeightProps {
    children: any;
}

const AdaptHeight = (props: AdaptHeightProps) => {

    return (
        <div className="AdaptHeight">
            <div className="AdaptHeight-Content">
                { props.children }
            </div>
        </div>
    );
}

export default AdaptHeight;
