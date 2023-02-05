import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deletePresentation, fetchPresentations, openPresentation, renamePresentation, selectAllPresentations } from "./PresentationSlice";
import { Button } from "primereact/button";
import { AppDispatch } from "../Store";
import { showInputForm } from "../AppSlice";
import {confirmDialog } from "primereact/confirmdialog";

export type PresentationFormVariant = "Open" | "Manage";

export interface PresentationListFormProps {
    visible: boolean;
    onHide: () =>  void;
    variant: PresentationFormVariant;
}

const ACTION_BUTTON_CLASSES = "p-button-sm p-button-link"


const PresentationListForm = (props: PresentationListFormProps) => {

    const presentations = useSelector(selectAllPresentations);
    const dispatch: AppDispatch = useDispatch();


    const handleOpenPresentation = (rowData: any) => {
        dispatch(openPresentation(rowData.id));
        props.onHide();
    }

    const handleRenamePresentation = (rowData: any) => {
        dispatch(showInputForm({
            header: "Změnit název prezentace",
            initialValue: rowData.name,
            acceptLabel: "Přejmenovat",
            rejectLabel: "Storno",
            onAccept: (name) => dispatch(renamePresentation({id: rowData.id, name: name.trim()}))
        }));
    }

    const handleDeletePresentation = (rowData: any) => {
        confirmDialog({
            header: "Vymazat prezentaci",
            message: "Opravdu chcete vymazat tuto prezentaci?",
            acceptLabel: "Vymazat",
            rejectLabel: "Storno",
            accept: () => dispatch(deletePresentation(rowData.id))
        })    
    }

    const actionColumnTemplate = (rowData: any) => {
        if(props.variant === "Open") {
            return (
                <Button 
                    label="Otevřít prezentaci" 
                    className={ACTION_BUTTON_CLASSES} 
                    onClick={() => handleOpenPresentation(rowData)}
                />               
            );
        } else {
            return (
                <>
                    <Button 
                        label="Změnit název prezentace" 
                        className={ACTION_BUTTON_CLASSES} 
                        onClick={() => handleRenamePresentation(rowData)}
                    />               
                    <Button 
                        label="Vymazat prezentaci" 
                        className={ACTION_BUTTON_CLASSES} 
                        onClick={() => handleDeletePresentation(rowData)}
                    />               
                </>
            )
        }
    }

    const formFooter = (
        <Button label="Zavřít formulář" className="p-button-secondary" onClick={props.onHide} />
    )

    useEffect(() => {
        if(props.visible === true) {
            dispatch(fetchPresentations());
        }

    }, [props.visible])

    return (
        <Dialog 
                header="Seznam prezentací" 
                visible={props.visible} 
                onHide={props.onHide} 
                footer={formFooter}
                style={{minWidth: "900px"}}
        >
            <DataTable 
                dataKey="id"
                size="small"
                emptyMessage="Nebyly nalezeny žádné prezentace."
                value={presentations}                
                scrollable
                scrollHeight="flex"
                style={{minHeight: "300px", maxHeight: "400px"}}
            >
                <Column header="Název prezentace" field="name" style={{width: "auto"}} />
                <Column body={actionColumnTemplate} style={{maxWidth: "max-content"}} />
            </DataTable>

        </Dialog>
    )
}

export default PresentationListForm;
