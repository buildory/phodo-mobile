export const validateLogin = (values: { email: string; password: string }) => {
    const errors: Partial<Record<keyof typeof values, string>> = {};
    if (!values.email.trim()) {
      errors.email = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = "유효한 이메일 주소를 입력해주세요.";
    }
    if (!values.password.trim()) errors.password = "비밀번호를 입력해주세요.";
    return errors;
  };