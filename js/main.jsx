import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import Game from './game'

class ModalExample extends React.Component {
  constructor() {
    console.log("gets here")
    super()
    this.state = {
      name: "",
      modal: false
    }
    this.toggle = this.toggle.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }
  handleChange(event){
    this.setState({
      name : event.target.value
    });
  }
  render() {
    return (
      <div className="h-100 w-100 d-flex justify-content-center align-items-center bg-primary">
          <input type="text" id="name" maxLength="5" size="5" style={{fontSize : 40}} onChange={this.handleChange}/>
          <Button color="danger" onClick={this.toggle} style={{fontSize : 40}}>PLAY</Button>
        <Modal size="lg" isOpen={this.state.modal} toggle={this.toggle}>
          <ModalBody>
            {<Game name = {this.state.name} />}
          </ModalBody>
          <Button color="secondary" onClick={this.toggle}>Cancel</Button>
        </Modal>
      </div>
    );
  }
}
ReactDOM.render(<ModalExample/>, document.getElementById('app'))