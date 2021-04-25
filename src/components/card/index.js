import styled from 'styled-components';

const StyledCard = styled.div`
  background: #FFFFFF;
  border-radius: 12px;
  margin: 40px 20px 0 20px;
  padding: 20px;
`;

const StyledHeading = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  text-align: center;

  color: #000000;
`;

const StyledDesctription = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 18px;
  margin-top: 6px;
  text-align: center;
  color: rgba(0, 0, 0, 0.58);
`;

export const Card = ({heading, subheading}) => {
    return (
        <StyledCard>
          <StyledHeading>
          {heading}
          </StyledHeading>
          <StyledDesctription>
          {subheading}
          </StyledDesctription>
        </StyledCard>
    )
}