/* eslint-disable */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect } from 'react'
import { Spin, Form, Button, List, message, Modal } from 'antd'
import { Comment } from '@ant-design/compatible'
import moment from 'moment'

import { connect } from 'react-redux'
import { Waypoint } from 'react-waypoint'
import { LoadingOutlined } from '@ant-design/icons'
import { capitalize, isEmpty } from 'lodash'
import RataComment from 'components/rata-comment'
import { setCreateEditMessage, checkPrivileges, avatarColor } from '../../../../../utils'
import TicketApi from 'api/ticket'
import { getUserById } from 'store/action/UserAction'
import { v4 as uuidv4 } from 'uuid'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { ModalLinkTextEditor, Mode } from './components/ModalLinkTextEditor'
import './styles/index.scss'
import JoditEditor from '../JoditEditor'
import { useNavigate } from 'react-router-dom'
import { config } from './editor.config'
const { confirm } = Modal

export function CommentLists({ userById }) {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingComment, setIsLoadingComment] = useState(false)
    const [comments, setComments] = useState([])
    const urlParams = new URLSearchParams(window.location.search)
    const [pageData, setPageData] = useState(1)
    const id = urlParams.get('id')
    const [pagination, setPagination] = useState({
        page: 1,
        size: 5,
    })
    const [value, setValue] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [commentAdded, setCommentAdded] = useState({})
    const createComment = checkPrivileges(userById, 19)
    // TODO: implement edit & delete comment
    // may be on next release ?
    // const editComment = checkPrivileges(userById, 20);
    // const deleteComment = checkPrivileges(userById, 21);
    const [showModalLink, setShowModalLink] = useState(false)
    const [quillInstance, setQuillInstance] = useState(undefined)

    const getTicketCommentListData = useCallback(async () => {
        try {
            setIsLoading(true)

            const { data } = await TicketApi.getTicketCommentList(
                id,
                pagination.page,
                pagination.size
            )
            setIsLoading(false)
            const commentConvertData = data.currentElements.map((value) => ({
                id: value.id,
                author_id: value.user.id,
                author: value.user.name,
                avatar: (
                    <div
                        className={`letter-avatar ${avatarColor(
                            !isEmpty(value.user) ? value.user.name.charAt(0) : ''
                        )}`}>
                        {capitalize(value.user.name.charAt(0))}
                        {capitalize(value.user.name.charAt(1))}
                    </div>
                ),
                content: (
                    <div
                        className={'ant-comment-content-detail__content'}
                        dangerouslySetInnerHTML={{ __html: value.message }}
                    />
                ),
                datetime: (
                    <div style={{ display: "flex" }}>
                        {formatCommentDate(value.createdAt)} {" "}
                        <span style={{ marginLeft: "10px" }}>{" "} {value.edited ? (
                            <span>Edited</span>
                        ) : ''}</span>
                    </div>
                ),
            }))

            setComments(commentConvertData)
            setPageData(data.totalPage)
        } catch (err) {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        getTicketCommentListData()
    }, [getTicketCommentListData])

    useEffect(() => {
        if (!isEmpty(commentAdded)) {
            getTicketCommentListData()
        }
    }, [commentAdded])

    const formatHTMLDescriptionLINK = (html) => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')

        const body = doc.querySelector('body')

        if (body) {
            const links = body.querySelectorAll('a')
            const image = body.querySelectorAll('img')
            image.forEach((img) => {
                return img.style.width = '100%'
            })

            links.forEach((link) => {
                const href = link.getAttribute('href')
                if (href) {
                    if (!(href.includes('http://') || href.includes('https://'))) {
                        link.setAttribute('href', 'https://' + href)
                    }
                }
            })
            return body.innerHTML
        } else {
            return html
        }
    }

    const onEditComment = async (commentId, comment) => {
        const maxSize = 2 * 1024 * 1024 // 2 MB in bytes
        if (comment.length > maxSize) {
            message.open({
                type: 'error',
                content: 'The file or message is too large, the maximum is only 2mb!',
                duration: 5,
            })
            return false
        } else {
            setIsLoadingComment(true)
            const payload = {
                message: formatHTMLDescriptionLINK(comment),
                user: {
                    id: localStorage.getItem('user_id'),
                },
            }

            try {
                await TicketApi.updateCommentTicket(id, commentId, payload)

                getTicketCommentListData()

                message.success('Comment updated')
            } catch {
                //
            } finally {
                setIsLoadingComment(false)
            }
        }
    }

    const onDeleteComment = async (commentId) => {
        confirm({
            title: `Are you sure you want to delete this comment?`,
            okText: 'Yes',
            okType: 'danger',
            width: 520,
            content: `Once deleted, the comment will removed from ticket comment section`,
            cancelText: 'No',
            onOk() {
                async function deleteComment() {
                    setIsLoadingComment(true)

                    try {
                        await TicketApi.deleteCommentTicket(id, commentId)
                        getTicketCommentListData()
                        message.success('Commment deleted')
                    } catch {
                        //
                    } finally {
                        setIsLoadingComment(false)
                    }
                }
                deleteComment()
            },
            onCancel() { },
        })
    }

    const CommentList = ({ comments }) => (
        <List
            dataSource={comments}
            itemLayout="horizontal"
            renderItem={(props) => (
                <RataComment
                    loading={isLoadingComment}
                    props={props}
                    comments={comments}
                    onSubmit={onEditComment}
                    onDelete={onDeleteComment}
                />
            )}
        />
    )

    const handleCancel = () => {
        setValue('')
    }

    const formatCommentDate = (val) => {
        return moment(val).tz('Asia/Jakarta').format('DD MMMM YYYY - HH:mm:ss A')
    }


    const handleLoadMoreComment = async () => {
        setIsLoading(true)

        const nextPage = pagination.page + 1

        const { data } = await TicketApi.getTicketCommentList(
            id,
            nextPage,
            pagination.size
        )

        const commentConvertData = data.currentElements.map((value) => ({
            id: value.id,
            author_id: value.user.id,
            author: value.user.name,
            avatar: (
                <div
                    className={`letter-avatar ${avatarColor(
                        !isEmpty(value.user) ? value.user.name.charAt(0) : ''
                    )}`}>
                    {capitalize(value.user.name.charAt(0))}
                    {capitalize(value.user.name.charAt(1))}
                </div>
            ),
            content: (
                <div
                    className="ant-comment-content-detail__content"
                    dangerouslySetInnerHTML={{ __html: value.message }}
                />
            ),
            datetime: (
                <div style={{ display: "flex" }}>
                    {formatCommentDate(value.createdAt)} {" "}
                    <span style={{ marginLeft: "10px" }}>{" "} {value.edited ? (
                        <span>Edited</span>
                    ) : ''}</span>
                </div>
            ),
        }))

        if (!isEmpty(data.currentElements)) {
            setComments([...comments, ...commentConvertData])
        }

        setPagination({ ...pagination, page: nextPage })

        setIsLoading(false)
    }


    const handleSubmit = async () => {
        const maxSize = 2 * 1024 * 1024 // 2 MB in bytes

        if (value.length > maxSize) {
            message.open({
                type: 'error',
                content: 'The file or message is too large, the maximum is only 2mb!',
                duration: 5,
            })
            return false
        } else {
            if (!value) {
                return
            }
            setSubmitting(true)
            try {
                // setIsLoading(true);
                let theResponse
                const currentDate = moment()
                const convertCurrentDate = currentDate.format(
                    moment.HTML5_FMT.DATETIME_LOCAL_SECONDS + 'Z'
                )

                theResponse = await TicketApi.addCommentTicket(
                    id,
                    formatHTMLDescriptionLINK(value),
                    convertCurrentDate,
                    localStorage.getItem('user_id')
                )

                setCreateEditMessage(
                    theResponse.data,
                    'Success Inserting Comment Data',
                    'Error Inserting Comment Data!'
                )

                setSubmitting(false)
                setValue('')

                if (theResponse.data.status !== 'FAILED') {
                    setCommentAdded({
                        ID: uuidv4(),
                    })
                }
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
            }
        }
    }


    return [
        <div className="comment-lists" key={'comment-lists'}>
            {createComment && (
                <Comment
                    avatar={
                        <div
                            className={`letter-avatar ${avatarColor(
                                localStorage.getItem('user_name').charAt(0) || ''
                            )}`}>
                            {capitalize(localStorage.getItem('user_name').charAt(0))}
                            {capitalize(localStorage.getItem('user_name').charAt(1))}
                        </div>
                    }
                    content={
                        <>
                            <Form.Item>
                                <JoditEditor
                                    config={config}
                                    value={value}
                                    setValue={setValue}
                                />
                            </Form.Item>
                            <div className="d-flex justify-content-flex-end">
                                <Form.Item className="mb-0">
                                    <Button
                                        //   loading={submitting}
                                        className="mr-10"
                                        onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                </Form.Item>
                                <Form.Item className="mb-0">
                                    <Button
                                        loading={submitting}
                                        onClick={handleSubmit}
                                        // disabled={value.length < 0 || value === "<p><br></p>"}
                                        type="primary">
                                        Post
                                    </Button>
                                </Form.Item>
                            </div>
                        </>
                    }
                />
            )}

            {comments.length > 0 && (
                <div>
                    <CommentList comments={comments} />
                </div>
            )}

            {pageData > pagination.page ? (
                <Waypoint onEnter={handleLoadMoreComment} />
            ) : (
                <></>
            )}

            {isLoading && (
                <div className="text-center">
                    <Spin size="large" indicator={<LoadingOutlined />} />
                </div>
            )}
        </div>,
        <ModalLinkTextEditor
            key={'modal-link-text-editor'}
            showModalLink={showModalLink}
            quillInstance={quillInstance}
            withoutSaveCallback={() => {
                setShowModalLink(false)
            }}
            saveCallback={() => {
                setShowModalLink(false)
            }}
        />,
    ]
}

const mapStateToProps = ({ userById }) => ({ userById })

export default connect(mapStateToProps, { getUserById })(CommentLists)
