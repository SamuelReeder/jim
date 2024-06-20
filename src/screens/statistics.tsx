import { Box, Text, Button, FlatList, HStack, Select, Pressable, Modal, KeyboardAvoidingView, Heading, Input } from "native-base"
import { Animated, Dimensions, StyleSheet, View, PanResponder, Platform } from 'react-native';
import React, { Component, useRef, useState, useEffect } from 'react';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Progress from 'react-native-progress';
import { fetchStats, gen } from "../api";
import { updateStat, savePriorityChoice, saveStateChoice, fetchStatistics } from "../api";
import { Stat, PageLoader, ErrorMessage, Priority } from "../components";
import { useAuth } from "../navigation/auth_provider";
import firestore from '@react-native-firebase/firestore';
import styles from "../styles/styles";


const screenWidth = Dimensions.get('window').width;
const { width, height } = Dimensions.get('window');

type Props = {
    animatedValue: any;
    title: string;
    subtitle: string;
}


const MAX_POINTS = 500;

const ProgressBar = ({ args }: { args: number }) => {
    // const progress = useRef(new Animated.Value(0)).current;
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Start the animation
        let progress = 0;
        setTimeout(() => {
            progress += args;
            setProgress(progress);
        }, 1000); // Change the speed of animation by modifying the interval
    }, []);

    return (
        <Progress.Bar
            progress={0.5}
            animated={true}
            animationType="decay"
            height={5}
            borderWidth={7.5}
            borderRadius={50}
            borderColor="#3d5875"
            color="#00e0ff"
            width={null} // Set width to null to make the progress bar take up the full width of its parent container
        />
    );
};


const CircularProgress = ({ args }: { args: Stat }) => {
    const [isMoving, setIsMoving] = useState<boolean>(false);
    const [pointsDelta, setPointsDelta] = useState<number>(0);
    const [points, setPoints] = useState<number>(args.value ?? 0);

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
        <AnimatedCircularProgress
            size={(screenWidth / 1.3) - 60}
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
    );
};

const StatisticsScreen = ({ navigation }) => {
    const { user, account } = useAuth();
    const [showModal0, setShowModal0] = useState(false);
    const [showModal1, setShowModal1] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [currentStat, setCurrentStat] = useState<Stat | null>(null)
    const [currentState, setCurrentState] = useState<string | undefined>();
    const [currentPriority, setCurrentPriority] = useState<string | undefined>();
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
    const [stats, setStats] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [data2, setData2] = useState<any | undefined>();
    const [unit, setUnits] = useState<string>("lbs");

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

    useEffect(() => {
        const fetchStuff = async () => {
            if (user) {
                try {
                    const res = await fetchStats(user.uid);

                    if (res == null) {
                        setLoading(false);
                        setError(true);
                        return;
                    }

                    setCurrentState(res.State);
                    setCurrentPriority(res.Priority);

                    // Remove the State attribute from res before setting it to the other variables
                    const resCopy = { ...res };
                    delete resCopy.State;
                    delete resCopy.Priority;
                    setStats(resCopy);

                    const newData = Object.entries(resCopy).map(([metric, value]) => ({ metric, value }));
                    setData2(newData);
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching stats:", error);
                    setLoading(false);
                    setError(true);
                }
            }
        };

        fetchStuff();
    }, [user]);

    if (loading) {
        return <PageLoader />;
    }

    if (error) {
        return <ErrorMessage handler={fetchStats} />;
    }


    return (
        <Box variant="pageContainer" px="4" py="2">
            <HStack justifyContent="space-between" alignItems="center" width="100%">
                <Text>Metrics</Text>
                <Select
                    width={24}
                    placeholder="Units"
                    // _selectedItem={{
                    //     bg: "cyan.600",
                    //     endIcon: <CheckIcon size="4" />,
                    // }}
                    onValueChange={(itemValue) => {
                        setUnits(itemValue)
                    }}
                >
                    <Select.Item label="kg" value="kg" />
                    <Select.Item label="lb" value="lb" />
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
                <Box style={{ borderRadius: 15, backgroundColor: "black", padding: 20, marginVertical: 10 }}>
                    <Text marginBottom="3" style={styles.title}>State</Text>
                    <Text marginY="3"
                        style={{
                            color: 'white',
                            fontWeight: '700',
                            fontSize: 28,
                            lineHeight: 30
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
                    <ProgressBar args={0.7} />
                </Box>
            </Pressable>

            <Pressable width="100%" onPress={() => setShowModal2(true)}>
                <Box style={{ borderRadius: 15, backgroundColor: "black", padding: 20, marginVertical: 10 }}>
                    <Text marginBottom="3" style={styles.title}>Priority</Text>
                    <Text marginY="3"
                        style={{
                            color: 'white',
                            fontWeight: '700',
                            fontSize: 28,
                            lineHeight: 30
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
                    <ProgressBar args={0.7} />
                </Box>
            </Pressable>

            {/* <FlatList
                data={data2}
                renderItem={({ item, index }: { item: Stat, index: number }) =>
                    <Pressable width="100%" onPress={() => {
                        // setCurrentStat(item)
                        setShowModal0(true);
                    }}>
                        <Box style={{
                            borderRadius: 15,
                            backgroundColor: "black",
                            padding: 20,
                            justifyContent: 'center',
                        }}>
                            <Text marginBottom="3" style={styles.title}>{item.metric}</Text>
                            <View style={{ alignItems: 'center' }}>
                                <CircularProgress args={item} />
                            </View>
                            <Text marginY="3" style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>Percentile</Text>
                            <ProgressBar args={70} />
                        </Box>
                    </Pressable>}
                keyExtractor={item => item.metric.toString()}
                numColumns={2}
            /> */}
            <Modal isOpen={showModal0} onClose={() => setShowModal0(false)}>
                <Modal.Content>
                    <Modal.CloseButton borderRadius="full" />
                    {/* <Modal.Header>Change amount</Modal.Header> */}
                    <Modal.Body height={300}>
                        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} flex={1}>
                            <Box p="6" flex={1} justifyContent="space-between">
                                <Heading marginX={6} size="lg">Change {currentStat?.metric}</Heading>
                                <Input marginX={6} variant="underlined" style={styles.landing_input} py={3} placeholder={`Weight (${unit})`}
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
                                            // saveStateChoice(user?.uid, selectedOption);
                                            setShowModal1(false);
                                        }
                                    }}
                                >
                                    <Text style={styles.login_button}>SUBMIT</Text>
                                </Button>
                            </Box>
                        </KeyboardAvoidingView>
                    </Modal.Body>
                </Modal.Content>
            </Modal>

            <Modal isOpen={showModal2} onClose={() => setShowModal2(false)}>
                <Modal.Content>
                    <Modal.CloseButton borderRadius="full" />
                    {/* <Modal.Header>Change amount</Modal.Header> */}
                    <Modal.Body height={300}>
                        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} flex={1}>
                            <Box p="6" flex={1} justifyContent="space-between">
                                <Heading marginX={6} size="lg">Change state</Heading>
                                <HStack justifyContent="space-between">
                                    <Pressable onPress={() => setSelectedPriority('Bodybuilding')}>
                                        <Box borderRadius={10} padding={2} bgColor={selectedPriority === 'Bodybuilding' ? 'green.300' : 'gray.300'}>
                                            <Text fontWeight="bold">Cutting</Text>
                                        </Box>
                                    </Pressable>
                                    <Pressable onPress={() => setSelectedPriority('Strongman')}>
                                        <Box borderRadius={10} padding={2} bgColor={selectedPriority === 'Strongman' ? 'green.300' : 'gray.300'}>
                                            <Text fontWeight="bold">Maintaining</Text>
                                        </Box>
                                    </Pressable>
                                    <Pressable onPress={() => setSelectedPriority('Aesthetics')}>
                                        <Box borderRadius={10} padding={2} bgColor={selectedPriority === 'Aesthetics' ? 'green.300' : 'gray.300'}>
                                            <Text fontWeight="bold">Bulking</Text>
                                        </Box>
                                    </Pressable>
                                </HStack>
                                <Button
                                    p="5"
                                    style={styles.landing_button}
                                    onPress={() => {
                                        if (user && selectedPriority) {
                                            setCurrentPriority(selectedPriority);
                                            // savePriorityChoice(user?.uid, selectedPriority);
                                            setShowModal1(false);
                                        }
                                    }}
                                >
                                    <Text style={styles.login_button}>SUBMIT</Text>
                                </Button>
                            </Box>
                        </KeyboardAvoidingView>
                    </Modal.Body>
                </Modal.Content>
            </Modal>


            {/* <Button style={styles.landing_button} p="5" marginY="5" onPress={() => setShowModal0(true)}>
                <Box justifyContent="center" alignItems="center">
                    <Text
                        style={{
                            color: '#FFFFFF',
                            // fontSize: 20,
                        }}>
                        ADD
                    </Text>
                </Box>

            </Button> */}



        </Box >
    )
}


export default StatisticsScreen;