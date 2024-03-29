import React, { Component } from 'react';
//Import Components
import ChatLeftSidebar from "./ChatLeftSidebar";
import UserChat from "./UserChat/";

import { connect } from "react-redux";



import { addLoggedinUser } from '../../redux/actions';

import { w3cwebsocket as W3CWebsSocket} from 'websocket';

import { ServerLink } from './Tabs/ServerLink';


let user = JSON.parse(localStorage.getItem("authUser"));


//http -> ws, https -> wss
const wsClient = new W3CWebsSocket("wss:"+ServerLink+"/ws");


wsClient.onopen = function() {
    console.log("connected");
    let data = {

        msg_type: "connection",
        id: user.name,
        role: user.role,
        business_number_id: user.business_number_id,
    
    }
    setTimeout(() => {wsClient.send(JSON.stringify(data));}, 1000)

    //wsClient.send(JSON.stringify(data));
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
                <ChatLeftSidebar recentChatList={this.props.users} user={user}/>

                {/* user chat */}
                <UserChat recentChatList={this.props.users} wsClient={wsClient} user={user}/>

            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    const { users } = state.Chat;
    return { users };
};

export default connect(mapStateToProps, {addLoggedinUser})(Index);