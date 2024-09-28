import { Router } from "express";
import { addproperty, fetchRentalProperty } from "../controllers/rental.js";

const router = Router();

router.post("/add", addproperty);
router.get("/fetch", fetchRentalProperty);

export default router;
