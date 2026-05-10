export const adminAuth = {
  // Owner password used to generate this hash:
  // AMB-Owner-2026!R7x#Kq9@L2m
  algorithm: 'PBKDF2',
  hashAlgorithm: 'SHA-256',
  iterations: 310_000,
  keyLength: 32,
  saltBase64: 'Yu+vqE/otvESjOklDdDaaw==',
  passwordHashBase64: 'WqA/m+/tVIRksckt+JH3RKHafkSwHYFDSXVui4ZJWTE=',
  sessionMinutes: 30,
  maxAttempts: 5,
  lockMinutes: 15,
} as const
