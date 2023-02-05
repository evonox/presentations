import React from "react";
import AudioViewHeader from "./AudioViewHeader";

import "./AudioView.scss";
import AudioFileDataTable from "./AudioFileDataTable";

const AudioView = () => {

    return (
        <div className="AudioView">
            <AudioViewHeader />
            <AudioFileDataTable />
        </div>
    );
}

export default AudioView;
