import { useMutation } from "@tanstack/react-query";
import { sendEmail, SendEmailRequest } from "../services/auth/send.service";

export const useSendEmail = () =>
  useMutation({
    mutationFn: (payload: SendEmailRequest) => sendEmail(payload),
  });
