import React from 'react';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { message } from 'antd';
import './styles.css';
import { debounce } from '../../utils';

export default class Wheel extends React.Component {
  powerRef;
  wheelRef;
  dragRef;
  constructor(props) {
    super(props);
    this.doc = null;
    this.state = {
      selectedItem: null,
      speed: 15,
      tempSpeed: 15,
      dragDegree: 1,
      lastPosition: 0
    };
    this.powerRef = React.createRef();
    this.wheelRef = React.createRef();
    this.dragRef = React.createRef();
    this.selectItem = this.selectItem.bind(this);
    this.debouncedSelect = debounce(this.selectItem, 300);
  }

  onTouchStart = (e) => {
      if (this.dragRef) {
        this.setState({tempSpeed:1}, () => {
            this.dragRef.current = {
                data: { isDragging: true }
            }
        });
      }
      e.stopPropagation();
  }

  onTouchMove = (e) => {
      if (this.dragRef && this.dragRef.current && this.dragRef.current.data && this.dragRef.current.data.isDragging && this.state.tempSpeed < 100) {
          this.setState({
            tempSpeed: this.state.tempSpeed + 0.4,
            dragDegree: this.state.dragDegree + 1
          });
      }
      if (this.dragRef && this.dragRef.current && this.dragRef.current.data && this.dragRef.current.data.isDragging && (this.state.tempSpeed + 0.4 >= 100 || this.state.tempSpeed >= 100)) {
        this.onEnd(e);
      }
      e.stopPropagation();
  }

  onEnd = (e) => {
    if (this.dragRef && this.dragRef.current && this.dragRef.current.data && this.dragRef.current.data.isDragging) {
        this.debouncedSelect();
    }
    if (this.dragRef && this.dragRef.current && this.dragRef.current.data) {
        this.dragRef.current.data = {
            isDragging: false,
        }
    }
    e.stopPropagation();
  }

  async componentDidMount() {
    this.wheelRef.current.addEventListener('touchstart', this.onTouchStart, { passive: true });
    this.wheelRef.current.addEventListener('mousedown', this.onTouchStart);
    this.wheelRef.current.addEventListener('touchmove', this.onTouchMove, { passive: false });
    this.wheelRef.current.addEventListener('mousemove', this.onTouchMove);
    this.wheelRef.current.addEventListener('touchend', this.onEnd);
    this.wheelRef.current.addEventListener('mouseup', this.onEnd);
    document.body.addEventListener('mouseleave', this.onEnd);
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
    this.wheelRef.current.removeEventListener('touchstart', this.onTouchStart);
    this.wheelRef.current.removeEventListener('mousedown', this.onTouchStart);
    this.wheelRef.current.removeEventListener('touchmove', this.onTouchMove);
    this.wheelRef.current.removeEventListener('mousemove', this.onTouchMove);
    this.wheelRef.current.removeEventListener('touchend', this.onEnd);
    this.wheelRef.current.removeEventListener('mouseup', this.onEnd);
    document.body.removeEventListener('mouseleave', this.onEnd);
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
      const lastPosition = 0;
    //   const lastPosition = Math.floor((this.state.speed + 50)/10) * 360 + (-360 * selectedItem / this.props.items.length) - 90;
      this.setState({ selectedItem, speed: this.state.tempSpeed, dragDegree: 1, lastPosition });
      if (selectedItem) {
        console.log('selectedItem', this.props.items[selectedItem]);
        this.dragRef.current = {
            data: {
                isDragging: false
            }
        }
        this.appendSpreadsheet({web_client: 'PWA', timestamp: new Date(), spin_result_index: selectedItem});
      }
    } else {
      this.setState({ selectedItem: null });
      setTimeout(this.debouncedSelect, 500);
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
    this.setState({speed: Math.floor(percantage), tempSpeed: Math.floor(percantage)}, () => {
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
      '--spinning-duration': `${(150 - Math.floor(this.state.speed))/10}s`,
      '--nb-turn': `${Math.floor((this.state.speed + 50)/10)}`
    };

    const dragVar = {
        '--drag-degree': this.state.dragDegree,
        '--last-position': this.state.lastPosition
    }
    const spinning = selectedItem !== null ? 'spinning' : '';

    return (
    <div>
      <div className="wheel-container">
        <div className="pointer-back"></div>
        <div className="pointer"></div>
        <div ref={this.wheelRef} className={this.dragRef && this.dragRef.current && this.dragRef.current.data.isDragging ? `wheel spinning-drag`: `wheel ${spinning}`} style={this.dragRef && this.dragRef.current && this.dragRef.current.data.isDragging ?  {...wheelVars, ...dragVar} : wheelVars}>
          {items.map((item, index) => (
            <>
            <div className="wheel-item" key={index} style={{ '--item-nb': index }}>
              <div className="wheel-item-dot"></div>
              {item}
            </div>
            </>
          ))}
        </div>

        <div className='spin-button' onClick={this.debouncedSelect}>Spin</div>
      </div>
      <div ref={this.powerRef} onClick={this.onPowerClick} onMouseMove={this._onMouseMove} style={{'--percentage': `${this.state.tempSpeed}%`}} className='speed-controller'>

      </div>

      </div>
    );
  }
}
