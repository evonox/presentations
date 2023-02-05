import React from "react";
import { SelectButton } from 'primereact/selectbutton';

export type ImageViewKind =  "2D" | "360";


export interface ImageViewSwitchProps {
    value: ImageViewKind;
    onChange: (value: ImageViewKind) => void;
}

const OPTIONS: any[] = [
    { label: "2D", value: "2D"},
    { label: "360°", value: "360"}
]

const ImageViewSwitch = (props: ImageViewSwitchProps) => {

    return (
        <SelectButton 
            options={OPTIONS} 
            value={props.value} 
            onChange={e => props.onChange(e.value)} 
        />
    );
}

export default ImageViewSwitch;
