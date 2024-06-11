import { Box, Spinner } from '@gluestack-ui/themed-native-base';
import PageContainer from './page_container';

const PageLoader = () => {
    return (
        <PageContainer>
            <Spinner size="lg" />
        </PageContainer>
    );
};

export default PageLoader;