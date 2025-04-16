import React, { useState } from 'react'
import {
    Modal,
    Form,
    Button,
    DatePicker,
    Row,
    Col,
    Select,
    message,
} from 'antd'

import { connect } from 'react-redux'
import moment from 'moment'

import { isEmpty } from 'lodash'

import ReportApi from 'api/report'
import MultiselectDropdown from 'components/MultiselectDropdown'

import { getTeamList } from 'store/action/TeamAction'
import { convertOptions } from '../../../../../utils'

import './style.scss'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

const { Option } = Select

export const ModalAddData = ({ isVisible, handleCancel, teamList }) => {
    const navigate = useNavigate()
    const { currentElements } = teamList
    const [minDate, setMinDate] = useState('')
    const [maxDate, setMaxDate] = useState('')

    const [form] = Form.useForm()

    const [isLoadingButton, setIsLoadingButton] = useState(false)
    const [filter, setFilter] = useState(false)

    const onCancel = () => {
        handleCancel()
        form.resetFields()
    }

    const onTeamChange = (checkedValues) => {
        setFilter({
            ...filter,
            team: checkedValues,
            page: 1,
        })
    }

    const convertObjToQs = (obj) => {
        return Object.keys(obj)
            .map((key) => `${key}=${obj[key]}`)
            .join('&')
    }

    const formatDateArray = (date) => {
        const formattedDate = new Date(date)

        const year = formattedDate.getFullYear()
        const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0')
        const day = formattedDate.getDate().toString().padStart(2, '0')

        return [year, month, day].join('-')
    }

    const handleDownload = async (values) => {
        const minDateValue = formatDateArray(values?.minDate)
        const maxDateValue = formatDateArray(values?.maxDate)
        try {
            setIsLoadingButton(true)

            const payload = {
                reportExtension: 'csv',
                team: values.team ? values.team.join(',') : [],
                reportType: values.reportType,
                minDate: minDateValue,
                maxDate: maxDateValue,
            }

            if (payload.team.length === 0) {
                delete payload.team
            }

            const { data } = await ReportApi.generateReport(convertObjToQs(payload))

            window.location.assign(data.url)

            message.success('Data berhasil diunduh')
        } catch (err) {
            if (err.response) {
                const errMessage = err.response.data.message
                message.error(errMessage)
            } else {
                message.error('Tidak dapat menghubungi server, cek koneksi')
                localStorage.clear()
                sessionStorage.clear()
                navigate('/')
            }
        } finally {
            setIsLoadingButton(false)
        }
    }

    const disabledDate = (current) => {
        return current && current > moment().endOf('day')
    }

    const reportType = [
        {
            name: 'Comment Log',
            key: 'comment-log',
        },
        {
            name: 'Customer Interaction',
            key: 'customer-interaction',
        },
        {
            name: 'SLA Report',
            key: 'sla-report',
        },
        {
            name: 'Ticket Solution',
            key: 'ticket-solution',
        },
    ]

    return (
        <Modal
            title="Download Report"
            centered
            className="modal-download-confirm"
            visible={isVisible}
            onCancel={onCancel}
            maskClosable={false}
            footer={[
                <Button key="back" loading={isLoadingButton} onClick={onCancel}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    htmlType="submit"
                    type="primary"
                    form="add-modal-all-tickets"
                    loading={isLoadingButton}>
                    Save
                </Button>,
            ]}>
            <Form
                form={form}
                layout="vertical"
                id={'add-modal-all-tickets'}
                onFinish={handleDownload}>
                <Form.Item
                    label="Report Type"
                    name="reportType"
                    rules={[{ required: true, message: 'Please input Report Type!' }]}>
                    <Select
                        showArrow
                        style={{ width: '100%' }}
                        placeholder="Select Report Type"
                        size="large"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        tokenSeparators={[',']}>
                        {reportType.map((report, index) => (
                            <Option value={report.key} key={index}>
                                {report.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Row gutter={[16, 0]}>
                    <Col xs={12}>
                        <Form.Item
                            label="Start Date"
                            name="minDate"
                            rules={[{ required: true, message: 'Please input Start Date!' }]}>
                            <DatePicker
                                size="large"
                                placeHolder={'Start Date'}
                                format="YYYY-MM-DD"
                                disabledDate={disabledDate}
                            />
                        </Form.Item>
                        <span className="max-range">
                            Max range: <b>30 days</b>
                        </span>
                    </Col>

                    <Col xs={12}>
                        <Form.Item
                            label="End Date"
                            name="maxDate"
                            rules={[{ required: true, message: 'Please input End Date!' }]}>
                            <DatePicker
                                size="large"
                                placeHolder={'End Date'}
                                format="YYYY-MM-DD"
                                disabledDate={disabledDate}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col xs={24}>
                        <Form.Item label="Team Name" name="team">
                            <MultiselectDropdown
                                placeHolder={'Select Team Name'}
                                onChange={onTeamChange}
                                options={
                                    !isEmpty(teamList)
                                        ? convertOptions(currentElements, 'name', 'id')
                                        : []
                                }
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

const mapStateToProps = ({ teamList }) => ({
    teamList,
})

export default connect(mapStateToProps, {
    getTeamList,
})(ModalAddData)
