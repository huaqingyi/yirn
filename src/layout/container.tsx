import React, { PureComponent } from 'react';
import { Descriptor } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Home } from '../pages/home/home';
import { Moment } from '../pages/moment/moment';
import { Setting } from '../pages/setting/setting';
import { Button, AppState } from 'react-native';
import { connect } from '../libs';
import { AppStore } from '../models/app.store';
import styles from './container.styles';

const Stack = createStackNavigator();

export interface Props extends Descriptor<any> {
    app: AppState;
}

export interface State {

}

@connect((state: any) => ({
    app: state[AppStore.namespace],
}))
export class Container extends PureComponent<Props, State> {

    public render() {
        return (
            <>
                <Stack.Navigator>
                    <Stack.Screen name="Home" component={Home} />
                    <Stack.Screen name="Moment" component={Moment} />
                    <Stack.Screen name="Setting" component={Setting} />
                </Stack.Navigator>
                <Button title="test" onPress={() => {
                    console.log(this.props.navigation);
                    this.props.navigation.navigate('Moment', { screen: 'Test1' });
                }}>Test1</Button>
            </>
        );
    }
}
