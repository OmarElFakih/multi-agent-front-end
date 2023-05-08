import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownMenu, DropdownItem, DropdownToggle, /*Button,*/ Input, Row, Col, Modal, ModalBody } from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX, faCheck } from '@fortawesome/free-solid-svg-icons'

import { openUserSidebar, setFullUser, /*activeUser*/ } from "../../../redux/actions";

import { activeUser as setActiveUser } from '../../../redux/actions';

//import images
//import user from '../../../assets/images/users/avatar-4.jpg'

function UserHead(props) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownOpen1, setDropdownOpen1] = useState(false);
    const [EndModal, setEndModal] = useState(false);
    const [RemoveModal, setRemoveModal] = useState(false);
    const [allUsers, setAllUsers] = useState(props.chatList);
    

    const toggle = () => setDropdownOpen(!dropdownOpen);
    const toggle1 = () => setDropdownOpen1(!dropdownOpen1);
    const toggleEndModal = () => setEndModal(!EndModal);
    const toggleRemoveModal = () => setRemoveModal(!RemoveModal);

    const openUserSidebar = (e) => {
        e.preventDefault();
        props.openUserSidebar();
    }

    function closeUserChat(e) {
        e.preventDefault();
        var userChat = document.getElementsByClassName("user-chat");
        if (userChat) {
            userChat[0].classList.remove("user-chat-show");
        }
    }

    // function deleteMessage() {
    //     let allUsers = props.users;
    //     let copyallUsers = allUsers;
    //     copyallUsers[props.active_user].messages = [];

       
    //     props.setFullUser(copyallUsers);

        
    //     console.log(allUsers[props.active_user]);
    // }


    function terminateConversation(){

        let copyAllUsers = [...allUsers];

        let noti_data = {
            msg_type: "notification",
            noti_type: "termination",
            body: "conversation terminated",
            client_number: copyAllUsers[props.activeUser].client_number,
            timestamp: Date.now().toString(),
        }

        props.ws_Client.send(JSON.stringify(noti_data));

        
        // copyAllUsers[props.activeUser].status = "offline";
        props.setFullUser(copyAllUsers);

        toggleEndModal();
        
        
    }


    function removeConversation(){
        console.log("removing")

        let copyAllUsers = [...allUsers];

        let id = copyAllUsers[props.activeUser].id

        console.log(id)
        
        let filteredUsers = copyAllUsers.filter(user => user.id !== id);

        console.log(filteredUsers)

        props.setActiveUser(0)

        props.setFullUser(filteredUsers)

        toggleRemoveModal();
    }


    useEffect(() => {
        setAllUsers(props.chatList);
    }, [props.chatList])




    return (
        <React.Fragment>
            <div className="p-3 p-lg-4 border-bottom">
                <Row className="align-items-center">
                    <Col sm={4} xs={8}>
                        <div className="d-flex align-items-center">
                            <div className="d-block d-lg-none me-2 ms-0">
                                <Link to="#" onClick={(e) => closeUserChat(e)} className="user-chat-remove text-muted font-size-16 p-2">
                                    <i className="ri-arrow-left-s-line"></i></Link>
                            </div>
                            {/*
                                props.users[props.active_user].profilePicture !== "Null" ?
                                    <div className="me-3 ms-0">
                                        <img src={props.users[props.active_user].profilePicture} className="rounded-circle avatar-xs" alt="chatvia" />
                                    </div>
                                    : <div className="chat-user-img align-self-center me-3">
                                        <div className="avatar-xs">
                                            <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                {props.users[props.active_user].name.charAt(0)}
                                            </span>
                                        </div>
                                    </div>
                            */}

                            <div className="flex-grow-1 overflow-hidden">
                                <h5 className="font-size-16 mb-0 text-truncate">
                                    <Link to="#" onClick={(e) => openUserSidebar(e)} className="text-reset user-profile-show">
                                        {/*props.users[props.active_user].name*/}
                                    </Link>
                                    {/*(() => {
                                        switch (props.users[props.active_user].status) {
                                            case "online":
                                                return (
                                                    <>
                                                        <i className="ri-record-circle-fill font-size-10 text-success d-inline-block ms-1"></i>
                                                    </>
                                                )

                                            case "away":
                                                return (
                                                    <>
                                                        <i className="ri-record-circle-fill font-size-10 text-warning d-inline-block ms-1"></i>
                                                    </>
                                                )

                                            case "offline":
                                                return (
                                                    <>
                                                        <i className="ri-record-circle-fill font-size-10 text-secondary d-inline-block ms-1"></i>
                                                    </>
                                                )

                                            default:
                                                return;
                                        }
                                    })()*/}

                                </h5>
                            </div>
                        </div>
                    </Col>
                    <Col sm={8} xs={4} >
                        <ul className="list-inline user-chat-nav text-end mb-0">

                            <li className="list-inline-item">
                                <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                                    <DropdownToggle color="none" className="btn nav-btn " type="button">
                                        <i className="ri-search-line"></i>
                                    </DropdownToggle>
                                    <DropdownMenu className="p-0 dropdown-menu-end dropdown-menu-md">
                                        <div className="search-box p-2">
                                            <Input type="text" className="form-control bg-light border-0" placeholder="Search.." />
                                        </div>
                                    </DropdownMenu>                                
                                </Dropdown>
                            </li>
                            {/* <li className="list-inline-item d-none d-lg-inline-block me-2 ms-0">
                                <button type="button" onClick={toggleEndModal} className="btn nav-btn" >
                                    <i className="ri-phone-line"></i>
                                </button>
                            </li>
                            <li className="list-inline-item d-none d-lg-inline-block me-2 ms-0">
                                <button type="button" onClick={toggleVideoModal} className="btn nav-btn">
                                    <i className="ri-vidicon-line"></i>
                                </button>
                            </li> */}

                            {/* <li className="list-inline-item d-none d-lg-inline-block">
                                <Button type="button" color="none" onClick={(e) => openUserSidebar(e)} className="nav-btn user-profile-show">
                                    <i className="ri-user-2-line"></i>
                                </Button>
                            </li> */}

                            <li className="list-inline-item">
                                <Dropdown isOpen={dropdownOpen1} toggle={toggle1}>
                                    <DropdownToggle className="btn nav-btn " color="none" type="button" >
                                        <i className="ri-more-fill"></i>
                                    </DropdownToggle>
                                    <DropdownMenu className="dropdown-menu-end">
                                        <DropdownItem>Refer conversation </DropdownItem>
                                        <DropdownItem>Change tag</DropdownItem>
                                        <DropdownItem onClick={toggleRemoveModal}>Remove Conversation</DropdownItem>
                                        <DropdownItem onClick={toggleEndModal}>End conversation</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </li>

                        </ul>
                    </Col>
                </Row>
            </div>

            {/* End Conversation Modal */}
            <Modal tabIndex="-1" isOpen={EndModal} toggle={toggleEndModal} centered>
                <ModalBody>
                    <div className="text-center p-4">
                        {/* <div className="avatar-lg mx-auto mb-4">
                            <img src={user} alt="" className="img-thumbnail rounded-circle" />
                        </div> */}

                        <h5 className="text-truncate">End Conversation?</h5>
                        <p className="text-muted">the conversation will end and you will no longer be able to send messages to this client</p>

                        <div className="mt-5">
                            <ul className="list-inline mb-1">
                                <li className="list-inline-item px-2 me-2 ms-0">
                                    <button type="button" className="btn btn-danger avatar-sm rounded-circle" onClick={toggleEndModal}>
                                        <span className="avatar-title bg-transparent font-size-20" >
                                            {/* <i className="ri-close-fill"></i> */}
                                            <FontAwesomeIcon icon={faX} />
                                        </span>
                                    </button>
                                </li>
                                <li className="list-inline-item px-2">
                                    <button onClick={(e) => terminateConversation(e)} type="button" className="btn btn-success avatar-sm rounded-circle">
                                        <span className="avatar-title bg-transparent font-size-20">
                                            {/* <i className="ri-phone-fill"></i> */}
                                            <FontAwesomeIcon icon={faCheck} />
                                        </span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </ModalBody>
            </Modal>

            {/* Start Remove Modal */}
            <Modal tabIndex="-1" isOpen={RemoveModal} toggle={toggleRemoveModal} centered>
                <ModalBody>
                    <div className="text-center p-4">

                        <h5 className="text-truncate">Remove Conversation?</h5>
                        <p className="text-muted">the conversation will be removed from the chat list</p>

                        <div className="mt-5">
                            <ul className="list-inline mb-1">
                                <li className="list-inline-item px-2 me-2 ms-0">
                                    <button type="button" className="btn btn-danger avatar-sm rounded-circle" onClick={toggleRemoveModal}>
                                        <span className="avatar-title bg-transparent font-size-20" >
                                            <FontAwesomeIcon icon={faX} />
                                        </span>
                                    </button>
                                </li>
                                <li className="list-inline-item px-2">
                                    <button onClick={(e) => removeConversation(e)} type="button" className="btn btn-success avatar-sm rounded-circle">
                                        <span className="avatar-title bg-transparent font-size-20">
                                            <FontAwesomeIcon icon={faCheck} />
                                        </span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </React.Fragment>
    );
}


const mapStateToProps = (state) => {
    const { users, active_user } = state.Chat;
    return { ...state.Layout, users, active_user };
};

export default connect(mapStateToProps, { openUserSidebar, setFullUser, setActiveUser })(UserHead);