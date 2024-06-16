import { Box, Spinner } from 'native-base';
import PageContainer from './page_container';
import React from 'react';

const PageLoader = () => {
    return (
        <PageContainer>
            <Spinner size="lg" />
        </PageContainer>
    );
};

export default PageLoader;