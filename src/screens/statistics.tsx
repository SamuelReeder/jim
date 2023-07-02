import { Box, Text, Button, FlatList, HStack, Select } from "native-base"
import { Animated, Dimensions, StyleSheet, View, PanResponder } from 'react-native';
import React, { Component, useRef, useState, useEffect } from 'react';
import Constants from 'expo-constants';
// import OnboardingComponent from "react-native-onboarding-animate";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Svg, { Circle } from 'react-native-svg';
import { BlurView } from 'expo-blur';
import styles from "../styles/styles";
import * as Progress from 'react-native-progress';


const screenWidth = Dimensions.get('window').width;


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

const Scene = ({ animatedValue, title, subtitle }: Props) => {
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
        <View style={styles.containerAlt}>
            <Text style={styles.title}>HEYY</Text>
            <Animated.Text style={paragraphAnimateStyle}>
                HEYYHEYYHEYYHEYYHEYYHEYY
            </Animated.Text>
        </View>
        // </Box>
    );
}

const MAX_POINTS = 500;
const data = [1, 2, 3, 4, 5, 6];

const data2 = [
    { metric: "Calories", value: Math.floor(Math.random() * 500) },
    { metric: "Bench press", value: Math.floor(Math.random() * 500) },
    { metric: "Squats", value: Math.floor(Math.random() * 500) },
    { metric: "Deadlift", value: Math.floor(Math.random() * 500) },
    { metric: "Pull ups", value: Math.floor(Math.random() * 500) },
    { metric: "Push ups", value: Math.floor(Math.random() * 500) },
    { metric: "Bicep curls", value: Math.floor(Math.random() * 500) },
    { metric: "Shoulder press", value: Math.floor(Math.random() * 500) },
    { metric: "Lateral raises", value: Math.floor(Math.random() * 500) },
    { metric: "Front raises", value: Math.floor(Math.random() * 500) },
    { metric: "Sit ups", value: Math.floor(Math.random() * 500) },


]

const ProgressBar = ({ args }) => {
    // const progress = useRef(new Animated.Value(0)).current;
    const [progress, setProgress] = useState(0);

    //   useEffect(() => {
    //     Animated.timing(progress, {
    //       toValue: (args / 100),
    //       duration: 2000,
    //       useNativeDriver: false,
    //     }).start();
    //   }, []);

    useEffect(() => {
        // Start the animation
        let progress = 0;
        setTimeout(() => {
            progress += args;
            setProgress(progress);
        }, 1000); // Change the speed of animation by modifying the interval
    }, []);

    return (
        // <Box>
        <Progress.Bar progress={0.5} animated={true} animationType="decay" height={5} borderWidth={7.5} borderRadius={50} borderColor="#3d5875" color="#00e0ff" />
        // {/* </Box> */}
    );
};


const CircularProgress = ({ args }) => {
    const [isMoving, setIsMoving] = useState(false);
    const [pointsDelta, setPointsDelta] = useState(0);
    const [points, setPoints] = useState(args.value);

    const circularProgressRef = useRef(null);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                setIsMoving(true);
                setPointsDelta(0);
            },
            onPanResponderMove: (_, gestureState) => {
                if (circularProgressRef.current) {
                    circularProgressRef.current.animate(0, 0);
                }
                setPointsDelta(Math.round(-gestureState.dy / 2));
            },
            onPanResponderRelease: (_, gestureState) => {
                if (circularProgressRef.current) {
                    circularProgressRef.current.animate(100, 3000);
                }
                let newPoints = points + pointsDelta;
                console.log(Math.min(newPoints, MAX_POINTS));
                setIsMoving(false);
                setPoints(newPoints > 0 ? Math.min(newPoints, MAX_POINTS) : 0);
                setPointsDelta(0);
            },
        })
    ).current;

    const fill = (points / MAX_POINTS) * 100;

    return (
        //   <View style={styles.container} {...panResponder.panHandlers}>
        <AnimatedCircularProgress
            size={(screenWidth / 2) - 60}
            width={5}
            backgroundWidth={15}
            fill={fill}
            tintColor="#00e0ff"
            backgroundColor="#3d5875">
            {fill => (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.points}>{args.value}</Text>
                    <Text color="gray.500" fontSize="sm">amount</Text>
                </View>
            )}
        </AnimatedCircularProgress>


        // <Text style={[styles.pointsDelta, isMoving && styles.pointsDeltaActive]}>
        //   {pointsDelta >= 0 && '+'}
        //   {pointsDelta}
        // </Text>
        //   </View>
    );
};

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
        <Box variant="pageContainer">
            <HStack px="5" justifyContent="space-between" alignItems="center" width="100%">
                <Text>Metrics</Text>
                <Select
                    width={20}
                    placeholder="Filter"
                // _selectedItem={{
                //     bg: "cyan.600",
                //     endIcon: <CheckIcon size="4" />,
                // }}
                >
                    <Select.Item label="Option 1" value="1" />
                    <Select.Item label="Option 2" value="2" />
                    <Select.Item label="Option 3" value="3" />
                </Select>
            </HStack>

            <FlatList
                data={data2}
                renderItem={({ item }) =>
                    <Box style={{ borderRadius: 15, backgroundColor: "black", padding: 20, margin: 5 }}>
                        <Text marginBottom="3" style={styles.title}>{item.metric}</Text><CircularProgress args={item} />
                        <Text marginY="3" style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>Percentile</Text>
                        <ProgressBar args={0.7} />
                    </Box>}
                keyExtractor={item => item.metric.toString()}
                numColumns={2}
            />
            <Box width="90%">
                {/* <BlurView intensity={100} tint="dark"> */}
                <Button style={styles.statButton} position="absolute" bottom="0" p="5" marginY="5" onPress={() => {
                    // handleUpdateProfile();
                    // navigation.navigate('Profile');
                }}>
                    <Box justifyContent="center" alignItems="center">
                        <Text
                            style={{
                                color: '#FFFFFF',
                            }}>
                            SUBMIT
                        </Text>
                    </Box>

                </Button>

                {/* </BlurView> */}
            </Box>


        </Box>
    )
}


export default StatisticsScreen;