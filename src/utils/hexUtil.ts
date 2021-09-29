const hexUtil = {
    /**
     * Ingreases hex value to one
     * @param hex hexadecimal string
     * @returns hexadecimal string
     */
    increase: (hex: string): string => {
        return '0x' + (parseInt(hex, 16) + 1).toString(16);
    },

    /**
     * Degreases hex value to one
     * @param hex hexadecimal string
     * @returns hexadecimal string
     */
    decrease: (hex: string): string => {
        return '0x' + (parseInt(hex, 16) - 1).toString(16);
    },

    /**
     * Parses uint256 hexabecimal string
     * @param hex hexadecimal string
     * @returns float number
     */
    uint256toFloat: (hex: string): number => {
        return parseInt(hex, 16) / Math.pow(10, 18);
    },

    /**
     * Converts number to uint256 hexabecimal string
     * @returns hexabecimal string
     */
    numberToUint256: (number: number): string => {
        return (number * Math.pow(10, 18)).toString(16);
    },

    /**
     * Converts number to hexabecimal string
     */
    toHex: (number: number): string => {
        return '0x' + number.toString(16);
    }
};

export default hexUtil;
