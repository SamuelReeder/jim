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

const screenWidth = Dimensions.get("window").width;

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
        <Box variant="pageContainer">
            <View>
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
            </View>
        </Box>
    );
}

export default StatScreen;


