import { requireAdminSession } from '../../../utils/adminAuth'
import {
  permanentlyDeleteSubmission,
  softDeleteSubmission,
} from '../../../utils/submissionDelete'

export default defineEventHandler(async (event) => {
  requireAdminSession(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, message: 'Некорректный ID заявки' })
  }

  const query = getQuery(event)
  const permanent = query.permanent === 'true' || query.permanent === '1'

  if (permanent) {
    await permanentlyDeleteSubmission(id)
    return {
      success: true,
      message: 'Заявка удалена навсегда, сведения сохранены в истории',
    }
  }

  await softDeleteSubmission(id)

  return {
    success: true,
    message: 'Заявка перемещена в удалённые',
  }
})
