import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'


class Field extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            others_data : {},
            player_data : [],
            food_data: [],
            power_data: {}
        }
    }
    componentDidMount(){
        this.draw()
    }
    componentDidUpdate(){
        this.draw()
    }
    render(){
        return (
            <canvas ref="canvas" width={600} height={600} 
                style={{border:"5px solid rgb(50,205,50)", float: "left"}}> 
            </canvas>
        )
    }
    draw_pattern(){
        const pattern = document.createElement('checkered');
        const pctx = pattern.getContext('2d');
        pattern.width = 40;
        pattern.height = 40;
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
        ctx.fillStyle = "rgb(255,0,0)"
        this.state.food_data.forEach( block => {
            ctx.beginPath()
            ctx.arc(block.x + 10, block.y + 10, 6, 0, 2*Math.PI)
            ctx.fill()
        })
    }
    draw_power(){
        if(this.state.power_data.hasOwnProperty("double")){
            let coord = this.state.power_data.double
            ctx.fillStyle = "rgb(255,215,0)"
            ctx.beginPath()
            ctx.arc(coord.x + 10, coord.y + 10, 6, 0, 2*Math.PI)
            ctx.fill()
        }
    }
    draw_others(){
        ctx.fillStyle = "rgb(50,205,50)"
        Object.keys(this.state.others_data).forEach( player => {
            this.state.others_data[player].forEach( block => 
                ctx.fillRect(block.x + 2, block.y + 2, 16, 16)
            )
            if(this.state.others_data[player].length > 0){
                let head = this.state.others_data[player][this.state.others_data[player].length - 1]
                ctx.fillRect(head.x , head.y , 20,20 )
            }
        })
    }
    draw_self(){
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