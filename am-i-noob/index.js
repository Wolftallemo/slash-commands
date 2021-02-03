const nacl = require('tweetnacl')
exports.noob = (req, res) => {
  const signature = req.get('X-Signature-Ed25519')
  const timestamp = req.get('X-Signature-Timestamp')
  // Set the PKEY runtime environment variable to your app's public key, see https://discord.dev
  const verified = nacl.sign.detached.verify(
    Buffer.from(timestamp + req.rawBody),
    Buffer.from(signature, 'hex'),
    Buffer.from(process.env.PKEY, 'hex')
  )
  if (!verified) return res.sendStatus(401)
  if (req.body.type === 1) return res.json({ type: 1 })
  const val = Math.round(Math.random())
  if (val === 1) return res.json({ type: 4, data: { content: 'You are a noob' } })
  res.json({ type: 4, data: { content: 'You are not a noob' } })
}
