import React, { useState, useEffect, useRef } from 'react';
import { DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown, Modal, ModalHeader, ModalBody, CardBody, Button, ModalFooter } from "reactstrap";
import { connect } from "react-redux";

import SimpleBar from "simplebar-react";

import { withRouter } from 'react-router-dom';

//Import Components
import UserProfileSidebar from "../../../components/UserProfileSidebar";
import SelectContact from "../../../components/SelectContact";
import UserHead from "./UserHead";
import ImageList from "./ImageList";
import ChatInput from "./ChatInput";
import FileList from "./FileList";

//actions
import { openUserSidebar, setFullUser, chatUser, addLoggedinUser } from "../../../redux/actions";

//Import Images
import avatar4 from "../../../assets/images/users/avatar-4.jpg";
// import avatar1 from "../../../assets/images/users/avatar-1.jpg";

//i18n
import { useTranslation } from 'react-i18next';
import { createHourString } from '../../../DateUtils/dateMethods';

function UserChat(props) {

    const ref = useRef();

    const [modal, setModal] = useState(false);

    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();

    //demo conversation messages
    //userType must be required
    const [allUsers, setAllUsers] = useState([]) /*useState(props.recentChatList)*/;
    const [chatMessages, setchatMessages] = useState([]) /*useState(props.recentChatList[props.active_user].messages)*/;

    useEffect(() => {
        //console.log(props.recentChatList);
        if(props.recentChatList.length !== 0){
            setchatMessages(props.recentChatList[props.active_user].messages);

        } else{
            setchatMessages([]);
        }
        setAllUsers(props.recentChatList)
        ref.current.recalculate();
        if (ref.current.el) {
            ref.current.getScrollElement().scrollTop = ref.current.getScrollElement().scrollHeight;
        }
    }, [props.active_user, props.recentChatList]);

    const toggle = () => setModal(!modal);

    const addMessage = (message, type) => {
        var messageObj = null;

        let d = new Date();
        var n = d.getSeconds();

        //matches the message type is text, file or image, and create object according to it
        switch (type) {
            
            case "textMessage":

                let dateObj = new Date();

                messageObj = {
                    id: chatMessages.length + 1,
                    message: message,
                    time: createHourString(dateObj),
                    userType: "sender",
                    // image: avatar4,
                    image: "Null",
                    isFileMessage: false,
                    isImageMessage: false
                }
                let data = {
                    msg_type: "msg",
                    business_phone_number: props.user.business_phone_number,
                    business_number_id: props.user.business_number_id,
                    client_number: props.recentChatList[props.active_user].client_number,
                    client_profile_name: props.recentChatList[props.active_user].name,
                    assigned_agent: "",
                    timestamp: dateObj.getTime(),
                    sender_is_business: true,
                    body: message,
                    
                    
                }
                props.wsClient.send(JSON.stringify(data))
                break;

            case "fileMessage":
                messageObj = {
                    id: chatMessages.length + 1,
                    message: 'file',
                    fileMessage: message.name,
                    size: message.size,
                    time: "00:" + n,
                    userType: "sender",
                    image: avatar4,
                    isFileMessage: true,
                    isImageMessage: false
                }
                break;

            case "imageMessage":
                var imageMessage = [
                    { image: message },
                ]

                messageObj = {
                    id: chatMessages.length + 1,
                    message: 'image',
                    imageMessage: imageMessage,
                    size: message.size,
                    time: "00:" + n,
                    userType: "sender",
                    image: avatar4,
                    isImageMessage: true,
                    isFileMessage: false
                }
                break;

            default:
                break;
        }

        //add message object to chat        
        setchatMessages([...chatMessages, messageObj]);

        let copyallUsers = [...allUsers];
        copyallUsers[props.active_user].messages = [...chatMessages, messageObj];
        copyallUsers[props.active_user].isTyping = false;
        props.setFullUser(copyallUsers);

        scrolltoBottom();
    }

    function scrolltoBottom() {
        if (ref.current.el) {
            ref.current.getScrollElement().scrollTop = ref.current.getScrollElement().scrollHeight;
        }
    }


    const deleteMessage = (id) => {
        let conversation = chatMessages;

        var filtered = conversation.filter(function (item) {
            return item.id !== id;
        });

        setchatMessages(filtered);
    }

    props.wsClient.onmessage = function(e){
        if (typeof e.data === 'string') {
            let message_data = JSON.parse(e.data);
            let mesObj;
            // let d = new Date();
            // let n = d.getSeconds();
            let update_array;

            let timestamp = parseInt(message_data.timestamp);
            let dateObj = new Date(timestamp * 1000);
            let hourString = createHourString(dateObj);


            //an existing conversation matching the sender's number
            let found = props.recentChatList.find(user => user.client_number === message_data.client_number && user.status !== "offline");
            
            
            
            let type = message_data.sender_is_business ? "sender" : "receiver"; 


            if (message_data.isNoti && message_data.isNoti === true){
                console.log("notification")
                mesObj = {
                    id: 0,
                    isNoti: message_data.isNoti,
                    body: message_data.body
                }

                if (message_data.type === "termination"){
                    found.status = "offline";
                }

                if (message_data.type === "assignment"){
                    found.assigned_agent = message_data.assigned_agent;
                    
                    if(message_data.assigned_agent !== props.user.name)
                        found.status = "away";
                    
                }

            }else{

                switch(message_data.msg_type){
                    
                    case "txt":
                        console.log("txt")
                        mesObj = {
                            id: 0,
                            message: message_data.body,
                            time: hourString,
                            userType: type,
                            isImageMessage: false,
                            isFileMessage: false
                        }
                        break;

                    case "img":
                        console.log("image")

                        let imageMessage = [{image: message_data.image_url}]

                        mesObj = {
                            id: 0,
                            message: message_data.caption,
                            imageMessage: imageMessage,
                            time: hourString,
                            userType: type,
                            isImageMessage: true,
                            isFileMessage: false
                        }
                        break;

                    default:
                        break;

                }
            

            

            }
    
            if (found != null){

                mesObj.id = found.messages.length + 1;
                found.messages = [...found.messages, mesObj];
                found.unRead += 1;
                update_array = [...allUsers];
                //props.setFullUser(update_array);
                
                scrolltoBottom();
                console.log("user found")
                    
            }else{
                //console.log("a agent: " + message_data.agent)
                let user_status = message_data.assigned_agent === props.user.name || message_data.assigned_agent === "none" ? "online" : "away";

                let new_user = {
                    id: props.recentChatList.length,
                    isRecord: false,
                    name: message_data.client_profile_name,
                    profilePicture: "Null",
                    status: user_status,
                    unRead: 1,
                    isGroup: false,
                    client_number: message_data.client_number,
                    assigned_agent: message_data.assigned_agent,
                    messages: [mesObj]
                }
                console.log(message_data.assigned_agent)

                props.addLoggedinUser(new_user);
                
                update_array = [...allUsers, new_user];

                console.log("user added")
                //props.setFullUser(update_array);
            }

        
            props.setFullUser(update_array);
        }
    }

    return (
        <React.Fragment>
            <div className="user-chat w-100">

                <div className="d-lg-flex">

                    <div className={props.userSidebar ? "w-70" : "w-100"}>

                        {/* render user head */}
                        <UserHead chatList={props.recentChatList} activeUser={props.active_user} ws_Client={props.wsClient}/>

                        <SimpleBar
                            style={{ maxHeight: "100%" }}
                            ref={ref}
                            className="chat-conversation p-3 p-lg-4"
                            id="messages">
                            <ul className="list-unstyled mb-0">


                                {
                                    chatMessages.map((chat, key) =>
                                        chat.isNoti && chat.isNoti === true ? <li key={"dayTitle" + key}>
                                            <div className="chat-day-title">
                                                <span className="title">{chat.body}</span>
                                            </div>
                                        </li> :
                                        (props.recentChatList.length !== 0) ?   
                                         
                                            (props.recentChatList[props.active_user].isGroup === true) ?
                                                <li key={key} className={chat.userType === "sender" ? "right" : ""}>
                                                    <div className="conversation-list">

                                                        <div className="chat-avatar">
                                                            {chat.userType === "sender" ? /*<img src={avatar1} alt="chatvia" />*/
                                                                <div className="chat-user-img align-self-center me-3">
                                                                    <div className="avatar-xs">
                                                                        <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                            {props.user["name"] && props.user["name"].charAt(0)}
                                                                        </span>
                                                                    </div>
                                                                </div> :
                                                                props.recentChatList[props.active_user].profilePicture === "Null" ?
                                                                    <div className="chat-user-img align-self-center me-3">
                                                                        <div className="avatar-xs">
                                                                            <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                {chat.userName && chat.userName.charAt(0)}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    : <img src={props.recentChatList[props.active_user].profilePicture} alt="chatvia" />
                                                            }
                                                        </div>

                                                        <div className="user-chat-content">
                                                            <div className="ctext-wrap">
                                                                <div className="ctext-wrap-content">
                                                                    {
                                                                        chat.message &&
                                                                        <p className="mb-0">
                                                                            {chat.message}
                                                                        </p>
                                                                    }
                                                                    {
                                                                        chat.imageMessage &&
                                                                        // image list component
                                                                        <ImageList images={chat.imageMessage} />
                                                                    }
                                                                    {
                                                                        chat.fileMessage &&
                                                                        //file input component
                                                                        <FileList fileName={chat.fileMessage} fileSize={chat.size} />
                                                                    }
                                                                    {
                                                                        chat.isTyping &&
                                                                        <p className="mb-0">
                                                                            typing
                                                                            <span className="animate-typing">
                                                                                <span className="dot ms-1"></span>
                                                                                <span className="dot ms-1"></span>
                                                                                <span className="dot ms-1"></span>
                                                                            </span>
                                                                        </p>
                                                                    }
                                                                    {
                                                                        !chat.isTyping && <p className="chat-time mb-0"><i className="ri-time-line align-middle"></i> <span className="align-middle">{chat.time}</span></p>
                                                                    }
                                                                </div>
                                                                {
                                                                    !chat.isTyping &&
                                                                    <UncontrolledDropdown className="align-self-start">
                                                                        <DropdownToggle tag="a">
                                                                            <i className="ri-more-2-fill"></i>
                                                                        </DropdownToggle>
                                                                        <DropdownMenu>
                                                                            <DropdownItem>{t('Copy')} <i className="ri-file-copy-line float-end text-muted"></i></DropdownItem>
                                                                            <DropdownItem>{t('Save')} <i className="ri-save-line float-end text-muted"></i></DropdownItem>
                                                                            <DropdownItem onClick={toggle}>Forward <i className="ri-chat-forward-line float-end text-muted"></i></DropdownItem>
                                                                            <DropdownItem onClick={() => deleteMessage(chat.id)}>Delete <i className="ri-delete-bin-line float-end text-muted"></i></DropdownItem>
                                                                        </DropdownMenu>
                                                                    </UncontrolledDropdown>
                                                                }

                                                            </div>
                                                            {
                                                                <div className="conversation-name">{chat.userType === "sender" ? "Patricia Smith" : chat.userName}</div>
                                                            }
                                                        </div>
                                                    </div>
                                                </li>
                                                :
                                                <li key={key} className={chat.userType === "sender" ? "right" : ""}>
                                                    <div className="conversation-list">
                                                        {
                                                            //logic for display user name and profile only once, if current and last messaged sent by same receiver
                                                            chatMessages[key + 1] ? chatMessages[key].userType === chatMessages[key + 1].userType ?

                                                                <div className="chat-avatar">
                                                                    <div className="blank-div"></div>
                                                                </div>
                                                                :
                                                                <div className="chat-avatar">
                                                                    {chat.userType === "sender" ? /*<img src={avatar1} alt="chatvia" />*/ 
                                                                        <div className="chat-user-img align-self-center me-3">
                                                                            <div className="avatar-xs">
                                                                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                    {props.user["name"] && props.user["name"].charAt(0)}
                                                                                </span>
                                                                            </div>
                                                                        </div>:
                                                                        props.recentChatList[props.active_user].profilePicture === "Null" ?
                                                                            <div className="chat-user-img align-self-center me-3">
                                                                                <div className="avatar-xs">
                                                                                    <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                        {props.recentChatList[props.active_user].name.charAt(0)}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            : <img src={props.recentChatList[props.active_user].profilePicture} alt="chatvia" />
                                                                    }
                                                                </div>
                                                                : <div className="chat-avatar">
                                                                    {chat.userType === "sender" ? /*<img src={avatar1} alt="chatvia" />*/ 
                                                                    
                                                                    <div className="chat-user-img align-self-center me-3">
                                                                        <div className="avatar-xs">
                                                                            <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                {props.recentChatList[props.active_user].assigned_agent.charAt(0)}
                                                                            </span>
                                                                        </div>
                                                                    </div>:
                                                                        props.recentChatList[props.active_user].profilePicture === "Null" ?
                                                                            <div className="chat-user-img align-self-center me-3">
                                                                                <div className="avatar-xs">
                                                                                    <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                        {props.recentChatList[props.active_user].name.charAt(0)}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            : <img src={props.recentChatList[props.active_user].profilePicture} alt="chatvia" />
                                                                    }
                                                                </div>
                                                        }


                                                        <div className="user-chat-content">
                                                            <div className="ctext-wrap">
                                                                <div className="ctext-wrap-content">
                                                                    {
                                                                        chat.message &&
                                                                        <p className="mb-0">
                                                                            {chat.message}
                                                                        </p>
                                                                    }
                                                                    {
                                                                        chat.imageMessage &&
                                                                        // image list component
                                                                        <ImageList images={chat.imageMessage} />
                                                                    }
                                                                    {
                                                                        chat.fileMessage &&
                                                                        //file input component
                                                                        <FileList fileName={chat.fileMessage} fileSize={chat.size} />
                                                                    }
                                                                    {
                                                                        chat.isTyping &&
                                                                        <p className="mb-0">
                                                                            typing
                                                                            <span className="animate-typing">
                                                                                <span className="dot ms-1"></span>
                                                                                <span className="dot ms-1"></span>
                                                                                <span className="dot ms-1"></span>
                                                                            </span>
                                                                        </p>
                                                                    }
                                                                    {
                                                                        !chat.isTyping && <p className="chat-time mb-0"><i className="ri-time-line align-middle"></i> <span className="align-middle">{chat.time}</span></p>
                                                                    }
                                                                </div>
                                                                {
                                                                    !chat.isTyping &&
                                                                    <UncontrolledDropdown className="align-self-start">
                                                                        <DropdownToggle tag="a">
                                                                            <i className="ri-more-2-fill"></i>
                                                                        </DropdownToggle>
                                                                        <DropdownMenu>
                                                                            <DropdownItem>{t('Copy')} <i className="ri-file-copy-line float-end text-muted"></i></DropdownItem>
                                                                            <DropdownItem>{t('Save')} <i className="ri-save-line float-end text-muted"></i></DropdownItem>
                                                                            <DropdownItem onClick={toggle}>Forward <i className="ri-chat-forward-line float-end text-muted"></i></DropdownItem>
                                                                            <DropdownItem onClick={() => deleteMessage(chat.id)}>Delete <i className="ri-delete-bin-line float-end text-muted"></i></DropdownItem>
                                                                        </DropdownMenu>
                                                                    </UncontrolledDropdown>
                                                                }

                                                            </div>
                                                            {
                                                                chatMessages[key + 1] ? 
                                                                chatMessages[key].userType === chatMessages[key + 1].userType ? null : 

                                                                <div className="conversation-name">{chat.userType === "sender" ? 

                                                                props.recentChatList[props.active_user].assigned_agent === "none" ? props.user["name"]  : props.recentChatList[props.active_user].assigned_agent :
                                                                
                                                                props.recentChatList[props.active_user].name}</div> : 

                                                                <div className="conversation-name">{chat.userType === "sender" ? 
                                                                
                                                                props.recentChatList[props.active_user].assigned_agent === "none" ? props.user["name"]  : props.recentChatList[props.active_user].assigned_agent : 
                                                                
                                                                props.recentChatList[props.active_user].name}</div>
                                                            }

                                                        </div>
                                                    </div>
                                                </li>
                                            
                                         
                                        :
                                        <></>                       
                                            
                                    )
                                    
                                }
                            </ul>
                        </SimpleBar>

                        <Modal backdrop="static" isOpen={modal} centered toggle={toggle}>
                            <ModalHeader toggle={toggle}>Forward to...</ModalHeader>
                            <ModalBody>
                                <CardBody className="p-2">
                                    <SimpleBar style={{ maxHeight: "200px" }}>
                                        <SelectContact handleCheck={() => { }} />
                                    </SimpleBar>
                                    <ModalFooter className="border-0">
                                        <Button color="primary">Forward</Button>
                                    </ModalFooter>
                                </CardBody>
                            </ModalBody>
                        </Modal>

                        <ChatInput onaddMessage={addMessage} chatList={props.recentChatList} activeUser={props.active_user}/>
                    </div>

                    <UserProfileSidebar activeUser={props.recentChatList[props.active_user]} />

                </div>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    const { active_user } = state.Chat;
    const { userSidebar } = state.Layout;
    return { active_user, userSidebar };
};

export default withRouter(connect(mapStateToProps, { openUserSidebar, setFullUser, chatUser, addLoggedinUser })(UserChat));

