const generateOTP = async() => {
    try {
        const OTP = Math.floor(1000 + Math.random() * 9000); // Generates a random 4-digit number
        return OTP;
    } catch (error) {
        return false;
    }
}
module.exports = generateOTP;