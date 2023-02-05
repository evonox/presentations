import { Button } from "primereact/button";
import React from "react";

import "./CompositionHeader.scss";

const CompositionHeader = () => {

    return (
        <div className="CompositionHeader">
            <Button label="Vložit novou 360° fotografii" />
        </div>
    )
}

export default CompositionHeader;