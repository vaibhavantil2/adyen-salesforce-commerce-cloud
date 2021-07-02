const Resource = require('dw/web/Resource');
const URLUtils = require('dw/web/URLUtils');
const Transaction = require('dw/system/Transaction');
const COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');
const hooksHelper = require('*/cartridge/scripts/helpers/hooks');
const addressHelpers = require('*/cartridge/scripts/helpers/addressHelpers');
const  constants = require('*/cartridge/adyenConstants/constants');
const { fraudDetection } = require('*/cartridge/scripts/hooks/fraudDetection');
const { hasAdyenPaymentMethod } = require('../helpers/index');
const handleTransaction = require('./transaction');
const handlePaymentAuthorization = require('./payment');
const handleFraudDetection = require('./fraud');

function createOrder(currentBasket, { res, req, next }, emit) {
  const validateOrder = (order) => {
    // Creates a new order.
    if (!order) {
      res.json({
        error: true,
        errorMessage: Resource.msg('error.technical', 'checkout', null),
      });
      emit('route:Complete');
    }
    return !!order;
  };

  const handlePlaceOrder = (order, fraudDetectionStatus) => {
    const placeOrderResult = COHelpers.placeOrder(order, fraudDetectionStatus);
    if (placeOrderResult.error) {
      res.json({
        error: true,
        errorMessage: Resource.msg('error.technical', 'checkout', null),
      });
      emit('route:Complete');
    }

    return !placeOrderResult.error;
  };

  const validateOrderAndAuthorize = (order) => {
    const isValidOrder = validateOrder(order);
    if (isValidOrder) {
      const paymentsResponse = handlePaymentAuthorization(
        order,
        { req, res },
        emit,
      );
      return paymentsResponse;
    }
    return false;
  };

  const handleCreateOrder = (order) => {
    const paymentsResponse = validateOrderAndAuthorize(order);
    if (paymentsResponse) {
      const fraudDetectionStatus = hooksHelper(
        'app.fraud.detection',
        'fraudDetection',
        currentBasket,
        fraudDetection,
      );
      const isSuccessful = handleFraudDetection(
        fraudDetectionStatus,
        order,
        { req, res },
        emit,
      );
      // Places the order
      if(isSuccessful) {
        handlePlaceOrder(order, fraudDetectionStatus)
      }
      return paymentsResponse;
    }
    return false;
  };

  const saveAddresses = ({ currentCustomer }, order) => {
    if (currentCustomer.addressBook) {
      const allAddresses = addressHelpers.gatherShippingAddresses(order);
      allAddresses.forEach((address) => {
        if (
          !addressHelpers.checkIfAddressStored(
            address,
            currentCustomer.addressBook.addresses,
          )
        ) {
          addressHelpers.saveAddress(
            address,
            currentCustomer,
            addressHelpers.generateAddressName(address),
          );
        }
      });
    }
  };

  const isAdyen = hasAdyenPaymentMethod(currentBasket);

  if (!isAdyen) {
    return next();
  }

  const isValidTransaction = handleTransaction(
    currentBasket,
    { res, req },
    emit,
  );
  if (isValidTransaction) {
    const order = COHelpers.createOrder(currentBasket);

    saveAddresses(req, order);

    const paymentsResponse = handleCreateOrder(order);
    if (paymentsResponse) {
      if (paymentsResponse.isSuccessful) {
        COHelpers.sendConfirmationEmail(order, req.locale.id);

        // Reset usingMultiShip after successful Order placement
        req.session.privacyCache.set('usingMultiShipping', false);

        // redirect to Order-Confirm if successful
        res.json({
          error: false,
          orderID: order.orderNo,
          orderToken: order.orderToken,
          continueUrl: URLUtils.url('Order-Confirm').toString(),
        });
        return emit('route:Complete');
      } else if (paymentsResponse.action) {

        // redirect to RedirectActionResponse if response contains an action
        const paymentInstrument = order.getPaymentInstruments(constants.METHOD_ADYEN_COMPONENT)[0];
        Transaction.wrap(function () {
          paymentInstrument.custom.adyenAction = JSON.stringify(paymentsResponse);
        });


        res.json({
          error: false,
          continueUrl: URLUtils.url(
              'Adyen-RedirectActionResponse',
              'orderNo',
              order.orderNo
          ).toString()
        });
        return emit('route:Complete');
      }
    }
  }
  return undefined;
}

module.exports = createOrder;
