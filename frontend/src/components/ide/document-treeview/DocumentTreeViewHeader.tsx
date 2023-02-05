import React from "react";
import { MegaMenu } from 'primereact/megamenu';

import "./DocumentTreeViewHeader.scss";
import { MenuItem } from "primereact/menuitem";
import { FileKind } from "./model-mapping";
import { AppDispatch } from "../../../Store";
import { useDispatch } from "react-redux";
import { triggerCreateNewFile, triggerFileUpload } from "./TreeViewSlice";

export interface DocumentTreeViewHeaderProps {
    loading?: boolean;
}

const DocumentTreeViewHeader = (props: DocumentTreeViewHeaderProps) => {

    const dispatch: AppDispatch = useDispatch();

    const handleCreateFile = (fileKind: FileKind) => {
        dispatch(triggerCreateNewFile(fileKind));
    }

    const handleUploadFile = () => {
        dispatch(triggerFileUpload());
    }

    const MENU_MODEL: MenuItem[] = [
        { 
            label: "Nový soubor", 
            icon: "fa fa-plus",
            items: [
                [
                    {
                        label: "Soubory šablon",
                        items: [
                            { label: "Šablona HBS", icon: "fa fa-code",
                                command: () => handleCreateFile("HBS")}
                        ]
                    },
                    {
                        label: "Programové soubory",
                        items: [
                            { label: "Soubor JavaScriptu", icon: "fa-brands fa-js",
                                command: () => handleCreateFile("JS")},
                            { label: "Komponenta Vue", icon: "fa-brands fa-vuejs",
                                command: () => handleCreateFile("VUE")}
    
                        ]
                    }
                ],
                [
                    {
                        label: "Soubory stylů",
                        items: [
                            { label: "Soubor CSS", icon: "fa-brands fa-css3",
                                command: () => handleCreateFile("CSS")},
                            { label: "Soubor SCSS", icon: "fa-brands fa-sass",
                                command: () => handleCreateFile("SCSS")},
                            { label: "Soubor LESS", icon: "fa-brands fa-less",
                                command: () => handleCreateFile('LESS')},
                            { label: "Soubor Stylus", icon: "fa-solid fa-s", 
                                command: () => handleCreateFile("STYL")},
    
                        ]
                    }
                ]
            ]
        },
        { label: "Nahrát soubor", icon: "fa fa-upload", command: () => handleUploadFile()},
    ]

    const LoadingCogTemplate = () => {
        return (
            <span className="DocumentTreeViewHeader-Loading">
                { props.loading && (
                    <i className="fa fa-cog fa-spin fa-2x" ></i>
                )}
            </span>
        );
    }
   
    return (
            <MegaMenu 
                model={MENU_MODEL } 
                end={(<LoadingCogTemplate />)}
            ></MegaMenu>
    );
}

export default DocumentTreeViewHeader;
