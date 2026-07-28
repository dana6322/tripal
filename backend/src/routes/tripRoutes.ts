import { Router } from "express";
import { generateTrip } from "../controllers/tripController";
import { validate } from "../middleware/validate";
import { generateTripSchema } from "../validation/generateTripSchema";

const router = Router();
router.all("/generate", validate({ body: generateTripSchema }), generateTrip);

export default router;
