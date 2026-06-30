import { toast } from 'sonner';

export const handleAppError = (
  error: any,
  context: string,
  userMessage: string = 'Ocorreu um erro ao processar sua solicitação.'
) => {
  // 1. Log to console (in production this could be sent to a service)
  console.error(`[Error in ${context}]:`, {
    timestamp: new Date().toISOString(),
    error,
    message: error?.message || 'Unknown error',
  });

  // 2. Show user-friendly toast
  toast.error(userMessage);
};
