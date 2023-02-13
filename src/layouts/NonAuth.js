import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux"
import PropTypes from "prop-types";
import { changeLayoutMode } from '../redux/actions';

class NonAuth extends Component {
    constructor(props) {
        super(props);
        this.state={};
        this.capitalizeFirstLetter.bind(this);
    }
    
    capitalizeFirstLetter = string => {
        return string.charAt(1).toUpperCase() + string.slice(2);
    };

    componentDidMount(){
        var getLayoutMode = localStorage.getItem("layoutMode");
        this.props.changeLayoutMode(getLayoutMode);
        if (getLayoutMode) {
            this.props.changeLayoutMode(getLayoutMode);
        } else {
            this.props.changeLayoutMode(this.props.layoutMode);
        }

        let currentage = this.capitalizeFirstLetter(this.props.location.pathname);

        document.title =
          currentage + " | Chatvia - Responsive Bootstrap 5 Admin Dashboard";
    }
    render() {
        return <React.Fragment>
            {this.props.children}
        </React.Fragment>;
    }
}

NonAuth.propTypes = {
    layoutMode: PropTypes.any,
  };

const mapStateToProps = state => {
    const { layoutMode } = state.Layout;
    return { layoutMode };
  };

export default withRouter(connect(mapStateToProps, { changeLayoutMode })(NonAuth))