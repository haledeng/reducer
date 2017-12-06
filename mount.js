import {
    connect,
    connectAdvanced
} from 'react-redux';
import PropTypes from 'prop-types'

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
            return createElement()

        }
    }

    const HOC = (factory) => {
        class Wrapper extends Component {
            render() {
                return createElement(factory, )
            }
        };

        Wrapper.contextTypes = {
            store: PropTypes.shape({
                subscribe: PropTypes.func.isRequired,
                dispatch: PropTypes.func.isRequired,
                getState: PropTypes.func.isRequired
            })
        }
    }

    return HOC(selectorFactory)
}