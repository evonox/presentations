import { Panel } from "primereact/panel";
import React from "react";
import { Dropdown } from "primereact/dropdown";
import { Fieldset } from "primereact/fieldset";

import "./CompositionTemplateView.scss";

const CompositionTemplateView = () => {

    return (
        <div className="CompositionTemplateView">
            <Panel header="Šablona prezentace">
                <div className="CompositionTemplateView-Body">
                    <Dropdown 
                        options={[]} 
                        style={{width: "100%"}}
                        placeholder="Vyberte webovou šablonu..." 
                        emptyMessage="Nebyly nalezeny žádné šablony."
                    />
                    <Fieldset legend="Parametry webové šablony" className="CompositionTemplateView-Parameters" >

                    </Fieldset>
                </div>
            </Panel>
        </div>
    );
}

export default CompositionTemplateView;
