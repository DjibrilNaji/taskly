import z from "zod"

import { emailValidator, passwordValidator, stringValidator } from "@/validators"

export const signupFormSchema = z
  .object({
    name: stringValidator.min(2, {
      message: "Error.fullNameError"
    }),
    email: emailValidator,
    password: passwordValidator
  })
  .required()

export type SignupType = z.infer<typeof signupFormSchema>

export const signinFormSchema = z
  .object({
    email: emailValidator,
    password: stringValidator.min(1, {
      message: "Error.passwordError"
    })
  })
  .required()

export type SigninType = z.infer<typeof signinFormSchema>

export const updateFormSchema = z
  .object({
    name: stringValidator.min(2, {
      message: "Error.fullNameError"
    }),
    email: emailValidator
  })
  .required()

export type UpdateType = z.infer<typeof updateFormSchema>

export const projectFormSchema = z
  .object({
    name: stringValidator.min(2, {
      message: "Error.projectNameError"
    }),
    description: stringValidator.min(10, {
      message: "Error.projectDescriptionError"
    })
  })
  .required()

export type ProjectType = z.infer<typeof projectFormSchema>
