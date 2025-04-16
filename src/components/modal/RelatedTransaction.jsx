import React from 'react'

import { Table, Tag, Modal } from 'antd'

import { PAYMENT_STATUS_COLOR } from 'data/general'
import { numberToRupiah } from '../../utils'

import './style.scss'

const RelatedTransaction = ({
    isModalVisible = false,
    closeModal,
    openOrderTrackingModal,
    data,
}) => {
    const handleOk = () => {
        closeModal()
    }

    const columns = [
        {
            title: 'Action',
            dataIndex: 'soNumber',
            key: 'action',
            render: (soNumber) => {
                return (
                    <div
                        className="order-tracking-btn"
                        onClick={() => openOrderTrackingModal(soNumber)}>
                        <img
                            src="https://rata-web-staging-assets.s3.ap-southeast-1.amazonaws.com/related_action_icon.svg"
                            alt="show"
                        />
                    </div>
                )
            },
        },
        {
            title: 'Transaction Date',
            dataIndex: 'transactionDate',
            key: 'transactionDate',
            render: (transactionDate) => (
                <span>
                    {(transactionDate && transactionDate.split(' ')[0]) ||
                        transactionDate}
                </span>
            ),
        },
        {
            title: 'SO Number',
            dataIndex: 'soNumber',
            key: 'soNumber',
            render: (text) => <span>{text}</span>,
        },
        {
            title: 'Product Name',
            dataIndex: 'productName',
            key: 'productName',
            render: (text) => <span>{text}</span>,
        },
        {
            title: 'Current State',
            dataIndex: 'currentState',
            key: 'currentState',
        },
        {
            title: 'Consultation Type',
            dataIndex: 'consultationType',
            key: 'consultationType',
        },
        {
            title: 'Payment Status',
            key: 'paymentStatus',
            dataIndex: 'paymentStatus',
            render: (status) => (
                <>
                    {status && (
                        <Tag
                            color={
                                PAYMENT_STATUS_COLOR.find((item) => item.key === status)
                                    .color || '#fff'
                            }>
                            {status.toUpperCase()}
                        </Tag>
                    )}
                </>
            ),
        },
        {
            title: 'Payment Type',
            dataIndex: 'paymentType',
            key: 'paymentType',
        },
        {
            title: 'Deal Payment',
            dataIndex: 'dealPayment',
            key: 'dealPayment',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (text) => <span>{numberToRupiah(text)}</span>,
        },
        {
            title: 'Promo Code',
            dataIndex: 'promoCode',
            key: 'promoCode',
        },
        {
            title: 'Discount',
            dataIndex: 'discount',
            key: 'discount',
            render: (text) => <span>{numberToRupiah(text)}</span>,
        },
        {
            title: 'Grand Total',
            dataIndex: 'grandTotal',
            key: 'grandTotal',
            render: (text) => <span>{numberToRupiah(text)}</span>,
        },
    ]

    return (
        <Modal
            title="Related Transaction"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleOk}
            okText="Selesai"
            width={1300}>
            <Table columns={columns} scroll={{ x: 1500 }} dataSource={data} />
        </Modal>
    )
}

export default RelatedTransaction
