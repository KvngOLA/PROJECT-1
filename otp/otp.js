const generateOtp = () => {
  const otp = Math.floor(Math.random() * 900000) + 100000;
  console.log("Generated Otp");
  return otp.toString();
};

module.exports = generateOtp;
