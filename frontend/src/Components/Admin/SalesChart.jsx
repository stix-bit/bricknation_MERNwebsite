import { useMemo, useState } from 'react'
import {
    LineChart,
    Line,
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

const buildDailySales = (orders, startDate, endDate) => {
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

        totals.set(key, totals.get(key) + Number(order.totalPrice || 0))
    })

    return Array.from(totals.entries()).map(([date, total]) => ({
        date,
        total: Number(total.toFixed(2)),
        label: formatChartLabel(date)
    }))
}

const SalesChart = ({ orders = [] }) => {
    const [startDate, setStartDate] = useState(() => toInputDate(daysAgo(29)))
    const [endDate, setEndDate] = useState(() => toInputDate(new Date()))

    const sales = useMemo(
        () => buildDailySales(orders, startDate, endDate),
        [orders, startDate, endDate]
    )

    const rangeTotal = sales.reduce((sum, item) => sum + item.total, 0)

    const applyPreset = days => {
        setStartDate(toInputDate(daysAgo(days - 1)))
        setEndDate(toInputDate(new Date()))
    }

    return (
        <div className="card sales-chart-card">
            <div className="card-body">
                <div className="sales-chart-header">
                    <div>
                        <h4 className="mb-1">Sales</h4>
                        <p className="text-muted mb-0">
                            Total in range: <b>${rangeTotal.toFixed(2)}</b>
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

                {sales.length === 0 ? (
                    <p className="text-center text-muted mt-4 mb-0">No sales in this date range.</p>
                ) : (
                    <div className="sales-chart-wrap">
                        <ResponsiveContainer width="100%" height={360}>
                            <LineChart data={sales} margin={{ top: 16, right: 16, bottom: 8, left: 0 }}>
                                <CartesianGrid stroke="#eee7df" strokeDasharray="4 4" />
                                <XAxis dataKey="label" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                    formatter={value => [`$${Number(value).toFixed(2)}`, 'Sales']}
                                    labelFormatter={(_, payload) => payload?.[0]?.payload?.date || ''}
                                />
                                <Line type="monotone" dataKey="total" stroke="#e30620" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SalesChart
