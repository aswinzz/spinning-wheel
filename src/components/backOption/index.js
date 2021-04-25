import styled from 'styled-components';
import { LeftOutlined   } from '@ant-design/icons';

const Container = styled.div`
    display: flex;
`;

const Item = styled.div`
    flex: 1;
`;

export const Back = ({text}) => {
    return (
        <Container>
          <Item  style={{
                    fontSize: 22,
                    color: '#000000',
                    margin: '20px 20px 50px 20px'
            }} >
            <LeftOutlined style={{color: '#1B1B1E'}}/> {text}
          </Item>
        </Container> 
    )
}