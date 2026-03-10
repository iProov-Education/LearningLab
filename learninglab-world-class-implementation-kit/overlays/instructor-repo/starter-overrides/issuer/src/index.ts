import express from 'express'
import type { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))

const PORT = Number(process.env.ISSUER_PORT || 3001)
const BASE_URL = process.env.ISSUER_BASE_URL || `http://localhost:${PORT}`
const STATUS_LIST_ID = process.env.STATUS_LIST_ID || '1'

function notImplemented(res: Response, message: string) {
  return res.status(501).json({
    error: 'not_implemented',
    message
  })
}

app.get('/.well-known/openid-credential-issuer', (_req: Request, res: Response) => {
  res.json({
    credential_issuer: BASE_URL,
    token_endpoint: `${BASE_URL}/token`,
    credential_endpoint: `${BASE_URL}/credential`,
    status_list_endpoint: `${BASE_URL}/statuslist/${STATUS_LIST_ID}.json`,
    credentials_supported: [
      {
        id: 'AgeCredential',
        format: 'vc+sd-jwt',
        scope: 'age',
        display: [{ name: 'AgeCredential', locale: 'en-US' }]
      },
      {
        id: 'AgeCredentialBBS',
        format: 'di-bbs',
        scope: 'age_bbs',
        display: [{ name: 'AgeCredentialBBS', locale: 'en-US' }]
      }
    ]
  })
})

app.get('/.well-known/jwks.json', (_req: Request, res: Response) => {
  return notImplemented(res, 'Lab 01: publish issuer signing keys')
})

app.get('/.well-known/bbs-public-key', (_req: Request, res: Response) => {
  return notImplemented(res, 'Lab 02: publish BBS public key')
})

app.post('/credential-offers', (_req: Request, res: Response) => {
  return notImplemented(res, 'Lab 01: implement pre-authorized credential offers')
})

app.post('/token', (_req: Request, res: Response) => {
  return notImplemented(res, 'Lab 01: implement token issuance for the pre-authorized flow')
})

app.post('/credential', (_req: Request, res: Response) => {
  return notImplemented(res, 'Lab 01/02/04/05: implement issuance, gating, and status')
})

app.post('/bbs/proof', (_req: Request, res: Response) => {
  return notImplemented(res, 'Lab 02: implement or expose the BBS proof helper')
})

app.get('/iproov/claim', (_req: Request, res: Response) => {
  return notImplemented(res, 'Lab 04: implement iProov claim session creation')
})

app.post('/iproov/webhook', (_req: Request, res: Response) => {
  return notImplemented(res, 'Lab 04: implement iProov webhook handling')
})

app.get('/statuslist/:id.json', (_req: Request, res: Response) => {
  return notImplemented(res, 'Lab 05: serve the Bitstring Status List')
})

app.post('/revoke/:id', (_req: Request, res: Response) => {
  return notImplemented(res, 'Lab 05: implement revocation')
})

app.get('/debug/issued', (_req: Request, res: Response) => {
  res.json({
    note: 'Students can add debug output here while building the labs'
  })
})

app.listen(PORT, () => {
  console.log(`[issuer] starter scaffold listening on ${BASE_URL}`)
})
