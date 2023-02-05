import React from "react";
import NavigationButton from "./NavigationButton";

import "./NavigationSidebar.scss";

export interface NavigationItem {
    title: string;
    icon: string;
    url: string;
}

export type NavigationModel = NavigationItem[];

export interface NavigationSidebarProps {
    model: NavigationModel;
}

const NavigationSidebar = (props: NavigationSidebarProps) => {

    return (
        <div className="NavigationSidebar">
            { props.model.map(item => {
                return (
                    <NavigationButton 
                        key={item.title}
                        title={item.title}
                        icon={item.icon}
                        url={item.url}
                    />
                )
            })}
        </div>
    )

}

export default NavigationSidebar;
