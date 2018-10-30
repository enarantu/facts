const Blocks = require('./blocks')

test('blocks constructor test', () => {
    let b = new Blocks()
    expect(b.blocks.length).toBe(0);
})