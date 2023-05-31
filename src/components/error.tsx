import { Box, Button, Text } from "native-base";

const ErrorMessage = ({handler}) => {
    return (
        <Box variant="pageContainer">
            <Text>Error</Text>
            <Button onPress={() => handler()}>Go Back</Button>
        </Box>
    );
};

export default ErrorMessage;