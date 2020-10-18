import { html, render as litRender } from 'lit-html';
import { ICart, IOrder, IOutput, ITranslation, OrderItemIDType, SectionType, IFieldProps, ITextFieldProps, ITextareaFieldProps, IDialogProps } from './types';
import styles from './styles.module.css';

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
        <div class=${styles.cart}>
            ${cart.section === SectionType.BUTTON ? html`
                ${output.items.length > 0 ? html`
                    <button
                        type="button"
                        @click=${handleCartButtonClick}
                        class=${styles.cartButton}
                    >
                        <span>${output.items.length}</span>
                    </button>
                ` : null}
            ` : cart.section === SectionType.CART ? dialog({
                content: html`
                    <div class=${styles.items}>
                        ${output.items.length > 0 ? output.items.map(item => html`
                            <div key=${item.id} class=${styles.item}>
                                ${item.image ? html`
                                    <img class=${styles.itemImage} src=${item.image} />
                                ` : null}
                                <div class=${styles.itemSummary}>
                                    <div class=${styles.itemName}>${item.name}</div>
                                    <div class=${styles.itemInfo}>
                                        <span>${translation.count}: <b>${item.count}</b></span>
                                        <span>${translation.price}: <b>${formatPrice(item.price)}</b></span>
                                    </div>
                                    <div class=${styles.itemActions}>
                                        <button class=${styles.itemAction} type="button" @click=${() => handleAddItemClick(item.id)}>${translation.addItem}</button>
                                        <button class=${styles.itemAction} type="button" @click=${() => handleRemoveItemClick(item.id)}>${translation.removeItem}</button>
                                    </div>
                                </div>
                            </div>
                        `) : (html`
                            <div class=${styles.empty}>${translation.nothingHere}</div>
                        `)}
                    </div>
                    <button class=${styles.bigButton} type="button" @click=${handleMakeOrderClick} ?disabled=${output.items.length === 0}>
                        ${translation.makeOrder} (${formatPrice(output.totalPrice)})
                    </button>
                `,
                translation,
                onClose: handleCloseClick
            }) : cart.section === SectionType.ORDER ? dialog({
                content: html`
                    <form class=${styles.orderForm} @submit=${handleOrderSubmit}>
                        <div class=${styles.orderFormContent}>
                            ${output.orderResult.message ? html`<div>${output.orderResult.message}</div>` : null}
                            <div class=${styles.orderFormFields}>
                                ${textInput({
                                    label: translation.name,
                                    name: 'name',
                                    error: output.orderResult.errors?.name
                                })}
                                ${textInput({
                                    label: translation.surname,
                                    name: 'surname',
                                    error: output.orderResult.errors?.surname
                                })}
                                ${textInput({
                                    label: translation.telephone,
                                    name: 'telephone',
                                    type: 'tel',
                                    error: output.orderResult.errors?.telephone
                                })}
                                ${textInput({
                                    label: translation.email,
                                    name: 'email',
                                    error: output.orderResult.errors?.email
                                })}
                                ${textareaInput({
                                    label: translation.comment,
                                    name: 'comment',
                                    error: output.orderResult.errors?.comment
                                })}
                            </div>
                        </div>
                        <button class=${styles.bigButton} type="submit" ?disabled=${output.orderResult.pending}>
                            ${translation.approveOrder} (${formatPrice(output.totalPrice)})
                        </button>
                    </form>
                `,
                translation,
                onClose: handleCloseClick
            }): cart.section === SectionType.COMPLETE ?  dialog({
                content: html`
                    <div class=${styles.orderCompleted}>
                        ${translation.orderCompleted}
                    </div>
                `,
                translation,
                onClose: handleCloseClick
            }) : null}
        </div>
    `, element);
}

function field(props: IFieldProps) {
    return html`
        <div class=${`${styles.field} ${props.error ? 'hasError' : ''}`}>
            <label class=${styles.fieldLabel}>${props.label}</label>
            <div class=${styles.fieldInput}>${props.input}</div>
            ${props.error ? html`<div class=${styles.fieldError}>${props.error}</div>` : null}
        </div>
    `;
}

function textInput(props: ITextFieldProps) {
    return field({
        ...props,
        input: html`<input type=${props.type || 'text'} name=${props.name} class=${styles.textInput} />`
    });
}

function textareaInput(props: ITextareaFieldProps) {
    return field({
        ...props,
        input: html`<textarea name=${props.name} class=${styles.textareaInput}></textarea>`
    });
}

function dialog(props: IDialogProps) {
    return html`
        <div class=${styles.dialog}>
            ${props.content}
            <button type="button" @click=${props.onClose} class=${styles.dialogClose} aria-label=${props.translation.close}>&times;</button>
        </div>
    `;
}
