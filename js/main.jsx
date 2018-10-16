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


function move(locations, direction){
    function moveU(locations){
        const n = locations.length
        locations.push( 
        { 
            x : locations[n-1].x, 
            y : locations[n-1].y - 10
        })
        locations.shift()
    }
    function moveD(locations){
        const n = locations.length
        locations.push( 
        { 
            x : locations[n-1].x, 
            y : locations[n-1].y + 10
        })
        locations.shift()

    }
    function moveR(locations){
        const n = locations.length
        locations.push( 
        { 
            x : locations[n-1].x + 10, 
            y : locations[n-1].y
        })
        locations.shift()

    }
    function moveL(locations){
        const n = locations.length
        locations.push( 
        { 
            x : locations[n-1].x - 10,
            y : locations[n-1].y
        })
        locations.shift()
    }
    switch(direction){
        case 'R':
            moveR(locations)
            break
        case 'L':
            moveL(locations)
            break
        case 'U':
            moveU(locations)
            break
        case 'D':
            moveD(locations)
            break
        default:
            console.log("unhandled direction", direction)
            break
    }
}

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            started: false,
            name: '',
            locations: {},
            directions: {},
            timesteps: {},
            
            endpoint: 'localhost'
        }
        this.socket = null
        this.request_queue = []
        this.timestep = -1

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleSubmit(event){
        this.socket = io(this.state.endpoint);
        this.socket.emit("new-player", this.state.name);
        this.socket.on("new-player", (data) => {
            console.log('new-player', data)
            clientstep = data.timestep + 1
        })
        setInterval(() => {clientstep += 1} , 250)
        this.state.started = true
        this.setState({})
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
        if( request_queue.length == 0 || request_queue[request_queue.length - 1].step < clientstep ){
            var msg = {}
            msg.request_type = 'dir-change'
            msg.player_name = this.state.name
            switch (e.keyCode) {
                case KEY.LEFT:
                    msg.dir = "L"
                    break;
                case KEY.RIGHT:
                    msg.dir = "R"
                    break;
                case KEY.UP:
                    msg.dir = "U"
                    break;
                case KEY.DOWN:
                    msg.dir = "D"
                    break;
                default:
                    return
            }
            if(msg.dir === dir){
                return
            }
            dir = msg.dir
            msg.step = clientstep
            if(this.state.started){
                this.socket.emit('request', msg)
                request_queue.push(msg)
            }
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
        Object.keys(this.state.players).forEach( player => {
            this.state.players[player].forEach( block => 
                ctx.fillRect(block.x, block.y, 10, 10)
            )
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