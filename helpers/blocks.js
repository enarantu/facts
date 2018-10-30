class Blocks{
    constructor(){
        this.blocks = []
    }
    contains(in_block){
        let does_contain = false
        this.blocks.forEach(block =>{
            if(block.x === in_block.x && block.y === in_block.y){
                does_contain = true
            }
        })
        return does_contain
    }
    add(in_block){
        this.blocks.push(in_block)
    }
    remove_equal_block(in_block){
        for( let i = this.blocks.length - 1; i >= 0; i--){
            if( this.blocks[i].x === in_block.x && this.blocks[i].y === in_block.y){
                this.blocks.splice(i, 1)
            }
        }
    }
}

module.exports = Blocks