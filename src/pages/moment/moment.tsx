import React, { PureComponent } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Test } from './test/test';
import { Test1 } from './test1/test1';

const Stack = createStackNavigator();

export class Moment extends PureComponent {
    public render() {
        return (
            <Stack.Navigator>
                <Stack.Screen name="Test" component={Test} />
                <Stack.Screen name="Test1" component={Test1} />
            </Stack.Navigator>
        );
    }
}