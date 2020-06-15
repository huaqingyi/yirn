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
