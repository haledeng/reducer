import {
    connect,
    connectAdvanced
} from 'react-redux';

import {
    bindActionCreators
} from 'redux';

import React, {Component, createElement} from 'react';

const defaultMapDispath = (state) => {
    return (dispatch) => {
        return {
            action: bindActionCreators(state.__actions__, dispatch);
        }
    };
}

export default function(mapStateToProps, mapDispatchToProps = ) {
    class HOC extends Component {
        render() {
            return (
            )

        }
    }

    return HOC(selectorFactory)
}