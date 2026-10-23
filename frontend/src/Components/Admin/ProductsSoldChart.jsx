import { useMemo, useState } from 'react'
import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts'
import {
    daysAgo,
    eachDateKey,
    formatChartLabel,
    isOrderInRange,
    resolveDateRange,
    toInputDate
} from '../../Utils/chartDates'

const orderQuantity = order =>
    (order.orderItems || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0)

const buildDailyQuantities = (orders, startDate, endDate) => {
    const { start, end } = resolveDateRange(startDate, endDate)
    const totals = new Map(eachDateKey(start, end).map(date => [date, 0]))

    orders.forEach(order => {
        if (!isOrderInRange(order, start, end)) {
            return
        }

        const key = toInputDate(order.paidAt || order.createdAt)
        if (!totals.has(key)) {
            return
        }

        totals.set(key, totals.get(key) + orderQuantity(order))
    })

    return Array.from(totals.entries()).map(([date, sold]) => ({
        date,
        sold,
        label: formatChartLabel(date)
    }))
}

const ProductsSoldChart = ({ orders = [] }) => {
    const [startDate, setStartDate] = useState(() => toInputDate(daysAgo(29)))
    const [endDate, setEndDate] = useState(() => toInputDate(new Date()))

    const productsSold = useMemo(
        () => buildDailyQuantities(orders, startDate, endDate),
        [orders, startDate, endDate]
    )

    const rangeTotal = productsSold.reduce((sum, item) => sum + item.sold, 0)

    const applyPreset = days => {
        setStartDate(toInputDate(daysAgo(days - 1)))
        setEndDate(toInputDate(new Date()))
    }

    return (
        <div className="card sales-chart-card">
            <div className="card-body">
                <div className="sales-chart-header">
                    <div>
                        <h4 className="mb-1">Products sold</h4>
                        <p className="text-muted mb-0">
                            Total in range: <b>{rangeTotal}</b>
                        </p>
                    </div>
                    <div className="sales-chart-filters">
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => applyPreset(7)}>
                            Last 7 days
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => applyPreset(30)}>
                            Last 30 days
                        </button>
                        <label className="mb-0">
                            From
                            <input
                                type="date"
                                className="form-control form-control-sm"
                                value={startDate}
                                max={endDate}
                                onChange={event => setStartDate(event.target.value)}
                            />
                        </label>
                        <label className="mb-0">
                            To
                            <input
                                type="date"
                                className="form-control form-control-sm"
                                value={endDate}
                                min={startDate}
                                max={toInputDate(new Date())}
                                onChange={event => setEndDate(event.target.value)}
                            />
                        </label>
                    </div>
                </div>

                {rangeTotal === 0 ? (
                    <p className="text-center text-muted mt-4 mb-0">No products sold in this date range.</p>
                ) : (
                    <div className="sales-chart-wrap">
                        <ResponsiveContainer width="100%" height={360}>
                            <BarChart data={productsSold} margin={{ top: 16, right: 16, bottom: 8, left: 0 }}>
                                <CartesianGrid stroke="#eee7df" strokeDasharray="4 4" />
                                <XAxis dataKey="label" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                <Tooltip
                                    formatter={value => [value, 'Products sold']}
                                    labelFormatter={(_, payload) => payload?.[0]?.payload?.date || ''}
                                />
                                <Bar dataKey="sold" fill="#c39a3b" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductsSoldChart
