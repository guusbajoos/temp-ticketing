import { Col, Row, Typography, Card } from 'antd'
import React, { Fragment, useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import CardReminderItems from './CardReminderItems/CardReminderItems'

export default function CardReminderNotification({
    myTicketCount,
    unassignedTicketCount,
    myTeamCount,
    isLoading,
    setSelectedSorting
}) {
    const location = useLocation()
    const { pathname } = location
    const [classNameSelectedCard, setClassNameSelectedCard] = useState('')

    useEffect(() => {
        if (pathname.includes('my-tickets')) {
            setClassNameSelectedCard('card-reminders-1')
        } else if (`${location.pathname}${location.search}` === "/all-tickets?my-teams") {
            setClassNameSelectedCard('card-reminders-2')
        } else if (pathname.includes('unassigned-tickets')) {
            setClassNameSelectedCard('card-reminders-3')
        } else {
            setClassNameSelectedCard('')
        }
    }, [location])

    return (
        <Fragment>
            <Row gutter={16} style={{ marginBottom: "50px" }}>
                {/* <CardReminderItems
                    index={1}
                    isLoading={isLoading}
                    countColor={'#1890FF'}
                    count={isNaN(myTicketCount) ? '' : myTicketCount}
                    desc={'All Tickets'}
                    path="/all-tickets"
                    setSelectedSorting={setSelectedSorting}
                    setClassNameSelectedCard={setClassNameSelectedCard}
                    classNameSelectedCard={classNameSelectedCard}
                    classNameCardLong={'card-long-All-Tickets'}
                    classNameCardReminder={'card-reminders-All-Tickets'}
                /> */}
                <CardReminderItems
                    index={1}
                    isLoading={isLoading}
                    countColor={'#1890FF'}
                    count={isNaN(myTicketCount) ? '' : myTicketCount}
                    desc={'My Tickets'}
                    path="/my-tickets"
                    setSelectedSorting={setSelectedSorting}
                    setClassNameSelectedCard={setClassNameSelectedCard}
                    classNameSelectedCard={classNameSelectedCard}
                    classNameCardLong={'card-long-My-Tickets'}
                    classNameCardReminder={'card-reminders-My-Tickets'}
                />
                <CardReminderItems
                    index={2}
                    isLoading={isLoading}
                    countColor={'#1890FF'}
                    count={isNaN(myTeamCount) ? '' : myTeamCount}
                    desc={'My team tickets'}
                    path="/all-tickets?my-teams"
                    setSelectedSorting={setSelectedSorting}
                    setClassNameSelectedCard={setClassNameSelectedCard}
                    classNameSelectedCard={classNameSelectedCard}
                    classNameCardLong={'card-long-My-team-tickets'}
                    classNameCardReminder={'card-reminders-My-team-tickets'}
                />
                <CardReminderItems
                    index={3}
                    isLoading={isLoading}
                    countColor={'#F5222D'}
                    count={isNaN(unassignedTicketCount) ? '' : unassignedTicketCount}
                    desc={'Unassigned tickets'}
                    path="/unassigned-tickets"
                    setSelectedSorting={setSelectedSorting}
                    setClassNameSelectedCard={setClassNameSelectedCard}
                    classNameSelectedCard={classNameSelectedCard}
                    classNameCardLong={'card-long-Unassigned-tickets'}
                    classNameCardReminder={'card-reminders-Unassigned-tickets'}
                />
            </Row>
        </Fragment>
    )
}
