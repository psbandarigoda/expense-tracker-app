import { Button } from 'antd';
import axios from 'axios';
import React, { Component } from 'react'
import toastr from 'toastr';
import 'toastr/build/toastr.min.css'
import TransactionManagement from './TransactionManagement';
import CategoryManagement from './CategoryManagement';
import BudgetManagement from './BudgetManagement';
import CurrencyManagement from './CurrencyManagement';


export class MainPage extends Component {

  state = {
    transactionsData: [],
    transactionsDataError: "",
    categoriesDataError:"",

    renderScreen: "TRANSACTION",
  }

  componentDidMount() {
    // this.getAllTransactions();
  }

  render() {
    return (
      <div className='mainbg'>
        <h1 style={{ fontSize: "50px", textDecoration: "underline" }}>EXPENSE TRACKER</h1>

        <div style={{}}>
          <div className='topButtonsContainer' style={{ justifyContent: "space-evenly" }}>

            <Button onClick={() => this.setState({
              renderScreen: "TRANSACTION"
            })} style={{
              fontSize: "20px", width: "fit-content", height: "fit-content", backgroundColor: "navajowhite",
              color: "black", fontWeight: "bold", border: "1px solid transparent", borderRadius: "20px"
            }}>Transactions Management</Button>

            <Button onClick={() => this.setState({
              renderScreen: "CATEGORY"
            })} style={{
              fontSize: "20px", width: "fit-content", height: "fit-content", backgroundColor: "gold",
              color: "black", fontWeight: "bold", border: "1px solid transparent", borderRadius: "20px"
            }}>Categories Management</Button>

            <Button onClick={() => this.setState({
              renderScreen: "BUDGET"
            })} style={{
              fontSize: "20px", width: "fit-content", height: "fit-content", backgroundColor: "salmon",
              color: "black", fontWeight: "bold", border: "1px solid transparent", borderRadius: "20px"
            }}>Budget Management</Button>

            <Button onClick={() => this.setState({
              renderScreen: "CURRENCY"
            })} style={{
              fontSize: "20px", width: "fit-content", height: "fit-content", backgroundColor: "forestgreen",
              color: "black", fontWeight: "bold", border: "1px solid transparent", borderRadius: "20px"
            }}>Currency Management</Button>

          </div>

          {
            this.state.renderScreen === "TRANSACTION" && (
              <TransactionManagement getAllTransactions={this.getAllTransactions} />
            )
          }
          {
            this.state.renderScreen === "CATEGORY" && (
              <CategoryManagement getAllTransactions={this.getAllTransactions} />
            )
          }
          {
            this.state.renderScreen === "BUDGET" && (
              <BudgetManagement getAllTransactions={this.getAllTransactions} />
            )
          }
          {
            this.state.renderScreen === "CURRENCY" && (
              <CurrencyManagement getAllTransactions={this.getAllTransactions} />
            )
          }
        </div>
      </div>
    )
  }
}
export default MainPage;
