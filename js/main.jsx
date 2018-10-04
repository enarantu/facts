import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'
import io from 'socket.io-client';

var KEY = {
    LEFT:  37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40
};




class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            started: false,
            players: [],
            name: '',
            endpoint: 'http://192.168.1.4'
        }
        this.socket = null
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleSubmit(event){
        this.socket = io(this.state.endpoint);
        this.socket.emit("new-player", this.state.name);
         this.socket.on('update', (data)=>{
            console.log(data);
            this.setState({players : data});
        });
        this.setState({
            started: true
        })
    }
    handleChange(event){
        this.setState({
            name: event.target.value,
        });
    }

    bindKeys() {
        window.addEventListener('keydown', this.handleKeys.bind(this));
    }

    unbindKeys() {
        window.removeEventListener('keydown', this.handleKeys);
    }
    handleKeys(e){
        var msg
        switch (e.keyCode) {
            case KEY.LEFT:
                msg = "L"
                break;
            case KEY.RIGHT:
                msg = "R"
                break;
            case KEY.UP:
                msg = "U"
                break;
            case KEY.DOWN:
                msg = "D"
                break;
            default:
                return
        }
        if(this.state.started){
            console.log(msg)
            this.socket.emit('movement',msg)
        }
    }
    componentDidMount() {
        this.bindKeys(); 
        this.drawPlayers();
    }
    componentDidUpdate() {
        this.drawPlayers()
    }
    componentWillUnmount() {
        this.unbindKeys();
    }
    drawPlayers() {
        const ctx = this.refs.canvas.getContext('2d');
        ctx.clearRect(0, 0, 1200, 800);
        Object.keys(this.state.players).forEach((player) => {
            ctx.fillRect(this.state.players[player].x, this.state.players[player].y, 10, 10);
        });
    }
    render() {
        return (
            <div>
                <canvas ref="canvas" width={800} height={600} style={{border:"1px solid #000000", float: "left"}}> </canvas>
                <div ref="names" width={200}>
                </div>
                {!this.state.started &&
                 <form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        onChange={this.handleChange}
                     />
                </form>
                }
                {
                    this.state.started &&
                    <p> {JSON.stringify(this.state.players)} </p>
                }
                <div style={{whiteSpace:"pre"}}>
                    State: <br></br>
                    {JSON.stringify(this.state, undefined, 4)}
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Game/>, document.getElementById('app'));