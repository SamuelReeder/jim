import { extendTheme } from 'native-base';

const theme = extendTheme({
    components: {
        Button: {
            baseStyle: {
                rounded: 'full',
                margin: 0.5,
            },
            variants: {
                landing: {
                    rounded: 'full',
                    margin: 0.5,
                }
            }
                    
        },
        Input: {
            baseStyle: {
                // rounded: 'full',
                margin: 0.5,
            },
        },  
        // Box: {
        //     baseStyle: {
        //         backgroundColor: 'white',
        //     }
        // },
    },
    config: {
        useSystemColorMode: false,
        initialColorMode: 'light',
    },
});

export default theme;