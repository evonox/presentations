import React from "react";
import { Panel } from "primereact/panel"
import {OrderList, OrderListChangeParams} from "primereact/orderlist";

import "./DocumentListView.scss";
import AdaptHeight from "../AdaptHeight";

export interface DocumentListViewProps {
    documents: any[];
    title: string;
    header?: () => React.ReactElement;
    itemTemplate: (document: any) => React.ReactElement;
}

const DocumentListView = (props: DocumentListViewProps) => {

    const handleItemReordering = (params: OrderListChangeParams) => {
        console.dir(params);
    }

    return (
        <div className="DocumentListView">
            <Panel header={props.title}>
                <div className="DocumentListView-Content">
                    <div className="DocumentListView-Header">
                        { props.header && props.header() }
                    </div>
                    <AdaptHeight>
                        <OrderList 
                            value={props.documents} 
                            dragdrop={true}                       
                            itemTemplate={props.itemTemplate}
                            onChange={e => handleItemReordering(e)}
                        >
                        </OrderList>
                    </AdaptHeight>
                </div>
            </Panel>
        </div>
    )
}

export default DocumentListView;
