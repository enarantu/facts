const logic = {
    prospective_block: function(blocks, direction){
        const n = blocks.length
        const head = {x : null, y : null}
        switch(direction){
            case 'R':
                head.x = blocks[n-1].x + 20
                head.y = blocks[n-1].y
                break
            case 'L':
                head.x = blocks[n-1].x - 20
                head.y = blocks[n-1].y
                break
            case 'U':
                head.x = blocks[n-1].x, 
                head.y = blocks[n-1].y - 20
                break
            case 'D':
                head.x = blocks[n-1].x, 
                head.y = blocks[n-1].y + 20
                break
        }
        return head
    },
    outcome: function(blocks, others, foods, powers, p_block){
        let ans = 'nothing'
        let collision = (p_block.x < 0 || p_block.y < 0 || p_block.x >= 600 || p_block.y >= 600)
        if(collision){
            console.log("wall collision")
        }
        if( !collision){
            blocks.forEach(block => {
                if(block.x === p_block.x && block.y === p_block.y){
                    collision = true
                    console.log("self collision")
                }
            })
        }
        if( !collision){
            others.forEach(player => {
                player.blocks.forEach(block => {
                    if(p_block.x === block.x && p_block.y === block.y){
                        collision = true
                        console.log("inter collision")
                    }
                })
            })
        }
        if(collision){
            ans = 'collision'
        }
        else{
            foods.forEach(food => {
                if(food.x === p_block.x && food.y === p_block.y){
                    ans = 'food'
                }
            })
            powers.forEach(power => {
                if(power.x === p_block.x && power.y === p_block.y){
                    ans = power.block_type
                }
            })
        }
        return ans
    }
}
export default logic