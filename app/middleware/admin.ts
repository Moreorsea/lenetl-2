export default defineNuxtRouteMiddleware(async () => {
  const requestFetch = useRequestFetch()

  try {
    await requestFetch('/api/admin/session')
  } catch {
    return navigateTo('/admin')
  }
})
