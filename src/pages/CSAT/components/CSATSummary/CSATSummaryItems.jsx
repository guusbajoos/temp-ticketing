import { Row, Col, Typography } from 'antd'
import { useEffect } from 'react'
import { useState } from 'react'
import { generateCardActive } from './constant'
import './index.scss'


export default function CSATSummaryItems({
    paramsSummary,
    handleQueryParamsSummary,
    classNameSelectedCard,
    setClassNameSelectedCard,
    countSummary,
    titleSummary,
    color,
    isClickable
}) {
    const handleClickSummary = () => {
        handleQueryParamsSummary(titleSummary)
        setClassNameSelectedCard(`csat-report-${titleSummary.toLowerCase()}`)
    }

    useEffect(() => {
        switch (paramsSummary) {
            case "GOOD":
                setClassNameSelectedCard('csat-report-good')
                break
            case "BAD":
                setClassNameSelectedCard('csat-report-bad')
                break
            case "RESPONSE":
                setClassNameSelectedCard('csat-report-response')
                break

            default:
                break
        }
    }, [paramsSummary])

    return (
        <Col span={8} style={{ margin: "10px 0px" }}>
            <div style={isClickable ? { cursor: "pointer" } : null} onClick={handleClickSummary}>
                <div style={classNameSelectedCard === `csat-report-${titleSummary.toLowerCase()}` ? generateCardActive(`csat-report-${titleSummary.toLowerCase()}`, color) : {
                    padding: "14px 30px",
                    border: !isClickable ? "solid 1px #000" : "",
                    boxShadow: "0px 3px 10px rgb(0 0 0 / 0.2)",
                    borderRadius: "5px"
                }}>
                    <Row justify={"start"} style={{ alignItems: "center", gap: "0px 0px" }}>
                        <div style={{ margin: "0px 20px" }}>
                            <Typography.Title level={4} style={{ color: "#000", whiteSpace: "nowrap", fontWeight: 400 }}>
                                {titleSummary}
                            </Typography.Title>
                            <Typography.Paragraph style={{ color: `#565656`, whiteSpace: "nowrap", fontSize: "20px", fontWeight: 300 }}>
                                {countSummary}
                            </Typography.Paragraph>
                        </div>
                    </Row>
                    <div
                        style={{
                            position: "absolute",
                            top: "0px",
                            left: "0px",
                            backgroundColor: `${color}`,
                            width: "3.5%",
                            height: "100%"
                        }}
                    ></div>
                </div>
            </div>
        </Col >
    )
}
