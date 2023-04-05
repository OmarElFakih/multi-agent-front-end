import React, { Component } from 'react';
import { connect } from "react-redux";

import { withTranslation } from 'react-i18next';

import BarChart from '../../../ChartComponents/BarChart';

import { CreatedConversations } from '../../../ChartData'

import { Button } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons'


class Metrics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenCollapse: false,
            dataCopy: CreatedConversations
        }
        
    }

    updateDataCopy(daysToShow){
        console.log("button clicked")
        if(daysToShow < 0){
            this.setState({
                dataCopy: CreatedConversations
            });
        }
        else{
            let auxArr = [];
            for (let i = 0; i < daysToShow; i++){
                auxArr.push(CreatedConversations[i])
            }

            this.setState({
                dataCopy: auxArr
            });
        }
    }


   
    
    render() {
        const { t } = this.props;

        const Cdata = {
            labels: this.state.dataCopy.map((data) => data.id),
            datasets: [{
                label: "Conversations created",
                data: this.state.dataCopy.map((data => data.conversations)),
                backgroundColor: "#7269ef"
            }],
            
        }

        return (
            <React.Fragment>
                <div style={{width: "100%"}}>
                    <div className="p-4" style={{display: "flex", justifyContent: "space-between"}}>
                        <h4 className="mb-4">{t('Metrics')}</h4>  
                        <Button type="input" color="primary" onClick={() => this.updateDataCopy(2)} className="font-size-16 btn-lg chat-send waves-effect waves-light">
                            <FontAwesomeIcon icon={faArrowsRotate}/>
                        </Button>

                    </div>
                    <div style={{width: "47vw", display: "flex"}}>
                        <BarChart chartData={Cdata}/>

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

export default (connect(mapStateToProps)(withTranslation()(Metrics)));