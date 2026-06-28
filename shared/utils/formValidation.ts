const EMAIL_REGEX = /^[^\s@]+@([^\s@]+\.)+[^\s@]{2,}$/i;
const ALLOWED_EMAIL_TLD_REGEX = /\.(com|ru)$/i;

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
  const trimmed = email.trim();
  if (!EMAIL_REGEX.test(trimmed)) return false;

  const domain = trimmed.split('@')[1]?.toLowerCase() ?? '';
  return ALLOWED_EMAIL_TLD_REGEX.test(domain);
}

export const EMAIL_DOMAIN_ERROR =
  'Укажите email с доменом .com или .ru (например, mail.ru, gmail.com)';

/** Маска: +7 (999) 123-45-67 */
export function formatPhoneMask(input: string): string {
  let digits = input.replace(/\D/g, '');

  if (!digits.length) return '';

  if (digits.startsWith('8')) {
    digits = `7${digits.slice(1)}`;
  } else if (!digits.startsWith('7')) {
    digits = `7${digits}`;
  }

  digits = digits.slice(0, 11);
  const local = digits.slice(1);

  let formatted = '+7';

  if (local.length > 0) {
    formatted += ` (${local.slice(0, 3)}`;
  }

  if (local.length >= 3) {
    formatted += `) ${local.slice(3, 6)}`;
  }

  if (local.length >= 6) {
    formatted += `-${local.slice(6, 8)}`;
  }

  if (local.length >= 8) {
    formatted += `-${local.slice(8, 10)}`;
  }

  return formatted;
}

export const PHONE_MASK_ERROR = 'Укажите номер в формате +7 (999) 123-45-67';

export function getEmailValidationError(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) return 'Пожалуйста, укажите email';
  if (!EMAIL_REGEX.test(trimmed)) return 'Пожалуйста, укажите корректный email';

  const domain = trimmed.split('@')[1]?.toLowerCase() ?? '';
  if (!ALLOWED_EMAIL_TLD_REGEX.test(domain)) return EMAIL_DOMAIN_ERROR;

  return null;
}

export const MAX_FORM_FILES = 3;
export const MAX_FORM_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 МБ

export const ALLOWED_FILE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'] as const;
export const ALLOWED_FILE_ACCEPT = '.jpg,.jpeg,.png,.pdf,.doc,.docx';
export const ALLOWED_FILE_TYPES_HINT = 'jpg, png, pdf, doc';

export const ALLOWED_FILE_MIMES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

export const MAX_FILES_HINT = 'Не более 3 файлов, до 15 МБ каждый';

export const MAX_FILES_MESSAGE =
  'Можно приложить не более 3 файлов размером до 15 МБ каждый.';

export function getFileTooLargeMessage(fileName: string): string {
  return `Файл «${fileName}» превышает 15 МБ. Загрузите его на Яндекс.Диск или другой файлообменник и укажите ссылку в поле «Сообщение или вопрос».`;
}

export function getInvalidFileTypeMessage(fileName: string): string {
  return `Файл «${fileName}» не поддерживается. Разрешены форматы: ${ALLOWED_FILE_TYPES_HINT}.`;
}

export type FileLike = { name: string; size: number; type?: string };

export function isAllowedFormFile(file: { name: string; type?: string }): boolean {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  if ((ALLOWED_FILE_EXTENSIONS as readonly string[]).includes(extension)) {
    return true;
  }

  if (file.type && (ALLOWED_FILE_MIMES as readonly string[]).includes(file.type)) {
    return true;
  }

  return false;
}

/** null — типы файлов пока неизвестны (до drop). */
export function isDragEventAllowed(event: DragEvent): boolean | null {
  const items = Array.from(event.dataTransfer?.items ?? []).filter(
    (item) => item.kind === 'file',
  );

  if (!items.length) return null;

  const types = items.map((item) => item.type).filter(Boolean);
  if (!types.length) return null;

  return types.every((type) => (ALLOWED_FILE_MIMES as readonly string[]).includes(type));
}

/** Проверка списка файлов перед отправкой (клиент и сервер). */
export function validateFormFiles(files: FileLike[]): string | null {
  if (files.length > MAX_FORM_FILES) {
    return MAX_FILES_MESSAGE;
  }

  for (const file of files) {
    if (!isAllowedFormFile(file)) {
      return getInvalidFileTypeMessage(file.name);
    }

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
    if (!isAllowedFormFile(file)) {
      error = getInvalidFileTypeMessage(file.name);
      continue;
    }

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
