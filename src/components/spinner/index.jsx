import React from 'react';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import './styles.css';

export default class Wheel extends React.Component {
  constructor(props) {
    super(props);
    this.doc = null;
    this.state = {
      selectedItem: null,
    };
    this.selectItem = this.selectItem.bind(this);
  }

  async componentDidMount() {
    this.doc = new GoogleSpreadsheet(process.env.REACT_APP_SPREADSHEET_ID);
    await this.doc.useServiceAccountAuth({
        client_email: process.env.REACT_APP_GAPI_EMAIL,
        private_key: process.env.REACT_APP_GAPI_KEY.replace(/\\n/g, '\n')
    });
    await this.doc.loadInfo();
    console.log(this.doc.title);
  }

  selectItem() {
    if (this.state.selectedItem === null) {
      const selectedItem = Math.floor(Math.random() * this.props.items.length);
      if (this.props.onSelectItem) {
        this.props.onSelectItem(selectedItem);
      }
      this.setState({ selectedItem });
      if (selectedItem) {
        this.appendSpreadsheet({web_client: 'PWA', timestamp: new Date(), spin_result_index: selectedItem}).then(() => {
            console.log('Data Saved');
        }, () => {
            console.log('Something went wrong');
        })
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
      console.error('Error: ', e);
    }
  };


  componentDidUpdate(prevProps) {
      if (prevProps.reset !== this.props.reset && this.props.reset) {
          this.setState({ selectedItem: null});
      }
  }

  render() {
    const { selectedItem } = this.state;
    const { items } = this.props;

    const wheelVars = {
      '--nb-item': items.length,
      '--selected-item': selectedItem,
    };
    const spinning = selectedItem !== null ? 'spinning' : '';

    return (
      <div className="wheel-container">
        <div className="pointer-back"></div>
        <div className="pointer"></div>
        <div className={`wheel ${spinning}`} style={wheelVars}>
          {items.map((item, index) => (
            <div className="wheel-item" key={index} style={{ '--item-nb': index }}>
              {item}
            </div>
          ))}
        </div>

        <div className='spin-button' onClick={this.selectItem}>Spin</div>
      </div>
    );
  }
}
