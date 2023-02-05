import { MenuItem } from "primereact/menuitem";
import React, { useState } from "react";
import {Menubar} from "primereact/menubar";
import PresentationListForm, { PresentationFormVariant } from "../presentations/PresentationListForm";
import { useDispatch } from "react-redux";
import { showInputForm } from "../AppSlice";
import { AppDispatch } from "../Store";
import { createPresentation, triggerCreateNewPresentation } from "../presentations/PresentationSlice";
import { useNavigate } from "react-router-dom";

const AppMenuBar = () => {

    const [visiblePresentationForm, setPresentationFormVisibility] = useState(false);
    const [presentationFormVariant, setPresentationFormVariant] = useState<PresentationFormVariant>("Open");

    const dispatch: AppDispatch = useDispatch();
    const handleCreatePresentation = () => {
        dispatch(triggerCreateNewPresentation());
    }

    const handleOpenPresentation = () => {
        setPresentationFormVariant("Open");
        setPresentationFormVisibility(true);
    }

    const handleManagePresentation = () => {
        setPresentationFormVariant("Manage");
        setPresentationFormVisibility(true);
    }

    const MENU_MODEL: MenuItem[] = [
        {
            label: "Prezentace",
            items: [
                {label: "Nová prezentace", command: () => handleCreatePresentation()},
                {label: "Otevřít prezentaci", command: () => handleOpenPresentation()},
                {separator: true},
                {label: "Spravovat prezentace", command: () => handleManagePresentation()}
            ]
        }
    ]

    return (
        <div className="AppMenuBar">
            <Menubar model={MENU_MODEL}  />
            <PresentationListForm
                variant={presentationFormVariant}
                visible={visiblePresentationForm}
                onHide={() => setPresentationFormVisibility(false)}
            />                
        </div>
    );
}

export default AppMenuBar;
