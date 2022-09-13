import { Router } from "express";
import { authUser, Login, refresh, Register } from "./controller/auth_controller";

export const routes = (router: Router) => {
    router.post("/api/register", Register);
    router.post("/api/login", Login);
    router.get("/api/user", authUser);
    router.post("/api/refresh", refresh)
}