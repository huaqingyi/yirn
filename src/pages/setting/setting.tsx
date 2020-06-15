import React, { PureComponent } from 'react';
import { ScrollView, View, Text } from 'react-native';

export class Setting extends PureComponent {
    public render() {
        return (
            <ScrollView contentInsetAdjustmentBehavior="automatic">
                <View>
                    <Text>Setting</Text>
                </View>
            </ScrollView>
        );
    }
}