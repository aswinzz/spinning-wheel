import React from 'react';
import styled from 'styled-components';
import { ArrowLeftOutlined   } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Container = styled.div`
    display: flex;
`;

const Item = styled.div`
    flex: 1;
`;

export default (props) => {
  return (
    <Container style={props.goBack ? {marginTop: 20}: {}}>
       <Item  style={{
                fontSize: 22,
                margin: '0 0 20px 0'
        }} >
        <Link to='/'>
        <ArrowLeftOutlined/> {props.goBack ? 'Go ': ''}Back
        </Link>
       </Item>
    </Container>
  );
};