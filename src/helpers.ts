import { IOrderResult, ITranslation } from './types';

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
    return import(`./translations/${translationId}.json`).then(result => result.default);
}

export function makeGScriptRequest(url: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        const cbName = `__cb${Math.ceil(Math.random() * 10000)}`;
        script.src = `${url}?data=${JSON.stringify(data)}&cb=${cbName}`;
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
