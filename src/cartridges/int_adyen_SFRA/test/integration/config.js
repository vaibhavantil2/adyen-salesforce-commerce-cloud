const cvcFail = "123";
const cvcSuccess = "737";
const expiryDate = "1020";
const mastercard = "5100290029002909";
const mastercard3D = "5454545454545454";
const holdernameSuccess = "Mastercard Success";
const holdernameFail = "Mastercard Fail";
const username = "YOUR_USERNAME";
const password = "YOUR_PASSWORD";
const password3d = "password";
const passwordFail = "passwordFail";

module.exports = {
  Storefront: {
    url: "https://www.yourstorefront.com?lang=en_US",
    login: "/on/demandware.store/Sites-RefArch-Site/default/Checkout-Login",
    urlEUR: "https://www.yourstorefront.com?lang=fr_FR",
    loginEUR: "/on/demandware.store/Sites-RefArch-Site/fr_FR/Checkout-Login",
  },

  Guest: {
    sellerEmail: "guest@adyen.com",
    sellerUserName: "Guest",
    sellerLastName: "Test",
    sellerStreet: "Guest street 1",
    sellerHouseNumber: "123",
    sellerCity: "Amsterdam",
    sellerPostCode: "12321",
    sellerCountryCode: "NL",
    sellerPhoneNumber: "0612345679",
    sellerDOB: "1990-10-10",
  },

  cardSuccess: {
    holderName: holdernameSuccess,
    cardNumber: mastercard,
    expiryDate,
    cvc: cvcSuccess,
  },

  cardSuccess3D: {
    holderName: holdernameSuccess,
    cardNumber: mastercard3D,
    expiryDate,
    cvc: cvcSuccess,
  },

  cardFail: {
    holderName: holdernameFail,
    cardNumber: mastercard,
    expiryDate,
    cvc: cvcFail,
  },

  cardFail3D: {
    holderName: holdernameFail,
    cardNumber: mastercard3D,
    expiryDate,
    cvc: cvcFail,
  },

  threeds2DetailsSuccess: {
    password: password3d,
  },

  threeds2DetailsFail: {
    password: passwordFail,
  },

  userAccount: {
    username,
    password,
  },
};
