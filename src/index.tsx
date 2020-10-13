import embed from './embed';

Promise.resolve()
  .then(() => embed('https://script.google.com/macros/s/AKfycbzRBXCS3lAL4-Y--VRXDq5-x_1ntkRhT0F3NHujOG_hMJI6R5s/exec'))
  .then((cart) => {
    cart.addItem({
      id: '1',
      url: '1',
      name: '1',
      count: 1,
      price: 1
    });
    return cart;
  }).then((cart) => {
    cart.addItem({
      id: '2',
      url: '1',
      name: '1',
      count: 1,
      price: 1
    });
  });
