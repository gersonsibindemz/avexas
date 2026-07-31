const translations: Record<string, string> = {
  "Invalid login credentials": "Credenciais de login inválidas",
  "Email already registered": "E-mail já registrado",
  "Password should be at least 6 characters": "A senha deve ter pelo menos 6 caracteres",
  "User already registered": "E-mail já está cadastrado",
  "Unable to validate email address: invalid format": "Formato de e-mail inválido",
};

export const translateMessage = (message: string): string => {
  return translations[message] || message;
};
