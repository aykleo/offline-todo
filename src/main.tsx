import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router";

import App from "./App.tsx";

setupIonicReact();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* @ts-expect-error cause it fuckin is*/}
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/" component={App} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </StrictMode>
);
