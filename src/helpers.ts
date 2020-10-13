import { IOrderResult, ITranslation } from './types';
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
