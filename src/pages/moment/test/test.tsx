import React, { PureComponent } from 'react';
import { Layout, Text } from '@ui-kitten/components';
import { Button } from 'react-native';

export class Test extends PureComponent<any, any> {
    public render() {
        return (
            <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text category='h1'>Test</Text>
            </Layout>
        );
    }
}