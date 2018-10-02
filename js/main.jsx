import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'

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
            input: {
                left: false, 
                right: false, 
                up: false, 
                down: false
            },
            speed: 10,
            x : 150,
            y : 150
        }
    }
    bindKeys() {
        window.addEventListener('keyup',   this.handleKeys.bind(this, false));
        window.addEventListener('keydown', this.handleKeys.bind(this, true));
    }

    unbindKeys() {
        window.removeEventListener('keyup', this.handleKeys);
        window.removeEventListener('keydown', this.handleKeys);
    }
    handleKeys(value, e){
        let keys = this.state.input;
        switch (e.keyCode) {
          case KEY.LEFT:
             keys.left  = value;
             break;
          case KEY.RIGHT:
             keys.right  = value;
             break;
          case KEY.UP:
             keys.up  = value;
             break;
          case KEY.DOWN:
             keys.down  = value;
             break;
        }
        this.setState({input : keys}) 
        if ( keys.up ){
            this.state.y -= this.state.speed
        }
        if (keys.down){
            this.state.y += this.state.speed
        }
        if (keys.left){
            this.state.x -= this.state.speed
        }
        if (keys.right){
            this.state.x += this.state.speed
        }
        this.update()
    }
    componentDidMount() {
        this.bindKeys(); 
        this.update()
    }
    componentWillUnmount() {
        this.unbindKeys();
    }
    update() {
        const ctx = this.refs.canvas.getContext('2d');
        ctx.clearRect(0, 0, 300, 400);
        ctx.fillRect(this.state.x, this.state.y,10, 10);
    }
    render() {
        return (
            <div>
                <canvas ref="canvas" width={300} height={400} style={{border:"1px solid #000000"}}> </canvas>
            </div>
        );
    }
}

ReactDOM.render(<Game/>, document.getElementById('app'));