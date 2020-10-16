import { IOrderResult, ITranslation, IOrderItem, IOrderItemUnnormalized } from './types';
import shorthash from 'shorthash';
// @todo resolve with dynamic imports (but could be issues with rollup)
import enTranslation from './translations/en.json';
import uaTranslation from './translations/ua.json';
import ruTranslation from './translations/ru.json';

export function createOrderResult(result: { [key: string]: any } = {}): IOrderResult {
    const {
        message = null,
        success = false,
        completed = false,
        pending = false,
        errors = null
    } = result;
    return {
        message,
        success,
        completed,
        pending,
        errors
    };
}

export function fetchTranslation(translationId: string): Promise<ITranslation> {
    if (translationId === 'en') {
        return Promise.resolve(enTranslation as any);
    }
    if (translationId === 'ua') {
        return Promise.resolve(uaTranslation as any);
    }
    if (translationId === 'ru') {
        return Promise.resolve(ruTranslation as any);
    }
    return Promise.resolve({} as ITranslation);
}

export function makeGScriptRequest(url: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        const cbName = `__cb${Math.ceil(Math.random() * 10000)}`;
        script.setAttribute('src', `${url}?data=${JSON.stringify(data)}&cb=${cbName}`);
        script.setAttribute('crossorigin', 'anonymous');
        (window as any)[cbName] = (data: any) => {
            resolve(data);
            delete (window as any)[cbName];
        };
        script.onerror = () => {
            reject();
            delete (window as any)[cbName];
        };
        document.body.appendChild(script);
    });
}

export function normilizeItem(item: IOrderItemUnnormalized): IOrderItem {
    const name = (item.name || '').trim();
    const url = (item.url || '').trim();
    const image = (item.image || '').trim();
    const id = (item.id || shorthash.unique(`${name}#${url}`)).trim();
    const price = parseInt(String(item.price || '0'), 10);
    const count = parseInt(String(item.count || '1'), 10);
    return {
        id,
        name,
        url,
        count,
        image,
        price
    };
}
