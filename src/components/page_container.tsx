import { Center } from "native-base";
import { ReactNode } from "react";


const PageContainer = ({children}: {children: ReactNode}) => {
    return (
        <Center flex={1} p="6" bg="white">
            {children}
        </Center>
    );
};

export default PageContainer;