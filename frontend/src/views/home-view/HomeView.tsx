import React, { useEffect } from "react";
import { Card } from "primereact/card";

import "./HomeView.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchPresentations, openPresentation, selectAllPresentations, triggerCreateNewPresentation } from "../../presentations/PresentationSlice";
import { AppDispatch } from "../../Store";
import AdaptHeight from "../../components/AdaptHeight";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

const HomeView = () => {

    const presentations = useSelector(selectAllPresentations);

    const dispatch: AppDispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchPresentations());
    }, []);

    const navigate = useNavigate();
    const handleCreateNewPresentation = () => {
        dispatch(triggerCreateNewPresentation());
    }

    const handleOpenPresentation = (id: number) => {
        dispatch(openPresentation(id));
        navigate("kompozice");
    }

    const CardHeader = () => (
        <div className="CardHeader">
            <div className="p-card-title">
                Editor virtuálních prohlídek a 3D prezentací
            </div>
            <Button label="Vytvořit novou prezentaci" onClick={handleCreateNewPresentation} />
        </div>
    )

    return (
        <div className="HomeView">
            <div className="HomeView-Body">
                <Card 
                    header={(<CardHeader />)}
                    subTitle="Vyberte prezentaci, kterou chcete otevřít..."
                    className="HomeView-Card"
                >
                    <AdaptHeight>
                        <div className="HomeView-Presentations">
                            <ul>
                                { presentations.map(presentation => {
                                    return (
                                        <li key={presentation.id} onClick={() => {handleOpenPresentation(presentation.id)}} >
                                            { presentation.name }
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </AdaptHeight>
                </Card>
            </div>
        </div>
    );
}

export default HomeView;
