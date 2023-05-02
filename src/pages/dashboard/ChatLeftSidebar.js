import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";

import { TabContent, TabPane } from "reactstrap";

//Import Components
import Profile from "./Tabs/Profile";
import Chats from "./Tabs/Chats";
import Metrics from "./Tabs/Metrics";
import History from './Tabs/History';
import Contacts from "./Tabs/Contacts";
import Settings from "./Tabs/Settings";

function ChatLeftSidebar(props) {

    const activeTab = props.activeTab;

    const [widthClass, setWidthClass] = useState("sidebar-standard-width") 
    
    useEffect(() => {
        let newWithClass = activeTab === "metrics" || activeTab === "history" ? "sidebar-max-width" : "sidebar-standard-width";

        setWidthClass(newWithClass)

    }, [activeTab])
    

    return (
        <React.Fragment>
            <div className={"chat-leftsidebar me-lg-1 " + widthClass}>

                <TabContent activeTab={activeTab}>
                    {/* Start Profile tab-pane */}
                    <TabPane tabId="profile" id="pills-user">
                        {/* profile content  */}
                        <Profile user={props.user}/>
                    </TabPane>
                    {/* End Profile tab-pane  */}

                    {/* Start chats tab-pane  */}
                    <TabPane tabId="chat" id="pills-chat">
                        {/* chats content */}
                        <Chats recentChatList={props.recentChatList} />
                    </TabPane>
                    {/* End chats tab-pane */}

                    {/* Start metrics tab-pane */}
                    <TabPane tabId="metrics" id="pills-metrics">
                        {/* Metrics content */}
                        <Metrics />
                    </TabPane>
                    {/* End metrics tab-pane */}

                    {/* Start history tab-pane */}
                    <TabPane tabId="history" id="pills-history">
                        {/* History content */}
                        <History />
                    </TabPane>
                    {/* End history tab-pane */}

                    {/* Start contacts tab-pane */}
                    <TabPane tabId="contacts" id="pills-contacts">
                        {/* Contact content */}
                        <Contacts />
                    </TabPane>
                    {/* End contacts tab-pane */}


                    {/* Start settings tab-pane */}
                    <TabPane tabId="settings" id="pills-setting">
                        {/* Settings content */}
                        <Settings user={props.user}/>
                    </TabPane>
                    {/* End settings tab-pane */}
                </TabContent>
                {/* end tab content */}

            </div>
        </React.Fragment>
    );
}

const mapStatetoProps = state => {
    return {
        ...state.Layout
    };
};

export default connect(mapStatetoProps, null)(ChatLeftSidebar);