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


class Game extends React.Component {
    constructor() {
        super()
        this.state = {
            started: false,
            ended: false,
            name : '',
            player_data: [],
            others_data: {},
            food_data: [],
            endpoint: '10.0.0.65'
        }
        this.socket = io(this.state.endpoint);
        this.newdir = ''
        this.dir = 'R'

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleKeys   = this.handleKeys.bind(this)
        this.move = this.move.bind(this)
    }
    componentDidMount() {
        this.bindKeys()
        this.draw()
    }
    componentDidUpdate() {
        this.draw()
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
        this.state.started = true
        this.setState({})
        this.game()
    }
    move(locations, direction, food){
    /*
    REQUIRES: valid snake and direction
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
        }
        function moveD(){
            const n = locations.length
            locations.push( 
            { 
                x : locations[n-1].x, 
                y : locations[n-1].y + 10
            })
        }
        function moveR(){
            const n = locations.length
            locations.push( 
            { 
                x : locations[n-1].x + 10, 
                y : locations[n-1].y
            })
        }
        function moveL(){
            const n = locations.length
            locations.push( 
            { 
                x : locations[n-1].x - 10,
                y : locations[n-1].y
            })
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
        let head_x = locations[locations.length - 1].x
        let head_y = locations[locations.length - 1].y

        let collision = (head_x < 0 || head_y < 0 || head_x >= 600 || head_y >= 600)

        if( collision === false){
            Object.keys(this.state.others_data).forEach(player => {
                this.state.others_data[player].forEach(block => {
                    if( block.x === head_x && block.y === head_y){
                        collision = true
                    }
                })
            })
        }

        if( collision === false){
            for(let i =  this.state.player_data.length - 2; i>=0; i--){
                let block = this.state.player_data[i]
                if(block.x === head_x && block.y === head_y){
                    collision = true
                }
            }
        }

        if( collision === true){
            this.state.ended = true
            this.state.player_data = []
            this.socket.emit("request", {
                type : "over",
                name : this.state.name,
            })
        }
        else{
            let grow = false
            food.forEach(food_pos => {
                if( food_pos.x === head_x && food_pos.y === head_y){
                    console.log("whoopsie I am sending")
                    this.socket.emit("request", {
                        type : "consume",
                        name : this.state.name,
                        data : food_pos}
                    )
                    grow = true
                }
            })
            if( grow === false){
                locations.shift()
            }
        }
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
            delete this.state.others_data[this.state.name]
            console.log("player data :",this.state.player_data)
            setInterval(() => {
                if( this.newdir !== ''){
                    this.dir = this.newdir
                    this.newdir = ''
                }
                if( !this.state.ended){
                    this.move(this.state.player_data, this.dir, this.state.food_data)
                    this.socket.emit("request", 
                        {
                            type: "update",
                            name: this.state.name,
                            data: this.state.player_data
                        })
                }
                this.setState({})
                } , 250
            ) 
        })
        this.socket.on("update", (data1, data2) => {
            delete data1[this.state.name]
            this.state.others_data = data1
            this.state.food_data = data2
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
        if( this.state.started){
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
    }
    draw() {
        /*
        REQUIRES: component needs to be mounted
        MODIFIES: canvas
        EFFECTS : draws checkers, snakes, and food
        */
        const ctx = this.refs.canvas.getContext('2d')
        ctx.clearRect(0, 0, 600, 600);
        var pattern = document.createElement('canvas');
        pattern.width = 20;
        pattern.height = 20;
        var pctx = pattern.getContext('2d');

        pctx.fillStyle = "rgb(193,245,77)"
        pctx.fillRect(0,0,10,10)
        pctx.fillRect(10,10,10,10)
        pctx.fillStyle = "rgb(203,245,97)"
        pctx.fillRect(0,10,10,10)
        pctx.fillRect(10,0,10,10)

        var pattern = ctx.createPattern(pattern, "repeat");
        ctx.fillStyle = pattern;
        ctx.fillRect(0,0,600,600)

        ctx.fillStyle = "rgb(255,0,0)"
        this.state.food_data.forEach( block => 
            ctx.fillRect(block.x, block.y, 10, 10)
        )
        ctx.fillStyle = "rgb(50,205,50)"
        Object.keys(this.state.others_data).forEach( player => {
            this.state.others_data[player].forEach( block => 
                ctx.fillRect(block.x + 1, block.y + 1, 8, 8)
            )
            let head = this.state.others_data[player][this.state.others_data[player].length - 1]
            ctx.fillRect(head.x , head.y , 10,10 )
        })
        ctx.fillStyle = "rgb(30,144,255)"
        this.state.player_data.forEach( block => 
            ctx.fillRect(block.x + 1,block.y + 1, 8, 8)
        )
        if( this.state.player_data.length > 0){
            let head = this.state.player_data[this.state.player_data.length - 1]
            ctx.fillRect(head.x , head.y , 10,10 )
        }
    }
    render() {
        const allplayers = Object.keys(this.state.others_data).concat([this.state.name])
        const list = allplayers.map( name => (
                <div key="name">
                    {name + " "} 
                    { name === this.state.name && 
                        this.state.player_data.length
                    }
                    { name !== this.state.name &&
                        this.state.others_data[name].length
                    }
                </div>
            ))
        return (
            <div>
                <canvas ref="canvas" width={600} height={600} 
                    style={{border:"5px solid rgb(50,205,50)", float: "left"}}> 
                </canvas>
                <div ref="names" width={200}></div>
                {
                    !this.state.started &&
                     <form onSubmit={this.handleSubmit}>
                        <input type="text" onChange={this.handleChange}/>
                    </form>
                }
                {
                    this.state.started &&
                    <p> {list} </p>
                }
            </div>
        );
    }
}
ReactDOM.render(<Game/>, document.getElementById('app'))