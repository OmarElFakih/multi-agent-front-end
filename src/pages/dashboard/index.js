import React, { Component } from 'react';
//Import Components
import ChatLeftSidebar from "./ChatLeftSidebar";
import UserChat from "./UserChat/";

import { connect } from "react-redux";



import { addLoggedinUser } from '../../redux/actions';

import { w3cwebsocket as W3CWebsSocket} from 'websocket';

//use wss for production, ws for local testing
const wsClient = new W3CWebsSocket("ws:localhost:8000/ws");


wsClient.onopen = function() {
    console.log("connected");
    let data = {
        type: "connection",
        business_number_id: "105046999163958"        
    }
    wsClient.send(JSON.stringify(data));
}

wsClient.onerror = function() {
    console.log('Connection Error');
};




class Index extends Component {
    componentDidMount(){
        
    }
    
    render() {

        return (
            <React.Fragment>
                {/* chat left sidebar */}
                <ChatLeftSidebar recentChatList={this.props.users} />

                {/* user chat */}
                <UserChat recentChatList={this.props.users} wsClient={wsClient}/>

            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    const { users } = state.Chat;
    return { users };
};

export default connect(mapStateToProps, {addLoggedinUser})(Index);