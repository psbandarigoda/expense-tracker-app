import { Button, Col, DatePicker, Input, Row, Select } from 'antd'
import { Option } from 'antd/es/mentions';
import axios from 'axios';
import moment from 'moment/moment';
import React, { Component } from 'react'
import Calendar from './Calendar';
import toastr from 'toastr';

export class TransactionManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            amount: "",
            category: "",
            description: "",
            date: "",
            formattedDate: "",
            recurrentType: "",

            categoriesData: [],
            recurrentTypes: [],
            progressArray: [],
            categoryType: "INCOME",

            transactionsData: [],
            transactionsDataError: "Warning Fetching All Transactions :(",

            usageText: "",
        }
    }

    componentDidMount() {
        this.getAllTransactions();
        this.getAllCategories();
        this.getAllRecurrentTypes();
        this.getAllUsage();
        this.getBudgetProgress();
    }

    //METHOD TO GET ALL CATEGORIES
    getAllCategories() {
        axios.get('http://localhost:8080/category')
            .then((res) => {
                if (res.status === 200) {

                    toastr.success("Successfully Fetched Categories.")
                    this.setState({
                        categoriesData: res.data.filter((data) => {
                            if (data.type === this.state.categoryType) {
                                return data;
                            }
                        }),
                    })

                } else {
                    toastr.warning("Warning on Fetching Categories.")

                    this.setState({
                        categoriesData: [],
                    })

                }
            }).catch((error) => {
                toastr.warning("Error on Fetching Categories.")
                this.setState({
                    categoriesData: [],
                })
            })
    }

    //METHOD TO GET ALL RECURRENT TYPES
    getAllRecurrentTypes() {
        axios.get('http://localhost:8080/recurrent-types')
            .then((res) => {
                if (res.status === 200) {

                    toastr.success("Successfully Fetched Recurrent Types.")
                    this.setState({
                        recurrentTypes: res.data,
                    })

                } else {
                    toastr.warning("Warning on Fetching Recurrent Types.")

                    this.setState({
                        recurrentTypes: [],
                    })

                }
            }).catch((error) => {
                toastr.warning("Error on Fetching Recurrent Types.")
                this.setState({
                    recurrentTypes: [],
                })
            })
    }

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

    createTransaction = () => {
        axios.post('http://localhost:8080/transaction', {
            "title": this.state.title,
            "amount": this.state.amount,
            "category": this.state.category,
            "desc": this.state.description,
            "dateTime": this.state.formattedDate,
            "recurrentType": this.state.recurrentType
        })
            .then((res) => {
                if (res.status === 201) {
                    toastr.success("Successfully Created Transaction.");
                    this.getAllTransactions();
                    this.getBudgetProgress();
                    this.getAllUsage();
                } else {
                    toastr.warning("Warning on Creating Transaction.");
                }
            }).catch((error) => {
                // console.log(error, "ERROR")
                toastr.error("Error on Creating Transaction.");
            })

    }

    resetFields = () => {
        this.setState({
            title: "",
            amount: "",
            category: "",
            description: "",
            date: "",
            formattedDate: "",
            recurrentType: "",

            categoriesData: [],
            recurrentTypes: [],
            categoryType: "INCOME",
        }, () => {
            this.getAllCategories();
            this.getAllRecurrentTypes();
        })
    }

    //METHOD TO CALL A SAMPLE GET ALL TRANSACTIONS
    getAllTransactions() {
        this.setState({
            transactionsData: [],
            transactionsDataError: "LOADING",
        }, () => {
            axios.get('http://localhost:8080/transaction')
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

    getAllUsage() {
        this.setState({
            usageText: "",
        }, () => {
            axios.get('http://localhost:8080/usage')
                .then((res) => {
                    if (res.status === 200) {
                        toastr.success("Successfully Fetched Usage");
                        this.setState({
                            usageText: (res.data).toString(),
                        }, () => {
                            this.resetFields();
                        })
                    } else {
                        toastr.warning("Usage Fetch Warning!");
                        this.setState({
                            usageText: "",
                        })
                    }

                }).catch((error) => {
                    toastr.error("Error Fetching Usage !");
                    this.setState({
                        usageText: "",
                    })
                })
        })

    }

    getBudgetProgress() {
        this.setState({
            progressArray: [],
        }, () => {
            axios.get('http://localhost:8080/progress')
                .then((res) => {
                    if (res.status === 200) {
                        toastr.success("Successfully Fetched Progress");
                        this.setState({
                            progressArray: (res.data),
                        })
                    } else {
                        toastr.warning("Progress Fetch Warning!");
                        this.setState({
                            progressArray: [],
                        })
                    }

                }).catch((error) => {
                    toastr.error("Error Fetching Progress !");
                    this.setState({
                        progressArray: [],
                    })
                })
        })

    }


    render() {
        return (
            <>

                <h1 style={{ textDecoration: "underline" }}>Transaction Management</h1>

                <div>

                    <div style={{ marginTop: "10px", marginBottom: "20px" }}>
                        <Row>
                            <Col className='inputColStyle'>
                                <span style={{ fontSize: "20px", marginBottom: "5px" }}>Transaction Type</span>
                                <Select onChange={(e) => {
                                    this.handleChange(e, "categoryType")
                                }} value={this.state.categoryType} style={{ height: "52px", fontSize: "18px", width: "100%" }}>
                                    <Option value={"INCOME"}>INCOME</Option>
                                    <Option value={"EXPENSE"}>EXPENSE</Option>
                                </Select>
                            </Col>
                        </Row>

                        <Row>
                            <Col className='inputColStyle'>
                                <span style={{ fontSize: "20px", marginBottom: "5px" }}>Title</span>
                                <Input onChange={(e) => {
                                    this.handleChange(e.target.value, "title")
                                }} value={this.state.title} style={{ height: "52px", fontSize: "18px" }} />
                            </Col>
                            <Col className='inputColStyle'>
                                <span style={{ fontSize: "20px", marginBottom: "5px" }}>Amount</span>
                                <Input onChange={(e) => {
                                    this.handleChange(e.target.value, "amount")
                                }} value={this.state.amount} type='number' style={{ height: "52px", fontSize: "18px" }} />
                            </Col>
                        </Row>

                        <Row>
                            <Col className='inputColStyle'>
                                <span style={{ fontSize: "20px", marginBottom: "5px" }}>Category</span>
                                <Select onChange={(e) => {
                                    this.handleChange(e, "category")
                                }} value={this.state.category} style={{ height: "52px", fontSize: "18px", width: "100%" }}>
                                    <Option value='' disabled>Select a Category</Option>

                                    {
                                        this.state.categoriesData.map((data) => {
                                            return (
                                                <Option value={data.name}>{data.name}</Option>
                                            )
                                        })
                                    }

                                </Select>
                            </Col>
                            <Col className='inputColStyle'>
                                <span style={{ fontSize: "20px", marginBottom: "5px" }}>Description</span>
                                <Input onChange={(e) => {
                                    this.handleChange(e.target.value, "description")
                                }} value={this.state.description} type='text' style={{ height: "52px", fontSize: "18px" }} />
                            </Col>
                        </Row>

                        <Row>
                            <Col className='inputColStyle'>
                                <span style={{ fontSize: "20px", marginBottom: "5px" }}>Date</span>
                                <DatePicker onSelect={(e) => {
                                    this.handleChange(e, "date")
                                }} format={"YYYY-MM-DD"} value={this.state.date} style={{ height: "52px", fontSize: "18px", width: "100%" }} />
                            </Col>

                            <Col className='inputColStyle'>
                                <span style={{ fontSize: "20px", marginBottom: "5px" }}>Recurrent Type</span>
                                <Select onChange={(e) => {
                                    this.handleChange(e, "recurrentType")
                                }} value={this.state.recurrentType} style={{ height: "52px", fontSize: "18px", width: "100%" }}>
                                    <Option value='' disabled>Select a Recurrent Type</Option>

                                    {
                                        this.state.recurrentTypes.map((data) => {
                                            return (
                                                <Option value={data}>{data}</Option>
                                            )
                                        })
                                    }

                                </Select>
                            </Col>
                        </Row>

                        <div style={{ display: "flex", justifyContent: "center", marginTop: "30px", marginBottom: "50px" }}>
                            <div>
                                <Button onClick={() => {
                                    this.createTransaction();
                                }} style={{
                                    fontSize: "20px", width: "fit-content", height: "fit-content", backgroundColor: "lightgreen",
                                    color: "black", fontWeight: "bold", border: "1px solid transparent", borderRadius: "10px"
                                }}>CREATE TRANSACTION</Button>
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

                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>

                        <div style={{ width: "50%" }}>
                            <h3 style={{ textDecoration: "underline" }}>Budget Progress</h3>

                            {
                                this.state.progressArray.map((data) => {
                                    // console.log(data, "DATA")
                                    return (
                                        <p>{data}</p>
                                    )
                                })
                            }

                        </div>

                        <div>
                            <h3 style={{ textDecoration: "underline" }}>Budget Usage</h3>

                            <div>
                                {this.state.usageText}
                            </div>

                        </div>

                    </div>


                    <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: "100px" }}>
                        <div style={{ width: "100%", justifyContent: "center" }}>
                            <Calendar transactionsData={this.state.transactionsData} />
                        </div>
                    </div>


                </div>

            </>
        )
    }
}

export default TransactionManagement