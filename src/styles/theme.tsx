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
                margin: 0.5,
            },
        },
        Box: {
            variants: {
                pageContainer: {
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    bg: 'white',
                    safeArea: true,
                },
                searchContainer: {
                    flex: 1,
                    bg: 'white',
                    safeArea: true,
                },
            },
        },
        // colors: {
        //     // add the color you want
        //     background: {
        //         50: "#ffffff", // replace with your color code
        //         100: "#ffffff", // replace with your color code
        //         // You can continue the scale if necessary
        //     },
        // },
    },
    config: {
        useSystemColorMode: false,
        initialColorMode: 'light',
    },
});

export default theme;