import React, { useImperativeHandle, useRef } from "react";
import { ContextMenu } from "primereact/contextmenu";
import { MenuItem } from "primereact/menuitem";
import { FileKind } from "./model-mapping";
import { AppDispatch } from "../../../Store";
import { useDispatch, useSelector } from "react-redux";
import { isSelectedFolderInTreeView, isTreeViewSelectionEmpty, triggerCreateNewFile, triggerCreateNewFolder, triggerDeleteEntry, triggerFileUpload, triggerRenameEntry } from "./TreeViewSlice";

const TreeViewContextMenu = (props: any, ref: any) => {

    const refContextMenu = useRef<ContextMenu>(null);

    useImperativeHandle(ref, () => {
        return {
            show: (event: React.MouseEvent) => refContextMenu.current?.show(event)
        }
    });

    const isFolderSelected = useSelector(isSelectedFolderInTreeView);
    //const isFileSelected = useSelector(isSelectedFileInTreeView);
    const isNothingSelected = useSelector(isTreeViewSelectionEmpty);

    const dispatch: AppDispatch = useDispatch();

    const handleCreateNewFolder = () => {
        dispatch(triggerCreateNewFolder());
    }

    const handleCreateNewFile = (fileKind: FileKind) => {
        dispatch(triggerCreateNewFile(fileKind));
    }

    const handleUploadFile = () => {
        dispatch(triggerFileUpload());
    }

    const handleRenameEntry = () => {
        dispatch(triggerRenameEntry());
    }

    const handleDeleteEntry = () => {
        dispatch(triggerDeleteEntry());
    }

    const CONTEXT_MENU_MODEL: MenuItem[] = [
        {
            label: "Nová složka", icon: "fa fa-folder", 
            command: () => handleCreateNewFolder(),
            visible: isFolderSelected || isNothingSelected
        },
        {
            label: "Nový soubor",
            icon: "fa fa-file",
            visible: isFolderSelected || isNothingSelected,
            items: [
                {label: "Šablona HBS", icon: "fa fa-code", command: () => handleCreateNewFile("HBS") },
                {separator: true},
                {label: "Soubor JavaScriptu", icon: "fa-brands fa-js", command: () => handleCreateNewFile("JS") },
                {label: "Komponenta Vue", icon: "fa-brands fa-vuejs", command: () => handleCreateNewFile("VUE") },
                {separator: true},
                {label: "Soubor CSS", icon: "fa-brands fa-css3", command: () => handleCreateNewFile("CSS") },
                {separator: true},
                {label: "Soubor SCSS", icon: "fa-brands fa-sass", command: () => handleCreateNewFile("SCSS") },
                {label: "Soubor LESS", icon: "fa-brands fa-less", command: () => handleCreateNewFile("LESS") },
                {label: "Soubor Stylus", icon: "fa-solid fa-s", command: () => handleCreateNewFile("STYL") }
            ]
        },
        {
            separator: isFolderSelected || isNothingSelected, 
            visible: isFolderSelected || isNothingSelected
        },
        {
            label: "Nahrát soubor", icon: "fa fa-upload", 
            command: () => handleUploadFile(),
            visible: isFolderSelected || isNothingSelected
         },
        {
            separator: isFolderSelected, 
            visible: isFolderSelected
        },
        {
            label: "Přejmenovat", 
            icon: "fa fa-edit", 
            command: () => handleRenameEntry() , 
            visible: isNothingSelected === false 
        },
        {
            label: "Vymazat", 
            icon: "fa fa-trash", 
            command: () => handleDeleteEntry, 
            visible: isNothingSelected === false 
        }    
    ]

    return (
        <ContextMenu model={CONTEXT_MENU_MODEL} ref={refContextMenu} onHide={() => {}} />
    )
}

export default React.forwardRef(TreeViewContextMenu);
