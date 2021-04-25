import styled from 'styled-components';
import { LeftOutlined   } from '@ant-design/icons';

export const StyledContainer = styled.div`
  margin: 20px 0;
  min-width: 358px;
`;

export const Container = ({children}) => {
    return (
        <StyledContainer>
            {children}
        </StyledContainer> 
    )
}