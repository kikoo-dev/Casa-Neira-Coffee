import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const PAKASIR_API_KEY = process.env.PAKASIR_API_KEY
const PAKASIR_SLUG = process.env.PAKASIR_SLUG
const PAKASIR_BASE_URL = process.env.PAKASIR_BASE_URL || 'https://app.pakasir.com'

app.use(cors())
app.use(express.json())

// Create QRIS transaction via Pakasir API
app.post('/api/qris-create', async (req, res) => {
  try {
    const { amount, order_id } = req.body

    if (!amount || !order_id) {
      return res.status(400).json({ error: 'Missing required fields: amount, order_id' })
    }

    const response = await fetch(`${PAKASIR_BASE_URL}/api/transactioncreate/qris`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project: PAKASIR_SLUG,
        order_id,
        amount,
        api_key: PAKASIR_API_KEY,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Pakasir API error:', data)
      return res.status(response.status).json({ error: 'Pakasir API error', details: data })
    }

    res.json({
      success: true,
      data: data.payment,
      message: 'QRIS created successfully',
    })
  } catch (error) {
    console.error('QRIS creation error:', error)
    res.status(500).json({ error: 'Failed to create QRIS' })
  }
})

// Check payment status via Pakasir API
app.get('/api/qris-status', async (req, res) => {
  try {
    const { order_id, amount } = req.query

    if (!order_id || !amount) {
      return res.status(400).json({ error: 'Missing order_id or amount' })
    }

    const url = `${PAKASIR_BASE_URL}/api/transactiondetail?project=${PAKASIR_SLUG}&amount=${amount}&order_id=${order_id}&api_key=${PAKASIR_API_KEY}`

    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      console.error('Pakasir status error:', data)
      return res.status(response.status).json({ error: 'Pakasir API error', details: data })
    }

    res.json({
      success: true,
      data: data.transaction,
      message: 'Payment status retrieved',
    })
  } catch (error) {
    console.error('QRIS status error:', error)
    res.status(500).json({ error: 'Failed to check payment status' })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Casa Neira Coffee QRIS API', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Casa Neira server running on http://localhost:${PORT}`)
})
