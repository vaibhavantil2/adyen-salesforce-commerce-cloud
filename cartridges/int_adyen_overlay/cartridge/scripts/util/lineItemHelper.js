"use strict";

/**
 *
 */
require('dw/order');

var AdyenHelper = require('*/cartridge/scripts/util/adyenHelper');

var __LineItemHelper = {
  getDescription: function getDescription(lineItem) {
    if (lineItem instanceof dw.order.ShippingLineItem) {
      return lineItem.getID();
    }

    if (lineItem instanceof dw.order.ProductLineItem) {
      return lineItem.product.name;
    }

    if (lineItem instanceof dw.order.PriceAdjustment) {
      return '';
    }

    return null;
  },
  getId: function getId(lineItem) {
    if (lineItem instanceof dw.order.ShippingLineItem || lineItem instanceof dw.order.PriceAdjustment) {
      return lineItem.UUID;
    }

    if (lineItem instanceof dw.order.ProductLineItem) {
      return lineItem.product.ID;
    }

    return null;
  },
  getQuantity: function getQuantity(lineItem) {
    if (lineItem instanceof dw.order.ShippingLineItem) {
      return '1';
    }

    if (lineItem instanceof dw.order.ProductLineItem) {
      return lineItem.quantityValue.toFixed();
    }

    if (lineItem instanceof dw.order.PriceAdjustment) {
      return lineItem.quantity.toFixed();
    }

    return null;
  },
  getVatPercentage: function getVatPercentage(lineItem) {
    var vatPercentage = 0;

    if (__LineItemHelper.getVatAmount(lineItem).value !== 0) {
      vatPercentage = lineItem.getTaxRate();
    }

    return vatPercentage;
  },
  getVatAmount: function getVatAmount(lineItem) {
    if (lineItem instanceof dw.order.ProductLineItem || lineItem instanceof dw.order.ShippingLineItem) {
      return AdyenHelper.getCurrencyValueForApi(lineItem.getAdjustedTax());
    }

    if (lineItem instanceof dw.order.PriceAdjustment && lineItem.getPromotion().getPromotionClass() !== 'ORDER') {
      return AdyenHelper.getCurrencyValueForApi(lineItem.tax);
    }

    return new dw.value.Money(0, lineItem.getTax().getCurrencyCode());
  },
  getItemAmount: function getItemAmount(lineItem) {
    if (lineItem instanceof dw.order.ProductLineItem || lineItem instanceof dw.order.ShippingLineItem) {
      return AdyenHelper.getCurrencyValueForApi(lineItem.adjustedNetPrice);
    }

    if (lineItem instanceof dw.order.PriceAdjustment) {
      return AdyenHelper.getCurrencyValueForApi(lineItem.netPrice);
    }

    return new dw.value.Money(0, lineItem.getPrice().getCurrencyCode());
  }
};
module.exports = __LineItemHelper;
