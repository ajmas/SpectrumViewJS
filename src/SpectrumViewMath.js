SpectrumViewMath = {

    /** speed of light in m/s */
    SPEED_OF_LIGHT: 299792458,

    /**
     Converts the frequency in Hz to wavelength in meters
     */
    frequencyToWavelength: function (frequencyHz) {
        return this.SPEED_OF_LIGHT / frequencyHz;
    },

    /**
     Converts the wavelength in meters to frequency in Hz
     */
    wavelengthToFrequency: function (wavelengthM) {
        return this.SPEED_OF_LIGHT / wavelengthM;
    }
};