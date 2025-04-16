import { Button, Form, message, Modal } from 'antd'
import SelectDropdown from '../../../../../components/SelectDropdown'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { getTeamList } from '../../../../../store/action/TeamAction'

import { isArray } from 'lodash/lang'
import TicketApi, { UpdateTicketRequest } from 'api/ticket'
import _ from 'lodash'
import { statusOptions } from '../../../helper'
import { useNavigate } from 'react-router-dom'

/**
 * ModalAssignTo is responsible to manage action to assign multiple cards
 * to a team (and agent)s
 * @param {boolean} showModalChangeStatus sets visibility of this modal (boolean)
 * @param {array} teamList sets array list of team
 * @param {array} selectedTickets selectedTicketIDs
 * @param {callback} withoutSaveCallback callback when `close` or `cancel` button clicked
 * @param {callback} saveCallback callback when `save` button clicked
 * @returns {JSX.Element}
 * @constructor
 */
export const ModalChangeStatus = ({
    showModalChangeStatus,
    selectedTickets,
    withoutSaveCallback,
    saveCallback,
}) => {
    const navigate = useNavigate()
    // state
    const [isLoadingButton, setIsLoadingButton] = useState(false)

    const [form] = Form.useForm()

    // internal function
    const handlePreventWithoutSave = () => {
        document.getElementById('form-modal-change-status').reset()
        withoutSaveCallback()
    }

    const handleFormSubmission = async (formData) => {
        /**
         * construct and call API
         */
        let updateTicketsRequests = []

        _.forEach(selectedTickets, function (ticket) {
            let updateReq = new UpdateTicketRequest(
                ticket.number || '',
                ticket.teamId || '',
                ticket.agentId || '',
                formData.mdl_change_status__change_status,
                ticket.title,
                ticket.description,
                ticket.source,
                ticket.urgency,
                ticket.categoryId || '',
                ticket.subcategory1Id || '',
                ticket.subcategory2Id || '',
                ticket.incomingAt,
                ticket.dueAt,
                ticket.patientId,
                ticket.patientName,
                ticket.patientPhone,
                ticket.soNumber,
                ticket.medicalRecord
            )

            updateTicketsRequests.push(updateReq)
        })

        try {
            setIsLoadingButton(true)
            await TicketApi.updateTickets(updateTicketsRequests)
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
            if (isArray(saveCallback)) {
                saveCallback.forEach(function (f) {
                    f()
                })
            } else {
                saveCallback()
            }
            setIsLoadingButton(false)
            document.getElementById('form-modal-change-status').reset()
        }
    }

    return (
        <Modal
            title="Move To"
            centered
            className="modal-assign-to"
            visible={showModalChangeStatus}
            onCancel={handlePreventWithoutSave}
            maskClosable={false}
            footer={[
                <Button
                    key="btn-cancel-modal-change-status"
                    onClick={handlePreventWithoutSave}>
                    Cancel
                </Button>,
                <Button
                    key="submit-change-status"
                    htmlType="submit"
                    type="primary"
                    form="form-modal-change-status"
                    loading={isLoadingButton}>
                    Save
                </Button>,
            ]}>
            <Form
                form={form}
                layout="vertical"
                id={'form-modal-change-status'}
                onFinish={handleFormSubmission}>
                <Form.Item
                    label="Ticket Status"
                    name="mdl_change_status__change_status"
                    rules={[{ required: true, message: 'Please select ticket status!' }]}>
                    <SelectDropdown
                        options={statusOptions}
                        placeHolder={'Select Ticket Status'}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}

const mapStateToProps = ({ teamList }) => ({
    teamList,
})

export default connect(mapStateToProps, {
    getTeamList,
})(ModalChangeStatus)
