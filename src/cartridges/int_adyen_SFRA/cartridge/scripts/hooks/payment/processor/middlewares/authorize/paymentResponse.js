const Transaction = require('dw/system/Transaction');
const AdyenHelper = require('*/cartridge/scripts/util/adyenHelper');

function get3DS2Response(result) {
  return {
    threeDS2: result.threeDS2,
    resultCode: result.resultCode,
    action: JSON.stringify(result.fullResponse.action),
  };
}

function getRedirectResponse(result, orderNumber, paymentInstrument) {
  const createHash = (substr) =>
    AdyenHelper.getAdyenHash(
      result.adyenAction.url.substr(result.adyenAction.url.length - 25),
      substr,
    );

  // Signature for 3DS payments
  const getMDSignature = () =>
    createHash(result.adyenAction.data.MD.substr(1, 25));
  // Signature for redirect methods
  const getPaymentDataSignature = () =>
    createHash(result.adyenAction.url.slice(-25));

  const hasMD = !!result.adyenAction?.data?.MD;
  // If the response has MD, then it is a 3DS transaction
  const signature = hasMD ? getMDSignature() : getPaymentDataSignature();

  return {
    authorized: true,
    authorized3d: hasMD,
    orderNo: orderNumber,
    paymentInstrument,
    adyenAction: result.adyenAction,
    signature,
  };
}

function paymentResponseHandler(paymentInstrument, result, orderNumber) {
  paymentInstrument.custom.adyenPaymentData = result.paymentData;
  Transaction.commit();

  return result.threeDS2
    ? get3DS2Response(result)
    : getRedirectResponse(result, orderNumber, paymentInstrument);
}

module.exports = paymentResponseHandler;
