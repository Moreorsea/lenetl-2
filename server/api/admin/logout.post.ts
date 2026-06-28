import { clearAdminSessionCookie } from '../../utils/adminAuth'

export default defineEventHandler(async (event) => {
  clearAdminSessionCookie(event)
  return { success: true }
})
