import { Router } from "express";
import { authUser, Login, logout, refresh, Register } from "./controller/auth_controller";
import { forgotPassword, resetPassword } from "./controller/forget_controller";

export const routes = (router: Router) => {
    router.post("/api/register", Register);
    router.post("/api/login", Login);
    router.get("/api/user", authUser);
    router.post("/api/refresh", refresh)
    router.post("/api/logout", logout)
    router.post("/api/forgot", forgotPassword);
    router.post("/api/reset", resetPassword);
    
}