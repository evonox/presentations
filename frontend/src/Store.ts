import { configureStore } from '@reduxjs/toolkit';

import appReducer from "./AppSlice";
import documentReducer from "./components/ide/DocumentSlice";
import templatesReducer from "./views/template-view/TemplateSlice";
import presentationReducer from "./presentations/PresentationSlice";
import imagesReducer from "./views/image-view/ImagesSlice";
import treeviewReducer from "./components/ide/document-treeview/TreeViewSlice";
import templateDocsReducer from "./views/template-detail-view/TemplateDocumentSlice";
import audioReducer from "./views/audio-view/AudioSlice";

export const store = configureStore({
  reducer: {
      app: appReducer,
      documents: documentReducer,
      templates: templatesReducer,
      presentations:  presentationReducer,
      images: imagesReducer,
      treeview: treeviewReducer,
      templateDocs: templateDocsReducer,
      audio: audioReducer
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
