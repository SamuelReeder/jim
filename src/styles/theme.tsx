import { extendTheme } from '@gluestack-ui/themed-native-base';

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
                    fontWeight: 'bold',
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
                    bg: 'red.200',
                    color: 'red.500',
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
                socialContainer: {
                    flex: 1,
                    bg: 'white',
                },
                headerContainer: {
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    bg: 'white',
                },
                createPostContainer: {
                    flex: 1,
                    alignItems: 'center',
                    bg: 'white',
                },
            },
        },
        KeyboardAvoidingView: {
            variants: {
                createPostContainer: {
                    flex: 1,
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