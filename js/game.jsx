import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import io from 'socket.io-client'

import Field from './field'
import Scoreboard from './scoreboard'
import logic from './gamelogic'
import Direction from './direction'
import { Progress, Button } from 'reactstrap'

class OddEven{
    constructor(){
        this.even = true
        this.double = 0
    }
    get(){
        if(this.even){
            this.even = false
            return true
        }
        else if(this.double > 0){
            this.double--
            this.even = true
            return true
        }
        else{
            this.even = true
            return false
        }
    }
    boost(){
        this.double = 100
    }
    restart(){
        this.double = 0
        this.even = true
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            player_data: [],
            others_data: [],
            food_data: [],
            power_data: []
        }
        this.highscore = 0
        this.dir = new Direction()
        this.oe = new OddEven()
        this.id = -1
        this.name = this.props.name
        this.ongoing = false
        this.socket = io('https://localhost');
        this.socket.on("update", (data1, data2, data3) => {
            for(let i = data1.length - 1; i >= 0; i--){
                if(data1[i].id === this.id){
                    data1.splice(i,1)
                }
            }
            this.state.others_data = data1
            this.state.food_data = data2
            this.state.power_data = data3
            if(!this.ongoing){
                this.setState({})
            }
        })
        this.socket.on("new-player", (data, id) => {
            this.state.player_data = data
            this.id = id
            this.game_loop = setInterval(this.tick, 100)
        })
        this.game_loop = null
        this.tick = this.tick.bind(this)
        this.handleKeys   = this.handleKeys.bind(this)
        this.tick_helper = this.tick_helper.bind(this)
        this.collision = this.collision.bind(this)
        this.consume = this.consume.bind(this)
        this.update = this.update.bind(this)
        this.newgame = this.newgame.bind(this)
        this.restart = this.restart.bind(this)
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
            id : this.id,
        })
        clearInterval(this.game_loop)
        console.log("collision")
        this.ongoing = false
        this.oe.restart()
        this.dir.restart()
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
            id: this.id,
            blocks: this.state.player_data
        })
    }
    restart(){
        this.state.player_data = [
            {
                x :  140,
                y :  140
            },
            {
                x : 160,
                y : 140
            },
            {
                x : 180,
                y : 140
            }
        ]
        this.ongoing = true
        this.game_loop = setInterval(this.tick, 100)
    }
    newgame(){
        this.ongoing = true
        this.socket.emit("new-player", this.name)
    }
    tick_helper(){
    /*
    REQUIRES: valid snake and direction
    MODIFIES: locations of the snake
    EFFECTS: moves the snake
    */
        if(this.highscore < this.state.player_data.length){
            this.highscore = this.state.player_data.length
        }
        const head = logic.prospective_block(this.state.player_data, this.dir.get_dir())
        const outcome = logic.outcome(this.state.player_data, this.state.others_data, this.state.food_data, this.state.power_data, head)
        switch(outcome){
            case 'collision':
                this.collision()
                break
            case 'food':
                this.state.player_data.push(head)
                this.consume(head)
                break
            case 'double':
                this.oe.boost()
                this.consume(head)
                this.state.player_data.push(head)
                break
            default:
                this.state.player_data.push(head)
                this.state.player_data.shift()
                break
        }
        
    }

    tick(){
        /*
        REQUIRES: this.state.started to be true
        MODIFIES: everything
        EFFECTS: controls the game
        */
        if(this.oe.get()){
            this.tick_helper()
        }
        this.update()
        this.setState({})
    }

    bindKeys() {
        window.addEventListener('keydown', this.handleKeys);
    }
    unbindKeys() {
        window.removeEventListener('keydown', this.handleKeys);
    }
    handleKeys(e){
        this.dir.user_input(e.keyCode)
    }
    render() {
        const sprops = this.state.others_data.map(player => {
            return {
                name : player.name,
                score : player.blocks.length,
                is_self : false
            }
        }).concat([{
            name : this.name,
            score : this.state.player_data.length,
            is_self : true
        }])
        return (
            <div>
                {<Field others_data = {this.state.others_data}
                        player_data = {this.state.player_data}
                        food_data   = {this.state.food_data}
                        power_data  = {this.state.power_data}/>
                }
                    
                    <Progress value={this.oe.double} color='danger'/>
                    <b>Online Players</b>
                    <Scoreboard data ={sprops}/>
                    <b>Your Highscore {this.highscore}</b>
                    {   !this.ongoing &&
                        <Button onClick={this.restart} color='danger'>Retry</Button>
                    }
            </div>
        )
    }
}

export default Game