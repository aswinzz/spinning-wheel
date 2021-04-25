import React, { Component, ReactNode } from 'react';
import styled from 'styled-components';
import Wheel from '../../components/spinner';
import PullToRefresh from '../../components/pullToRefresh';
import { AppShell } from '../../components/appshell';
import { Back } from '../../components/backOption';
import { Card } from '../../components/card';
import { Container } from '../../components/container';
import { message } from 'antd';

const StyledHelp = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  color: #000000;
  text-align: center;
  margin-top: 15px;
`;

const MainContainer = styled.div`
    background-color: rgb(247, 246, 243);
    max-width: 410px;
    margin: 0 auto;
`;

export default class Home extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      reset: false,
      loading: true,
      items: []
      // items: ['Better luck!', '2X Savings', '₹100 Cashback', '₹20 💸', '₹50 💸', '1.5X Savings', '2X Savings', '₹50 💸']
    };
  }

  async componentDidMount() {
    await this.fetchData();
  }

  fetchData = async () => {
    try {
      const res = await fetch('https://60852621d14a87001757772d.mockapi.io/api/v1/get-spinner-data');
      const response  = await res.json();
      this.setState({
        items: response,
        loading: false
      })
    }
    catch(e) {
      message.error('Something went wrong');
      this.setState({loading: false});
    }
  }

  onRefresh = () => {
    console.log('On Refresh')
    return new Promise((resolve, reject) => {
      this.setState({
        reset: true,
        loading: true
      }, resolve);
      setTimeout(() => {
        this.setState({
          reset: false,
          loading: false
        })
      }, 1000);
    })
    
  }

  render() {
    return (
      <MainContainer>
        <PullToRefresh onRefresh={this.onRefresh}>
        {this.state.loading ?
          <AppShell/>    
        :
        <Container>
        <Back text='Your rewards'/>
        {this.state.items && this.state.items.length ? 
        <>
        <Wheel reset={this.state.reset} items={this.state.items} />
        <Card heading='Spin the wheel now to get rewarded' subheading='Tap on Spin or rotate the wheel anti-clockwise and release to start spinning '/>
        </>
         : 
        <StyledHelp>
          Spinner wheel was not loaded, please try refreshing the page
        </StyledHelp>
        }
        
        <StyledHelp>
          Have a question? <font style={{color:'#F6C95D'}}>Get help</font>
        </StyledHelp>
        </Container>}
        </PullToRefresh>
      </MainContainer>
    );
  }
}
