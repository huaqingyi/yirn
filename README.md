# This's React Native Framework Basic Application Struct
# Quick Start
```
git clone https://github.com/huaqingyi/yirn.git appname
cd appname && yarn install && npx install pod-ios
npm run ios/android
```
## React Pages Router
### src/app
```
import './assets';
import React from 'react';
import { AppRegistry, Text, Platform } from 'react-native';
import { Container } from './layout/container';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from './libs';

const Stack = createStackNavigator();

AppRegistry.registerComponent(require('../app.json').name, () => (props) => (
    // 内置 eva-design ui 框架, 已配置主题.
    <ApplicationProvider {...eva} theme={{
        ...eva.light, ...require('./assets/eva/theme.json'),
    }} customMapping={require('./assets/eva/mapping.json')}>
        <Provider>
            <NavigationContainer linking={{
                // deeplink 配置
                prefixes: [Platform.OS === 'android' ? 'yirn://android' : 'yirn://ios']
            }} fallback={(
                <Text>Loading ...</Text>
            )}>
                <Stack.Navigator>
                    {/* 主路由 */}
                    <Stack.Screen name="Pages" component={Container} />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    </ApplicationProvider>
));
```
### layout/container
```
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
```
* infinite level router, but the best not more than 4
### model layer
```
import { redux, ReduxStore, reducers, effects, service } from '../libs';
import { AppService } from './app.service';

@redux
export class AppStore extends ReduxStore {

    public logined: boolean;
    public loading: boolean;
    public fetching: boolean;

    @service(AppService)
    public service!: AppService;

    constructor() {
        super();
        this.logined = false;
        this.loading = true;
        this.fetching = false;
    }

    @reducers
    public async updateState(state, { payload }) {
        return { ...state, ...payload };
    }

    @effects
    public *login({ payload }, { call, put }) {
        // params formmat, post or get to server
        yield put(this.createAction((acts => acts.updateState))({ fetching: true }))
        const logined = yield call(this.service.login, payload)
        yield put(this.createAction((acts => acts.updateState))({ logined, fetching: false }))
    }

    @effects
    public *logout(action, { call, put }) {
        yield put(this.createAction((acts => acts.updateState))({ logined: false }))
    }
}
```
### service layer
```
import { Service, ReduxService } from '../libs';

@Service
export class AppService extends ReduxService {
    // api request data
    public async login() {
        // return this.http.get('xxxx');
        return Promise.resolve(true);
    }
}
```
## For the time being, the next iteration
### Thx, Welcome to fork
