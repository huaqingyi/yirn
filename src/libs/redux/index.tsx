import React, { PureComponent } from 'react';
import { connect as ct } from 'react-redux';
import { YirnClass } from '../core/yirn';

export * from './redux';
export * from './service';
export function connect<State = any>(
    maprops: (state: State) => any,
): <Component extends YirnClass<PureComponent<any, any, any>>>(component: Component) => Component {
    return function <Component extends YirnClass<PureComponent<any, any, any>>>(
        component: Component,
    ): Component {
        return ct(maprops)(component as any);
    }
}
