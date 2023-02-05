import { Button } from "primereact/button";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectOpenedPresentationName } from "../presentations/PresentationSlice";

import "./AppHeader.scss";
import AppMenuBar from "./AppMenuBar";

const AppHeader = () => {

    const openedPresentationName = useSelector(selectOpenedPresentationName);

    const navigate = useNavigate();
    const handleLogoClick = () => {
        navigate("/");
    }

    return (
        <div className="AppHeader">
            <div className="AppHeader-Logo" onClick={handleLogoClick} >
                Prezentace ve 3D
            </div>           
            <AppMenuBar />

            { openedPresentationName && (
                <div className="AppHeader-PresentationName">
                    &laquo; { openedPresentationName } &raquo;
                </div>
            )}

            <div className="AppHeader-Separator" />
            <Button label="Generovat prezentaci" className="p-button-secondary AppHeader-GenerateButton" />

        </div>
    )

}

export default AppHeader;