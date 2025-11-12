import { z } from "zod";

export const params = z.object({
    id: z.string({
        required_error: "Identifier must be provided",
    }),
});