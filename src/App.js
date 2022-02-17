import logo from './logo.svg';
import React, { Component } from 'react'
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {


state = {
  manager: '',
  player: [],
  balance: '',
  value: '',
  message: '',
  winner: ''
};

async componentDidMount(){

  

  const manager = await lottery.methods.manager().call();
  const player = await lottery.methods.checkEntries().call();
  const balance = await web3.eth.getBalance(lottery.options.address);


  this.setState({ manager, player, balance});
}

onSubmit = async (event) =>{

  event.preventDefault();

  await window.ethereum.enable();

  const accounts = await web3.eth.getAccounts();

  this.setState({ message: 'Waiting on transaction success...' });

  await lottery.methods.enter().send({
    from : accounts[0],
    value: web3.utils.toWei(this.state.value, 'ether')
  });
  

  this.setState ({ message: 'You have been entered!'} );
}

onClick = async () =>{

  await window.ethereum.enable();

  const accounts = await web3.eth.getAccounts();

  this.setState({ message: 'Waiting on transaction success...' })

  await lottery.methods.winner().send({
    from : accounts[0]
  });

  const winner = await lottery.methods.lastWinner().call();

  this.setState({ message: 'The winner has been picked! The winner is : ', winner});

}


  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager} <br/>
          There are curently {this.state.player.length} people entered, <br/>
          competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p>
        
        <hr />

        <form onSubmit={this.onSubmit}>

          <h4>Want to try your luck?</h4>

          <div>

            <label>Amount of ether to enter</label>

            <input
            value = {this.state.value}
            onChange={event => this.setState({ value: event.target.value })}
            />

          </div>
          <button>Enter</button>
        </form>

        <hr/>

        <h4>Ready to pick a winner</h4>
            <button onClick={this.onClick}>Pick a winner</button>
        <hr/>

        <h1>{this.state.message}{this.state.winner}</h1>
      </div>
    );
  }
}
export default App;
