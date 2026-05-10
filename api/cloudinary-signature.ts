import { createHash } from 'node:crypto'

type VercelRequest = {
  method?: string
}

type VercelResponse = {
  status: (code: number) => VercelResponse
  json: (data: unknown) => void
  setHeader: (name: string, value: string) => void
}

function signParams(params: Record<string, string | number>, apiSecret: string): string {
  const serialized = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&')

  return createHash('sha1')
    .update(`${serialized}${apiSecret}`)
    .digest('hex')
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'POST') {
    res.status(405).json({ error: { message: 'Method Not Allowed' } })
    return
  }

  const apiKey = process.env.CLOUDINARY_API_KEY?.trim() ?? ''
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim() ?? ''
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET?.trim() ?? ''
  const folder = process.env.CLOUDINARY_FOLDER?.trim() ?? ''

  if (!apiKey || !apiSecret || !uploadPreset) {
    res.status(500).json({
      error: {
        message:
          'Cloudinary server config manquante. Ajoutez CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET et CLOUDINARY_UPLOAD_PRESET.',
      },
    })
    return
  }

  const timestamp = Math.floor(Date.now() / 1000)
  const paramsToSign: Record<string, string | number> = {
    timestamp,
    upload_preset: uploadPreset,
  }
  if (folder) paramsToSign.folder = folder

  const signature = signParams(paramsToSign, apiSecret)

  res.status(200).json({
    signature,
    timestamp,
    apiKey,
    uploadPreset,
    folder: folder || undefined,
  })
}
