"use server"

import db from "@/lib/db"
import bcrypt from "bcrypt"
import { signIn } from "@/auth"
import {
  IRegister,
  ICredentials,
  credentialsValidator,
  registerValidator,
} from "@/lib/validations/credentials"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"

export async function login(values: ICredentials) {
  const validatedFields = credentialsValidator.safeParse(values)

  if (!validatedFields.success) {
    return {
      error: "Invalid Fields",
    }
  }

  const { email, password } = validatedFields.data

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    return {
      ok: true,
      message: "Signed in successfully",
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "Invalid Credentials",
          }
        default:
          return {
            error: "Something went wrong",
          }
      }
    }

    throw error
  }
}

export async function register(values: IRegister) {
  const validatedFields = registerValidator.safeParse(values)

  if (!validatedFields.success) {
    return {
      error: "Invalid Fields",
    }
  }

  const { firstName, lastName, email, password, confirmPassword } =
    validatedFields.data

  const isEmailExist = await db.user.findFirst({
    where: { email },
  })

  if (isEmailExist) {
    return {
      error: "User already exist",
    }
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  const randomNumber = Math.floor(Math.random() * 6) + 1

  if (password !== confirmPassword) {
    return {
      error: "The passwords did not match",
    }
  }

  await db.user.create({
    data: {
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
      image: `/avatar-${randomNumber}.png`,
      username: `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
    },
  })

  return {
    ok: true,
    message: "Success",
  }
}
