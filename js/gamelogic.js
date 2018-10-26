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
    will_hit_self: function(blocks, p_block){
        const n = blocks.length
        for( let i = n - 2; i >= 0; i--){
            if( blocks[i].x === p_block.x && blocks[i].y === p_block.y){
                return true
            }
        }
        return false
    },
    will_hit_others: function(others, p_block){
        Object.keys(others).forEach(name => {
            others[name].forEach(block => {
                if(p_block.x === block.x && p_block.y === block.y){
                    return true
                }
            })
        })
        return false
    },
    will_hit_wall: function(p_block){
        return p_block.x < 0 || p_block.y < 0 || p_block.x >= 600 || p_block.y >= 600
    },

    will_hit_food: function(foods,p_block){
        let ans = {x : -1, y : -1}
        foods.forEach(food => {
            if(food.x === p_block.x && food.y === p_block.y){
                ans = p_block
            }
        })
        return ans
    },
    will_hit_double: function(double, p_block){
        console.log(double, p_block)
        if(double.x === p_block.x && double.y === p_block.y){
            return true
        }
        return false
    }
}
export default logic