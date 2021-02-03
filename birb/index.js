const axios = require('axios')
const nacl = require('tweetnacl')
exports.birb = async (req, res) => {
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
  try {
    const imglist = await axios('https://random.birb.pw/img/', { responseType: 'text' })
    const images = imglist.data.match(/\/img\/\S[^.<]*\.[A-z]*/g)
    const index = Math.round(Math.random() * (images.length - 1))
    res.json({ type: 4 , data: { content: `https://random.birb.pw${images[index]}`} })
  } catch (e) {
    console.error(e)
    return res.sendStatus(500)
  }
}
