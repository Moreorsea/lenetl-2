export type ToastType = 'success' | 'error' | 'info'

export type ToastItem = {
  id: number
  message: string
  type: ToastType
}

export function useToast() {
  const toasts = useState<ToastItem[]>('toasts', () => [])

  const dismissToast = (id: number) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  const showToast = (
    message: string,
    type: ToastType = 'success',
    duration = 5000,
  ) => {
    const id = Date.now() + Math.random()
    toasts.value.push({ id, message, type })

    if (duration > 0) {
      setTimeout(() => dismissToast(id), duration)
    }
  }

  return {
    toasts,
    showToast,
    dismissToast,
  }
}
