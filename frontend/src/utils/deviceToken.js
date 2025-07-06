import FingerprintJS from '@fingerprintjs/fingerprintjs';

export async function getDeviceToken() {
  const key = "deviceToken";
  const saved = localStorage.getItem(key);

  if (saved) return saved;

  const fp = await FingerprintJS.load();
  const result = await fp.get();
  const token = result.visitorId;

  localStorage.setItem(key, token);
  return token;
}
