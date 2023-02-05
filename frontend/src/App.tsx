import React from 'react';
import { Outlet } from 'react-router-dom';
import './App.scss';

import NavigationSidebar, { NavigationModel } from './components/NavigationSidebar';
import InputValueForm from './forms/InputValueForm';
import {ConfirmDialog } from "primereact/confirmdialog";
import AppHeader from './components/AppHeader';

const NAVIGATION_MODEL: NavigationModel = [
  {title: "Kompozice prezentace", icon: "fa-solid fa-house fa-2x", url: "kompozice"},
  {title: "Fotografie", icon: "fa-solid fa-image fa-2x", url: "fotografie"},
  {title: "Audio soubory", icon: "fa-solid fa-music fa-2x", url: "audio-soubory"},
  {title: "Šablony", icon: "fa-solid fa-table-cells fa-2x", url: "sablony"}
]

function App() { 
  return (
    <div className="App">
        <AppHeader />
        <div className="App-Body">
          <NavigationSidebar model={NAVIGATION_MODEL} />
          <Outlet />
        </div>
        <InputValueForm />
        <ConfirmDialog  />
    </div>
  );
}

export default App;
