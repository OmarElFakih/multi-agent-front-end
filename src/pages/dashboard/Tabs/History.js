import React, { Component } from 'react';
import { connect } from "react-redux";

import { withTranslation } from 'react-i18next';

import Select from 'react-select'

import MultiAgentDatePicker from '../../../DatePicker/MultiAgentDatePicker';

import {Input, Button} from "reactstrap"


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'


import { ServerLink } from './ServerLink';


class History extends Component {
    constructor(props) {
        super(props);
        this.serverLink = ServerLink + "/history"
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

    async search(){
       var data = {
            business_phone_number_id: this.user.business_number_id,
            assigned_agent: this.state.selectedAgent,
            client_name: this.state.clientProfileName,
            date: this.state.selectedDate
        }
        

        try{
            console.log(data)
            let response = await fetch(this.serverLink, {
                method: "POST",
                // mode: "no-cors",
                body: JSON.stringify(data),
                headers:{
                    'Content-Type': 'application/json'
                }
            });
            if(response.ok){
                let jresponse = await response.json();
                console.log(jresponse)
            }else{
                console.log("something went wrong")
                console.log(response)
            }
        }catch(error){
            console.log(error)
        }
        
        
        
        // fetch(this.serverLink, {
        //     method: "POST",
        //     mode: "no-cors",
        //     body: JSON.stringify(data),
        //     headers:{
        //         'Content-Type': 'application/json'
        //     }
        // }).then(res => res.json())
        // .catch(error => console.error("Error", error))
        // .then(response => console.log("Success", response));
    }

    

    updateDate = (dateObj) => {
        let dateString = dateObj.getDate() + "-" + (dateObj.getMonth() + 1) + "-" + dateObj.getFullYear();
        
        
        this.setState({selectedDate: dateString});
    }

    updateState = (stateVar, stateValue) => {

        this.setState({[stateVar]: stateValue});
    }


    componentDidMount(){
       
    }

    componentDidUpdate(){
      
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

                        <Button type="input" color="primary" onClick={() => this.search()} className="font-size-16 waves-effect waves-light" style={{marginRight: "5%", borderRadius: "1.5rem"}}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} style={{marginRight: "0.5rem", marginLeft: "-0.3rem"}}/>
                        </Button>

                    </div>

                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    const { groups, active_user } = state.Chat;
    return { groups, active_user };
};

export default (connect(mapStateToProps)(withTranslation()(History)));