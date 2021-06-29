const URLUtils = require('dw/web/URLUtils');
const Logger = require('dw/system/Logger');

/**
 * Redirects to form to handle Adyen payments response
 */
function redirectActionResponse(req, res, next) {
  try {
    res.render('adyenHandleActionForm');
  } catch (err) {
    Logger.getLogger('Adyen').error(
        `payments response redirect failed with reason: ${err.toString()}`,
    );
    res.redirect(URLUtils.url('Error-ErrorCode', 'err', 'general'));
  }

  return next();
}

module.exports = redirectActionResponse;