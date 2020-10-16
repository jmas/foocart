import embed from './embed';

document.addEventListener('DOMContentLoaded', () => {
  embed().then(cart => {
    if ((window as any).__foocartCallback) {
      (window as any).__foocartCallback(cart);
    }
  });
});
