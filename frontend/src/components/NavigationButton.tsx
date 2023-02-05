import React from "react";
import { Link } from "react-router-dom";

import "./NavigationButton.scss";

export interface NavigationButtonProps {
    title: string;
    icon: string;
    url: string;
}

const NavigationButton = (props: NavigationButtonProps) => {

    return (
        <Link to={props.url} >
             <div className="NavigationButton" >
                <div className="NavigationButton-Icon">
                    <i className={props.icon} ></i>
                </div>
                <div className="NavigationButton-Title">
                    { props.title }
                </div>
            </div>   
         </Link>
    )
}

export default NavigationButton;
