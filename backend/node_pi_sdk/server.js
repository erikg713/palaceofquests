require('dotenv').config()
const express = require('express')
const PiNetwork = require('pi-backend')

const app = express()
app.use(express.json())

const pi = new PiNetwork(process.env.PI_API_KEY, process.env.PI_WALLET_SECRET)

app.post('/create-payment', async (req, res) => {
  const { username, amount, metadata } = req.body

  try {
    const payment = await pi.createPayment({
      amount,
      memo: `Payment from ${username}`,
      metadata
    })

    res.json(payment)
  } catch (err) {
    console.error(err)
    res.status(500).send("Error creating payment")
  }
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Pi SDK server running on port ${PORT}`))
