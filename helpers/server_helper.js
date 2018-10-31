class Helper{
    constructor(){
        this.foods = new Blocks()
        this.powers = new Blocks()
        this.players = new Players()
    }
    add_player : function( name, blocks){
        let max_id = 0
        this.players.forEach( player => {
            if( max_id < player.id){
                max_id = player.id + 1
            }
        })
        const data = {
            id : max_id,
            name : name,
            blocks : blocks
        }
        this.players.push(data)
        return max_id
    },
    remove_player: function( id){
        for( let i = this.players.length - 1; i >= 0; i--){
            if( this.players[i].id === id){
                this.players.splice(i, 1)
            }
        }
    },
    update : function(id, blocks){
        for( let i = 0; i < this.players.length ; i++){
            if( this.players[i].id === id){
                this.players[i].blocks = blocks
            }
        }
    },
    consume: function( block ){
        for( let i = this.foods.length - 1; i >= 0; i--){
            if( this.foods[i].x === block.x && this.foods[i].y === block.y){
                this.foods.splice(i, 1)
            }
        }
        for( let i = this.powers.length - 1; i >= 0; i--){
            if( this.powers[i].x === block.x && this.powers[i].y === block.y){
                this.powers.splice(i, 1)
            }
        }
    },
    generate : function(){
        let xc = parseInt(Math.floor((Math.random() * 30)))*20
        let yc = parseInt(Math.floor((Math.random() * 30)))*20
        return {x : xc, y : yc}
    },
    will_overlap : function(block){
        ans = false
        this.foods.forEach(food => {
            if( food.x === block.x && food.y === block.y){
                ans = true
            }
        })
        this.powers.forEach(power => {
            if( power.x === block.x && power.y === block.y){
                ans = true
            }
        })
        return ans
    },
    refill: function(){
        while(this.foods.length < 8){
            newfood = this.generate()
            while(this.will_overlap(newfood)){
                newfood = this.generate()
            }
            this.foods.push(newfood)
        }
        let is_double_exist = false
        this.powers.forEach(power => {
            if( power.power_type === 'double'){
                is_double_exist = true
            }
        })
        if(!is_double_exist){
            newdouble = this.generate()
            while(this.will_overlap(newdouble)){
                newdouble = this.generate()
            }
            newdouble.type = 'double'
            this.powers.push(newdouble)
        }
    },
    set_data: function(id, blocks){
        for( let i = 0 ; i < this.players.length ; i++){
            if(this.players.id === id){
                this.players.blocks = blocks
            }
        }
    },
    get_data: function(){
        return {
            players: this.players,
            foods: this.foods,
            powers: this.powers
        }
    }
}