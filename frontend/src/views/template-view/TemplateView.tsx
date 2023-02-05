import React, { useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";
import { createTemplate, deleteTemplate, fetchTemplates, renameTemplate, selectTemplates } from "./TemplateSlice";
import { Column } from "primereact/column";
import { showInputForm } from "../../AppSlice";
import { AppDispatch } from "../../Store";
import {confirmDialog } from "primereact/confirmdialog";
import { useNavigate } from "react-router-dom";

const ACTION_BUTTON_CLASSES = "p-button-sm p-button-link"

const TemplateView = () => {

    const dispatch: AppDispatch = useDispatch();
    const handleCreateTemplate = () => {
        dispatch(showInputForm({
            header: "Název nové šablony",
            initialValue: "",
            placeholder: "Zadejte název nové šablony...",
            acceptLabel: "Vytvořit",
            rejectLabel: "Storno",
            onAccept: (name) => dispatch(createTemplate(name.trim()))
        }));
    }

    const navigate = useNavigate();
    const handleOpenTemplate = (data: any) => {
        navigate("/sablona/" + data.id);
    }   

    const handleRenameTemplate = (data: any) => {
        dispatch(showInputForm({
            header: "Přejmenovat šablonu",
            initialValue: data.name,
            placeholder: "Zadejte nový název šablony...",
            acceptLabel: "Přejmenovat",
            rejectLabel: "Storno",
            onAccept: (name) => dispatch(renameTemplate({id: data.id, name }))
        }));
    }

    const handleDeleteTemplate = (id: number) => {
        confirmDialog({
            header: "Vymazat šablonu",
            message: "Opravdu chcete vymazat tuto šablonu?",
            acceptLabel: "Vymazat",
            rejectLabel: "Storno",
            accept: () => dispatch(deleteTemplate(id))
        })
    }

    useEffect(() => {
        dispatch(fetchTemplates());
    }, []);

    const header = (<Button label="Vytvořit novou šablonu" onClick={handleCreateTemplate} />)
    const actionColumnBody = (rowData) => (
        <>
            <Button 
                label="Otevřít šablonu" 
                className={ACTION_BUTTON_CLASSES} 
                onClick={() => handleOpenTemplate(rowData)}
            />
            <Button 
                label="Přejmenovat" 
                className={ACTION_BUTTON_CLASSES} 
                onClick={() => handleRenameTemplate(rowData)}
            />
            <Button 
                label="Vymazat" 
                className={ACTION_BUTTON_CLASSES} 
                onClick={() => handleDeleteTemplate(rowData.id)}
            />
        </>
    )

    const data = useSelector(selectTemplates);

    return (
        <DataTable 
            stripedRows
            value={data}
            header={header} 
            emptyMessage="Žádné šablony nenalezeny"
            scrollable
            scrollHeight="flex"
        >
            <Column field="name" header="Název šablony" style={{width: "auto"}} />
            <Column header="" body={actionColumnBody} style={{maxWidth: "max-content", minWidth: "min-content", justifyContent: "left"}} />
        </DataTable>
    );
}

export default TemplateView;
