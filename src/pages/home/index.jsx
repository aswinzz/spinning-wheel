import React, { Component, ReactNode } from 'react';
import styled from 'styled-components';
import { Skeleton, Popover, Layout } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import Wheel from '../../components/spinner';
import PullToRefresh from '../../components/pullToRefresh';
import { LeftOutlined   } from '@ant-design/icons';

const { Footer } = Layout;
export const StyledContainer = styled.div`
  margin: 20px 0;
  min-width: 428px;
`;

const StyledDiv = styled.div`
  /* position: absolute;
  width: 320px;
  height: 130px;
  left: 20px;
  top: 454px; */

  background: #FFFFFF;
  border-radius: 12px;
  margin: 40px 20px 0 20px;
  padding: 20px;
`;

const StyledHeading = styled.div`
  /* position: absolute;
  width: 215px;
  height: 48px;
  left: 73px;
  top: 474px; */

  /* font-family: Metropolis; */
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  /* or 120% */

  text-align: center;

  color: #000000;
`;

const StyledDesctription = styled.div`
  /* position: absolute;
  width: 267px;
  height: 36px;
  left: 43px;
  top: 528px; */

  /* font-family: Metropolis; */
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 18px;
  /* or 150% */
  margin-top: 6px;
  text-align: center;

  color: rgba(0, 0, 0, 0.58);
`;

const StyledHelp = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  /* identical to box height */


  color: #000000;
  text-align: center;
  margin-top: 15px;
`;

const Container = styled.div`
    display: flex;
`;

const Item = styled.div`
    flex: 1;
`;

export default class Home extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      reset: false,
      places: ['Better luck next time!', '2X Savings', '₹100 Cashback', '₹20 💸', '₹50 💸', '1.5X Savings', '2X Savings', '₹50 💸']
    };
  }

  onRefresh = () => {
    console.log('On Refresh')
    return new Promise((resolve, reject) => {
      this.setState({
        reset: true
      }, resolve);
      setTimeout(() => {
        this.setState({
          reset: false
        })
      }, 1000);
    })
    
  }

  render() {
    return (
      <div style={{backgroundColor: '#F7F6F3'}}>
        <PullToRefresh onRefresh={this.onRefresh}>
        <StyledContainer>
        <Container>
          <Item  style={{
                    fontSize: 22,
                    color: '#000000',
                    margin: '20px 20px 50px 20px'
            }} >
            <LeftOutlined style={{color: '#1B1B1E'}}/> Your rewards
          </Item>
        </Container>
        <Wheel reset={this.state.reset} items={this.state.places} />
        <StyledDiv>
          <StyledHeading>
          Spin the wheel now to get rewarded
          </StyledHeading>
          <StyledDesctription>
          Tap on Spin or rotate the wheel anti-clockwise and release to start spinning 
          </StyledDesctription>
        </StyledDiv>
        <StyledHelp>
          Have a question? <font style={{color:'#F6C95D'}}>Get help</font>
        </StyledHelp>
        </StyledContainer>
        </PullToRefresh>
      </div>
    );
  }
}
