import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    landing_button: {
        backgroundColor: '#000000',
        color: '#ffffff',
        paddingVertical: 50,
        justifyContent: 'center',
        width: '100%',
        borderRadius: 100,
    },

    landing_input: {
        // backgroundColor: '#000000',
        // color: '#ffffff',
        // paddingVertical: 20,
        // justifyContent: 'center',
        width: '100%',
        // marginVertical: 10,
        // borderRadius: 100,
    },

    login_button: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },

    separator: {
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    item: {
        paddingHorizontal: 18,
        paddingVertical: 8,
    },

    socialItem: {
        padding: 10,
    },

    circleButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        width: 70,
        height: 70,
        borderRadius: 35,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    buttonText: {
        color: 'white',
        fontSize: 40,
    },

    // social
    container: {
        flexDirection: 'row',
        height: 50,
        margin: 10,
        borderRadius: 25,
        backgroundColor: 'grey',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    innerTab: {
        width: '100%',
        height: '80%',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerTabFocused: {
        backgroundColor: 'black',
    },
    innerTabUnfocused: {
        backgroundColor: 'grey',
    },
    label: {
        textAlign: 'center',
    },
    labelFocused: {
        color: 'white',
    },
    labelUnfocused: {
        color: 'black',
    },

    // edit profile
    pfpButton: {
        position: 'relative',
    },

    pfpImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    pfpIcon: {
        backgroundColor: 'black',
        padding: 5,
        borderRadius: 50,
        position: 'absolute',
        bottom: 10,
        right: 10,
        color: 'white',
    },
    


});

export default styles;