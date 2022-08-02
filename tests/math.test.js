const { fahrenheitToCelsius, celsiusToFahrenheit, calculateTip } = require('../src/math')

// Recommended test frameworks: Jest, Mocha. Available at: jestjs.io, mochajs.org
// We use Jest here.
// When we run 'npm test', jest is executed because it is the name of the test script provided in the 
// package.json. Jest finds this test suite by means of the file extension .test (.js).
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

