import React, { Component } from 'react';
import { connect } from "react-redux";

import { withTranslation } from 'react-i18next';

import BarChart from '../../../ChartComponents/BarChart';

import { CreatedConversations, AgentPerformance } from '../../../ChartData'

import { Button, InputGroup } from 'reactstrap';
import Select from 'react-select'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowsRotate, faClock} from '@fortawesome/free-solid-svg-icons'


class Metrics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenCollapse: false,
            beData: {},
            convDataCopy: CreatedConversations,
            perfDataCopy: AgentPerformance,
            Pdata: {},
            options: []
        }
        
    }

    updateDataCopies(daysToShow){
        
        if(daysToShow < 0){
            this.setState({
                convDataCopy: CreatedConversations,
                perfDataCopy: AgentPerformance
            });
        }
        else{
            let auxArr = [];
            let auxArr2 = []
            let starterIndex = CreatedConversations.length - daysToShow;
            for (let i = starterIndex; i < CreatedConversations.length; i++){
                auxArr.push(CreatedConversations[i])
                auxArr2.push(AgentPerformance[i])
            }

            this.setState({
                convDataCopy: auxArr,
                perfDataCopy: auxArr2,
                Pdata: this.sumOfCalls(auxArr2)
            });
        }
    }


    sumOfCalls(performanceData){
        let totalSum = {}
        
        // performanceData[0].agents.map(agent => totalSum[Object.keys(agent)[0]] = 0)

        Object.keys(performanceData[0].agents).forEach(function(key, index){totalSum[key] = 0})

        // performanceData.forEach(day => {
        //     day["agents"].map(agent => totalSum[Object.keys(agent)[0]] += agent[Object.keys(agent)[0]])
        // });

        performanceData.forEach(day => {
            Object.keys(day.agents).forEach(function(key, index){totalSum[key] += day.agents[key]})
        })

        return totalSum
    }

    componentDidMount(){
        console.log("mounted")

        this.setState({
            Pdata: this.sumOfCalls(this.state.perfDataCopy)
        })

       
    }

    componentDidUpdate(){
        // console.log("updated")
        // console.log(this.state.Pdata)
    }

    
    render() {
        const { t } = this.props;

        const Cdata = {
            labels: this.state.convDataCopy.map((data) => data.id),
            datasets: [{
                label: "Conversations created",
                data: this.state.convDataCopy.map((data => data.conversations)),
                backgroundColor: "#7269ef"
            }],
            
        }

        

        const options = [
            {value: 2, label: "Last 2 days"},
            {value: 7, label: "Last 7 days"},
            
        ]

        return (
            <React.Fragment>
                <div style={{width: "100%"}}>
                    <div className="p-4" style={{display: "flex", justifyContent: "space-between"}}>
                        <h4 className="mb-4">{t('Metrics')}</h4>


                        <div style={{width: "35%"}}>
                        <InputGroup className="mb-3 bg-soft-light rounded-3">
                            <span className="input-group-text text-muted" id="basic-addon3">
                                {/* <i className="ri-user-2-line"></i> */}
                                <FontAwesomeIcon icon={faClock}/>
                            </span>
                            <Select options={options} defaultValue={{value: 7, label: "Last 7 days"}} onChange={(e) => this.updateDataCopies(e.value)} unstyled={true} className="form-control form-control-lg border-light bg-soft-light" classNames={{option: (state) => "form-control form-control-lg"}}/>
                        </InputGroup>
                        </div>


                        <Button type="input" color="primary" onClick={() => this.sumOfCalls()} className="font-size-16 btn-lg chat-send waves-effect waves-light">
                            <FontAwesomeIcon icon={faArrowsRotate}/>
                        </Button>

                    </div>
                    <div style={{width: "47vw", marginLeft: "25%"}}>
                        <BarChart chartData={Cdata}/>
                    </div>
                    <div style={{width: "35%", marginLeft: "32%"}}>
                        <ul className="shadow-none border mb-2 py-3">
                            {
                                Object.keys(this.state.Pdata).map((key, value) => (
                                    <li key={key} >
                                        <div className="d-flex align-items-center mb-0">
                                            <div className="flex-grow-1">
                                                <h5 className="font-size-14 m-0">{key}</h5>
                                            </div>
                                                            
                                            <div>
                                                {this.state.Pdata[key]}
                                            </div>
                                            
                                        </div>
                                    </li>)
                                )
                            }
                        </ul>
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