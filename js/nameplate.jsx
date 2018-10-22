import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class Nameplate extends React.Component{
    constructor(props){
        super(props)
        this.state = this.props
    }
    render(){
        return (
            <p className={this.state.is_self ? 'bg-primary' : 'bg-success'}>
                <h1>{this.state.name}</h1>
                <h1> {this.state.score}</h1>
            </p>
        )
    }
}

export default Nameplate