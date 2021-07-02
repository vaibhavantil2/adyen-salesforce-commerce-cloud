const Logger = require('dw/system/Logger');
const URLUtils = require('dw/web/URLUtils');
const adyenCheckout = require('*/cartridge/scripts/adyenCheckout');

/*
 * Redirects to list of added cards on success. Otherwise redirects to add payment with error
 */
function redirect(req, res, next) {
  try {
    const jsonRequest = {
      details: {
        MD: req.form?.MD,
        PaRes: req.form?.PaRes,
      },
    };
    const result = adyenCheckout.doPaymentsDetailsCall(jsonRequest);

    if (result.resultCode === 'Authorised') {

      res.redirect(URLUtils.url('PaymentInstruments-List'));
    } else {
      res.redirect(
        URLUtils.url('PaymentInstruments-AddPayment', 'isAuthorised', 'false'),
      );
    }

    return next();
  } catch (e) {
    Logger.getLogger('Adyen').error(
      `Error during 3ds1 response verification: ${e.toString()} in ${
        e.fileName
      }:${e.lineNumber}`,
    );
    res.redirect(URLUtils.url('Error-ErrorCode', 'err', 'general'));
    return next();
  }
}

module.exports = redirect;
