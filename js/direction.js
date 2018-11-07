class Direction{
    constructor(){
        this.old = "R"
        this.new = "R"
    }
    user_input(keycode){
        let KEY = {
            LEFT:  37,
            RIGHT: 39,
            UP: 38,
            DOWN: 40
        }
        switch(keycode){
            case KEY.LEFT:
                if(this.old !== "R"){
                    this.new = "L"
                }
                break
            case KEY.RIGHT:
                if(this.old !== "L"){
                    this.new = "R"
                }
                break
            case KEY.UP:
                if(this.old !== "D"){
                    this.new = "U"
                }
                break;
            case KEY.DOWN:
                if(this.old !== "U"){
                    this.new = "D"
                }
                break
        }
    }
    get_dir(){
        this.old = this.new
        return this.old
    }
    restart(){
        this.old = "R"
        this.new = "R"
    }
}

module.exports = Direction