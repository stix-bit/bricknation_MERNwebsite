const PDFDocument = require('pdfkit')
const sendEmail = require('./sendEmail')

const money = value => `$${Number(value || 0).toFixed(2)}`

const escapeHtml = value => String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const downloadImage = async url => {
    if (!url || !/^https?:\/\//i.test(url)) {
        return null
    }

    try {
        const response = await fetch(url, {
            signal: AbortSignal.timeout(10000)
        })
        if (!response.ok) {
            return null
        }
        return Buffer.from(await response.arrayBuffer())
    } catch (error) {
        console.error(`Unable to download product image: ${url}`, error.message)
        return null
    }
}

const prepareImages = async orderItems => {
    const images = await Promise.all(orderItems.map(async (item, index) => ({
        index,
        buffer: await downloadImage(item.image)
    })))

    return images.filter(image => image.buffer)
}

const createReceipt = async (order, productImages) => new Promise((resolve, reject) => {
    const document = new PDFDocument({ margin: 50 })
    const chunks = []

    document.on('data', chunk => chunks.push(chunk))
    document.on('end', () => resolve(Buffer.concat(chunks)))
    document.on('error', reject)

    document.fillColor('#1f2937').fontSize(22).text('BrickNation', { align: 'center' })
    document.fontSize(16).text('Official Order Receipt', { align: 'center' })
    document.moveDown()
    document.strokeColor('#d1d5db').moveTo(50, document.y).lineTo(545, document.y).stroke()
    document.moveDown()
    document.fillColor('#374151').fontSize(10)
    document.text(`Order ID: ${order._id}`)
    document.text(`Order date: ${new Date(order.createdAt || Date.now()).toLocaleString()}`)
    document.text(`Order status: ${order.orderStatus}`)
    document.moveDown()
    document.fillColor('#111827').fontSize(14).text('Order details')
    document.moveDown(0.5)

    order.orderItems.forEach((item, index) => {
        const image = productImages.find(productImage => productImage.index === index)
        const rowTop = document.y

        if (image) {
            document.image(image.buffer, 50, rowTop, { fit: [58, 58] })
        }

        document.fillColor('#111827').fontSize(10)
            .text(item.name, 120, rowTop, { width: 240 })
        document.fillColor('#4b5563').fontSize(9)
            .text(`${item.quantity} x ${money(item.price)}`, 120, rowTop + 17)
        document.fillColor('#111827').fontSize(10)
            .text(money(item.quantity * item.price), 430, rowTop + 8, { width: 100, align: 'right' })
        document.y = Math.max(rowTop + 68, document.y + 10)
    })

    document.moveDown()
    document.strokeColor('#d1d5db').moveTo(300, document.y).lineTo(545, document.y).stroke()
    document.moveDown(0.5)
    document.fillColor('#374151').fontSize(10)
        .text(`Subtotal: ${money(order.itemsPrice)}`, 330, document.y, { width: 215, align: 'right' })
        .text(`Shipping: ${money(order.shippingPrice)}`, 330, document.y, { width: 215, align: 'right' })
        .text(`Tax: ${money(order.taxPrice)}`, 330, document.y, { width: 215, align: 'right' })
    document.fillColor('#111827').fontSize(13)
        .text(`Grand total: ${money(order.totalPrice)}`, 300, document.y + 6, { width: 245, align: 'right' })
    document.end()
})

const sendOrderEmail = async (order, subject, intro) => {
    const productImages = await prepareImages(order.orderItems)
    const receipt = await createReceipt(order, productImages)
    const imageAttachments = productImages.map(image => ({
        filename: `product-${image.index + 1}.jpg`,
        content: image.buffer,
        cid: `product-${image.index}@bricknation`
    }))
    const imageByIndex = new Map(productImages.map(image => [image.index, image]))
    const itemsHtml = order.orderItems.map((item, index) => {
        const image = imageByIndex.get(index)
        const imageMarkup = image
            ? `<img src="cid:product-${index}@bricknation" alt="${escapeHtml(item.name)}" width="64" height="64" style="display:block; width:64px; height:64px; object-fit:cover; border-radius:8px;">`
            : ''

        return `
            <tr>
                <td style="padding:14px 8px; border-bottom:1px solid #e5e7eb;">${imageMarkup}</td>
                <td style="padding:14px 8px; border-bottom:1px solid #e5e7eb; color:#111827;">${escapeHtml(item.name)}</td>
                <td style="padding:14px 8px; border-bottom:1px solid #e5e7eb; text-align:center; color:#4b5563;">${item.quantity}</td>
                <td style="padding:14px 8px; border-bottom:1px solid #e5e7eb; text-align:right; color:#4b5563;">${money(item.price)}</td>
                <td style="padding:14px 8px; border-bottom:1px solid #e5e7eb; text-align:right; font-weight:600; color:#111827;">${money(item.quantity * item.price)}</td>
            </tr>`
    }).join('')

    await sendEmail({
        email: order.user.email,
        subject,
        html: `
            <div style="margin:0; padding:32px 12px; background:#f3f4f6; font-family:Arial,Helvetica,sans-serif; color:#374151;">
                <div style="max-width:680px; margin:0 auto; background:#ffffff; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden;">
                    <div style="padding:28px 32px; background:#1f2937; color:#ffffff;">
                        <div style="font-size:24px; font-weight:700; letter-spacing:.3px;">BrickNation</div>
                        <div style="margin-top:6px; font-size:13px; color:#d1d5db;">${escapeHtml(intro)}</div>
                    </div>
                    <div style="padding:28px 32px;">
                        <p style="margin:0 0 18px; font-size:15px;">Dear ${escapeHtml(order.user.name || 'Customer')},</p>
                        <p style="margin:0 0 22px; line-height:1.6;">Thank you for choosing BrickNation. Below are the details of your order.</p>
                        <div style="padding:14px 16px; background:#f9fafb; border-left:4px solid #2563eb; margin-bottom:24px;">
                            <div style="font-size:13px; color:#6b7280;">Order reference</div>
                            <div style="margin-top:4px; font-weight:700; color:#111827;">${escapeHtml(order._id)}</div>
                            <div style="margin-top:8px; font-size:13px; color:#6b7280;">Status: <strong style="color:#111827;">${escapeHtml(order.orderStatus)}</strong></div>
                        </div>
                        <table style="width:100%; border-collapse:collapse; font-size:13px;">
                            <thead>
                                <tr style="background:#f9fafb; color:#6b7280; text-align:left;">
                                    <th style="padding:10px 8px;">Image</th><th style="padding:10px 8px;">Product</th><th style="padding:10px 8px; text-align:center;">Qty</th><th style="padding:10px 8px; text-align:right;">Price</th><th style="padding:10px 8px; text-align:right;">Total</th>
                                </tr>
                            </thead>
                            <tbody>${itemsHtml}</tbody>
                        </table>
                        <div style="margin:24px 0 0 auto; max-width:280px; font-size:14px;">
                            <div style="display:flex; justify-content:space-between; padding:5px 0;">Subtotal <strong>${money(order.itemsPrice)}</strong></div>
                            <div style="display:flex; justify-content:space-between; padding:5px 0;">Shipping <strong>${money(order.shippingPrice)}</strong></div>
                            <div style="display:flex; justify-content:space-between; padding:5px 0;">Tax <strong>${money(order.taxPrice)}</strong></div>
                            <div style="display:flex; justify-content:space-between; border-top:2px solid #111827; margin-top:8px; padding:12px 0 0; font-size:17px; color:#111827;">Grand total <strong>${money(order.totalPrice)}</strong></div>
                        </div>
                        <p style="margin:28px 0 0; font-size:13px; line-height:1.6; color:#6b7280;">A formal PDF receipt is attached for your records. If you have any questions, please contact our support team.</p>
                        <p style="margin:24px 0 0;">Sincerely,<br><strong>The BrickNation Team</strong></p>
                    </div>
                    <div style="padding:18px 32px; background:#f9fafb; color:#9ca3af; font-size:11px; text-align:center;">This is an automated message. Please do not reply directly to this email.</div>
                </div>
            </div>
        `,
        attachments: [
            ...imageAttachments,
            {
                filename: `order-${order._id}.pdf`,
                content: receipt,
                contentType: 'application/pdf'
            }
        ]
    })
}

module.exports = { sendOrderEmail }
