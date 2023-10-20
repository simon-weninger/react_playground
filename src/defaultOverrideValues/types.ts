import { z } from "zod";

export type TDefaultOverrideValues<TValue> = {
  value: TValue;
  overrideValues?: TOverrideValue<TValue>[];
};

export type TOverrideValue<TValue> = {
  value: TValue;
  containerId: number;
  environmentId?: number;
};

export const ToolSchema = z.object({
  name: z.string().min(1, "Name is Required"),
  constants: z.optional(
    z.record(
      z.string().min(1),
      z.object({
        value: z.string().min(1, "Name is Required"),
        overrideValues: z.optional(
          z.array(
            z.object({
              value: z.string(),
              containerId: z.number(),
              environmentId: z.optional(z.number()),
            })
          )
        ),
      })
    )
  ),
});

export type TTool = z.infer<typeof ToolSchema>;
