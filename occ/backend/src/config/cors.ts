import type { CorsOptions } from "cors";
import { env } from "./env";

export const corsOptions: CorsOptions = {
  origin: env.corsOrigin.split(",").map((value) => value.trim()),
  credentials: true
};
