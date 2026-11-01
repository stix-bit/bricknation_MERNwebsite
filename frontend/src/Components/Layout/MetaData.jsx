import React from 'react'
import { Helmet } from 'react-helmet'

const MetaData = ({ title }) => {
    return (
        <Helmet>
            <title>{`${title} - Build Something Bold`}</title>
        </Helmet>
    )
}

export default MetaData