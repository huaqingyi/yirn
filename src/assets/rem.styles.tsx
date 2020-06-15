import { Dimensions } from 'react-native';

export default () => {
    const { width } = Dimensions.get('window');
    return width > 340 ? 18 : 17;
}