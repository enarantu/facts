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
            ended: false,
            name : this.props.name,
            player_data: [],
            others_data: {},
            food_data: [],
            power_data: {},
            player_power: {},
            endpoint: '10.0.0.65'
        }
        this.socket = io(this.state.endpoint);
        this.socket.on("update", (data1, data2, data3) => {
            delete data1[this.state.name]
            this.state.others_data = data1
            this.state.food_data = data2
            this.state.power_data = data3
        })
        console.log("gets here")
        this.newdir = ''
        this.dir = 'R'
        this.even = true
        this.game_loop = null
    }
    componentDidMount() {
        this.bindKeys()
        this.newGame()
    }
    componentWillUnmount() {
        this.unbindKeys()
        this.socket.disconnect()
        clearInterval(this.game_loop)
    }
    collision(){
        this.state.player_data = []
        this.socket.emit("request", {
            type : "over",
            name : this.state.name,
        })
        clearInterval(this.game_loop)
    }
    food_consume(food_pos){
        this.socket.emit("request", {
            type : "consume",
            name : this.state.name,
            data : food_pos
        })
    }
    double_consume(){
        this.state.player_power.double = 100
        this.socket.emit("request",{
            type: "power",
            power_type: "double",
            name : this.state.name,
        })
    }
    send_update(){
        this.socket.emit("request", {
            type: "update",
            name: this.state.name,
            data: this.state.player_data
        })
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
        else if(logic.will_hit_double(this.state.power_data, head)){
            this.double_consume()
            this.state.player_data.shift()
        }
        else{
            const block = logic.will_hit_food(this.state.food_data, head)
            if(block.x >= 0 && block.y >= 0){
                this.food_consume(block)
            }
            else{
                this.state.player_data.shift()
            }
        }
    }

    newGame(){
        this.socket.emit("new-player", this.state.name)
        this.socket.on("new-player", (data) => {
            this.state.player_data = data.player_data
        })
        this.game_loop = setInterval(this.tick, 100)
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
        this.send_update()
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
        }
    }
    render() {

        return (
            <div>
                {<Field others_data = {this.state.others_data}
                        player_data = {this.state.player_data}
                        food_data   = {this.state.food_data}
                        power_data  = {this.state.power_data}/>
                }
            </div>
        )
    }
}

export default Game