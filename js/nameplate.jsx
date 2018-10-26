import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class Nameplate extends React.Component{
    constructor(props){
        super(props)
        this.state = {}
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            name : nextProps.name,
            score : nextProps.score,
            is_self : nextProps.is_self
        })
    }
    render(){
        return (
            <h1 className={this.state.is_self ? 'bg-primary' : 'bg-success'}>
                {this.state.name} {this.state.score}
            </h1>
        )
    }
}

export default Nameplate