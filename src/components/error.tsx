import { Box, Button, Text } from "native-base";

// TODO: make sure this is correct type
const ErrorMessage = ({handler}: {handler}) => {
    return (
        <Box variant="pageContainer">
            <Text>Error</Text>
            <Button onPress={() => handler()}>Go Back</Button>
        </Box>
    );
};

export default ErrorMessage;