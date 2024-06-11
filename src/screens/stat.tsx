import { Center, Text, Button, useColorMode, HStack, Switch, Box } from 'native-base';
import { Dimensions, View } from 'react-native';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";
import styles from '../styles/styles';
import { useState, useEffect } from 'react';
import * as Progress from 'react-native-progress';
import { LineGraph, GraphPoint } from 'react-native-graph'

export function generateRandomGraphData(length: number): GraphPoint[] {
    return Array<number>(length)
      .fill(0)
      .map((_, index) => ({
        date: new Date(
          new Date(2000, 0, 1).getTime() + 1000 * 60 * 60 * 24 * index
        ),
        value: Math.random(),
      }))
  }

const screenWidth = Dimensions.get("window").width;

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
        <Progress.Bar progress={0.5} animated={true} animationType="decay" height={5} borderWidth={0} borderRadius={50} borderColor="#3d5875" color="#00e0ff" />
        // {/* </Box> */}
    );
};

const StatScreen = () => {

    const chartConfig = {
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16
        },
        withInnerLines: false,
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            // stroke: "#ffa726"
        },
        useShadowColorFromDataset: false // optional
    };
    return (
        <Box variant="createPostContainer" justifyContent="space-between" px="4" py="2" alignItems="flex-start">
            <Box style={{ borderRadius: 15, backgroundColor: "black", padding: 20, margin: 5 }}>
                <Text color="gray.500" fontSize="sm">
                    Max Weight
                </Text>
                <Text variant="bold" fontSize='3xl'>
                    225LBs
                </Text>
                <ProgressBar args={0.7} />
            </Box>
            <LineGraph
                points={generateRandomGraphData(100)}
                animated={false}
                color="#4484B2"
            />

            {/* <View>
                <Text>Bezier Line Chart</Text>
                <LineChart
                    data={{
                        labels: ["January", "February", "March", "April", "May", "June"],
                        datasets: [
                            {
                                data: [
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100,
                                    Math.random() * 100
                                ]
                            }
                        ]
                    }}
                    width={screenWidth - 10}
                    height={220}
                    verticalLabelRotation={30}
                    chartConfig={chartConfig}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                    onDataPointClick={({ value, dataset, getColor }) =>
                        alert(`The value is ${value}`)
                    }
                />
            </View> */}
            <Button style={styles.landing_button} p="5" marginY="5">
                <Box justifyContent="center" alignItems="center">
                    <Text
                        style={{
                            color: '#FFFFFF',
                            // fontSize: 20,
                        }}>
                        SUBMIT
                    </Text>
                    {/* npm i react-native-progress */}
                </Box>

            </Button>
        </Box>
    );
}

export default StatScreen;


