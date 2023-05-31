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
        Box: {
            // baseStyle: {
            //     backgroundColor: 'white',
            // }
            variants: {
                pageContainer: {
                    // These styles will be applied when this variant is used
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
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