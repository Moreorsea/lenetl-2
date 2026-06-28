<template>
  <PageHeader title="Оставьте заявку и мы свяжемся с вами">
    Заявки рассматриваются в течение рабочего дня
  </PageHeader>

  <form
    class="form"
    :class="{ 'form--submitting': isSubmitting }">
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
          class="form__input"
          :class="{ 'form__input--error': errors.message }"
          rows="5"
          placeholder="Опишите ваш вопрос..."
          :disabled="isSubmitting"
          @input="errors.message = ''"></textarea>
        <span v-if="errors.message" class="form__error-text">{{ errors.message }}</span>
      </label>

      <!-- Красивое поле для файлов -->
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
.form {
  max-width: 600px;
  margin: 3rem auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  &__body {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
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
    border-radius: 12px;
    background: rgba(13, 20, 70, 0.25);
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
    gap: 0.5rem;
    width: 100%;
    font-size: 0.95rem;
    font-weight: 500;
    color: #e3f2fd;

    span {
      margin-left: 0.25rem;
    }

    &--checkbox {
      flex-direction: row;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      background: transparent;
      padding: 0;
      margin: 0;
      border-radius: 0;

      &:hover,
      &:active,
      &:focus,
      &:focus-visible {
        background: transparent;
        outline: none;
        border: none;
      }
    }

    &--error {
      .form__checkbox-text {
        color: #ffcdd2;
        text-decoration: underline;
        text-decoration-color: #ff8a80;
        text-underline-offset: 3px;
      }
    }
  }

  &__input {
    padding: 1rem;
    border-radius: 12px;
    outline: none;
    border: 1px solid rgba(100, 181, 246, 0.3);
    background: rgba(13, 20, 70, 0.6);
    color: #e3f2fd;
    font-size: 1rem;
    transition: all 0.3s ease;

    &::placeholder {
      color: rgba(227, 242, 253, 0.5);
    }

    &:hover {
      border-color: rgba(100, 181, 246, 0.5);
    }

    &:disabled {
      opacity: 0.65;
      cursor: not-allowed;
      background: rgba(13, 20, 70, 0.45);
    }

    &--error {
      border-color: #ff8a80;
      box-shadow:
        0 0 0 1px rgba(255, 138, 128, 0.5),
        0 0 12px rgba(255, 82, 82, 0.35);

      &:hover,
      &:focus {
        border-color: #ffab91;
        box-shadow:
          0 0 0 1px rgba(255, 171, 145, 0.6),
          0 0 12px rgba(255, 82, 82, 0.4);
      }
    }
  }

  textarea.form__input {
    resize: vertical;
    font-family: inherit;
  }

  &__file-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
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
    gap: 0.75rem;
    padding: 2rem;
    border: 2px dashed rgba(100, 181, 246, 0.4);
    border-radius: 16px;
    background: rgba(13, 20, 70, 0.4);
    transition: all 0.3s ease;
    cursor: pointer;

    i {
      font-size: 2.5rem;
      color: #64b5f6;
    }

    span {
      font-size: 1rem;
      color: #e3f2fd;
    }

    &:hover {
      border-color: #64b5f6;
      background: rgba(13, 20, 70, 0.6);
      transform: translateY(-2px);
    }

    &--error {
      border-color: #ff8a80;
      box-shadow:
        0 0 0 1px rgba(255, 138, 128, 0.5),
        0 0 12px rgba(255, 82, 82, 0.3);
    }

    &--drag-over {
      border-color: #64b5f6;
      background: rgba(13, 20, 70, 0.6);
      transform: translateY(-2px);
    }

    &--drag-invalid {
      border-color: rgba(239, 83, 80, 0.65);
      background: rgba(239, 83, 80, 0.08);
    }
  }

  &__file-hint {
    font-size: 0.8rem !important;
    color: rgba(227, 242, 253, 0.6) !important;
  }

  &__file-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-height: 200px;
    overflow-y: auto;
    padding: 0.5rem;
    background: rgba(13, 20, 70, 0.3);
    border-radius: 12px;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(100, 181, 246, 0.5);
      border-radius: 3px;
    }
  }

  &__file-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: rgba(25, 118, 210, 0.2);
    border-radius: 8px;
    font-size: 0.9rem;
    color: #e3f2fd;

    i {
      color: #64b5f6;
      font-size: 1rem;
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
    color: rgba(227, 242, 253, 0.6);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: all 0.2s ease;

    &:hover {
      color: #ff6b6b;
      background: rgba(255, 107, 107, 0.1);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      pointer-events: none;
    }

    i {
      font-size: 0.8rem;
    }
  }

  &__checkbox {
    width: 20px;
    height: 20px;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    background: rgba(13, 20, 70, 0.8);
    border: 2px solid #64b5f6;
    border-radius: 4px;
    position: relative;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &:checked {
      background: #64b5f6;
      border-color: #64b5f6;

      &::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #0a0f2a;
        font-size: 14px;
        font-weight: bold;
      }
    }

    &:hover {
      border-color: #90caf9;
      background: rgba(100, 181, 246, 0.2);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(100, 181, 246, 0.3);
    }

    &--error {
      border-color: #ff8a80;
      box-shadow:
        0 0 0 2px rgba(255, 138, 128, 0.45),
        0 0 10px rgba(255, 82, 82, 0.35);
    }
  }

  &__checkbox-text {
    font-size: 0.9rem;
    color: #e3f2fd;
    cursor: pointer;
    line-height: 1.4;
    user-select: none;
    transition: color 0.2s ease;

    &:hover {
      color: #90caf9;
    }
  }

  &__submit {
    margin-top: 1rem;
    padding: 1rem;
    background: linear-gradient(135deg, #64b5f6, #1976d2);
    border: none;
    border-radius: 12px;
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s ease;
    }

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(100, 181, 246, 0.4);

      &::before {
        left: 100%;
      }
    }

    &:active {
      transform: translateY(0);
    }
  }

  &__error-text {
    display: flex;
    align-items: flex-start;
    gap: 0.4rem;
    margin-top: 0.15rem;
    margin-left: 0.25rem;
    padding: 0.45rem 0.65rem;
    border-radius: 8px;
    background: rgba(183, 28, 28, 0.45);
    border: 1px solid rgba(255, 138, 128, 0.75);
    color: #fff5f5;
    font-size: 0.85rem;
    font-weight: 500;
    line-height: 1.35;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);

    &::before {
      content: '!';
      flex-shrink: 0;
      width: 1.1rem;
      height: 1.1rem;
      border-radius: 50%;
      background: #ff5252;
      color: #fff;
      font-size: 0.7rem;
      font-weight: 700;
      line-height: 1.1rem;
      text-align: center;
      text-shadow: none;
    }

    &--checkbox {
      margin-top: -0.35rem;
      margin-left: 0;
    }

    &--files {
      margin-left: 0;
    }
  }

  &__error-message {
    padding: 0.85rem 1rem;
    background: rgba(183, 28, 28, 0.5);
    border: 1px solid rgba(255, 138, 128, 0.85);
    border-radius: 12px;
    color: #fff5f5;
    font-size: 0.95rem;
    font-weight: 500;
    line-height: 1.4;
    text-align: center;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
    box-shadow: 0 4px 16px rgba(183, 28, 28, 0.25);
  }
}
</style>