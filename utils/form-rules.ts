export default {
  required: (value: string) => !!value || 'Required.',
  length: (length: number) => (value: string) => (value && value.length >= length) || `Value must be at least ${length} characters`,
  email: (value: string) => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || 'Invalid e-mail.'
  },
  password: [
    (value: string) => (value && value.length >= 13) || 'Password must be at least 13 characters',
    (value: string) => (value && /\d/.test(value)) || 'Password must contain at least one number',
    (value: string) => (value && /[a-z]/.test(value)) || 'Password must contain at least one lowercase letter',
    (value: string) => (value && /[A-Z]/.test(value)) || 'Password must contain at least one uppercase letter',
  ],
};