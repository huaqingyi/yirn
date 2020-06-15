import React, { PureComponent } from 'react';
import { map } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { Provider as Pd } from 'react-redux';
import { reduxify } from './reduxify';

export interface ReduxOption {
    namespace?: string;
    state: any;
    effects?: { [x: string]: any };
    reducers?: { [x: string]: any };
    [x: string]: any;
}

export class ReduxStore<Props = any> {
    public static namespace: string;
    public static id: string;
    public static state: any;
    public static effects: { [x: string]: any };
    public static reducers: { [x: string]: any };
    public static _root() {
        return ReduxStore;
    }
    public static action<ReduxModel>(callback: (props: ReduxModel) => any) {
        return `${this.namespace}/${callback(this.prototype as any).rename}`;
    };


    public namespace!: string;
    public state!: Props;
    public effects!: { [x: string]: any };
    public reducers!: { [x: string]: any };

    public createAction(action: (props: this) => any) {
        return payload => ({ type: `${this.namespace}/${action(this).rename}`, payload });
    }
}

export declare type YirnStoreClass<V> = (new (...args: any[]) => V & ReduxStore) & typeof ReduxStore;

export class ReactRedux {
    public static stores: { [x: string]: any; };
    public static i: ReactRedux;
    public static behavior: BehaviorSubject<{ [x: string]: any; }>;

    public static I(): ReactRedux {
        // tslint:disable-next-line:new-parens
        if (!ReactRedux.i) {
            ReactRedux.stores = {};
            ReactRedux.behavior = new BehaviorSubject(ReactRedux.stores);
            ReactRedux.i = new ReactRedux;
        }
        return ReactRedux.i;
    }

    private effect: { [x: string]: any };
    private reducer: { [x: string]: any };
    private subscription: { [x: string]: any };
    private servicemappings: { [x: string]: any };

    constructor() {
        this.effect = {};
        this.reducer = {};
        this.subscription = {};
        this.servicemappings = {};
    }

    public redux(constructor: any, config: ReduxOption) {
        const store: any = {};
        store.namespace = constructor.id;

        store.effects = {};
        map(config.effects, (o, i) => store.effects[i] = o.bind(c));

        store.reducers = {};
        map(config.reducers, (o, i) => store.reducers[i] = o.bind(c));

        map(this.servicemappings, (o, i) => {
            constructor.prototype[i] = o;
        });

        map(this.effect, (o, i) => {
            o.rename = i;
            store.effects[i] = o.bind(constructor.prototype);
        });

        map(this.reducer, (o, i) => {
            o.rename = i;
            store.reducers[i] = o.bind(constructor.prototype);
        });

        this.servicemappings = {};
        this.effect = {};
        this.reducer = {};

        const c = new constructor();
        store.state = JSON.parse(JSON.stringify(c));

        ReactRedux.stores[store.namespace] = store;

        ReactRedux.behavior.next(ReactRedux.stores);

        return constructor;
    }

    public effects(constructor: any, proptype: string) {
        this.effect[proptype] = constructor[proptype].bind(constructor);
        this.effect[proptype].rename = proptype;
    }

    public reducers(constructor: any, proptype: string) {
        this.reducer[proptype] = constructor[proptype].bind(constructor);
        this.reducer[proptype].rename = proptype;
    }

    public subscriptions(constructor: any, proptype: string) {
        this.subscription[proptype] = constructor[proptype].bind(constructor);
        this.subscription[proptype].rename = proptype;
    }

    public serviceMapping(service: any, constructor: any, proptype: string): any {
        this.servicemappings[proptype] = new service();
    }
}

export function redux<Store extends YirnStoreClass<ReduxStore<any>>>(props: Store): Store;
export function redux<RO extends ReduxOption>(config: RO): <Store extends YirnStoreClass<ReduxStore<any>>>(props: Store) => Store;
export function redux(config: any) {
    const { _root } = config;
    if (_root && _root() === ReduxStore) {
        config.id = config.namespace = Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
        return ReactRedux.I().redux(config, { state: config.prototype });
    }
    // tslint:disable-next-line:only-arrow-functions
    return <Store extends YirnStoreClass<ReduxStore<any>>>(constructor: Store) => {
        if (!config.namespace) {
            config.namespace = Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
        }
        constructor.id = constructor.namespace = config.namespace;
        ReactRedux.I().redux(constructor, config);
        return constructor;
    }
}

export function reducers(target: ReduxStore, key: string): void {
    ReactRedux.I().reducers(target, key);
}

export function effects(target: ReduxStore, key: string): void {
    ReactRedux.I().effects(target, key);
}

export function subscriptions(target: ReduxStore, key: string): void {
    ReactRedux.I().subscriptions(target, key);
}

export interface Props {

}

export interface State {
    store: any;
}

export class Provider extends PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            store: reduxify({})
        }
    }

    public UNSAFE_componentWillMount() {
        ReactRedux.I();
        ReactRedux.behavior.subscribe((stores: { [x: string]: any }) => {
            this.setState({
                store: reduxify(stores)
            });
        });
    }

    public render() {
        return (
            <Pd store={this.state.store}>
                {this.props.children}
            </Pd>
        )
    }
}
