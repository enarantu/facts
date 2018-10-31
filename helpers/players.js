const Blocks = require('./blocks')

class Players{
    constructor(){
        this.players = new Array(0)
    }
    add(name, blocks){
        this.invariant()
        let id = this.new_id()
        this.players.push({
            id : id,
            name: name,
            blocks: blocks
        })
        this.invariant()
        return id
    }
    update(id, blocks){
        this.invariant()
        for(let i = 0; i < this.players.length; i++){
            if( this.players[i].id === id){
                this.players[i].blocks = blocks
            }
        }
        this.invariant()
    }
    remove_player(id){
        this.invariant()
        for( let i = this.players.length - 1; i >= 0 ; i--){
            if(this.players[i].id === id){
                this.players.splice(i, 1)
            }
        }
        this.invariant()
    }
    new_id(){
        this.invariant()
        let max_id = 0
        this.players.forEach( player => {
            if(max_id <= player.id){
                max_id = player.id + 1
            }
        })
        this.invariant()
        return max_id
    }
    is_equal_blocks(id, blocks){
        this.invariant()
        let specified_blocks
        this.players.forEach(player => {
            if(player.id === id){
                specified_blocks = player.blocks
            }
        })
        this.invariant()
        return specified_blocks.equals(blocks)
    }
    get_data(){
        return this.players.map(player => {
            id : player.id,
            name : player.name,
            blocks. player.blocks.get_data()
        })
    }
    invariant(){
        let that = this
        function is_array(){
            return Array.isArray(that.players)
        }
        function is_id_integers(){
            let ans = true
            that.players.forEach(player =>{
                if(!Number.isInteger(player.id)){
                    ans = false
                }
            })
            return ans
        }
        function is_id_unique(){
            let ids = []
            that.players.forEach(player => {
                ids.push(player.id)
            })
            return !ids.find((element, index) => (ids.indexOf(element) != index))
        }
        function is_blocks_block(){
            let ans = true
            that.players.forEach(player => {
                if(!(player.blocks instanceof Blocks)){
                    ans = false
                }
            })
            return ans
        }
        function is_name_string(){
            let ans = true
            that.players.forEach( player => {
                if(typeof player.name !== 'string'){
                    ans = false
                }
            })
            return ans
        }
        if(is_array()){
            if(is_id_integers()){
                if(is_id_unique()){
                    if(is_blocks_block()){
                        if(is_name_string()){
                            return
                        }
                        else{
                            console.log('name(s) are not string')
                        }
                    }
                    else{
                        console.log('blocks are not instance of Blocks')
                    }
                }
                else{
                    console.log('ids are not unique')
                }
            }
            else{
                console.log('id(s) are not integers')
            }
        }
        else{
            console.log('players is not array')
        }
        console.log(this.players)
    }
}

module.exports = Players