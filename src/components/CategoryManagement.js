import { Button, Col, Input, Row, Select } from 'antd'
import { Option } from 'antd/es/mentions';
import axios from 'axios';
import moment from 'moment/moment';
import React, { Component } from 'react'
import toastr from 'toastr';

const CategoryTable = props => (
    <tr>
        <td>{props.categoryTable.type}</td>
        <td>{props.categoryTable.name}</td>
        {
            props.categoryTable.type === "EXPENSE" ? (
                <td>{props.categoryTable.budget?.name + " - $" + props.categoryTable.budget?.totalBudgetAmount}</td>
            ) : <td> - </td>
        }
        {/* <td>{props.categoryTable.iconUrl}</td> */}
    </tr>
)

export class CategoryManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trsId: "",
            type: "",
            name: "",
            iconUrl: "",

            categoriesData: [],
            categoriesDataError: "Warning Fetching All Categories Data :(",
            budgetData: [],
            budgetDataError: "",

            categoryType: "INCOME",
            budget: "",

        }
    }

    componentDidMount() {
        this.getAllCategories();
        this.getAllBudget();
    }

    //METHOD TO CALL A SAMPLE GET ALL Budget
    getAllBudget() {
        this.setState({
            budgetData: [],
            budgetDataError: "LOADING",
        }, () => {
            axios.get('http://localhost:8080/budget')
                .then((res) => {
                    if (res.status === 200) {
                        toastr.success("Successfully Fetched All Transactions");
                        this.setState({
                            budgetData: res.data,
                            budgetDataError: "",
                        }, () => {
                            this.resetFields();
                        })
                    } else {
                        toastr.warning("Transactions Fetch Warning!");
                        this.setState({
                            budgetData: [],
                            budgetDataError: "Warning Fetching All Transactions :(",
                        })
                    }

                }).catch((error) => {
                    toastr.error("Error Fetching All Transactions !");
                    this.setState({
                        budgetData: [],
                        budgetDataError: "Error Fetching All Transactions :(",
                    })
                })
        })

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
                        categoriesDataError: "Warning Fetching All Categories Data :(",
                    })

                }
            }).catch((error) => {
                toastr.warning("Error on Fetching Categories.")
                this.setState({
                    categoriesData: [],
                    categoriesDataError: "Error Fetching All Categories Data :(",
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
                this.setState({
                    formattedDate: moment((this.state.date).toDate()).format("YYYY-MM-DDTHH:mm:ss.SSSSSSS")
                })
        })
    }

    createCategory = () => {
        axios.post('http://localhost:8080/category',
            {
                "type": this.state.categoryType,
                "name": this.state.name,
                "iconUrl": this.state.iconUrl,
                "budget": this.state.budget
            })
            .then((res) => {
                if (res.status === 201) {
                    toastr.success("Successfully Created Category.");
                    // this.getAllCategories();
                    this.resetFields();
                } else {
                    toastr.warning("Warning on Creating Category.");
                }
            }).catch((error) => {
                // console.log(error, "ERROR")
                toastr.error("Error on Creating Category.");
            })

    }

    resetFields = () => {
        this.setState({
            name: "",
            iconUrl: "",

            categoriesData: [],
            categoryType: "INCOME",
        }, () => {
            this.getAllCategories();
        })
    }

    CategoryList = () => {
        return this.state.categoriesData.map((category, i) => {
            return <CategoryTable categoryTable={category} key={i} />
        })
    }

    render() {
        return (
            <>

                <h1 style={{ textDecoration: "underline" }}>Category Management</h1>

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
                                <span style={{ fontSize: "20px", marginBottom: "5px" }}>Name</span>
                                <Input onChange={(e) => {
                                    this.handleChange(e.target.value, "name")
                                }} value={this.state.name} style={{ height: "52px", fontSize: "18px" }} />
                            </Col>
                            <Col className='inputColStyle'>
                                <span style={{ fontSize: "20px", marginBottom: "5px" }}>Icon Url</span>
                                <Input onChange={(e) => {
                                    this.handleChange(e.target.value, "iconUrl")
                                }} value={this.state.iconUrl} style={{ height: "52px", fontSize: "18px" }} />
                            </Col>
                        </Row>

                        {
                            this.state.categoryType === "EXPENSE" && (
                                <Row>
                                    <Col className='inputColStyle'>
                                        <span style={{ fontSize: "20px", marginBottom: "5px" }}>Select Budget</span>
                                        <Select onChange={(e) => {
                                            this.handleChange(e, "budget")
                                        }} value={this.state.budget} style={{ height: "52px", fontSize: "18px", width: "100%" }}>
                                            <Option value='' disabled>Select a Budget</Option>

                                            {
                                                this.state.budgetData.map((data) => {
                                                    return (
                                                        <Option value={data.name}>{data.name} ($ {data.totalBudgetAmount})</Option>
                                                    )
                                                })
                                            }

                                        </Select>
                                    </Col>
                                </Row>
                            )
                        }

                        <div style={{ display: "flex", justifyContent: "center", marginTop: "30px", marginBottom: "50px" }}>
                            <div>
                                <Button onClick={() => {
                                    this.createCategory();
                                }} style={{
                                    fontSize: "20px", width: "fit-content", height: "fit-content", backgroundColor: "lightgreen",
                                    color: "black", fontWeight: "bold", border: "1px solid transparent", borderRadius: "10px"
                                }}>CREATE CATEGORY</Button>
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

                    <h2 style={{ textDecoration: "underline" }}>{this.state.categoryType} CATEGORY LIST</h2>

                    <div style={{ width: "100%", display: "flex", marginBottom: "100px" }}>
                        <table border={"1px solid green"} style={{ width: "100%" }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: "left" }}>Type</th>
                                    <th style={{ textAlign: "left" }}>Name</th>
                                    <th style={{ textAlign: "left" }}>Budget</th>
                                    {/* <th style={{ textAlign: "left" }}>ICON URL</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {this.CategoryList()}
                            </tbody>
                        </table>
                    </div>
                </div>

            </>
        )
    }
}

export default CategoryManagement