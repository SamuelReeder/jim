import { Box, Spinner } from 'native-base';

const PageLoader = () => {
    return (
        <Box flex={1} justifyContent="center" alignItems="center">
            <Spinner size="lg" />
        </Box>
    );
};

export default PageLoader;