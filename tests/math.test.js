const { fahrenheitToCelsius, celsiusToFahrenheit, calculateTip, add } = require('../src/math')

// Recommended test frameworks: Jest, Mocha. Available at: jestjs.io, mochajs.org
// We use Jest here.
// When we run 'npm test', jest is executed because it is the name of the test script provided in the 
// package.json. Jest finds this test suite by means of the file extension .test (.js).
// jest --watch: Jest will rerun tests when changes occur.
// One does not have to require anything in. The test() function will automatically be available.
test('Should convert 32 F to 0 C', () => {
    const temp = fahrenheitToCelsius(32)
    expect(temp).toBe(0)
})

test('Should convert 0 C to 32 F', () => {
    const temp = celsiusToFahrenheit(0)
    expect(temp).toBe(32)
})

test('Should calculate total with tip', () => {
    const total = calculateTip(10, .3)
    expect(total).toBe(13)
    // Same as:
    // if (total !== 13) {
    //     throw new Error('Total should equal 13. Got ' + total)
    // }
    // but less code!
})

test('Should calculate total with default tip', () => {
    const total = calculateTip(10)
    expect(total).toBe(12.5)
})
// test('Async test demo', (done) => {
//     setTimeout(() => {
//         expect(1).toBe(2) // Clearly a wrong assertion, however, the test passes if Jest does not 
//         // know that this is an asynchronous function call. 
//         // Solution: a parameter, which can have any name. Here we use 'done'. When that is in place,
//         // Jest will wait for the async function to finish, in this case, wait for the two seconds. 
//         done() // This is how it's done :-)
//     }, 2000)
// })
test('Should add two numbers', (done) => {
    add(2,3).then((sum) => {
        expect(sum).toBe(5)
        done()
    })
})
// Alternative syntax using async/await:
test('Should add two numbers async/await', async () => {
   const sum = await add(10,22)
   expect(sum).toBe(32)
})

