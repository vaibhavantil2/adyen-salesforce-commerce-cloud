function getCurrentBasket() {
  return {
    defaultShipment: {
      shippingAddress: {
        firstName: "Amanda",
        lastName: "Jones",
        address1: "65 May Lane",
        address2: "",
        city: "Allston",
        postalCode: "02135",
        countryCode: { value: "us" },
        stateCode: "MA",
        seller_phone: "617-555-1234",


        setSellerFirstName(firstNameInput) {
          this.firstName = firstNameInput;
        },
        setSellerLastName(lastNameInput) {
          this.lastName = lastNameInput;
        },
        setSellerAddress1(address1Input) {
          this.address1 = address1Input;
        },
        setSellerAddress2(address2Input) {
          this.address2 = address2Input;
        },
        setSellerCity(cityInput) {
          this.city = cityInput;
        },
        setSellerPostalCode(postalCodeInput) {
          this.postalCode = postalCodeInput;
        },
        setSellerStateCode(stateCodeInput) {
          this.stateCode = stateCodeInput;
        },
        setSellerCountryCode(countryCodeInput) {
          this.countryCode.value = countryCodeInput;
        },
        setSellerPhone(phoneInput) {
          this.seller_phone = phoneInput;
        },
      },
    },
    totalGrossPrice: {
      value: 250.0,
    },

    paymentInstruments: {},
  };
}

module.exports = {
  getCurrentBasket,
};
