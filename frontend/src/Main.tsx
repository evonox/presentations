import React from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from 'react-router-dom';
import App from "./App";
import { selectOpenedPresentationId } from "./presentations/PresentationSlice";
import AudioView from "./views/audio-view/AudioView";
import CompositionView from "./views/composition-view/CompositionView";
import HomeView from "./views/home-view/HomeView";
import ImageView from "./views/image-view/ImageView";
import TemplateDetailView from "./views/template-detail-view/TemplateDetailView";
import TemplateView from "./views/template-view/TemplateView";

const Main = () => {

    const openedPresentationId = useSelector(selectOpenedPresentationId);

    return (
        <Routes>
            <Route path="*" element={<App />}>
                { 
                    openedPresentationId !== null && (
                        <>
                            <Route path="kompozice" element={(<CompositionView />)} />
                            <Route path="audio-soubory" element={<AudioView />} />
                            <Route path="fotografie" element={<ImageView />} />
                            <Route path="sablony" element={<TemplateView />} />
                            <Route path="sablona/:id" element={<TemplateDetailView />} />
                        </>
                    )}
                    <Route path="*" index element={<HomeView />} />
            </Route>
        </Routes>
    );
}

export default Main;