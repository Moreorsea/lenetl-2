<template>
  <section class="form-header">
    <h1>Оставьте заявку и мы свяжемся с вами</h1>
    <p>Заявки рассматриваются в течение рабочего дня</p>
  </section>

  <form class="form">
    <label class="form__label">
      <span>Как к вам обращаться *</span>
      <input
        v-model="formData.name"
        class="form__input"
        type="text"
        placeholder="Имя, фамилия" />
      <span v-if="errors.name" class="form__error-text">{{ errors.name }}</span>
    </label>

    <label class="form__label">
      <span>Ваш телефон *</span>
      <input
        v-model="formData.phone"
        class="form__input"
        type="tel"
        placeholder="+7 (___) ___-__-__" />
      <span v-if="errors.phone" class="form__error-text">{{ errors.phone }}</span>
    </label>

    <label class="form__label">
      <span>Ваш e-mail *</span>
      <input
        v-model="formData.email"
        class="form__input"
        type="email"
        placeholder="example@mail.ru" />
      <span v-if="errors.email" class="form__error-text">{{ errors.email }}</span>
    </label>

    <label class="form__label">
      <span>Сообщение или вопрос *</span>
      <textarea
        v-model="formData.message"
        class="form__input"
        rows="5"
        placeholder="Опишите ваш вопрос..."></textarea>
      <span v-if="errors.message" class="form__error-text">{{ errors.message }}</span>
    </label>

    <!-- Красивое поле для файлов -->
    <div class="form__file-wrapper">
      <label class="form__file-label">
        <input
          type="file"
          class="form__file-input"
          multiple
          @change="handleFileChange" />
        <div class="form__file-content">
          <i class="fas fa-cloud-upload-alt"></i>
          <span>Приложить файлы</span>
          <span class="form__file-hint">(jpg, png, pdf, doc — {{ MAX_FILES_HINT }})</span>
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
            @click="removeFile(index)">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>

    <label class="form__label form__label--checkbox">
      <input
        v-model="formData.consent"
        type="checkbox"
        class="form__checkbox" />
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
      <span v-else>Отправка...</span>
    </button>

    <div v-if="successMessage" class="form__success-message">
      {{ successMessage }}
    </div>

    <div v-if="errorMessage" class="form__error-message">
      {{ errorMessage }}
    </div>
  </form>
</template>

<script lang="ts" setup>
const files = ref<File[]>([]);
const isSubmitting = ref(false);
const successMessage = ref('');
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
    errors.phone = 'Укажите номер в формате +7 (999) 123-45-67';
    isValid = false;
  }

  if (!formData.email.trim()) {
    errors.email = 'Пожалуйста, укажите email';
    isValid = false;
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Пожалуйста, укажите корректный email';
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

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const selectedFiles = Array.from(target.files || []);
  const { files: nextFiles, error } = mergeFormFiles(files.value, selectedFiles);

  files.value = nextFiles;
  errors.files = error ?? '';
  target.value = '';
};

const removeFile = (index: number) => {
  files.value.splice(index, 1);
  errors.files = validateFormFiles(files.value) ?? '';
};

const handleSubmit = async () => {
  successMessage.value = '';
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
      successMessage.value = result.message || 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.';
      formData.name = '';
      formData.phone = '';
      formData.email = '';
      formData.message = '';
      formData.consent = false;
      files.value = [];

      setTimeout(() => {
        successMessage.value = '';
      }, 5000);
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
.form-header {
  text-align: center;
  margin-bottom: 50px;

  h1 {
    font-size: 2.8rem;
    margin-bottom: 20px;
    text-shadow: 0 0 20px rgba(100, 181, 246, 0.7);
    background: linear-gradient(to right, #e3f2fd, #bbdefb);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;

    @media (max-width: 768px) {
      font-size: 2.2rem;
    }
  }

  p {
    font-size: 1.2rem;
    max-width: 800px;
    margin: 0 auto 30px;
    color: #e3f2fd;
    line-height: 1.6;

    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }
}

.form {
  max-width: 600px;
  margin: 3rem auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

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
    font-size: 0.75rem;
    color: red;
    margin-top: -0.25rem;
    margin-left: 0.25rem;

    &--checkbox {
      margin-top: -0.5rem;
      margin-left: 1.75rem;
    }
  }

  &__success-message {
    padding: 0.75rem;
    background: rgba(100, 181, 246, 0.2);
    border: 1px solid #64b5f6;
    border-radius: 12px;
    color: #64b5f6;
    font-size: 0.9rem;
    text-align: center;
  }

  &__error-message {
    padding: 0.75rem;
    background: rgba(255, 107, 107, 0.2);
    border: 1px solid red;
    border-radius: 12px;
    color: red;
    font-size: 0.9rem;
    text-align: center;
  }
}
</style>