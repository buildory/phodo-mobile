export const validateSignup = (values: { email: string; password: string; passwordConfirm: string }) => {
    const errors: Partial<Record<keyof typeof values, string>> = {};
  
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]|\\;:'",.<>?/`~]).{8,16}$/;
  
    if (!values.email.trim()) {
      errors.email = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = "유효한 이메일 주소를 입력해주세요.";
    }
  
    const password = values.password.trim();
    if (!password) {
      errors.password = "비밀번호를 입력해주세요.";
    } else if (!passwordRegex.test(password)) {
      errors.password = "비밀번호 형식을 확인해주세요.";
    }
  
    const passwordConfirm = values.passwordConfirm.trim();
    if (!passwordConfirm) {
      errors.passwordConfirm = "비밀번호 확인을 입력해주세요.";
    } else if (!passwordRegex.test(passwordConfirm)) {
      errors.passwordConfirm = "비밀번호 형식을 확인해주세요.";
    } else if (password && password !== passwordConfirm) {
      errors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }
  
    return errors;
  };

  export const validateResetPassword = (values: { email: string; password: string; passwordConfirm: string }) => {
    const errors: Partial<Record<keyof typeof values, string>> = {};
  
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]|\\;:'",.<>?/`~]).{8,16}$/;
  
    if (!values.email.trim()) {
      errors.email = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = "유효한 이메일 주소를 입력해주세요.";
    }
  
    const password = values.password.trim();
    if (!password) {
      errors.password = "비밀번호를 입력해주세요.";
    } else if (!passwordRegex.test(password)) {
      errors.password = "비밀번호 형식을 확인해주세요.";
    }
  
    const passwordConfirm = values.passwordConfirm.trim();
    if (!passwordConfirm) {
      errors.passwordConfirm = "비밀번호 확인을 입력해주세요.";
    } else if (!passwordRegex.test(passwordConfirm)) {
      errors.passwordConfirm = "비밀번호 형식을 확인해주세요.";
    } else if (password && password !== passwordConfirm) {
      errors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }
  
    return errors;
  };
  
  