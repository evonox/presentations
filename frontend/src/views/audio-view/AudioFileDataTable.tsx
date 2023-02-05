import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../Store";
import AudioFilePlayer from "./AudioFilePlayer";
import { renameAudioFile, clearAudioState, fetchAudioFileContent, fetchAudioFiles, isAudioForegroundLoading, isDownloadingAudioFile, selectAudioFiles, deleteAudioFile } from "./AudioSlice";

import "./AudioFileDataTable.scss";
import { showInputForm } from "../../AppSlice";
import { confirmDialog } from "primereact/confirmdialog";
import AdaptHeight from "../../components/AdaptHeight";
import { getAudioFileCache } from "./AudioFileCache";

const ACTION_BUTTON_CLASSES = "p-button-sm p-button-link"

const audioCache = getAudioFileCache();

const AudioFileDataTable = () => {

    const isLoading = useSelector(isAudioForegroundLoading);
    const isAudioFileLoading = useSelector(isDownloadingAudioFile);
    const audioFiles = useSelector(selectAudioFiles);

    const dispatch: AppDispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchAudioFiles());
        return () => {
            dispatch(clearAudioState());
            audioCache.clear();
        }
    }, []);

    const handleRenameFile = (id: number, name: string) => {
        dispatch(showInputForm({
            header: "Přejmenovat audio soubor",
            placeholder: "Zadejte nový název souboru...",
            initialValue: name,
            acceptLabel: "Přejmenovat",
            rejectLabel: "Storno",
            onAccept: (value) =>dispatch(renameAudioFile({assetId: id, name: value}))
        }))
    }

    const handleDeleteFile = (id: number) => {
        confirmDialog({
            header: "Vymazat audio soubor",
            message: "Opravdu chcete vymazat tento audio soubor?",
            acceptLabel: "Vymazat",
            acceptClassName: "p-button-danger",
            rejectLabel: "Storno",
            accept: () => dispatch(deleteAudioFile(id))
        })    
    }

    const audioPlayerTemplate = (rowData) => {
        if(rowData.contentUrl === null) {
            setTimeout(() => {
                dispatch(fetchAudioFileContent(rowData.id));
            });
        }
        return (
            <AudioFilePlayer url={rowData.contentUrl} />
        )
    }

    const actionColumnTemplate = (rowData) => {
        return (
            <>
                <Button 
                    label="Přejmenovat soubor" 
                    className={ACTION_BUTTON_CLASSES} 
                    onClick={() => handleRenameFile(rowData.id, rowData.name)}
                />               
                <Button 
                    label="Vymazat soubor" 
                    className={ACTION_BUTTON_CLASSES} 
                    onClick={() => handleDeleteFile(rowData.id)}
                />               
            </>
        )
    }

    return (
        <AdaptHeight>
            <DataTable 
                dataKey="id"  
                loading={isLoading}
                value={audioFiles}
                scrollable
                scrollHeight="flex"
                emptyMessage="Žádné zvukové soubory nebyly nalezeny."
            >
                <Column field="name" header="Název souboru" style={{width: "auto"}} />
                <Column 
                    header="Audio přehrávač" 
                    body={(data) => audioPlayerTemplate(data)} 
                    style={{minWidth: "420px", maxWidth: "420px"}} 
                    className="AudioFileDataTable-AudioPlayerCell"
                />
                <Column header="" body={actionColumnTemplate} style={{maxWidth: "310px"}} />
            </DataTable>
        </AdaptHeight>
    )
}

export default AudioFileDataTable;
