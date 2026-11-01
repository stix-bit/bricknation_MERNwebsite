const Product = require('../models/product')

const normalize = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

const findCatalogProduct = (name, products) => {
    const requested = normalize(name)
    return products
        .map(product => ({
            product,
            score: normalize(product.name).includes(requested) || requested.includes(normalize(product.name))
                ? 2
                : normalize(product.name).split(' ').some(word => word.length > 3 && requested.includes(word))
                    ? 1
                    : 0
        }))
        .sort((a, b) => b.score - a.score)[0]
}

exports.generateEstimate = async (req, res) => {
    const prompt = String(req.body.prompt || '').trim()
    if (!prompt) {
        return res.status(400).json({ success: false, message: 'Please describe what you want to build.' })
    }

    if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({ success: false, message: 'Bob is not configured with a Gemini API key yet.' })
    }

    try {
        const products = await Product.find({ isArchived: { $ne: true } })
            .select('name price stock images')
            .lean()
        const catalog = products.map(product => product.name).join('\n')
        const configuredModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash'
        const models = [...new Set([
            configuredModel,
            'gemini-3.5-flash',
            'gemini-3.5-flash-lite',
            'gemini-3.8-flash',
            'gemini-2.5-flash-lite'
        ])]
        const requestBody = {
                systemInstruction: {
                    parts: [{
                        text: `You are Bob the Builder, a practical construction materials assistant for a Philippine hardware store.
Estimate rough material quantities from the user's project description. Use only materials that can be matched to the catalog.
Return JSON only in this shape: {"message":"brief explanation","materials":[{"name":"exact catalog product name","quantity":1}]}.
Keep materials to at most 8 items, quantities must be whole numbers from 1 to 1000, and clearly state that estimates are approximate.
Catalog:
${catalog}`
                    }]
                },
                contents: [{
                    role: 'user',
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.2,
                    responseMimeType: 'application/json'
                }
            }
        let response
        let model = configuredModel

        for (const candidate of models) {
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${candidate}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`
            response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            })
            model = candidate
            if (response.ok) break
        }

        if (!response.ok) {
            const details = await response.text()
            console.error('Gemini Bob request failed:', response.status, details)
            if (response.status === 401 || response.status === 403) {
                return res.status(502).json({ success: false, message: 'Bob could not authenticate with Gemini. Check GEMINI_API_KEY.' })
            }
            if (response.status === 404) {
                return res.status(502).json({ success: false, message: 'Bob could not find an available Gemini generation model. Check GEMINI_MODEL and your Gemini API access.' })
            }
            if (response.status === 429) {
                return res.status(502).json({ success: false, message: 'Bob has reached the Gemini usage limit. Please try again later.' })
            }
            if (response.status === 503) {
                return res.status(502).json({ success: false, message: 'The selected Gemini model is temporarily unavailable. Please try again shortly.' })
            }
            return res.status(502).json({ success: false, message: 'Gemini rejected Bob’s request. Check the backend configuration.' })
        }

        const payload = await response.json()
        const responseText = payload.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
        if (!responseText || responseText === '{}') {
            return res.status(502).json({ success: false, message: 'Gemini returned an empty response. Please try a more detailed project description.' })
        }
        const result = JSON.parse(responseText)
        const materials = Array.isArray(result.materials) ? result.materials : []
        const recommendations = materials
            .map(material => {
                const match = findCatalogProduct(material.name, products)
                const quantity = Math.min(1000, Math.max(1, Math.round(Number(material.quantity) || 1)))
                return match?.score > 0
                    ? { product: match.product, quantity }
                    : null
            })
            .filter(Boolean)

        return res.status(200).json({
            success: true,
            message: result.message || 'Here is a rough materials estimate for your project.',
            recommendations
        })
    } catch (error) {
        console.error('Bob estimate failed:', error.message)
        return res.status(502).json({ success: false, message: 'Bob could not create an estimate right now.' })
    }
}
