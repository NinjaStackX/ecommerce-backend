import { z } from "zod";

export const authValidationReg = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export const authValidationLog = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default authValidationReg;
