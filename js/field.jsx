import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'


class Field extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            others_data : [],
            player_data : [],
            food_data: [],
            power_data: []
        }
    }
    componentDidMount(){
        this.draw()
    }
    componentDidUpdate(){
        this.draw()
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ others_data : nextProps.others_data,
                        player_data : nextProps.player_data,
                        food_data   : nextProps.food_data,
                        power_data  : nextProps.power_data});  
    }
    render(){
        return (
            <canvas ref="canvas" width={600} height={600} 
                style={{border:"5px solid rgb(50,205,50)", float: "left"}}> 
            </canvas>
        )
    }
    draw_pattern(){
        const pattern = document.createElement('canvas');
        pattern.width = 40;
        pattern.height = 40;
        const pctx = pattern.getContext('2d');
        pctx.fillStyle = "rgb(193,245,77)"
        pctx.fillRect(0,0,20,20)
        pctx.fillRect(20,20,20,20)
        pctx.fillStyle = "rgb(203,245,97)"
        pctx.fillRect(0,20,20,20)
        pctx.fillRect(20,0,20,20)

        const ctx = this.refs.canvas.getContext('2d')
        ctx.fillStyle = ctx.createPattern(pattern, "repeat");
        ctx.fillRect(0,0,600,600)
    }
    draw_food(){
        const ctx = this.refs.canvas.getContext('2d')
        ctx.fillStyle = "rgb(255,0,0)"
        this.state.food_data.forEach( block => {
            ctx.beginPath()
            ctx.arc(block.x + 10, block.y + 10, 6, 0, 2*Math.PI)
            ctx.fill()
        })
    }
    draw_power(){
        const ctx = this.refs.canvas.getContext('2d')
        this.state.power_data.forEach(power => {
            if(power.block_type === 'double'){
                ctx.fillStyle = "rgb(255,0,0)"
                ctx.beginPath()
                ctx.arc(power.x + 10, power.y + 10, 9, 0, 2*Math.PI)
                ctx.fill()
            }
        })
    }
    draw_others(){
        const ctx = this.refs.canvas.getContext('2d')
        ctx.fillStyle = "rgb(50,205,50)"
        this.state.others_data.forEach( player => {
            player.blocks.forEach( block => 
                ctx.fillRect(block.x + 2, block.y + 2, 16, 16)
            )
            if(player.blocks.length > 0){
                let head = player.blocks[player.blocks.length - 1]
                ctx.fillRect(head.x , head.y , 20,20 )
            }
        })
    }
    draw_self(){
        const ctx = this.refs.canvas.getContext('2d')
        ctx.fillStyle = "rgb(30,144,255)"
        this.state.player_data.forEach( block => 
            ctx.fillRect(block.x + 2,block.y + 2, 16, 16)
        )
        if( this.state.player_data.length > 0){
            let head = this.state.player_data[this.state.player_data.length - 1]
            ctx.fillRect(head.x , head.y , 20,20 )
        }
    }
    draw(){
        this.draw_pattern()
        this.draw_food()
        this.draw_power()
        this.draw_others()
        this.draw_self()
    }
}

export default Field