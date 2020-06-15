import EStyleSheet from 'react-native-extended-stylesheet';
import rem from './rem.styles';
import variables from './variables.styles';

EStyleSheet.build({
    ...variables,
    $rem: rem,
});
