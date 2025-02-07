function validateNigerianPhoneNumber(phoneNumber) {
  const pattern = /^(?:\+234|0)(7[0-9]|8[0-9]|9[0-9])[0-9]{7}$/;
  return pattern.test(phoneNumber);
}

// function validateNigerianPhoneNumber(phoneNumber) {
//   const regex =
//     /^(?:\+234|234|0)(701|702|703|704|705|706|707|708|709|802|803|804|805|806|807|808|809|810|811|812|813|814|815|816|817|818|901|902|903|904|905|906|907|908|909|910|911|912)\d{6}$/;
//   return regex.test(phoneNumber);
// }
module.exports = { validateNigerianPhoneNumber };
