import { Box, Text, Button, FlatList, HStack, Select, Pressable, Modal, KeyboardAvoidingView, Heading, Input } from "native-base"
import { Animated, Dimensions, StyleSheet, View, PanResponder, Platform } from 'react-native';
import React, { Component, useRef, useState, useEffect } from 'react';
import Constants from 'expo-constants';
// import OnboardingComponent from "react-native-onboarding-animate";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Svg, { Circle } from 'react-native-svg';
import { BlurView } from 'expo-blur';
import styles from "../styles/styles";
import * as Progress from 'react-native-progress';
import { gen } from "../api";
import { updateStat, saveChoice, fetchStatistics } from "../api";
import { Stat } from "../components";
import { useAuth } from "../navigation/auth_provider";
// import { PieChart } from "react-native-chart-kit";


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

const genData = () => {

}

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
    const { user } = useAuth();
    const [showModal0, setShowModal0] = useState(false);
    const [showModal1, setShowModal1] = useState(false);
    const [currentStat, setCurrentStat] = useState<Stat | null>(null)
    const [currentState, setCurrentState] = useState("");
    const [selectedOption, setSelectedOption] = useState<string | null>(null);


    const data = [
        {
            name: "Seoul",
            population: 21500000,
            //   color: "rgba(131, 167, 234, 1)",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "Toronto",
            population: 2800000,
            //   color: "#F00",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "Beijing",
            population: 527612,
            //   color: "red",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "New York",
            population: 8538000,
            //   color: "#ffffff",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "Moscow",
            population: 11920000,
            //   color: "rgb(0, 0, 255)",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        }
    ];

    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
    };

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
                    width={24}
                    placeholder="Units"
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
            {/* <Pressable width="100%" flexDirection="row" onPress={() => {
                // navigation.navigate('Stat', { stat: item.metric })

                // const stat: Stat = {
                //     metric: data2[index].metric,  // Assuming data2.metric is a string
                //     value: null,
                // };
                // setCurrentStat(stat)
                // setShowModal0(true);
            }}> */}
            <Pressable width="100%" onPress={() => setShowModal1(true)}>
                <Box style={{ borderRadius: 15, backgroundColor: "black", padding: 20, margin: 10 }}>
                    <Text marginBottom="3" style={styles.title}>State</Text>
                    <Text marginY="3"
                        style={{
                            color: currentState === 'bulking' ? 'green' :
                                currentState === 'cutting' ? 'red' :
                                    currentState === 'maintaining' ? 'blue' : 'white',
                            fontWeight: '700',
                            fontSize: 16
                        }}>{currentState}</Text>
                    {/* <PieChart
                        data={data}
                        width={screenWidth}
                        height={220}
                        // chartConfig={chartConfig}
                        accessor={"population"}
                        backgroundColor={"transparent"}
                        paddingLeft={"15"}
                        center={[10, 50]}
                        absolute     
                    /> */}
                    {/* <ProgressBar args={0.7} /> */}
                </Box>
            </Pressable>


            <FlatList
                data={data2}
                renderItem={({ item, index }) =>
                    <Pressable onPress={() => {
                        // navigation.navigate('Stat', { stat: item.metric })

                        const stat: Stat = {
                            metric: data2[index].metric,  // Assuming data2.metric is a string
                            value: null,
                        };
                        setCurrentStat(stat)
                        setShowModal0(true);
                    }}>
                        <Box style={{ borderRadius: 15, backgroundColor: "black", padding: 20, margin: 5 }}>
                            <Text marginBottom="3" style={styles.title}>{item.metric}</Text><CircularProgress args={item} />
                            <Text marginY="3" style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>Percentile</Text>
                            <ProgressBar args={0.7} />
                        </Box>
                    </Pressable>}
                keyExtractor={item => item.metric.toString()}
                numColumns={2}
            />
            {/* <Box width="90%">
                <Button style={styles.statButton} position="absolute" bottom="0" p="5" marginY="5" onPress={() => {
                    // handleUpdateProfile();
                    // navigation.navigate('Profile');
                    gen(10);
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

            </Box> */}
            <Modal isOpen={showModal0} onClose={() => setShowModal0(false)}>
                <Modal.Content>
                    <Modal.CloseButton borderRadius="full" />
                    {/* <Modal.Header>Change amount</Modal.Header> */}
                    <Modal.Body height={300}>
                        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} flex={1}>
                            <Box p="6" flex={1} justifyContent="space-between">
                                <Heading marginX={6} size="lg">Change {currentStat?.metric}</Heading>
                                <Input marginX={6} variant="underlined" style={styles.landing_input} py={3} placeholder="Weight (lbs)"
                                    onChangeText={(value) => {
                                        const stat = currentStat;
                                        if (!isNaN(parseFloat(value)) && stat != null) {
                                            stat.value = parseFloat(value);
                                        }
                                        // setUsername(value)
                                    }}
                                />
                                <Button
                                    p="5"
                                    style={styles.landing_button}
                                    onPress={() => {
                                        if (user && currentStat && currentStat.value != null) {
                                            updateStat(user?.uid, currentStat)
                                            setShowModal0(false);
                                        }
                                    }}
                                >
                                    <Text style={styles.login_button}>SUBMIT
                                    </Text>
                                </Button>
                            </Box>
                        </KeyboardAvoidingView>
                    </Modal.Body>
                    {/* <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                setShowModal(false);
                            }}>
                                Cancel
                            </Button>
                            <Button onPress={() => {
                                setShowModal(false);
                            }}>
                                Save
                            </Button>
                        </Button.Group>
                    </Modal.Footer> */}
                </Modal.Content>
            </Modal>
            <Modal isOpen={showModal1} onClose={() => setShowModal1(false)}>
                <Modal.Content>
                    <Modal.CloseButton borderRadius="full" />
                    {/* <Modal.Header>Change amount</Modal.Header> */}
                    <Modal.Body height={300}>
                        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} flex={1}>
                            <Box p="6" flex={1} justifyContent="space-between">
                                <Heading marginX={6} size="lg">Change state</Heading>
                                <HStack justifyContent="space-between">
                                    <Pressable onPress={() => setSelectedOption('Cutting')}>
                                        <Box borderRadius={10} padding={2} bgColor={selectedOption === 'Cutting' ? 'green.300' : 'gray.300'}>
                                            <Text fontWeight="bold">Cutting</Text>
                                        </Box>
                                    </Pressable>
                                    <Pressable onPress={() => setSelectedOption('Maintaining')}>
                                        <Box borderRadius={10} padding={2} bgColor={selectedOption === 'Maintaining' ? 'green.300' : 'gray.300'}>
                                            <Text fontWeight="bold">Maintaining</Text>
                                        </Box>
                                    </Pressable>
                                    <Pressable onPress={() => setSelectedOption('Bulking')}>
                                        <Box borderRadius={10} padding={2} bgColor={selectedOption === 'Bulking' ? 'green.300' : 'gray.300'}>
                                            <Text fontWeight="bold">Bulking</Text>
                                        </Box>
                                    </Pressable>
                                </HStack>
                                <Button
                                    p="5"
                                    style={styles.landing_button}
                                    onPress={() => {
                                        if (user && selectedOption) {
                                            setCurrentState(selectedOption);
                                            saveChoice(user?.uid, selectedOption);
                                            setShowModal1(false);
                                        }
                                    }}
                                >
                                    <Text style={styles.login_button}>SUBMIT</Text>
                                </Button>
                            </Box>
                        </KeyboardAvoidingView>
                    </Modal.Body>
                    {/* <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                setShowModal(false);
                            }}>
                                Cancel
                            </Button>
                            <Button onPress={() => {
                                setShowModal(false);
                            }}>
                                Save
                            </Button>
                        </Button.Group>
                    </Modal.Footer> */}
                </Modal.Content>
            </Modal>



        </Box >
    )
}


export default StatisticsScreen;