import React from "react";

import "./EmptyImageView.scss";

const PLACEHOLDER_IMAGE = "/placeholder.webp";

const EmptyImageView = () => {

    return (
        <div className="EmptyImageView" style={{backgroundImage: `url(${PLACEHOLDER_IMAGE})`}} >            
        </div>
    )
}

export default EmptyImageView;