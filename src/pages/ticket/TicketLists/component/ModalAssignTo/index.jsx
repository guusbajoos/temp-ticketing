import { Button, Form, message, Modal } from 'antd'
import SelectDropdown from '../../../../../components/SelectDropdown'
import { convertOptions } from '../../../../../utils'
import React, { useState } from 'react'
import { isEmpty } from 'lodash'
import { connect } from 'react-redux'
import { getTeamList } from '../../../../../store/action/TeamAction'

import { isArray } from 'lodash/lang'
import TicketApi, { UpdateTicketRequest } from 'api/ticket'
import _ from 'lodash'
import { filterSelectedTeamForSelectBox } from '../../../helper'
import { useNavigate } from 'react-router-dom'

/**
 * ModalAssignTo is responsible to manage action to assign multiple cards
 * to a team (and agent)s
 * @param {boolean} showModalAssignTo sets visibility of this modal (boolean)
 * @param {array} teamList sets array list of team
 * @param {array} selectedTickets selectedTicketIDs
 * @param {callback} withoutSaveCallback callback when `close` or `cancel` button clicked
 * @param {callback} saveCallback callback when `save` button clicked
 * @returns {JSX.Element}
 * @constructor
 */
export const ModalAssignTo = ({
    showModalAssignTo,
    teamList,
    selectedTickets,
    withoutSaveCallback,
    saveCallback,
}) => {
    const navigate = useNavigate()
    // state
    const [isTeamSelected, setIsTeamSelected] = useState(false)
    const [isLoadingButton, setIsLoadingButton] = useState(false)
    const [selectedTeam, setSelectedTeam] = useState('')

    const [form] = Form.useForm()

    // internal function
    const handlePreventWithoutSave = () => {
        document.getElementById('form-modal-assign-to').reset()
        withoutSaveCallback()
        setIsTeamSelected(false)
    }

    const userOptions = filterSelectedTeamForSelectBox(teamList, selectedTeam)

    const onTeamChange = () => {
        setIsTeamSelected(true)
    }

    const handleFormSubmission = async (formData) => {
        /**
         * construct and call API
         */
        let updateTicketsRequests = []

        _.forEach(selectedTickets, function (ticket) {
            let updateReq = new UpdateTicketRequest(
                ticket.number,
                formData.mdl_assigned_to__assigned_team,
                formData.mdl_assigned_to__agent,
                ticket.status,
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
            document.getElementById('form-modal-assign-to').reset()
            setIsTeamSelected(false)
        }
    }

    const handleFormValuesChange = (changedValues) => {
        const formFieldName = Object.keys(changedValues)[0]
        if (formFieldName === 'mdl_assigned_to__assigned_team') {
            setSelectedTeam(String(changedValues[formFieldName]))
            form.setFieldsValue({ mdl_assigned_to__agent: undefined })
        }
    }

    return (
        <Modal
            title="Assign To"
            centered
            className="modal-assign-to"
            visible={showModalAssignTo}
            onCancel={handlePreventWithoutSave}
            maskClosable={false}
            footer={[
                <Button
                    key="btn-cancel-modal-assign-to"
                    onClick={handlePreventWithoutSave}>
                    Cancel
                </Button>,
                <Button
                    key="submit-assign-to"
                    htmlType="submit"
                    type="primary"
                    form="form-modal-assign-to"
                    loading={isLoadingButton}>
                    Save
                </Button>,
            ]}>
            <Form
                form={form}
                layout="vertical"
                onValuesChange={handleFormValuesChange}
                id={'form-modal-assign-to'}
                onFinish={handleFormSubmission}>
                <Form.Item
                    label="Assigned to Team"
                    name="mdl_assigned_to__assigned_team"
                    rules={[{ required: true, message: 'Please select team!' }]}>
                    <SelectDropdown
                        options={
                            !isEmpty(teamList) && !isEmpty(teamList.currentElements)
                                ? convertOptions(teamList.currentElements, 'name', 'id')
                                : []
                        }
                        onChange={onTeamChange}
                        placeHolder={'Select Team'}
                    />
                </Form.Item>

                <Form.Item
                    label="Assigned to Agent"
                    rules={[{ required: false }]}
                    name="mdl_assigned_to__agent">
                    <SelectDropdown
                        disabled={!isTeamSelected}
                        options={
                            !isEmpty(userOptions) && !isEmpty(userOptions[0].users)
                                ? convertOptions(userOptions[0].users, 'name', 'id')
                                : []
                        }
                        withoutOnchange={true}
                        placeHolder={'Select Agent'}
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
})(ModalAssignTo)
