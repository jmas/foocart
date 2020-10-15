import { html, render as litRender } from 'lit-html';
import { ICart, IOrder, IOutput, ITranslation, OrderItemIDType, SectionType, IFieldProps, ITextFieldProps, ITextareaFieldProps } from './types';

export default function render(cart: ICart, output: IOutput, translation: ITranslation, element: HTMLElement, priceTemplate: string) {
    function handleAddItemClick(id: OrderItemIDType) {
        cart.addItemCount(id);
    }

    function handleRemoveItemClick(id: OrderItemIDType) {
        const foundItem = output.items.find(item => item.id === id);
        if (foundItem) {
            if (foundItem.count > 1) {
                cart.removeItemCount(id);
            } else {
                cart.removeItem(id);
            }
        }
    }

    function handleCartButtonClick() {
        cart.setSection(SectionType.CART);
    }

    function handleMakeOrderClick() {
        cart.setSection(SectionType.ORDER);
    }

    function handleOrderSubmit(event: Event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget as HTMLFormElement);
        cart.completeOrder({
            items: output.items,
            name: formData.get('name'),
            surname: formData.get('surname'),
            email: formData.get('email'),
            telephone: formData.get('telephone'),
            comment: formData.get('comment')
        } as IOrder);
    }

    function handleCloseClick() {
        cart.setSection(SectionType.BUTTON);
    }

    function formatPrice(price: number) {
        return priceTemplate.replace('{price}', String(price));
    }

    litRender(html`
        ${cart.section === SectionType.BUTTON ? html`
            <button type="button" @click=${handleCartButtonClick}>${output.items.length}</button>
        ` : cart.section === SectionType.CART ? html`
            <div>
                ${output.items.length > 0 ? output.items.map(item => html`
                    <div key=${item.id}>
                        <div><b>${item.name}</b></div>
                        <div>
                            <span>${translation.count}: <b>${item.count}</b></span>
                            <span>${translation.price}: <b>${formatPrice(item.price)}</b></span>
                        </div>
                        <div>
                            <button type="button" @click=${() => handleAddItemClick(item.id)}>${translation.addItem}</button>
                            <button type="button" @click=${() => handleRemoveItemClick(item.id)}>${translation.removeItem}</button>
                        </div>
                    </div>
                `) : (html`
                    <div>${translation.nothingHere}</div>
                `)}
            </div>
            <button type="button" @click=${handleMakeOrderClick}>${translation.makeOrder} (${formatPrice(output.totalPrice)})</button>
            <button type="button" @click=${handleCloseClick}>${translation.close}</button>
        ` : cart.section === SectionType.ORDER ? html`
            <form @submit=${handleOrderSubmit}>
                ${output.orderResult.message ? html`<div>${output.orderResult.message}</div>` : null}
                ${textField({
                    label: translation.name,
                    name: 'name',
                    error: output.orderResult.errors?.name
                })}
                ${textField({
                    label: translation.surname,
                    name: 'surname',
                    error: output.orderResult.errors?.surname
                })}
                ${textField({
                    label: translation.telephone,
                    name: 'telephone',
                    type: 'tel',
                    error: output.orderResult.errors?.telephone
                })}
                ${textField({
                    label: translation.email,
                    name: 'email',
                    error: output.orderResult.errors?.email
                })}
                ${textareaField({
                    label: translation.comment,
                    name: 'comment',
                    error: output.orderResult.errors?.comment
                })}
                <button type="submit" ?disabled=${output.orderResult.pending}>
                    ${translation.approveOrder} (${formatPrice(output.totalPrice)})
                </button>
            </form>
            <button type="button" @click=${handleCloseClick}>${translation.close}</button>
        ` : cart.section === SectionType.COMPLETE ? html`
            <div>
                ${translation.orderCompleted}
            </div>
            <button type="button" @click=${handleCloseClick}>${translation.close}</button>
        ` : null}
    `, element);
}

function field(props: IFieldProps) {
    return html`
        <div>
            <label>${props.label}</label>
            ${props.input}
            ${props.error ? html`<div>${props.error}</div>` : null}
        </div>
    `;
}

function textField(props: ITextFieldProps) {
    return field({
        ...props,
        input: html`<input type=${props.type || 'text'} name=${props.name} />`
    });
}

function textareaField(props: ITextareaFieldProps) {
    return field({
        ...props,
        input: html`<textarea name=${props.name}></textarea>`
    });
}
