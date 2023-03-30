import { useState, useEffect } from "react"

// use like: const [ data, isPending, error ] = useFetch("someURL/....")

const useFetch = (url) => {
    const [data, setData] = useState([])
    const [isPending, setIsPending] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw Error(`Could not fetch data for resource ${url}`)
                }
                return res.json()
            })
            .then(data => {
                setData(data)
                setIsPending(false)
                setError(null)
            })
            .catch(err => {
                setIsPending(false)
                setError(err.message)
            })
    }, [url])

    return [ data, isPending, error ]
}

export default useFetch