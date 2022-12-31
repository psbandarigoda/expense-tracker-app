import React, { Component } from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!

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
                    title: data.title + ` $${data.amount}`,
                    start: data.date,
                    backgroundColor: data.category.type === "INCOME" ? "green" : "red",
                    rrule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,WE,FR'
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