import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import io from 'socket.io-client'

var KEY = {
    LEFT:  37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40
}

function move(locations, direction){
    /*
    REQUIRES: direction should be a valid direction, snake should be a valid snake
    MODIFIES: locations of the snake
    EFFECTS: moves the snake
    */
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
        super()
        this.state = {
            started: false,
            name : '',
            player_data: {},
            others_data: {},
            endpoint: 'localhost'
        }
        this.socket = null
        this.newdir = ''
        this.dir = 'R'

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleKeys   = this.handleKeys.bind(this)
    }
    componentDidMount() {
        this.bindKeys()
        this.drawPlayers()
    }
    componentDidUpdate() {
        this.drawPlayers()
    }
    componentWillUnmount() {
        this.unbindKeys()
    }
    handleSubmit(event){
        /*
        REQUIRES: user to click submit
        MODIFIES: this.state.started
        EFFECTS:  declares the game to started and starts game
        */
        this.socket = io(this.state.endpoint);
        this.state.started = true
        game()
    }
    game(){
        /*
        REQUIRES: this.state.started to be true
        MODIFIES: everything
        EFFECTS: controls the game
        */
        this.socket.emit("new-player", this.state.name);
        this.socket.on("new-player", (data) => {
            this.state.player_data = data.player_data
            this.state.others_data = data.others_data
        })
        this.socket.on("update", (data) => {
            delete data[this.state.name]
            this.state.others_data = data
        })
        setInterval(() => {
            if( this.newdir !== ''){
                this.dir = this.newdir
                this.newdir = ''
            }
            move(this.player_data, this.dir)
            this.socket.emit("request", this.state.player_data)
            this.setState({})
        } , 250)
        
    }

    handleChange(event){
        /*
        REQUIRES: keyboard to be bound
        MODIFIES: player name
        EFFECTS : setState is called, so rerenders
        */
        this.setState({
            name : event.target.value
        });
    }

    bindKeys() {
        window.addEventListener('keydown', this.handleKeys);
    }
    unbindKeys() {
        window.removeEventListener('keydown', this.handleKeys);
    }
    handleKeys(e){
        /*
        REQUIRES: player has given a name and connected to the game
        MODIFIES: new direction variable this.newdir
        EFFECTS:  prepares this.newdir for the next frame
        */
        switch (e.keyCode) {
            case KEY.LEFT:
                if(this.dir !== "R"){
                    this.newdir = "L"
                }
                break
            case KEY.RIGHT:
                if(this.dir !== "L"){
                    this.newdir = "R"
                }
                break
            case KEY.UP:
                if(this.dir !== "D"){
                    this.newdir = "U"
                }
                break;
            case KEY.DOWN:
                if(this.dir !== "U"){
                    this.newdir = "D"
                }
                break
            default:
                return
        }
    }
    drawPlayers() {
        /*
        REQUIRES: component needs to be mounted
        MODIFIES: canvas
        EFFECTS : draws snakes on canvas
        */
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
                <canvas ref="canvas" width={800} height={600} 
                        style={{border:"1px solid #000000", float: "left"}}> </canvas>
                <div ref="names" width={200}></div>
                {
                    !this.state.started &&
                     <form onSubmit={this.handleSubmit}>
                        <input type="text" onChange={this.handleChange}/>
                    </form>
                }
                {
                    this.state.started &&
                    <p> {JSON.stringify(this.state.players)} </p>
                }
                <div style={{whiteSpace:"pre"}}>
                    State: <br></br>
                    {
                        JSON.stringify(this.state, undefined, 2)
                    }
                </div>
            </div>
        );
    }
}
ReactDOM.render(<Game/>, document.getElementById('app'))