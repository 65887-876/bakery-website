const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim() ?? ''
const unsignedUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim() ?? ''

export const cloudinaryConfig = {
  cloudName,
} as const

export function isCloudinaryConfigured(): boolean {
  return Boolean(cloudName)
}

type CloudinaryUploadSuccess = {
  secure_url?: string
}

type CloudinaryUploadError = {
  error?: {
    message?: string
  }
}

type SignaturePayload = {
  signature: string
  timestamp: number
  apiKey: string
  uploadPreset: string
  folder?: string
}

async function getSignedUploadParams(): Promise<SignaturePayload> {
  const response = await fetch('/api/cloudinary-signature', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  })

  let payload: (SignaturePayload & CloudinaryUploadError) | null = null
  try {
    payload = (await response.json()) as SignaturePayload & CloudinaryUploadError
  } catch {
    // Some dev servers return HTML for missing routes.
    payload = null
  }

  if (!payload) {
    throw new Error('Signature Cloudinary indisponible sur ce serveur.')
  }

  if (!response.ok || !payload.signature || !payload.timestamp || !payload.apiKey || !payload.uploadPreset) {
    throw new Error(payload.error?.message ?? 'Impossible de signer l upload Cloudinary.')
  }

  return payload
}

async function uploadToCloudinary(
  file: File,
  params: {
    uploadPreset: string
    apiKey?: string
    timestamp?: number
    signature?: string
    folder?: string
  },
): Promise<string> {
  const body = new FormData()
  body.append('file', file)
  body.append('upload_preset', params.uploadPreset)
  if (params.apiKey) body.append('api_key', params.apiKey)
  if (params.timestamp) body.append('timestamp', String(params.timestamp))
  if (params.signature) body.append('signature', params.signature)
  if (params.folder) body.append('folder', params.folder)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
    {
      method: 'POST',
      body,
    },
  )

  const payload = (await response.json()) as CloudinaryUploadSuccess & CloudinaryUploadError

  if (!response.ok || !payload.secure_url) {
    throw new Error(payload.error?.message ?? 'Echec upload Cloudinary.')
  }

  return payload.secure_url
}

export async function uploadImageToCloudinary(file: File): Promise<string> {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary non configure. Ajoutez VITE_CLOUDINARY_CLOUD_NAME.')
  }

  try {
    const signed = await getSignedUploadParams()
    return await uploadToCloudinary(file, {
      uploadPreset: signed.uploadPreset,
      apiKey: signed.apiKey,
      timestamp: signed.timestamp,
      signature: signed.signature,
      folder: signed.folder,
    })
  } catch (signedError) {
    if (!unsignedUploadPreset) {
      const message = signedError instanceof Error ? signedError.message : 'Echec upload Cloudinary.'
      throw new Error(`${message} Ajoutez VITE_CLOUDINARY_UPLOAD_PRESET pour fallback local.`)
    }

    return uploadToCloudinary(file, {
      uploadPreset: unsignedUploadPreset,
    })
  }
}
