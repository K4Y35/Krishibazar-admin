import Link from 'next/link'
import React from 'react'

export default function PrimaryLinkButton({ link }) {
    return (
        <Link
            type={link}
            className="inline-flex items-center justify-center bg-meta-3 px-10 py-4 text-center font-normal text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
            Button
        </Link>
    )
}
