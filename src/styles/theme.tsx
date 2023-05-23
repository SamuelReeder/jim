import { extendTheme } from 'native-base';

const theme = extendTheme({
    components: {
        Button: {
            baseStyle: {
                rounded: 'full',
                margin: 0.5,
            },
        },
        Input: {
            baseStyle: {
                margin: 0.5,
            },
        },  
    },
});

export default theme;