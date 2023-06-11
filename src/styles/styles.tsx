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
        padding: 18,
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


});

export default styles;