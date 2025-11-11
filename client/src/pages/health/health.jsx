
import "./styles.css";

import React from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

function HealthCalendar() {
const events = [
    {
    title: 'Workout',
    start: new Date(),
    end: new Date(new Date().getTime() + 60 * 60 * 1000),
    },
]

return (
    <div style={{ height: '80vh', padding: '1rem' }}>
    <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="week"
        style={{ height: '100%' }}
    />
    </div>
)
}


const Health = () => {

    return ( <>
        <h1> Medication Calendar </h1>
        <hr/>
        <HealthCalendar />
        <h1> Glucose Entry </h1>
        <hr/>
        <h1> Doctor Note </h1>
        <hr/>
    </> );
}

export default Health;
