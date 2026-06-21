const EMAIL_REGEX = /^[^\s@]+@([^\s@]+\.)+[^\s@]{2,}$/i;

/** Российский номер: 10 цифр или 11 с кодом 7/8. */
export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');

  if (digits.length === 11) {
    const normalized = digits.startsWith('8') ? `7${digits.slice(1)}` : digits;
    return /^7\d{10}$/.test(normalized);
  }

  if (digits.length === 10) {
    return /^\d{10}$/.test(digits);
  }

  return false;
}

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export const MAX_FORM_FILES = 3;
export const MAX_FORM_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 МБ

export const MAX_FILES_HINT = 'Не более 3 файлов, до 15 МБ каждый';

export const MAX_FILES_MESSAGE =
  'Можно приложить не более 3 файлов размером до 15 МБ каждый.';

export function getFileTooLargeMessage(fileName: string): string {
  return `Файл «${fileName}» превышает 15 МБ. Загрузите его на Яндекс.Диск или другой файлообменник и укажите ссылку в поле «Сообщение или вопрос».`;
}

export type FileLike = { name: string; size: number };

/** Проверка списка файлов перед отправкой (клиент и сервер). */
export function validateFormFiles(files: FileLike[]): string | null {
  if (files.length > MAX_FORM_FILES) {
    return MAX_FILES_MESSAGE;
  }

  for (const file of files) {
    if (file.size > MAX_FORM_FILE_SIZE_BYTES) {
      return getFileTooLargeMessage(file.name);
    }
  }

  return null;
}

/**
 * Добавляет файлы к уже выбранным: пропускает слишком большие, не больше 3 всего.
 * Возвращает текст ошибки, если что-то отклонено.
 */
export function mergeFormFiles<T extends FileLike>(
  current: T[],
  incoming: T[],
): { files: T[]; error: string | null } {
  const next = [...current];
  let error: string | null = null;

  for (const file of incoming) {
    if (file.size > MAX_FORM_FILE_SIZE_BYTES) {
      error = getFileTooLargeMessage(file.name);
      continue;
    }

    if (next.length >= MAX_FORM_FILES) {
      error = error ?? MAX_FILES_MESSAGE;
      break;
    }

    next.push(file);
  }

  return { files: next, error };
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');

  if (digits.length === 11 && digits.startsWith('8')) {
    return `+7${digits.slice(1)}`;
  }

  if (digits.length === 11 && digits.startsWith('7')) {
    return `+${digits}`;
  }

  if (digits.length === 10) {
    return `+7${digits}`;
  }

  return phone.trim();
}
