import { Component, h, State, Event, EventEmitter } from '@stencil/core';
import { AV_API_KEY } from '../../global/global';

@Component({
  tag: 'uc-stock-finder',
  styleUrl: './stock-finder.css',
  shadow: true,
})
export class StockFinder {
  stockNameInput: HTMLInputElement;

  @State() searchResults: {symbol: string, name: string}[] = [];

  @Event({bubbles: true, composed: true}) ucSymbolSelected: EventEmitter<string>;

  onFindStocks(event) {
    event.preventDefault();
    const stockName = this.stockNameInput.value;
    fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockName}&apikey=${AV_API_KEY}`)
      .then(res => res.json())
      .then(parsedRes => {
        this.searchResults = parsedRes['bestMatches'].map(elem => {
          return { symbol: elem['1. symbol'], name: elem['2. name'] }
        })
      })
      .catch(err => console.log(err));
  }

  onSelectSymbol(symbol: string) {
    this.ucSymbolSelected.emit(symbol);
  }

  render() {
    return [
      <form onSubmit={this.onFindStocks.bind(this)}>
        <input id="stock-symbol" ref={el => this.stockNameInput = el}/>
        <button type="submit">Find!</button>
      </form>,
      <ul>
        {
          this.searchResults && this.searchResults.map(result => (
            <li onClick={this.onSelectSymbol.bind(this, result.symbol)}>
              <strong>{result.symbol}</strong> - {result.name}
            </li>
          ))
        }
      </ul>
    ];
  }
}
