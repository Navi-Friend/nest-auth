import * as z from "zod";

export const loginSchema = z.object({
    email: z.email("Please enter a valid email"),
    password: z
        .string()
        .min(6, "Password shoud be at least 6 characters")
        .max(128, "Password must be less than 128 characters"),
});

export const signupSchema = loginSchema
    .extend({
        name: z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(50, "Name must be less than 50 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
