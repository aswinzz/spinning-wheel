import styled from 'styled-components';
import { Skeleton } from 'antd';

const LoadingContainer = styled.div`
    min-width: 358px;
    max-width: 600px;
    margin: 20px auto;
`;

export const AppShell = () => {
    return (
        <LoadingContainer>
              <Skeleton active />
              <Skeleton active />
              <Skeleton active />
              <Skeleton active />
        </LoadingContainer>  
    )
}