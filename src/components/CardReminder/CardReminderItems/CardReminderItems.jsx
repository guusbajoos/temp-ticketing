import { Col, Typography, Card } from 'antd'
import { Link } from 'react-router-dom'
import './index.scss'

export default function CardReminderItems({
    index,
    count,
    desc,
    setClassNameSelectedCard,
    classNameSelectedCard,
    classNameCardLong,
    classNameCardReminder,
    path,
    setSelectedSorting
}) {
    return (
        <Col className="gutter-row" span={3} style={{ margin: "0px 10px" }}>
            <Link to={path} onClick={() => {
                setSelectedSorting('')
                setClassNameSelectedCard(`card-reminders-${index}`)
            }}>
                <div className={classNameSelectedCard === `card-reminders-${index}` ? classNameCardReminder : ''}
                    style={{
                        padding: classNameSelectedCard !== `card-reminders-${index}` ? "14px 30px" : "",
                        boxShadow: classNameSelectedCard !== `card-reminders-${index}` ? "6px 6px 10px rgba(0, 0, 0, 0.03)" : "",
                        borderRadius: classNameSelectedCard !== `card-reminders-${index}` ? "5px" : "",
                    }}>
                    <Typography.Title style={{ color: "#000", whiteSpace: "nowrap" }} level={4}>
                        {new Intl.NumberFormat('id-ID').format(count)}
                    </Typography.Title>
                    <Typography.Paragraph level={5} style={{ color: "#4F4F4F", whiteSpace: "nowrap" }}>{desc}</Typography.Paragraph>
                    <div className={classNameCardLong}></div>
                </div>
            </Link>
        </Col>
    )
}
