import React, { Component } from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import moment from 'moment/moment';

export class Calendar extends Component {
    constructor(props) {
        super(props);
        this.state = {

            transactionsInCalendarFormat: []

        }
    }
    componentWillReceiveProps = (nextprops) => {

        if (nextprops.transactionsData) {

            let transactionsInCalendarFormat = nextprops.transactionsData.map((data) => {
                let mockObj = {
                    id: data.trnId,
                    title: data.title + ` $${data.amount}`,
                    start: data.date,
                    end: data.date,
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
    render() {
        return (
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                height={600}
                events={this.state.transactionsInCalendarFormat}
            />
        )
    }
}

export default Calendar