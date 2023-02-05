import React from "react";
import { Button } from "primereact/button";

import "./CrudItemActions.scss";
import TooltipOptions from "primereact/tooltip/tooltipoptions";

export interface CrudItemActionProps {
    hideView?: boolean;
    hideEdit?: boolean;
    hideDelete?: boolean;
    tooltipView?: string;
    tooltipEdit?: string;
    tooltipDelete?: string;
    tooltipOptions?: TooltipOptions;
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

const DEFAULT_CLASS_NAME = "p-button-secondary p-button-sm p-button-outlined CrudItemActions-Button";

const CrudItemActions = (props: CrudItemActionProps) => {

    return (
        <div className="CrudItemActions">
            { props.hideView !== true && (
                <Button 
                    className={DEFAULT_CLASS_NAME}
                    icon="fa fa-eye"
                    tooltip={props.tooltipView}
                    tooltipOptions={props.tooltipOptions}
                    onClick={props.onView}
                ></Button>
            )}
            { props.hideEdit !== true && (
                <Button 
                    className={DEFAULT_CLASS_NAME}
                    icon="fa fa-pencil"
                    tooltip={props.tooltipEdit}
                    tooltipOptions={props.tooltipOptions}
                    onClick={props.onEdit}
                ></Button>
            )}
            { props.hideDelete !== true && (
                <Button 
                    className={DEFAULT_CLASS_NAME}
                    icon="fa fa-trash"
                    tooltip={props.tooltipDelete}
                    tooltipOptions={props.tooltipOptions}
                    onClick={props.onDelete}
                ></Button>
            )}
        </div>
    );

}

export default CrudItemActions;
