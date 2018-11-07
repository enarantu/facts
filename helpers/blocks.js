class Blocks{
    constructor(inB){
        this.blocks = inB
        this.invariant()
    }
    contains(in_block){
        this.invariant()
        let does_contain = false
        this.blocks.forEach(block => {
            if(block.x === in_block.x && block.y === in_block.y){
                does_contain = true
            }
        })
        this.invariant()
        return does_contain
    }
    contains_type(in_type){
        this.invariant()
        let does_contain = false
        this.blocks.forEach(block => {
            if(block.block_type === in_type){
                does_contain = true
            }
        })
        this.invariant()
        return does_contain
    }
    length(){
        return this.blocks.length
    }
    add(in_block){
        this.invariant()
        this.blocks.push(in_block)
        this.invariant()
    }
    equals(inB){
        if(!(inB instanceof Blocks)){
            return false
        }
        if(inB.blocks.length !== this.blocks.length){
            return false
        }
        for(let i = 0 ; i < inB.blocks.length ; i++){
            if(inB.blocks[i].x !== this.blocks[i].x){
                return false
            }
            if(inB.blocks[i].y !== this.blocks[i].y){
                return false
            }
        }
        return true
    }
    remove_equal_block(in_block){
        this.invariant()
        for( let i = this.blocks.length - 1; i >= 0; i--){
            if( this.blocks[i].x === in_block.x && this.blocks[i].y === in_block.y){
                this.blocks.splice(i, 1)
            }
        }
        this.invariant()
    }
    get_data(){
        return this.blocks
    }
    invariant(){
        let that = this
        function is_array(){
            return Array.isArray(that.blocks)
        }
        function is_blocks_have_xy(){
            let ans = true
            that.blocks.forEach(block => {
                if(!('x' in block)){
                    ans = false
                }
                if(!('y' in block)){
                    ans = false
                }
            })
            return ans
        }
        function is_xy_integers(){
            let ans = true
            that.blocks.forEach(block => {
                if(!Number.isInteger(block.x)){
                    ans = false
                }
                if(!Number.isInteger(block.y)){
                    ans = false
                }
            })
            return ans
        }
        if(is_array())
            if(is_blocks_have_xy()){
                if(is_xy_integers()){
                    return
                }{
                    console.log('xy not integers')
                }
            }
            else{
                console.log('blocks dont have xy')
            }
        else{
            console.log('blocks not array')
        }
        console.log(this.blocks)
    }
}

module.exports = Blocks