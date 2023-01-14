import React, { Component } from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import moment from 'moment/moment';
import { Button, Col, Input, Modal, Row, Select } from 'antd';
import toastr from 'toastr';
import axios from 'axios';
import { Option } from 'antd/es/mentions';


export class Calendar extends Component {
    constructor(props) {
        super(props);
        this.state = {

            transactionsInCalendarFormat: [],

            selectedTitle: "",
            selectedPublicID: "",
            viewModalOpen: false,
            title: "",
            amount: "",
            description: "",
            date: "",
            formattedDate: "",
            recurrentTypes: [],
            transactionsData: [],
            transactionsDataError: "LOADING",
            selectedTransactionData: {
                title: "",
                amount: "",
                description: "",
                date: "",
                recurrentType: ""
            }

        }
    }
    componentWillReceiveProps = (nextprops) => {

        if (nextprops.transactionsData) {

            let transactionsInCalendarFormat = nextprops.transactionsData.map((data) => {
                let mockObj = {
                    id: data.trnId,
                    title: data.title + ` $${data.amount}`,
                    start: (data.date).split("T")[0],
                    // end: data.date,
                    backgroundColor: data.category.type === "INCOME" ? "green" : "red",
                }
                return mockObj;
            })

            this.setState({
                transactionsInCalendarFormat
            }, () => {
                // console.log(transactionsInCalendarFormat, "TRANAS")
            })

        }

    }

    eventClick = (e) => {

        // console.log(e, "EVENT CLICK")
        let title = e.event._def.title;
        let id = e.event._def.publicId;

        let transactionData = [];
        // console.log(this.state.transactionsData, "TRANS DATA")
        transactionData = this.state.transactionsData.filter((data) => {
            if (data.trnId === id) {
                return transactionData;
            }
        });

        // console.log(transactionData, "EVENT CLICK TRANSACTION DATA")

        if (transactionData.length === 1) {

            let date = transactionData[0].date;
            let formattedDate = date.split("T")[0];

            this.setState({
                selectedTitle: title,
                selectedPublicID: id,
                viewModalOpen: true,
                date,
                formattedDate,
                selectedTransactionData: transactionData[0]
            })

        }
    }

    reset = () => {
        this.setState({
            selectedTitle: "",
            selectedPublicID: "",
            viewModalOpen: false,
            selectedTransactionData: {
                title: "",
                amount: "",
                description: "",
                date: "",
                recurrentType: ""
            }
        })
    }

    deleteTransaction() {
        this.setState({
        }, () => {
            axios.delete('http://localhost:8080/delete/transaction/' + this.state.selectedPublicID)
                .then((res) => {
                    if (res.status === 200) {
                        toastr.success("Successfully Deleted Transaction");
                        window.location.reload();
                    } else {
                        toastr.warning("Delete Warning!");
                    }

                }).catch((error) => {
                    toastr.error("Error Deleting Transaction !");
                })
        })

    }

    handleChange = (value, name) => {
        let selTransData = this.state.selectedTransactionData;
        selTransData[name] = value;
        this.setState({
            selectedTransactionData: selTransData
        }, () => {
            if (name === "date")
                this.setState({
                    formattedDate: moment((this.state.date).toDate()).format("YYYY-MM-DDTHH:mm:ss.SSSSSSS")
                }, () => {
                })
        })
    }

    componentDidMount = () => {
        this.getAllRecurrentTypes();
        this.getAllTransactions();
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

    onUpdate = () => {

        let payload = {
            id: this.state.selectedPublicID,
            title: this.state.selectedTransactionData.title,
            amount: Number(this.state.selectedTransactionData.amount),
            desc: this.state.selectedTransactionData.description,
            dateTime: this.state.date,
            recurrentType: this.state.selectedTransactionData.recurrentType,
        }
        // console.log(payload, "ON UPDATE PAYLOAD")
        this.onEditTransaction(payload);
    }

    onEditTransaction(data) {
        axios.put('http://localhost:8080/edit/transaction', data)
            .then((res) => {
                if (res.status === 200) {
                    toastr.success("Successfully Updated Transaction.");
                    window.location.reload();
                } else {
                    toastr.warning("Warning on Updating Transaction.");
                }
            }).catch((error) => {
                toastr.error("Error on Updating Transaction.");
            })
    }
    render() {
        return (
            <>
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    height={600}
                    events={this.state.transactionsInCalendarFormat}
                    eventClick={(e) => {
                        this.eventClick(e);
                    }}
                />
                <Modal
                    open={this.state.viewModalOpen}
                    title={this.state.selectedTitle}
                    // onOk={handleOk}
                    onCancel={() => this.reset()}
                    footer={[
                        <Button key="delete" style={{ backgroundColor: "red", color: "white" }} onClick={() => {
                            this.deleteTransaction();
                        }}>
                            Delete
                        </Button>,
                        <Button key="submit" type="primary"
                            //  loading={loading}
                            onClick={this.onUpdate}
                        >
                            Edit
                        </Button>,
                    ]}
                >
                    <div>

                        <Row>
                            <Col className='inputColStyle'>
                                <span style={{ fontSize: "20px", marginBottom: "5px" }}>Title</span>
                                <Input onChange={(e) => {
                                    this.handleChange(e.target.value, "title")
                                }} value={this.state.selectedTransactionData.title} style={{ height: "52px", fontSize: "18px" }} />
                            </Col>
                            <Col className='inputColStyle'>
                                <span style={{ fontSize: "20px", marginBottom: "5px" }}>Amount</span>
                                <Input onChange={(e) => {
                                    this.handleChange(e.target.value, "amount")
                                }} value={this.state.selectedTransactionData.amount} type='number' style={{ height: "52px", fontSize: "18px" }} />
                            </Col>
                        </Row>

                        <Row>
                            <Col className='inputColStyle' style={{ width: "100%" }}>
                                <span style={{ fontSize: "20px", marginBottom: "5px" }}>Description</span>
                                <Input onChange={(e) => {
                                    this.handleChange(e.target.value, "description")
                                }} value={this.state.selectedTransactionData.description} type='text' style={{ height: "52px", fontSize: "18px" }} />
                            </Col>
                        </Row>

                        <Row>
                            <Col className='inputColStyle'>
                                <span style={{ fontSize: "20px", marginBottom: "5px" }}>Date</span>
                                <Input value={this.state.formattedDate} disabled type='text' style={{ height: "52px", fontSize: "18px" }} />
                            </Col>

                            <Col className='inputColStyle'>
                                <span style={{ fontSize: "20px", marginBottom: "5px" }}>Recurrent Type</span>
                                <Select onChange={(e) => {
                                    this.handleChange(e, "recurrentType")
                                }} value={this.state.selectedTransactionData.recurrentType} style={{ height: "52px", fontSize: "18px", width: "100%" }}>
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

                    </div>
                </Modal>
            </>
        )
    }
}

export default Calendar