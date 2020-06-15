import React, { PureComponent } from 'react';

export declare type YirnClass<V> = (new (...args: any[]) => V & PureComponent) & typeof PureComponent;
