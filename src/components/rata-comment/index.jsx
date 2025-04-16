import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'

import { capitalize, isEmpty } from 'lodash'

import { avatarColor } from '../../utils'

import { Button } from 'antd'
import { Comment } from '@ant-design/compatible'
import EditorJodit from 'pages/ticket/EditTicket/components/JoditEditor'
import { config } from './editor.config'

const RataComment = ({ props, comments, onSubmit, loading, onDelete }) => {
    const [isCommented, setIsCommented] = useState(false)
    const [value, setValue] = useState('')

    useEffect(() => {
        setValue(props.content.props.dangerouslySetInnerHTML.__html)
    }, [props.content])

    const handleCancel = () => {
        setIsCommented(false)
    }

    const handleSubmit = (id, value) => {
        onSubmit(id, value)
    }

    const handleDelete = (id) => {
        onDelete(id)
    }

    const userLoggedinId = localStorage.getItem('user_id')

    const findComment =
        comments &&
        comments.find((comment) => comment.author_id === props.author_id)

    const isPrivilegesileges = findComment.author_id === userLoggedinId

    return (
        <div className='mt-10 mb-10'>
            {!isCommented ? (
                <Comment
                    actions={
                        isPrivilegesileges
                            ? [
                                <div key="comment-nested-action">
                                    <span
                                        className="mr-10 pointer"
                                        onClick={() => setIsCommented((prevState) => !prevState)}>
                                        Edit
                                    </span>
                                    <span
                                        className="pointer"
                                        onClick={() => handleDelete(props.id)}>
                                        Delete
                                    </span>
                                </div>,
                            ]
                            : null
                    }
                    {...props}
                />
            ) : (
                <div>
                    <div className="ant-comment-content-author">
                        <div
                            className={`ant-comment-avatar letter-avatar ${avatarColor(
                                !isEmpty(props.author) ? props.author.charAt(0) : ''
                            )}`}>
                            {capitalize(props.author.charAt(0))}
                            {capitalize(props.author.charAt(1))}
                        </div>
                        <span className="ant-comment-content-author-name">
                            {props.author}
                        </span>
                    </div>

                    {/* <ReactQuill
                        value={value}
                        theme="snow"
                        modules={modules}
                        formats={formats}
                        style={{ backgroundColor: '#fff' }}
                        defaultValue={''}
                        onChange={(data) => {
                            setValue(data)
                        }}
                    /> */}
                    <EditorJodit
                        config={config}
                        value={value}
                        setValue={setValue}
                    />

                    <div className="mt-10">
                        <Button loading={loading} className="mr-10" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button
                            loading={loading}
                            onClick={() => handleSubmit(props.id, value)}
                            type="primary">
                            Edit
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RataComment
