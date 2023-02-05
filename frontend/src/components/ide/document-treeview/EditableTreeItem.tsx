import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";

import "./EditableTreeItem.scss";
import { EntryNode } from "./model-mapping";

export interface EditableTreeItemProps {
    node: EntryNode;
    options: any;
    onAcceptValue: (label: string) => void;
    onRejectValue: () => void;
}

const EditableTreeItem = (props: EditableTreeItemProps) => {

    const [value, setValue] = useState<string>("");

    useEffect(() => {
        if(props.node.inEditMode === true) {
            setValue(props.node.label ?? "");
        }
    }, [props.node.inEditMode])

    const handleTryAccept = () => {
        const name = value.trim();
        if(name.length === 0) {
            props.onRejectValue();
        } else {
            props.onAcceptValue(value.trim());
        }
    }

    const handleReject = () => {
        props.onRejectValue();
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if(event.key === "Enter") {
            handleTryAccept();
        } else if(event.key === "Escape") {
            handleReject();
        }
    }

    let classNameInputText = "EditableTreeItem-InputText";
    if(props.node.isUpdating === true) {
        classNameInputText += " EditableTreeItem-InputText-Updating";
    }

    return (
        <div className="EditableTreeItem">
            <div className="EditableTreeItem-Content">
            { props.node.inEditMode === false ? 
                (
                    <span className="EditableTreeItem-NodeLabel">
                        { props.node.label }
                    </span>
                ) : (
                    <div className={classNameInputText}>
                        <InputText
                            placeholder="Zadejte název složky nebo souboru..." 
                            autoFocus 
                            value={value} 
                            onChange={e => setValue(e.target.value)} 
                            onKeyDown={handleKeyDown}
                            onBlur={handleTryAccept}
                            readOnly={props.node.isUpdating === true}
                        />
                        { props.node.isUpdating && (
                            <div className="EditableTreeItem-Cog">
                                <i className="fa fa-cog fa-spin"></i>
                            </div>
                        )}
                    </div>
                )
            }                   
            </div>
        </div>
    );
}

export default EditableTreeItem;

