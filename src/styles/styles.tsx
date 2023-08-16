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

    outer: {
        backgroundColor: "white",
        padding:20,
    },

    // social
    container: {
        flexDirection: 'row',
        height: 47,
        // margin: 10,
        borderRadius: 25,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        // padding: 4,    
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // padding: 1,
    },
    innerTab: {
        width: '100%',
        height: '100%',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerTabFocused: {
        backgroundColor: 'rgba(0,0,0, 1)',
    },
    innerTabUnfocused: {
        backgroundColor: 'transparent',
    },
    label: {
        textAlign: 'center',
    },
    labelFocused: {
        color: 'white',
    },
    labelUnfocused: {
        color: 'white',
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
    
    title: {
        // lineHeight: ,
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        // textAlign: 'center',
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'rgba(255,255,255,0.7)',

    },

    points: {
        textAlign: 'center',
        color: 'white',
        lineHeight: 24,
        fontSize: 24,
        // lineHeight: 40,
        fontFamily: 'Poppins',
        fontWeight: '700',
    },
    containerAlt: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#152d44',
        padding: 50,
    },
    pointsDelta: {
        color: '#4c6479',
        fontSize: 50,
        fontWeight: '100',
    },
    pointsDeltaActive: {
        color: '#fff',
    },

    statButton: {
        backgroundColor: "rgba(0,0,0,0.7)",
        color: '#ffffff',
        paddingVertical: 50,
        justifyContent: 'center',
        width: '100%',
        borderRadius: 100,
    },

});

export default styles;