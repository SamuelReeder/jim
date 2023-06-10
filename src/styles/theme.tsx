import { extendTheme } from 'native-base';
import * as Font from 'expo-font';
import { Poppins_400Regular, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import { tags } from 'react-native-svg/lib/typescript/xml';

const theme = extendTheme({
    components: {
        fonts: {
            heading: 'Poppins_400Regular',
            body: 'Poppins_400Regular',
            bold: 'Poppins_700Bold',
        },
        Text: {
            baseStyle: {
                fontFamily: 'Poppins_400Regular',
            },
            variants: {
                bold: {
                    fontFamily: 'Poppins_700Bold',
                },
            },
        },
        Button: {
            baseStyle: {
                rounded: 'full',
                margin: 0.5,
                fontFamily: 'Poppins_400Regular',
            },
            variants: {
                landing: {
                    rounded: 'full',
                    margin: 0.5,
                },
                tag: {
                    rounded: 'full',
                    margin: 0.5,
                    bg: 'red.200',
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
                pageContainerNoWhite: {
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    safeArea: true,
                },
                searchContainer: {
                    flex: 1,
                    bg: 'white',
                    safeArea: true,
                },
                headerContainer: {
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    bg: 'white',
                },
            },
        },
        Heading: {
            baseStyle: {
                fontFamily: 'Poppins_400Regular',
            },
            variants: {
                bold: {
                    fontFamily: 'Poppins_700Bold',
                },
            },
        },
    },
    config: {
        useSystemColorMode: false,
        initialColorMode: 'light',
    },
});

export default theme;