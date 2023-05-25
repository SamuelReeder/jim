import { Box, Spinner } from 'native-base';

export const PageLoader = () => {
    return (
        <Box flex={1} justifyContent="center" alignItems="center">
            <Spinner size="lg" />
        </Box>
    );
};