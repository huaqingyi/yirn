import React, { PureComponent } from 'react';
import { Layout, Text } from '@ui-kitten/components';

export class Test1 extends PureComponent {
    public render() {
        return (
            <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text category='h1'>Test1</Text>
            </Layout>
        );
    }
}