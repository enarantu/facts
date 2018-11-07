const Direction = require('./direction')

test('get_dir test',() => {
    let x = new Direction()
    expect(x.get_dir()).toBe("R")
    x.user_input(40)
    expect(x.get_dir()).toBe("D")
    expect(x.get_dir()).toBe("D")
    expect(x.get_dir()).toBe("D")
    x.user_input(39)
    x.user_input(38)
    x.user_input(37)
    expect(x.get_dir()).toBe("L")
})