import { IProps, IOrder, IOutput, ITranslation, ICart, IOrderItem } from './types';
import shorthash from 'shorthash';
import render from './render';
import { fetchTranslation, createOrderResult, makeGScriptRequest } from './helpers';
import Cart from './cart';

export default function embed(id: string = 'foocart', props?: IProps): Promise<ICart> {
    // prepare element
    const element = (document.getElementById(id) || document.createElement('div')) as HTMLElement;
    if (!element.id) {
        element.id = id;
        document.body.appendChild(element);
    }
    
    // parse config from element attributes
    const translationId = element.dataset.translation || 'en';
    // eslint-disable-next-line no-template-curly-in-string
    const priceTemplate = element.dataset.priceTemplate || '${price}';
    const completeUrl = element.dataset.completeUrl || '';

    if (!completeUrl) {
        throw new Error('foocart: Please provide data-complete-url attribute!');
    }
    
    // prepare translation
    return fetchTranslation(translationId)
        .then((translation: ITranslation) => {
            const defaultProps = {
                priceTemplate,
                completeOrder(order: IOrder) {
                    return makeGScriptRequest(completeUrl, order)
                        .then(result => createOrderResult(result));
                }
            };

            // prepare cart
            const cart = new Cart({
                ...defaultProps,
                ...props,
                onUpdate(cart: ICart, output: IOutput) {
                    render(
                        cart,
                        output,
                        translation as ITranslation,
                        element,
                        priceTemplate
                    );
                }
            });
            
            // prepare handler for catch 'Add Product' clicks
            document.body.addEventListener('click', (event: Event) => {
                if (event.target instanceof HTMLElement && event.target.dataset.foocartUrl !== undefined) {
                    event.preventDefault();
                    const name = (event.target.dataset.foocartName || event.target.innerText).trim();
                    const url = (event.target.dataset.foocartUrl || '').trim();
                    const image = (event.target.dataset.foocartImage || '').trim();
                    const id = event.target.dataset.foocartId || shorthash.unique(`${name}#${url}`);
                    const price = parseInt(event.target.dataset.foocartPrice || '0', 10);
                    const item = {
                        id,
                        name,
                        price,
                        url,
                        image,
                        count: 1
                    } as IOrderItem;
                    cart.addItem(item);
                }
            });
            return cart;
        });
}
