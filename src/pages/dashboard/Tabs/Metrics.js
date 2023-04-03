import React, { Component } from 'react';
import { connect } from "react-redux";

import { withTranslation } from 'react-i18next';


//actions
import { createGroup } from "../../../redux/actions";

class Metrics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenCollapse: false,
        }
        // this.toggleCollapse = this.toggleCollapse.bind(this);
    }

    

    // toggleCollapse() {
    //     this.setState({ isOpenCollapse: !this.state.isOpenCollapse });
    // }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({
                groups: this.props.groups
            });
        }
    }

   
    
    render() {
        const { t } = this.props;
        return (
            <React.Fragment>
                <div style={{width: "100%"}}>
                    <div className="p-4">
                        
                        
                        <h4 className="mb-4">{t('Metrics')}</h4>

                        
                        

                        
                       
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

export default (connect(mapStateToProps, { createGroup })(withTranslation()(Metrics)));