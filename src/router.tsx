import React, { PureComponent } from 'react';
import { BackHandler } from 'react-native';
import {
    NavigationActions, createSwitchNavigator,
} from 'react-navigation';
import {
    createReduxContainer,
    createReactNavigationReduxMiddleware,
    createNavigationReducer,
} from 'react-navigation-redux-helpers';
import { connect } from 'react-redux';
import { AppStore } from './models/app.store';
import { Container } from './layout/container';
import { NavigationContainer } from '@react-navigation/native';

const AppNavigator = createSwitchNavigator({
    Pages: { screen: Container },
});

export const routerReducer = createNavigationReducer(AppNavigator)

export const routerMiddleware = createReactNavigationReduxMiddleware(
    (state: any) => state.router,
    'root',
)

const App = createReduxContainer(AppNavigator, 'root')

function getActiveRouteName(navigationState) {
    if (!navigationState) {
        return null
    }
    const route = navigationState.routes[navigationState.index]
    if (route.routes) {
        return getActiveRouteName(route)
    }
    return route.routeName
}

class Router extends PureComponent<any, any> {

    public UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backHandle)
    }

    public componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backHandle)
    }

    public backHandle = () => {
        const currentScreen = getActiveRouteName(this.props.router)
        if (currentScreen === 'Login') {
            return true
        }
        if (currentScreen !== 'Home') {
            this.props.dispatch(NavigationActions.back())
            return true
        }
        return false
    }

    public render() {
        const { app, dispatch, router } = this.props
        // if (app.loading) return <Loading />

        return (
            <NavigationContainer>
                <App dispatch={dispatch} state={router} />
            </NavigationContainer>
        )
    }
}

export default connect((state: any) => ({
    app: state[AppStore.namespace], router: state.router,
}))(Router)
