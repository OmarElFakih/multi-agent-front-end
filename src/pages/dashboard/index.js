import React, { Component } from 'react';
//Import Components
import ChatLeftSidebar from "./ChatLeftSidebar";
import UserChat from "./UserChat/";

import { connect } from "react-redux";



import { addLoggedinUser } from '../../redux/actions';

let testUser2 =  {id: 55, name : "Test User 2", profilePicture : "Null", status : "online",unRead : 0, isGroup: false, number:"12345", 
messages: []  }


class Index extends Component {
    componentDidMount(){
        this.props.addLoggedinUser(testUser2);
    }
    
    render() {

        return (
            <React.Fragment>
                {/* chat left sidebar */}
                <ChatLeftSidebar recentChatList={this.props.users} />

                {/* user chat */}
                <UserChat recentChatList={this.props.users} />

            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    const { users } = state.Chat;
    return { users };
};

export default connect(mapStateToProps, {addLoggedinUser})(Index);