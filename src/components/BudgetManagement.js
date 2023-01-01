import { Button, Col, DatePicker, Input, Row, Select } from 'antd'
import { Option } from 'antd/es/mentions';
import axios from 'axios';
import moment from 'moment/moment';
import React, { Component } from 'react'
import Calendar from './Calendar';
import toastr from 'toastr';

export class BudgetManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            alertAmount: "",
            totalBudgetAmount: "",

            // categoriesData: [],
            // recurrentTypes: [],

            // transactionsData: [],
            // transactionsDataError: "Warning Fetching All Transactions :(",

            transactionsData: [],
            transactionsDataError: "Warning Fetching All Transactions :(",
        }
    }

    componentDidMount() {
        this.getAllBudget();
        // this.getAllCategories();
        // this.getAllRecurrentTypes();
    }

    //METHOD TO GET ALL CATEGORIES
    // getAllCategories() {
    //     axios.get('http://localhost:8080/category')
    //         .then((res) => {
    //             if (res.status === 200) {

    //                 toastr.success("Successfully Fetched Categories.")
    //                 this.setState({
    //                     categoriesData: res.data.filter((data) => {
    //                         if (data.type === this.state.categoryType) {
    //                             return data;
    //                         }
    //                     }),
    //                 })

    //             } else {
    //                 toastr.warning("Warning on Fetching Categories.")

    //                 this.setState({
    //                     categoriesData: [],
    //                 })

    //             }
    //         }).catch((error) => {
    //             toastr.warning("Error on Fetching Categories.")
    //             this.setState({
    //                 categoriesData: [],
    //             })
    //         })
    // }

    //METHOD TO GET ALL RECURRENT TYPES
    // getAllRecurrentTypes() {
    //     axios.get('http://localhost:8080/recurrent-types')
    //         .then((res) => {
    //             if (res.status === 200) {

    //                 toastr.success("Successfully Fetched Recurrent Types.")
    //                 this.setState({
    //                     recurrentTypes: res.data,
    //                 })

    //             } else {
    //                 toastr.warning("Warning on Fetching Recurrent Types.")

    //                 this.setState({
    //                     recurrentTypes: [],
    //                 })

    //             }
    //         }).catch((error) => {
    //             toastr.warning("Error on Fetching Recurrent Types.")
    //             this.setState({
    //                 recurrentTypes: [],
    //             })
    //         })
    // }

    handleChange = (value, name) => {
        this.setState({
            [name]: value
        }, () => {
            if (name === "categoryType")
                this.getAllCategories();

            if (name === "date")
                // console.log((this.state.date).toDate(), "DATE")
                this.setState({
                    formattedDate: moment((this.state.date).toDate()).format("YYYY-MM-DDTHH:mm:ss.SSSSSSS")
                })
        })
    }

    createBudget = () => {
        axios.post('http://localhost:8080/budget', {
            "name": this.state.name,
            "alertAmount": this.state.alertAmount,
            "totalBudgetAmount": this.state.totalBudgetAmount
        })
            .then((res) => {
                if (res.status === 200) {
                    toastr.success("Successfully Created Transaction.");
                    this.getAllTransactions();
                } else {
                    toastr.warning("Warning on Creating Transaction.");
                }
            }).catch((error) => {
                console.log(error, "ERROR")
                toastr.error("Error on Creating Transaction.");
            })

    }

    resetFields = () => {
        this.setState({
            name: "",
            alertAmount: "",
            totalBudgetAmount: "",

            categoriesData: [],
            recurrentTypes: [],
        }, () => {
            this.getAllCategories();
            this.getAllRecurrentTypes();
        })
    }

    //METHOD TO CALL A SAMPLE GET ALL TRANSACTIONS
    getAllBudget() {
        this.setState({
            transactionsData: [],
            transactionsDataError: "LOADING",
        }, () => {
            axios.get('http://localhost:8080/budget')
                .then((res) => {
                    if (res.status === 200) {
                        toastr.success("Successfully Fetched All Transactions");
                        this.setState({
                            transactionsData: res.data,
                            transactionsDataError: "",
                        }, () => {
                            this.resetFields();
                        })
                    } else {
                        toastr.warning("Transactions Fetch Warning!");
                        this.setState({
                            transactionsData: [],
                            transactionsDataError: "Warning Fetching All Transactions :(",
                        })
                    }

                }).catch((error) => {
                    toastr.error("Error Fetching All Transactions !");
                    this.setState({
                        transactionsData: [],
                        transactionsDataError: "Error Fetching All Transactions :(",
                    })
                })
        })

    }


    render() {
        return (
            <>

                <h1 style={{ textDecoration: "underline" }}>Budget Management</h1>

                <div>

                    <div style={{ marginTop: "10px", marginBottom: "20px" }}>
                        <Row>
                            <Col className='inputColStyle'>
                                <span style={{ fontSize: "20px", marginBottom: "5px" }}>Name</span>
                                <Input onChange={(e) => {
                                    this.handleChange(e.target.value, "name")
                                }} value={this.state.name} style={{ height: "52px", fontSize: "18px" }} />
                            </Col>
                        </Row>

                        <Row>
                            <Col className='inputColStyle'>
                                <span style={{ fontSize: "20px", marginBottom: "5px" }}>Alert Amount</span>
                                <Input onChange={(e) => {
                                    this.handleChange(e.target.value, "alertAmount")
                                }} value={this.state.alertAmount} type='number' style={{ height: "52px", fontSize: "18px" }} />
                            </Col>
                            <Col className='inputColStyle'>
                                <span style={{ fontSize: "20px", marginBottom: "5px" }}>Total Budget Amount</span>
                                <Input onChange={(e) => {
                                    this.handleChange(e.target.value, "totalBudgetAmount")
                                }} value={this.state.totalBudgetAmount} type='number' style={{ height: "52px", fontSize: "18px" }} />
                            </Col>
                        </Row>

                        <div style={{ display: "flex", justifyContent: "center", marginTop: "30px", marginBottom: "50px" }}>
                            <div>
                                <Button onClick={() => {
                                    this.createBudget();
                                }} style={{
                                    fontSize: "20px", width: "fit-content", height: "fit-content", backgroundColor: "lightgreen",
                                    color: "black", fontWeight: "bold", border: "1px solid transparent", borderRadius: "10px"
                                }}>CREATE BUDGET</Button>
                            </div>

                            <div>
                                <Button onClick={() => {
                                    this.resetFields();
                                }} style={{
                                    fontSize: "20px", width: "fit-content", height: "fit-content", backgroundColor: "lightgrey",
                                    color: "black", fontWeight: "bold", border: "1px solid transparent", borderRadius: "10px",
                                    marginLeft: "20px"
                                }}>RESET FIELDS</Button>
                            </div>

                        </div>
                    </div>

                    <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: "100px" }}>
                        <div style={{ width:"100%", justifyContent: "center" }}>
                            <Calendar transactionsData={this.state.transactionsData} />
                        </div>
                    </div>


                </div>

            </>
        )
    }
}

export default BudgetManagement