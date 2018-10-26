import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import io from 'socket.io-client'

import Field from './field'
import Scoreboard from './scoreboard'
import logic from './gamelogic'

var KEY = {
    LEFT:  37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40
}


class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: -1,
            name : this.props.name,
            player_data: [],
            others_data: {},
            food_data: [],
            power_data: {},
            player_power: {
                double: 0
            },
            endpoint: 'localhost'
        }
        this.ongoing = false
        this.socket = io(this.state.endpoint);
        this.socket.on("update", (data1, data2, data3) => {
            delete data1[this.state.name]
            console.log('recieved update', data1, data2, data3)
            this.state.others_data = data1
            this.state.food_data = data2
            this.state.power_data = data3
            if(!this.ongoing){
                this.setState({})
            }
        })
        this.socket.on("new-player", (data, id) => {
            this.state.player_data = data
            this.state.id = id
            this.game_loop = setInterval(this.tick, 100)
            this.ongoing = true
        })
        this.newdir = ''
        this.dir = 'R'
        this.even = true
        this.game_loop = null
        this.tick = this.tick.bind(this)
        this.handleKeys   = this.handleKeys.bind(this)
        this.tick_helper = this.tick_helper.bind(this)
        this.collision = this.collision.bind(this)
        this.consume = this.consume.bind(this)
        this.update = this.update.bind(this)
        this.newgame = this.newgame.bind(this)
    }
    componentDidMount() {
        this.bindKeys()
        this.newgame()
    }
    componentWillUnmount() {
        this.unbindKeys()
        clearInterval(this.game_loop)
        this.socket.disconnect()
        this.ongoing = false
    }
    collision(){
        this.state.player_data = []
        this.socket.emit("request", {
            type : "over",
            id : this.state.id,
        })
        clearInterval(this.game_loop)
        this.ongoing = false
    }
    consume(pos){
        this.socket.emit("request", {
            type : "consume",
            block : pos
        })
    }
    update(){
        this.socket.emit("request", {
            type: "update",
            id: this.state.id,
            blocks: this.state.player_data
        })
    }
    newgame(){
        this.socket.emit("new-player", this.state.name)
    }
    tick_helper(){
    /*
    REQUIRES: valid snake and direction
    MODIFIES: locations of the snake
    EFFECTS: moves the snake
    */
        const head = logic.prospective_block(this.state.player_data, this.dir)
        if(logic.will_hit_wall(head) ||
           logic.will_hit_self(this.state.player_data, head) ||
           logic.will_hit_others(this.state.others_data, head) ) {
            this.collision()
        }
        
        this.state.player_data.push(head)
        if(logic.will_hit_double(this.state.power_data.double, head)){
            this.consume(head)
        }
        else{
            const block = logic.will_hit_food(this.state.food_data, head)
            if(block.x >= 0 && block.y >= 0){
                this.consume(head)
            }
            else{
                this.state.player_data.shift()
            }
        }
    }

    tick(){
        /*
        REQUIRES: this.state.started to be true
        MODIFIES: everything
        EFFECTS: controls the game
        */
        if(this.even || this.state.player_power.double > 0){
            if( this.newdir !== ''){
                this.dir = this.newdir
                this.newdir = ''
            }
            this.tick_helper(this.state.player_data, this.dir, this.state.food_data)
            if(!this.even){
                this.state.player_power.double -= 1
            }
        }
        this.update()
        this.setState({})
        this.even = !this.even
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
            console.log("NEWDIR:", this.newdir)
        }
    }
    render() {
        const tempObj = {}
        tempObj[this.state.name] = this.state.player_data
        const cdata = Object.assign(tempObj , this.state.others_data)
        const sprops = Object.keys(cdata).map( name => {
            return {
                name : name,
                score : cdata[name].length,
                is_self : name === this.state.name
            }
        })
        return (
            <div>
                {<Field others_data = {this.state.others_data}
                        player_data = {this.state.player_data}
                        food_data   = {this.state.food_data}
                        power_data  = {this.state.power_data}/>
                }
                {
                    <Scoreboard data ={sprops}/>
                }
            </div>
        )
    }
}

export default Game