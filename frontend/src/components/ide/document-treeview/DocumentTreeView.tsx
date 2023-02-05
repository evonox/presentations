import React, { useEffect, useRef } from "react";
import { Tree, TreeDragDropParams, TreeNodeDoubleClickParams, TreeSelectionKeys } from 'primereact/tree';

import "./DocumentTreeView.scss";
import { Panel } from "primereact/panel";
import DocumentTreeViewHeader from "./DocumentTreeViewHeader";
import EditableTreeItem from "./EditableTreeItem";
import _ from "lodash";
import AdaptHeight from "../../AdaptHeight";
import TreeNode from "primereact/treenode";
import { StorageDataSource } from "../../../helper/StorageDataSource";
import { useDispatch, useSelector } from "react-redux";
import { collapseFolder, expandFolder, handleAcceptLabelChange, handleRejectLabelChange, handleSelectNode, handleUnselectAll, initializeTreeViewAdapter, processMoveEntry, selectIsBlockingLoading, selectIsNonBlockingLoading, selectTreeNodes, selectTreeNodeSelection, setStorageDataSource, triggerFileUpload } from "./TreeViewSlice";
import { AppDispatch } from "../../../Store";
import { EntryNode } from "./model-mapping";
import TreeViewContextMenu from "./TreeViewContextMenu";
import { IFile } from "../../../helper/StorageInterfaces";

const storageDataSource = new StorageDataSource();

export interface DocumentTreeViewProps {
    rootFolderId: number;
    onOpenDocument?: (document: IFile) => void;
}

const DocumentTreeView = (props: DocumentTreeViewProps) => {

    const isBlockingLoading = useSelector(selectIsBlockingLoading);
    const isNonBlocingLoading = useSelector(selectIsNonBlockingLoading);
    const entryNodes = useSelector(selectTreeNodes);
    const selectedNodes = useSelector(selectTreeNodeSelection);

    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        if(props.rootFolderId <= 0)
            return;
        setStorageDataSource(storageDataSource);
        dispatch(initializeTreeViewAdapter(props.rootFolderId));      
    }, [props.rootFolderId]);
   
    const handleExpandFolder = (event) => {
        const entryNode = event.node as EntryNode;
        if(entryNode.isGhost === true) return;
        dispatch(expandFolder(entryNode.key as any));
    }

    const handleCollapseFolder = (event) => {
        const entryNode = event.node as EntryNode;
        if(entryNode.isGhost === true) return;
        dispatch(collapseFolder(entryNode.key as any));
    }

    const handleTreeNodeMove = async (event: TreeDragDropParams) => {
        if(event.dropNode === null)
            return;
        const draggedEntryId = event.dragNode.key as number;
        const droppedFolderId = event.dropNode.key as number;
        dispatch(processMoveEntry({entryId: draggedEntryId, targetParentId: droppedFolderId}))
    }


    /************************************************************/
    /* NODE SELECTION HANDLING                                */
    /************************************************************/
    
    const refContextMenu = useRef<any>(null);

    const isTreeNodeClicked = (event: React.MouseEvent) => {
        const domItem = (event.target as HTMLElement).closest(".p-treenode");
        return domItem !== null;
    }

    const handleNodeDoubleClick = (event: TreeNodeDoubleClickParams) => {
        const entryNode = event.node as EntryNode;
        if(entryNode.isGhost) return;
        if(entryNode.leaf === true) {
            if(typeof props.onOpenDocument === "function") {
                props.onOpenDocument(entryNode.data);
            }
        } else {
            if(entryNode.expanded === true) {
                dispatch(collapseFolder(entryNode.key as any));
            } else {
                dispatch(expandFolder(entryNode.key as any));
            }
        }
    }

    const handleSelectEntry = (entryId: TreeSelectionKeys) => {
        dispatch(handleSelectNode(entryId as any));
    }

    const handleUnselectNode = (event: React.MouseEvent) => {       
        if(isTreeNodeClicked(event) === false) {
            dispatch(handleUnselectAll());
        }
    }

    const handleShowContextMenu = (event: React.MouseEvent) => {
        if(isTreeNodeClicked(event) === false) {
            dispatch(handleUnselectAll());
        }
        refContextMenu.current.show(event)
    }

    /************************************************************/
    /* NODE TEMPLATE RENDERER                                   */
    /************************************************************/
   
    const nodeTemplate = (treeNode: TreeNode, options)  => {
        const entryNode = treeNode as EntryNode;
        const handleAcceptValue  = (name: string) => {
            dispatch(handleAcceptLabelChange(name));
        }

        const handleRejectValue = () => {
            dispatch(handleRejectLabelChange());
        }

        return (
            <EditableTreeItem 
                node={entryNode} 
                options={options} 
                onAcceptValue={handleAcceptValue}
                onRejectValue={handleRejectValue}
            />
        )
    }

    return (
        <div className="DocumentTreeView">
            <Panel header="Soubory šablony">
                <div className="DocumentTreeView-Content">
                    <DocumentTreeViewHeader loading={isNonBlocingLoading || isBlockingLoading} />
                    <div
                        className="DocumentTreeView-TreeWrapper"
                        onClick={handleUnselectNode}                         
                        onContextMenu={handleShowContextMenu}
                    >
                        <AdaptHeight>
                            <Tree
                                value={entryNodes} 
                                nodeTemplate={nodeTemplate}

                                loading={isBlockingLoading}
                                onExpand={handleExpandFolder} 
                                onCollapse={handleCollapseFolder}
                                onNodeDoubleClick={handleNodeDoubleClick}

                                selectionMode="single"                       
                                selectionKeys={selectedNodes as any}
                                onSelectionChange={e => handleSelectEntry(e.value)}
                                onContextMenuSelectionChange={e => handleSelectEntry(e.value)}

                                dragdropScope="Storage"
                                onDragDrop={e => handleTreeNodeMove(e)}
                                
                            />
                        </AdaptHeight>
                    </div>
                    <TreeViewContextMenu ref={refContextMenu} />
                </div>
            </Panel>
        </div>
    )
}

export default DocumentTreeView; 
