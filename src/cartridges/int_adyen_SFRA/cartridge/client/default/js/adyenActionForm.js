
console.log('adyenActionForm reached');

const navigateOrderConfirm = function() {
  $.ajax({
    type: 'GET',
    url: 'Order-Confirm',
    data: JSON.stringify({
      ID: 'orderNo',
      token: 'orderToken'
    }),
    contentType: 'application/json; charset=utf-8',
    async: false,
    success(data) {
      //Handle response
    },
  });
}

const handleAction = function() {
  const {paymentsResponse} = window;
  console.log(paymentsResponse);

  if(paymentsResponse.isSuccessful) {
    // do success
    navigateOrderConfirm();
  }

  if(paymentsResponse.action) {
    // card and checkout component creation
    const cardNode = document.getElementById('card');
    checkout = new AdyenCheckout(window.Configuration);
    const card = checkout.create('card').mount(cardNode);

    checkout.createFromAction(paymentsResponse.action).mount('#action-container');
    $('#action-modal').modal({ backdrop: 'static', keyboard: false });
  }

  else {
    // do error
  }
};

// handleAction();

$.ajax({
  type: 'GET',
  url: 'Order-Confirm',
  data: JSON.stringify({
    ID: 'orderNo',
    token: 'orderToken'
  }),
  contentType: 'application/json; charset=utf-8',
  async: false,
  success(data) {
    //Handle response
  },
});

module.exports = {
  handleAction,
}
