const URLUtils = require('dw/web/URLUtils');
const Logger = require('dw/system/Logger');
const OrderMgr = require('dw/order/OrderMgr');
const Transaction = require('dw/system/Transaction');
const constants = require('*/cartridge/adyenConstants/constants');

/**
 * Redirects to form to handle Adyen payments response
 */
function redirectActionResponse(req, res, next) {
  try {
    const { orderNo } = req.querystring;

    const order = OrderMgr.getOrder(orderNo);
    const paymentInstrument = order.getPaymentInstruments(constants.METHOD_ADYEN_COMPONENT)[0];
    res.render('adyenHandleActionForm', {
      paymentInstrument,
      orderNo
    });
  } catch (err) {
    Logger.getLogger('Adyen').error(
        `payments response redirect failed with reason: ${err.toString()}`,
    );
    res.redirect(URLUtils.url('Error-ErrorCode', 'err', 'general'));
  }

  return next();
}

module.exports = redirectActionResponse;