export const toInputDate = date => {
    const value = new Date(date)
    if (Number.isNaN(value.getTime())) {
        return ''
    }

    const year = value.getFullYear()
    const month = String(value.getMonth() + 1).padStart(2, '0')
    const day = String(value.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export const daysAgo = days => {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date
}

export const startOfDay = dateStr => {
    if (!dateStr) {
        return new Date(NaN)
    }

    const [year, month, day] = dateStr.split('-').map(Number)
    return new Date(year, month - 1, day, 0, 0, 0, 0)
}

export const endOfDay = dateStr => {
    if (!dateStr) {
        return new Date(NaN)
    }

    const [year, month, day] = dateStr.split('-').map(Number)
    return new Date(year, month - 1, day, 23, 59, 59, 999)
}

export const resolveDateRange = (startDate, endDate) => {
    let start = startOfDay(startDate)
    let end = endOfDay(endDate)

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return { start: new Date(NaN), end: new Date(NaN) }
    }

    if (start > end) {
        start = startOfDay(endDate)
        end = endOfDay(startDate)
    }

    return { start, end }
}

export const eachDateKey = (start, end) => {
    const keys = []
    const cursor = new Date(start)

    if (Number.isNaN(cursor.getTime()) || Number.isNaN(end.getTime())) {
        return keys
    }

    while (cursor <= end) {
        keys.push(toInputDate(cursor))
        cursor.setDate(cursor.getDate() + 1)
    }

    return keys
}

export const formatChartLabel = date =>
    new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
    })

export const isOrderInRange = (order, start, end) => {
    const rawDate = order.paidAt || order.createdAt
    if (!rawDate) {
        return false
    }

    const orderDate = new Date(rawDate)
    return !Number.isNaN(orderDate.getTime()) && orderDate >= start && orderDate <= end
}
