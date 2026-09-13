import { NextRequest } from "next/server";

export interface AppRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    role: string;
    status: string;
  };
}
