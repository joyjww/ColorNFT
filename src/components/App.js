import React, { Component } from 'react';//load react component
import Web3 from 'web3';//load web3
import './App.css';
import Color from '../abis/Color.json';//load Color abis(blockchaindata)

class App extends Component {

//load the component every time it successfully loads up to the dom(the mark-up of the webiste)
//if interested - componentWillMount, can search for "react lifecycle methods" and learn about it.
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

//load the metamask
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser deteced. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    //load account, fetch the account address and store it in our application
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})

//get the network ID to fetch the correct contract address
    const networkId= await web3.eth.net.getId()
    //through the network ID, get the right data of the contract deployed on blockchain
    const networkData = Color.networks[networkId]
    if (networkData){
      const abi = Color.abi //get the abi of the jsonfile
      const address = networkData.address //use the network ID to get the contract address
      const contract = new web3.eth.Contract(abi,address)
      this.setState({ contract })
      //get the information of the totalsupply
      const totalSupply = await contract.methods.totalSupply().call()
      this.setState({ totalSupply })
      //load Colors
      for (var i=1; i<= totalSupply; i++){
        const color = await contract.methods.colors(i-1).call()
        this.setState({
          colors: [...this.state.colors, color]//add new color the old colors array
        })
      }
    } else {
      window.alert('Smart contract not deployed to detected network')
    }
  }

//create the mint function on react.js to mint new color and put it on the blockchain
//which means creating new transactions on the blockchain
mint = (color) => {
  //send new color to the blockchain
  this.state.contract.methods.awardItem(color).send({from: this.state.account})
  .once('receipt', (receipt) => {
    this.setState({
      colors: [...this.state.colors, color]
    })
  })
}

  constructor(props){
    super(props)
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      colors: [],
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
          <view>
            {/*Main name of the webapp (on the top right)*/}
          </view>
            Color Tokens
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <view>
              {/*where the account address shows up(on the top left of the webapp)*/}
            </view>
              <small className="text-white"><span id="account">{this.state.account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Issue Token</h1>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const color = this.color.value
                  this.mint(color)
                }}>
                <view>
                  {/*this.mint()creates new mint function that calls the smart contract to mint the color
                    ref = {input, this color =.. }keep track of the color we input each time
                    */}
                </view>
                <input
                type = 'text'
                className = 'form-control mb-1'
                placeholder = 'e.g. #FFFFFF'
                ref = {(input) => {this.color = input}}
                />
                <input
                type = 'submit'
                className = 'btn btn-block btn-primary'
                value = 'MINT'
                />
                </form>
              </div>
            </main>
          </div>
          <hr/>
          <div className="row text-center">
          {this.state.colors.map((color,key)=>{
            return(
              <div key={key} className="col-md-3 mb-3">
              <view>
                {/*ClassName is the format of the listed color numbers*/}
              </view>
                <div className="token"
                style ={{ backgroundColor: color}}>
                <view>
                  {/*the style of the color token we set in the App.css*/}
                </view>
                </div>
                <div>{color}</div>
              </div>
              )
          })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
