import React from 'react';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { message } from 'antd';
import './styles.css';

export default class Wheel extends React.Component {
  powerRef;
  constructor(props) {
    super(props);
    this.doc = null;
    this.state = {
      selectedItem: null,
      speed: 15
    };
    this.powerRef = React.createRef();
    this.selectItem = this.selectItem.bind(this);
  }

  async componentDidMount() {
    this.powerRef.current.addEventListener('touchstart', this.eventHandler, { passive: true });
    this.powerRef.current.addEventListener('touchmove', this.eventHandler, { passive: false });
    this.powerRef.current.addEventListener('touchend', this.eventHandler);
    try {
        this.doc = new GoogleSpreadsheet(process.env.REACT_APP_SPREADSHEET_ID);
        await this.doc.useServiceAccountAuth({
            client_email: process.env.REACT_APP_GAPI_EMAIL,
            private_key: process.env.REACT_APP_GAPI_KEY.replace(/\\n/g, '\n')
        });
        await this.doc.loadInfo();
    }
    catch(e) {
        message.error('Something went wrong');
    }
  }

  componentWillUnmount() {
    this.powerRef.current.removeEventListener('touchstart', this.eventHandler);
    this.powerRef.current.removeEventListener('touchmove', this.eventHandler);
    this.powerRef.current.removeEventListener('touchend', this.eventHandler);
  }

  eventHandler = (e) => {
      e.stopPropagation();
  }

  selectItem() {
    if (this.state.selectedItem === null) {
      const selectedItem = Math.floor(Math.random() * this.props.items.length);
      if (this.props.onSelectItem) {
        this.props.onSelectItem(selectedItem);
      }
      this.setState({ selectedItem });
      if (selectedItem) {
        this.appendSpreadsheet({web_client: 'PWA', timestamp: new Date(), spin_result_index: selectedItem});
      }
    } else {
      this.setState({ selectedItem: null });
      setTimeout(this.selectItem, 500);
    }
  }

  appendSpreadsheet = async (row) => {
    try {
      if (!this.doc){
          return;
      }
  
      const sheet = this.doc.sheetsById[0];
      const result = await sheet.addRow(row);
    } catch (e) {
        message.error('Something went wrong, Data was not saved in the database.');
    }
  };


  componentDidUpdate(prevProps) {
      if (prevProps.reset !== this.props.reset && this.props.reset) {
          this.setState({ selectedItem: null});
      }
  }

  _onMouseMove = (e) => {
    this.setState({ x: e.pageX, y: e.pageY });
  }

  onPowerClick = () => {
    const rect = this.powerRef.current.getBoundingClientRect();
    const max = rect.left + rect.width;
    const percantage = ((this.state.x - rect.left) / (max - rect.left)) * 100;
    this.setState({speed: Math.floor(percantage)}, () => {
        if (this.state.speed > 20) {
            this.selectItem();
        }
    });
  }

  render() {
    const { selectedItem } = this.state;
    const { items } = this.props;

    const wheelVars = {
      '--nb-item': items.length,
      '--selected-item': selectedItem,
      '--spinning-duration': `${(150 - this.state.speed)/10}s`,
      '--nb-turn': `${Math.floor((this.state.speed + 50)/10)}`
    };
    const spinning = selectedItem !== null ? 'spinning' : '';

    return (
    <div>
      <div className="wheel-container">
        <div className="pointer-back"></div>
        <div className="pointer"></div>
        <div className={`wheel ${spinning}`} style={wheelVars}>
          {items.map((item, index) => (
            <>
            <div className="wheel-item" key={index} style={{ '--item-nb': index }}>
              <div className="wheel-item-dot"></div>
              {item}
            </div>
            </>
          ))}
        </div>

        <div className='spin-button' onClick={this.selectItem}>Spin</div>
      </div>
      <div ref={this.powerRef} onClick={this.onPowerClick} onMouseMove={this._onMouseMove} style={{'--percentage': `${this.state.speed}%`}} className='speed-controller'>

      </div>

      </div>
    );
  }
}
