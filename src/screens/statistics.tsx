import { Box, Text, Button } from "native-base"
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import React, { Component } from 'react';
import Constants from 'expo-constants';
// import OnboardingComponent from "react-native-onboarding-animate";


// const StatisticsCard = () => {
//     return (

//     )
// }


const { width, height } = Dimensions.get('window');

type Props = {
    animatedValue: any;
    title: string;
    subtitle: string;
}

const Scene = ({ animatedValue, title, subtitle}: Props ) => {
    console.log(animatedValue)

    const halfWWidth = width / 2;
    const animateInputRange = [-1 * halfWWidth, 0, halfWWidth];

    const paragraphAnimateStyle = [
        styles.paragraph,
        {
            // transform: [{
            //     translateX: animatedValue.interpolate({
            //         inputRange: animateInputRange,
            //         outputRange: [width, 0, -1 * width],
            //         extrapolate: 'clamp'
            //     })
            // }],
            // opacity: animatedValue.interpolate({
            //     inputRange: animateInputRange,
            //     outputRange: [0, 1, 0]
            // })
        }
    ];

    return (
        // <Box variant="pageContainerNoWhite">
            <View style={styles.container}>
            <Text style={styles.title}>HEYY</Text>
            <Animated.Text style={paragraphAnimateStyle}>
                HEYYHEYYHEYYHEYYHEYYHEYY
            </Animated.Text>
            </View>
        // </Box>
    );
}


const StatisticsScreen = ({ navigation }) => {
    // const onBoardingCompleted = () => {
    //     alert('Boarding process is completed!')
    // };

    // let scenes = [
    //     {
    //         component: ({animatedValue}) => <Scene animatedValue={animatedValue} title="Share" subtitle="Share metrics with your friends" />,
    //         backgroundColor: '#512DA8',
    //     },
    //     {
    //         component: ({animatedValue}) => <Scene animatedValue={animatedValue} title="Learn" subtitle="Learn about your progress and your metrics" />,
    //         backgroundColor: '#388E3C',
    //     },
    //     {
    //         component: ({animatedValue}) => <Scene animatedValue={animatedValue} title="Compete" subtitle="Compare with the public" />,
    //         backgroundColor: '#1976D2',
    //     },
    // ];


    // return (
    //     <OnboardingComponent
    //         scenes={scenes}
    //         enableBackgroundColorTransition={true}
    //         onCompleted={onBoardingCompleted}
    //     />
    // );
    return (
        <Text>HEYY</Text>
    )
}

export default StatisticsScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width,
        paddingTop: Constants.statusBarHeight
    },
    title: {
        lineHeight: 38,
        fontSize: 32,
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
});