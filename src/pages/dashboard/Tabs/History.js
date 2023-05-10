import React, { Component } from 'react';
import { connect } from "react-redux";
// import axios from 'axios';

import { withTranslation } from 'react-i18next';

import Select from 'react-select'

import MultiAgentDatePicker from '../../../DateUtils/MultiAgentDatePicker';
import { createDateString} from '../../../DateUtils/dateMethods';


import {Input, Button} from "reactstrap"

import { addLoggedinUser } from '../../../redux/actions';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'


import { ServerLink } from './ServerLink';


class History extends Component {
    constructor(props) {
        super(props);
        this.serverLink = "https://"+ ServerLink + "/history"
        this.user = JSON.parse(localStorage.getItem("authUser"));
        
        this.state = {
            //fetch agends from backend on future iterations
            agents: [
                {value: "", label: "Assigned Agent"},
                {value: "Admin01", label: "Admin01"},
                {value: "Admin02", label: "Admin02"},
                {value: "Agent01", label: "Agent01"},
                {value: "Agent02", label: "Agent02"},
            ],
            selectedAgent: "",
            clientProfileName: "",
            selectedDate: "",
            conversationsList: [],      
        }
        
    }


    addaptData(data) {
        let addapted = []
        
        for (const conversation of data){
            console.log(conversation)
            let timestamp = parseInt(conversation["date"]);
            let convDate = new Date(timestamp * 1000)
            let convDateString = createDateString(convDate)


            let messageList = [{
                id: 0,
                isNoti: true,
                body: "this conversation took place on " + convDateString
            }]


            for (const message of conversation["messages"]){
                let type = message["sender_is_business"] ? "sender" : "receiver";
                let msgObj = {};

                switch(message["msg_type"]){
                    case "txt":
                        msgObj = {
                            id: messageList.length,
                            message: message["body"],
                            time: "-",
                            userType: type,
                            isImageMessage: false,
                            isFileMessage: false
                        }
                        break;

                    case "img":
                        let imageMessage = [{image: message["img_url"]}]

                        msgObj = {
                            id: 0,
                            message: message["caption"],
                            imageMessage: imageMessage,
                            time: "-",
                            userType: type,
                            isImageMessage: true,
                            isFileMessage: false
                        }
                        break;

                    default:
                        break;
                }
                
                
                messageList.push(msgObj)
            
                
            }


            


            let new_user = {
                id: conversation["_id"]["$oid"],
                name: conversation["client_name"],
                profilePicture: "Null",
                status: "offline",
                unRead: 0,
                isGroup: false,
                date: convDateString,
                client_number: conversation["client_number"],
                assigned_agent: conversation["assigned_agent"],
                messages: messageList
            }

            addapted.push(new_user)
        }   


        this.updateState("conversationsList", addapted)
    }


    async search(){

        let fullUrl = this.serverLink+"?business_phone_number_id="+this.user.business_number_id+"&assigned_agent="+this.state.selectedAgent+"&client_name="+this.state.clientProfileName+"&date="+this.state.selectedDate
        
        

        // axios.get(this.serverLink + "?key1=value4")
        // .then(function (response){
        //     console.log(response)
        // })
        // .catch(function(error){
        //     console.log(error)
        // })
        // .finally(function (){
            
        // })
        
        try{
            let response = await fetch(fullUrl, {
                method: "GET",
                headers:{
                    'Content-Type': 'application/json'
                }
            });
            if(response.ok){
                let jresponse = await response.json();
                
                this.addaptData(jresponse)

            }else{
                console.log("something went wrong")
                console.log(response)
            }
        }catch(error){
            console.log(error)
        }
        
    }


    

    

    updateDate = (dateObj) => {
        let dateString = dateObj === "" ? "" : createDateString(dateObj)
        console.log(dateString)
        
        this.setState({selectedDate: dateString});
    }

    updateState = (stateVar, stateValue) => {

        this.setState({[stateVar]: stateValue});
    }


    componentDidMount(){
       
    }

    componentDidUpdate(){
        console.log(this.state.conversationsList)
    }

    logSate(){
      console.log(this.state.selectedAgent)
      console.log(this.state.clientProfileName)
      console.log(this.state.selectedDate)
      console.log("context: " + this.serverLink)
    }

    
    render() {
        const { t } = this.props;

        return (
            <React.Fragment>
                <div style={{width: "100%"}}>
                    <div className="p-4" style={{display: "flex", justifyContent: "space-between"}}>
                        <h4 className="mb-4">{t('History')}</h4>
                    </div>
                    <div>
                        <h4 className="mb-4">{t('Find Conversations By')}</h4>
                    </div>
                    <div className="p-4" style={{display: "flex", justifyContent: "center"}}>

                        <Select options={this.state.agents} defaultValue={{value: "", label: "Assigned Agent"}} onChange={(e) => this.updateState("selectedAgent", e.value)} unstyled={true} className="form-control form-control-lg border-light bg-soft-light" classNames={{option: (state) => "form-control form-control-lg"}}/>

                        <Input
                            type="text"
                            id="client-p-name"
                            name="client profile name"
                            className="form-control form-control-lg border-light bg-soft-light"
                            placeholder="Client Profile Name"
                            onChange={(e)=> this.updateState("clientProfileName", e.target.value)}
                            // onBlur={formik.handleBlur}
                            // value={formik.values.email}
                            // invalid={formik.touched.email && formik.errors.email ? true : false}
                        />

                        <MultiAgentDatePicker onDateChange={this.updateDate}/>

                        <Button type="input" color="primary" onClick={() => this.search()} className="font-size-16 waves-effect waves-light" style={{marginRight: "5%", marginLeft: "3%", borderRadius: "1.5rem"}}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} style={{marginRight: "0.5rem", marginLeft: "-0.3rem"}}/>
                        </Button>

                    </div>

                    <ul className="list-unstyled chat-list chat-user-list">
                        {this.state.conversationsList.map((conversation, key) => 
                            <li key={key} id={conversation["id"]} style={{display: "flex"}}>
                                <p>id: {conversation["id"]} | date: {conversation["date"]} | assigned_agent: {conversation["assigned_agent"]} | client name: {conversation["name"]}      </p>

                                <Button type="input" color="primary" onClick={() => this.props.addLoggedinUser(conversation)} className="font-size-16 waves-effect waves-light" style={{marginRight: "5%", borderRadius: "1.5rem"}}>
                                    load
                                </Button>
                            </li>
                        )}
                    </ul>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    const { groups, active_user } = state.Chat;
    return { groups, active_user };
};

export default (connect(mapStateToProps, {addLoggedinUser})(withTranslation()(History)));