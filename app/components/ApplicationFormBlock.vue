<template>
  <section
    id="form"
    class="form-page">
    <div class="form-page__media" aria-hidden="true">
      <NuxtImg
        class="form-page__image"
        src="images/miko10.jpg"
        alt=""
        format="webp"
        quality="90" />
    </div>

    <div class="form-page__content">
      <form
        class="form"
        :class="{ 'form--submitting': isSubmitting }">
        <div class="form__header">
          <h2 class="form__title">Оставьте заявку</h2>
          <p class="form__lead">Быстрый способ обсудить детали. Заявки рассматриваются в течение рабочего дня.</p>
        </div>

        <div
          class="form__body"
          :aria-busy="isSubmitting">
          <label class="form__label">
            <span>Как к вам обращаться *</span>
            <input
              v-model="formData.name"
              class="form__input"
              :class="{ 'form__input--error': errors.name }"
              type="text"
              placeholder="Имя, фамилия"
              :disabled="isSubmitting"
              @input="errors.name = ''" />
            <span v-if="errors.name" class="form__error-text">{{ errors.name }}</span>
          </label>

          <label class="form__label">
            <span>Ваш телефон *</span>
            <input
              :value="formData.phone"
              class="form__input"
              :class="{ 'form__input--error': errors.phone }"
              type="tel"
              inputmode="tel"
              autocomplete="tel"
              placeholder="+7 (___) ___-__-__"
              :disabled="isSubmitting"
              @input="onPhoneInput" />
            <span v-if="errors.phone" class="form__error-text">{{ errors.phone }}</span>
          </label>

          <label class="form__label">
            <span>Ваш e-mail *</span>
            <input
              v-model="formData.email"
              class="form__input"
              :class="{ 'form__input--error': errors.email }"
              type="email"
              placeholder="example@mail.ru"
              :disabled="isSubmitting"
              @input="errors.email = ''" />
            <span v-if="errors.email" class="form__error-text">{{ errors.email }}</span>
          </label>

          <label class="form__label">
            <span>Сообщение или вопрос *</span>
            <textarea
              v-model="formData.message"
              class="form__input form__input--textarea"
              :class="{ 'form__input--error': errors.message }"
              rows="4"
              placeholder="Опишите ваш вопрос..."
              :disabled="isSubmitting"
              @input="errors.message = ''"></textarea>
            <span v-if="errors.message" class="form__error-text">{{ errors.message }}</span>
          </label>

          <div class="form__file-wrapper">
            <label
              class="form__file-label"
              :class="{
                'form__file-label--disabled': isSubmitting,
                'form__file-label--error': errors.files,
              }">
              <input
                type="file"
                class="form__file-input"
                multiple
                :accept="ALLOWED_FILE_ACCEPT"
                :disabled="isSubmitting"
                @change="handleFileChange" />
              <div
                class="form__file-content"
                :class="{
                  'form__file-content--error': errors.files,
                  'form__file-content--drag-over': isDragOver && !isDragInvalid,
                  'form__file-content--drag-invalid': isDragOver && isDragInvalid,
                }"
                @dragenter.prevent="onDragEnter"
                @dragover.prevent="onDragOver"
                @dragleave="onDragLeave"
                @drop.prevent="onDrop">
                <i class="fas fa-cloud-upload-alt"></i>
                <span>Приложить файлы</span>
                <span class="form__file-hint">({{ ALLOWED_FILE_TYPES_HINT }} — {{ MAX_FILES_HINT }})</span>
              </div>
            </label>
            <span v-if="errors.files" class="form__error-text form__error-text--files">{{ errors.files }}</span>
            <div
              v-if="files.length > 0"
              class="form__file-list">
              <div
                v-for="(file, index) in files"
                :key="index"
                class="form__file-item">
                <i class="fas fa-file"></i>
                <span>{{ file.name }}</span>
                <button
                  type="button"
                  class="form__file-remove"
                  :disabled="isSubmitting"
                  @click="removeFile(index)">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>

          <label
            class="form__label form__label--checkbox"
            :class="{ 'form__label--error': errors.consent }">
            <input
              v-model="formData.consent"
              type="checkbox"
              class="form__checkbox"
              :class="{ 'form__checkbox--error': errors.consent }"
              :disabled="isSubmitting"
              @change="errors.consent = ''" />
            <span class="form__checkbox-text">
              Я согласен на обработку персональных данных *
            </span>
          </label>
          <span v-if="errors.consent" class="form__error-text form__error-text--checkbox">{{ errors.consent }}</span>

          <button
            type="button"
            class="form__submit"
            :disabled="isSubmitting"
            @click="handleSubmit">
            <span v-if="!isSubmitting">Отправить заявку</span>
            <span
              v-else
              class="form__submit-loading">
              <i class="fas fa-spinner fa-spin"></i>
              Отправка...
            </span>
          </button>

          <div
            v-if="isSubmitting"
            class="form__overlay"
            aria-hidden="true" />
        </div>

        <div v-if="errorMessage" class="form__error-message">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  </section>
</template>

<script lang="ts" setup>
const { showToast } = useToast();
const files = ref<File[]>([]);
const isSubmitting = ref(false);
const isDragOver = ref(false);
const isDragInvalid = ref(false);
const errorMessage = ref('');

const formData = reactive({
  name: '',
  phone: '',
  email: '',
  message: '',
  consent: false,
});

const errors = reactive({
  name: '',
  phone: '',
  email: '',
  message: '',
  files: '',
  consent: '',
});

type SubmissionResponse = {
  success: boolean;
  message?: string;
};

/** Текст ошибки из ответа API ($fetch бросает при statusCode >= 400). */
const getSubmitErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: { message?: string; statusMessage?: string } }).data;
    if (data?.message) return data.message;
    if (data?.statusMessage) return data.statusMessage;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return 'Ошибка соединения с сервером. Попробуйте позже.';
};

const validateForm = () => {
  let isValid = true;

  errors.name = '';
  errors.phone = '';
  errors.email = '';
  errors.message = '';
  errors.files = '';
  errors.consent = '';

  const filesError = validateFormFiles(files.value);
  if (filesError) {
    errors.files = filesError;
    isValid = false;
  }

  if (!formData.name.trim()) {
    errors.name = 'Пожалуйста, укажите ваше имя';
    isValid = false;
  }

  if (!formData.phone.trim()) {
    errors.phone = 'Пожалуйста, укажите номер телефона';
    isValid = false;
  } else if (!isValidPhone(formData.phone)) {
    errors.phone = PHONE_MASK_ERROR;
    isValid = false;
  }

  const emailError = getEmailValidationError(formData.email);
  if (emailError) {
    errors.email = emailError;
    isValid = false;
  }

  if (!formData.message.trim()) {
    errors.message = 'Пожалуйста, опишите ваш вопрос или сообщение';
    isValid = false;
  }

  if (!formData.consent) {
    errors.consent = 'Необходимо согласие на обработку персональных данных';
    isValid = false;
  }

  return isValid;
};

const onPhoneInput = (event: Event) => {
  errors.phone = '';
  const target = event.target as HTMLInputElement;
  formData.phone = formatPhoneMask(target.value);
};

const addFiles = (incoming: File[]) => {
  const { files: nextFiles, error } = mergeFormFiles(files.value, incoming);
  files.value = nextFiles;
  errors.files = error ?? '';
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  addFiles(Array.from(target.files || []));
  target.value = '';
};

const onDragEnter = (event: DragEvent) => {
  if (isSubmitting.value || !event.dataTransfer?.types.includes('Files')) return;
  isDragOver.value = true;
  updateDragValidity(event);
};

const onDragOver = (event: DragEvent) => {
  if (isSubmitting.value || !event.dataTransfer?.types.includes('Files')) return;
  isDragOver.value = true;
  updateDragValidity(event);
};

const onDragLeave = (event: DragEvent) => {
  const currentTarget = event.currentTarget as HTMLElement;
  const relatedTarget = event.relatedTarget as Node | null;
  if (relatedTarget && currentTarget.contains(relatedTarget)) return;

  isDragOver.value = false;
  isDragInvalid.value = false;
};

const onDrop = (event: DragEvent) => {
  isDragOver.value = false;
  isDragInvalid.value = false;

  if (isSubmitting.value) return;

  const droppedFiles = Array.from(event.dataTransfer?.files ?? []);
  if (!droppedFiles.length) return;

  addFiles(droppedFiles);
};

const updateDragValidity = (event: DragEvent) => {
  const allowed = isDragEventAllowed(event);
  isDragInvalid.value = allowed === false;
};

const removeFile = (index: number) => {
  files.value.splice(index, 1);
  errors.files = validateFormFiles(files.value) ?? '';
};

const handleSubmit = async () => {
  errorMessage.value = '';

  if (!validateForm()) {
    errorMessage.value = 'Пожалуйста, исправьте ошибки в форме';
    return;
  }

  isSubmitting.value = true;

  try {
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name.trim());
    formDataToSend.append('phone', normalizePhone(formData.phone));
    formDataToSend.append('email', formData.email.trim());
    formDataToSend.append('message', formData.message.trim());
    formDataToSend.append('consent', String(formData.consent));

    files.value.forEach(file => {
      formDataToSend.append('files', file);
    });

    const result = await $fetch<SubmissionResponse>('/api/submissions', {
      method: 'POST',
      body: formDataToSend,
    });
    if (result.success) {
      showToast(
        result.message || 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
        'success',
      );
      formData.name = '';
      formData.phone = '';
      formData.email = '';
      formData.message = '';
      formData.consent = false;
      files.value = [];
    } else {
      errorMessage.value = result.message || 'Произошла ошибка при отправке';
    }
  } catch (error) {
    console.error('Ошибка отправки:', error);
    errorMessage.value = getSubmitErrorMessage(error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style lang="scss" scoped>
.form-page {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(320px, 520px);
  gap: 32px;
  align-items: stretch;
  min-height: 640px;
  margin: 0 0 40px;
  padding: 24px 0 40px;
  overflow: hidden;
  scroll-margin-top: 96px;

  @media (max-width: 900px) {
    display: block;
    min-height: auto;
    padding: 16px 0 40px;
  }
}

.form-page__media {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 520px;
  background: var(--lenet-bg);
  padding: 24px;
  overflow: hidden;

  @media (max-width: 900px) {
    position: absolute;
    inset: 0;
    z-index: 0;
    min-height: 0;
    padding: 0;
    pointer-events: none;
  }
}

.form-page__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;

  @media (max-width: 900px) {
    object-fit: cover;
    object-position: center;
    filter: blur(12px);
    transform: scale(1.08);
  }
}

.form-page__content {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;

  @media (max-width: 900px) {
    position: relative;
    z-index: 1;
    justify-content: center;
  }
}

.form {
  width: 100%;
  max-width: 520px;
  margin: 0;
  padding: 36px 32px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background: #ffffff;
  box-shadow: 0 18px 48px rgba(13, 27, 42, 0.12);
  border: 1px solid rgba(13, 27, 42, 0.06);

  @media (max-width: 480px) {
    padding: 24px 18px;
  }

  &__header {
    margin-bottom: 0.25rem;
  }

  &__title {
    margin: 0 0 10px;
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.25;
    color: var(--lenet-body-text);
  }

  &__lead {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.5;
    color: var(--lenet-text-muted);
  }

  &__body {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 1.15rem;
  }

  &--submitting {
    .form__input:disabled,
    .form__checkbox:disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }

    .form__label--checkbox {
      cursor: not-allowed;
    }

    .form__checkbox-text {
      cursor: not-allowed;
      opacity: 0.65;
    }
  }

  &__overlay {
    position: absolute;
    inset: 0;
    z-index: 2;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.45);
    backdrop-filter: blur(1px);
    cursor: wait;
  }

  &__submit-loading {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  &__label {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    width: 100%;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--lenet-body-text);

    &--checkbox {
      flex-direction: row;
      align-items: flex-start;
      gap: 0.75rem;
      cursor: pointer;
      background: transparent;
      padding: 0;
      margin: 0;
      font-weight: 500;
    }

    &--error {
      .form__checkbox-text {
        color: #c62828;
      }
    }
  }

  &__input {
    padding: 0.9rem 1rem;
    border-radius: 6px;
    outline: none;
    border: 1px solid rgba(13, 27, 42, 0.12);
    background: #f5f7f9;
    color: var(--lenet-body-text);
    font-size: 1rem;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

    &::placeholder {
      color: rgba(13, 27, 42, 0.4);
    }

    &:hover {
      border-color: rgba(13, 27, 42, 0.22);
    }

    &:focus {
      border-color: var(--lenet-accent);
      background: #fff;
      box-shadow: 0 0 0 3px rgba(255, 183, 3, 0.18);
    }

    &:disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }

    &--textarea {
      resize: vertical;
      font-family: inherit;
      min-height: 110px;
    }

    &--error {
      border-color: #ef5350;
      box-shadow: 0 0 0 3px rgba(239, 83, 80, 0.12);
    }
  }

  &__file-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__file-label {
    cursor: pointer;
    display: block;

    &--disabled {
      opacity: 0.65;
      cursor: not-allowed;
      pointer-events: none;
    }
  }

  &__file-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  &__file-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1.25rem 1rem;
    border: 1.5px dashed rgba(13, 27, 42, 0.18);
    border-radius: 8px;
    background: #f5f7f9;
    transition: border-color 0.2s ease, background 0.2s ease;
    cursor: pointer;

    i {
      font-size: 1.6rem;
      color: var(--lenet-accent);
    }

    span {
      font-size: 0.95rem;
      color: var(--lenet-body-text);
      font-weight: 500;
    }

    &:hover {
      border-color: var(--lenet-accent);
      background: rgba(255, 183, 3, 0.06);
    }

    &--error {
      border-color: #ef5350;
    }

    &--drag-over {
      border-color: var(--lenet-accent);
      background: rgba(255, 183, 3, 0.08);
    }

    &--drag-invalid {
      border-color: rgba(239, 83, 80, 0.65);
      background: rgba(239, 83, 80, 0.06);
    }
  }

  &__file-hint {
    font-size: 0.78rem !important;
    color: rgba(13, 27, 42, 0.5) !important;
    font-weight: 400 !important;
  }

  &__file-list {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    max-height: 180px;
    overflow-y: auto;
  }

  &__file-item {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.65rem 0.75rem;
    background: #f5f7f9;
    border-radius: 6px;
    font-size: 0.88rem;
    color: var(--lenet-body-text);

    i {
      color: var(--lenet-accent);
    }

    span {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &__file-remove {
    background: none;
    border: none;
    color: rgba(13, 27, 42, 0.45);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: color 0.2s ease, background 0.2s ease;

    &:hover {
      color: #c62828;
      background: rgba(198, 40, 40, 0.08);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      pointer-events: none;
    }
  }

  &__checkbox {
    width: 20px;
    height: 20px;
    margin-top: 2px;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    background: #fff;
    border: 2px solid rgba(13, 27, 42, 0.25);
    border-radius: 4px;
    position: relative;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &:checked {
      background: var(--lenet-accent);
      border-color: var(--lenet-accent);

      &::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        font-size: 13px;
        font-weight: 700;
      }
    }

    &:hover {
      border-color: var(--lenet-accent);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(255, 183, 3, 0.22);
    }

    &--error {
      border-color: #ef5350;
    }
  }

  &__checkbox-text {
    font-size: 0.88rem;
    color: var(--lenet-text-muted);
    cursor: pointer;
    line-height: 1.45;
    user-select: none;
  }

  &__submit {
    margin-top: 0.35rem;
    padding: 0.95rem 1.25rem;
    background: var(--lenet-accent);
    border: none;
    border-radius: 6px;
    color: #1a1a1a;
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      filter: brightness(0.96);
      box-shadow: 0 8px 20px rgba(255, 183, 3, 0.35);
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  }

  &__error-text {
    display: block;
    margin-top: 0.1rem;
    color: #c62828;
    font-size: 0.82rem;
    font-weight: 500;
    line-height: 1.35;

    &--checkbox,
    &--files {
      margin-top: -0.35rem;
    }
  }

  &__error-message {
    padding: 0.85rem 1rem;
    background: rgba(198, 40, 40, 0.08);
    border: 1px solid rgba(198, 40, 40, 0.25);
    border-radius: 8px;
    color: #c62828;
    font-size: 0.92rem;
    font-weight: 500;
    line-height: 1.4;
    text-align: center;
  }
}
</style>
