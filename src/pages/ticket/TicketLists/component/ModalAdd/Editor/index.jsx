import React from 'react'
import ReactQuill from 'react-quill'

export default function Editor({ value, setValue, ref }) {
    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
            ],
            ['link'],
            ['clean'],
        ],
    }

    const formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
    ]

    return (
        <ReactQuill
            value={value}
            defaultValue={''}
            theme="snow"
            modules={modules}
            placeholder="Insert Description"
            formats={formats}
            style={{ backgroundColor: '#fff' }}
            onChange={(data) => {
                setValue(data)
            }}
        />
    )
}
