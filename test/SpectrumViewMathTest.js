SpectrumViewMathTest = function () {

    function assertEqual(x, y, msg) {
        var equals = (x === y);

        if (!equals) {
            console.error ((msg?msg:''), 'not equal', x, y);
        }

        return equals;
    }

    var success = true;

    assertEqual(2.99792458e-8, SpectrumViewMath.wavelengthToFrequency(Math.pow(10,16)) ) ;

    assertEqual(2.99792458e-8, SpectrumViewMath.frequencyToWavelength(Math.pow(10,16)) );

    return success;
};
