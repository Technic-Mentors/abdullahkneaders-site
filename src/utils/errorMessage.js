// The backend's validation middleware (backend/src/middleware/validate.js) responds to
// every failed request with the generic `error: "Validation failed"` plus a `details`
// array of the actual field-level messages (e.g. "Provide either an addressId or
// shipping details."). Reading only `data.error` throws away the useful part.
export function getErrorMessage(err, fallback = 'Something went wrong.') {
  const data = err?.response?.data;
  if (data?.details?.length) {
    return data.details.map((detail) => detail.message).join(' ');
  }
  return data?.error || fallback;
}
