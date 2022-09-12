import { Router } from "express";
import { Register } from "./controller/auth_controller";

export const routes = (router: Router) => {
    router.post("/api/register", Register);
}