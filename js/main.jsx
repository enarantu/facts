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
    function moveU(){
        const n = locations.length
        locations.push( 
        { 
            x : locations[n-1].x, 
            y : locations[n-1].y - 10
        })
        locations.shift()
    }
    function moveD(){
        const n = locations.length
        locations.push( 
        { 
            x : locations[n-1].x, 
            y : locations[n-1].y + 10
        })
        locations.shift()
    }
    function moveR(){
        const n = locations.length
        locations.push( 
        { 
            x : locations[n-1].x + 10, 
            y : locations[n-1].y
        })
        locations.shift()

    }
    function moveL(){
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
            moveR()
            break
        case 'L':
            moveL()
            break
        case 'U':
            moveU()
            break
        case 'D':
            moveD()
            break
        default:
            console.log("unhandled direction", direction)
            break
    }
    locations[locations.length - 1].x += 800
    locations[locations.length - 1].x %= 800
    locations[locations.length - 1].y += 600
    locations[locations.length - 1].y %= 600
}

class Game extends React.Component {
    constructor() {
        super()
        this.state = {
            started: false,
            name : '',
            player_data: [],
            others_data: {},
            endpoint: '10.0.0.65'
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
        this.setState({})
        this.game()
    }
    game(){
        /*
        REQUIRES: this.state.started to be true
        MODIFIES: everything
        EFFECTS: controls the game
        */
        this.socket.emit("new-player", this.state.name);
        this.socket.on("new-player", (data) => {
            console.log("new-player", data)
            console.log("server player_data", data.player_data)
            this.state.player_data = data.player_data
            this.state.others_data = data.others_data
            console.log("player data :",this.state.player_data)
            setInterval(() => {
                if( this.newdir !== ''){
                    this.dir = this.newdir
                    this.newdir = ''
                }
                move(this.state.player_data, this.dir)
                this.socket.emit("request", this.state.player_data)
                this.setState({})
                } , 250
            ) 
        })
        this.socket.on("update", (data) => {
            console.log("update", data)
            delete data[this.state.name]
            this.state.others_data = data
        })
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
        const ctx = this.refs.canvas.getContext('2d')
        ctx.clearRect(0, 0, 800, 600);
        var pattern = document.createElement('canvas');
        pattern.width = 20;
        pattern.height = 20;
        var pctx = pattern.getContext('2d');

        // Two green rects make a checkered square: two green, two transparent (white)
        pctx.fillStyle = "rgb(188, 222, 178)";
        pctx.fillRect(0,0,10,10);
        pctx.fillRect(10,10,10,10);

        var pattern = ctx.createPattern(pattern, "repeat");
        ctx.fillStyle = pattern;
        ctx.fillRect(0,0,800,600)

        ctx.fillStyle = "#FF0000"
        Object.keys(this.state.others_data).forEach( player => {
            this.state.others_data[player].forEach( block => 
                ctx.fillRect(block.x, block.y, 10, 10)
            )
        })
        this.state.player_data.forEach( block => 
            ctx.fillRect(block.x,block.y, 10, 10)
        )
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