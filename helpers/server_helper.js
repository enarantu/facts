const Blocks = require('./blocks')
const Players = require('./players')

class Helper{
    constructor(){
        this.foods = new Blocks()
        this.powers = new Blocks()
        this.players = new Players()
    }
    new_player(name, blocks){
        const inB = new Blocks(blocks)
        return this.players.add(name, blocks)
    },
    remove_player(id){
        this.players.remove_player(id)
    },
    update(id, blocks){
        const inB = new Blocks(blocks)
        this.players.update(id, inB)
    },
    consume(block){
        this.foods.remove_equal_block(block)
        this.powers.remove_equal_block(block)
    },
    generate(){
        let xc = parseInt(Math.floor((Math.random() * 30)))*20
        let yc = parseInt(Math.floor((Math.random() * 30)))*20
        return {x : xc, y : yc}
    },
    will_overlap(block){
        return this.foods.contains(block) || this.powers.contains(block)
    },
    refill(){
        while(this.foods.length < 8){
            newfood = this.generate()
            while(this.will_overlap(newfood)){
                newfood = this.generate()
            }
            this.foods.add(newfood)
        }
        if(!this.powers.contains_type('double')){
            newdouble = this.generate()
            while(this.will_overlap(newdouble)){
                newdouble = this.generate()
            }
            newdouble.block_type = 'double'
            this.powers.push(newdouble)
        }
    },
    get_data(){
        return {
            players: this.players.get_data(),
            foods: this.foods.get_data(),
            powers: this.powers.get_data()
        }
    }
}