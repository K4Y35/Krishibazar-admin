import React from 'react'

export default function PrimaryButton({ type, text, onClick = () => { }, className = '' }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`${className} inline-flex  items-center justify-center bg-meta-3 px-10 py-4 text-center font-normal text-white hover:bg-opacity-90 lg:px-8 xl:px-10`}
        >
            {text}
        </button>
    )
}
