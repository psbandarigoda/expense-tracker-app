import React, { Component } from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import moment from 'moment/moment';
import { Button, Modal } from 'antd';
import toastr from 'toastr';
import axios from 'axios';


export class Calendar extends Component {
    constructor(props) {
        super(props);
        this.state = {

            transactionsInCalendarFormat: [],

            selectedTitle: "",
            selectedPublicID: "",
            viewModalOpen: false,

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
                console.log(transactionsInCalendarFormat, "TRANAS")
            })

        }

    }

    eventClick = (e) => {

        console.log(e, "EVENT CLICK")
        let title = e.event._def.title;
        let id = e.event._def.publicId;

        this.setState({
            selectedTitle: title,
            selectedPublicID: id,
            viewModalOpen: true
        })

    }

    reset = () => {
        this.setState({
            selectedTitle: "",
            selectedPublicID: "",
            viewModalOpen: false
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
                        //   onClick={handleOk}
                        >
                            Edit
                        </Button>,
                    ]}
                >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Modal>
            </>
        )
    }
}

export default Calendar