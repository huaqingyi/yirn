import 'reflect-metadata'
import { ReduxStore } from './redux';

export class ReduxService {
    public http: any;
}

export declare type YirnServiceClass<V> = (new (...args: any[]) => V & ReduxService) & typeof ReduxService;


export function Service<S extends YirnServiceClass<ReduxService>>(target: S): S {
    return target;
}

export function service<S extends YirnServiceClass<ReduxService>>(s: S) {
    return function(target: ReduxStore, key: string){
        target[key] = new s;
        return target[key];
    }
}