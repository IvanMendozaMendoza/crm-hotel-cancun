import { env } from "@/config/env";

export const Endpoints = {
  UPDATE_ME: `${env.API_URL}/users/me`,
  UPDATE_PASSWORD: `${env.API_URL}/users/me/password`,
  GET_ALL_USERS: `${env.API_URL}/users`,
};
