import React, { Component } from 'react';
import { Input, InputGroup, Nav, NavItem, NavLink} from "reactstrap";

import { Link } from "react-router-dom";
import { connect } from "react-redux";

//simplebar
import SimpleBar from "simplebar-react";

//actions
import { setconversationNameInOpenChat, activeUser, addLoggedinUser } from "../../../redux/actions"
import classnames from "classnames";

//components
//import OnlineUsers from "./OnlineUsers";

// let testUser =  { id:66, name : "Test User", profilePicture : "Null", status : "online",unRead : 0, isGroup: false, number:"12345", 
// messages: []  }

let user = JSON.parse(localStorage.getItem("authUser"));


class Chats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchChat: "",
            recentChatList: this.props.recentChatList,
            activeTab: "allChats"
        }
        this.handleChange = this.handleChange.bind(this);
        this.openUserChat = this.openUserChat.bind(this);
        // this.props.addLoggedinUser(testUser)
    }

    componentDidMount() {
        var li = document.getElementById("conversation" + this.props.active_user);
        if (li) {
            li.classList.add("active");
        }
        
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {

            let filteredChatList = this.filterByTab(this.props.recentChatList)
            this.setState({
                // recentChatList: this.props.recentChatList
                recentChatList: filteredChatList
            });
        }

        

        
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.recentChatList !== nextProps.recentChatList) {
            
            this.setState({
                recentChatList: nextProps.recentChatList,
                
            });
        }

        
    }

    handleChange(e) {
        this.setState({ searchChat: e.target.value });
        var search = e.target.value;
        let conversation = this.state.recentChatList;
        let filteredArray = [];

        //find conversation name from array
        for (let i = 0; i < conversation.length; i++) {
            if (conversation[i].name.toLowerCase().includes(search) || conversation[i].name.toUpperCase().includes(search))
                filteredArray.push(conversation[i]);
        }

        filteredArray = this.filterByTab(filteredArray)

        //set filtered items to state
        this.setState({ recentChatList: filteredArray })

        //if input value is blanck then assign whole recent chatlist to array
        if (search === "") this.setState({ recentChatList: this.props.recentChatList })
    }

    openUserChat(e, chat) {

        e.preventDefault();

        //find index of current chat in array
        var index = this.props.recentChatList.indexOf(chat);

        // set activeUser 
        this.props.activeUser(index);

        var chatList = document.getElementById("chat-list");
        var clickedItem = e.target;
        var currentli = null;

        if (chatList) {
            var li = chatList.getElementsByTagName("li");
            //remove coversation user
            for (var i = 0; i < li.length; ++i) {
                if (li[i].classList.contains('active')) {
                    li[i].classList.remove('active');
                }
            }
            //find clicked coversation user
            for (var k = 0; k < li.length; ++k) {
                if (li[k].contains(clickedItem)) {
                    currentli = li[k];
                    break;
                }
            }
        }

        //activation of clicked coversation user
        if (currentli) {
            currentli.classList.add('active');
        }

        var userChat = document.getElementsByClassName("user-chat");
        if (userChat) {
            userChat[0].classList.add("user-chat-show");
        }

        //removes unread badge if user clicks
        var unread = document.getElementById("unRead" + chat.id);
        if (unread) {
            unread.style.display = "none";
        }
    }

    switchTab = (tabName) => {
        console.log(tabName)
        let filteredChatList = this.filterByTab(this.props.recentChatList, tabName)
        this.setState({activeTab: tabName,
                       recentChatList: filteredChatList
                    })


    }

    filterByTab = (chatList, tabName = this.state.activeTab) => {

        let filteredChats;

        switch(tabName){

            case "allChats": 
                filteredChats = chatList.filter(chat => chat.isRecord === false)
                break;

            case "myChats":
                filteredChats = chatList.filter(chat => chat.assigned_agent === user.name)
                break;

            case "archived":
                filteredChats = chatList.filter(chat => chat.isRecord === true)
                break;

            default:
                break;

        }

        return filteredChats;

    }

    render() {
        return (
            <React.Fragment>
                <div>
                    <div className="px-4 pt-4">
                        <h4 className="mb-4">Chats</h4>
                        <div className="search-box chat-search-box">
                            <InputGroup size="lg" className="mb-3 rounded-lg">
                                <span className="input-group-text text-muted bg-light pe-1 ps-3" id="basic-addon1">
                                    <i className="ri-search-line search-icon font-size-18"></i>
                                </span>
                                <Input type="text" value={this.state.searchChat} onChange={(e) => this.handleChange(e)} className="form-control bg-light" placeholder="Search messages or users" />
                            </InputGroup>
                        </div>
                        {/* Search Box */}
                    </div>

                    <div className="flex-lg-column my-auto">
                        <Nav pills fill role='tablist'>
                            <NavItem id='allChats'>
                                <NavLink id='pills-allChats' className={classnames({ active: this.state.activeTab === 'allChats' })} onClick={() => {this.switchTab("allChats");}}>
                                    All Chats
                                </NavLink>
                            </NavItem>
                            <NavItem id='myChats'>
                                <NavLink id='pills-allChats' className={classnames({ active: this.state.activeTab === 'myChats' })} onClick={() => {this.switchTab("myChats");}}>
                                    My Chats
                                </NavLink>
                            </NavItem>
                            {
                            user.role === "admin" ? 
                                <NavItem id='archiveChats'>
                                    <NavLink id='pills-archive'  className={classnames({ active: this.state.activeTab === 'archived' })} onClick={() => {this.switchTab("archived");}}>
                                        Archived Chats
                                    </NavLink>
                                </NavItem> 
                            : 
                            <></>
                            }
                        </Nav>
                    </div>

                    {/* Start chat-message-list  */}
                    <div className="px-2">
                        <h5 className="mb-3 px-3 font-size-16">Recent</h5>
                        <SimpleBar style={{ maxHeight: "100%" }} className="chat-message-list">

                            <ul className="list-unstyled chat-list chat-user-list" id="chat-list">
                                {
                                    this.state.recentChatList.map((chat, key) =>
                                        <li key={key} id={"conversation" + key} className={chat.unRead ? "unread" : chat.isTyping ? "typing" : key === this.props.active_user ? "active" : ""}>
                                            <Link to="#" onClick={(e) => this.openUserChat(e, chat)}>
                                                <div className="d-flex">
                                                    {
                                                        chat.profilePicture === "Null" ?
                                                            <div className={"chat-user-img " + chat.status + " align-self-center me-3 ms-0"}>
                                                                <div className="avatar-xs">
                                                                    <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                        {chat.name.charAt(0)}
                                                                    </span>
                                                                </div>
                                                                {
                                                                    chat.status && <span className="user-status"></span>
                                                                }
                                                            </div>
                                                            :
                                                            <div className={"chat-user-img " + chat.status + " align-self-center me-3 ms-0"}>
                                                                <img src={chat.profilePicture} className="rounded-circle avatar-xs" alt="chatvia" />
                                                                {
                                                                    chat.status && <span className="user-status"></span>
                                                                }
                                                            </div>
                                                    }

                                                    <div className="flex-grow-1 overflow-hidden">
                                                        <h5 className="text-truncate font-size-15 mb-1">{chat.name}</h5>
                                                        <p>Assigned to {chat.assigned_agent}</p>
                                                        <p className="chat-user-message text-truncate mb-0">
                                                            {
                                                                chat.isTyping ?
                                                                    <>
                                                                        typing<span className="animate-typing">
                                                                            <span className="dot ms-1"></span>
                                                                            <span className="dot ms-1"></span>
                                                                            <span className="dot ms-1"></span>
                                                                        </span>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        {
                                                                            chat.messages && (chat.messages.length > 0 && chat.messages[(chat.messages).length - 1].isImageMessage === true) ? <i className="ri-image-fill align-middle me-1"></i> : null
                                                                        }
                                                                        {
                                                                            chat.messages && (chat.messages.length > 0 && chat.messages[(chat.messages).length - 1].isFileMessage === true) ? <i className="ri-file-text-fill align-middle me-1"></i> : null
                                                                        }
                                                                        {chat.messages && chat.messages.length > 0 ? chat.messages[(chat.messages).length - 1].message : null}
                                                                    </>
                                                            }



                                                        </p>
                                                    </div>
                                                    <div className="font-size-11">{chat.messages && chat.messages.length > 0 ? chat.messages[(chat.messages).length - 1].time : null}</div>
                                                    {chat.unRead === 0 ? null :
                                                        <div className="unread-message" id={"unRead" + chat.id}>
                                                            <span className="badge badge-soft-danger rounded-pill">{chat.messages && chat.messages.length > 0 ? chat.unRead >= 20 ? chat.unRead + "+" : chat.unRead : ""}</span>
                                                        </div>
                                                    }
                                                </div>
                                            </Link>
                                        </li>
                                    )
                                }
                            </ul>
                        </SimpleBar>

                    </div>
                    {/* End chat-message-list */}
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    const { active_user } = state.Chat;
    return { active_user };
};

export default connect(mapStateToProps, { setconversationNameInOpenChat, activeUser, addLoggedinUser })(Chats);