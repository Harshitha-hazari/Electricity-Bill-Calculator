import express, {
    Request,
    Response
} from "express";

import path from "path";

import { calculateBill } from "./calculator";

import {
    BillRequest,
    ConsumerCategory
} from "./types";

const app = express();

const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

app.use(express.static(path.join(process.cwd(), "public")));

app.get("/", (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
        status: "success",
        message: "Electricity Calculator API is running"
    });
});

app.post(
    "/api/calculate",
    (req: Request, res: Response) => {
        const body = req.body as Partial<BillRequest>;

        const validCategories: ConsumerCategory[] = [
            "domestic",
            "commercial"
        ];

        if (
            !body.category ||
            !validCategories.includes(body.category)
        ) {
            res.status(400).json({
                error: "Select a valid consumer category."
            });
            return;
        }

        const units = body.units;
        const fixedCharges = body.fixedCharges;
        const otherCharges = body.otherCharges;

        if (
            typeof units !== "number" ||
            !Number.isFinite(units) ||
            units < 0
        ) {
            res.status(400).json({
                error: "Units must be a valid non-negative number."
            });
            return;
        }

        if (
            typeof fixedCharges !== "number" ||
            !Number.isFinite(fixedCharges) ||
            fixedCharges < 0
        ) {
            res.status(400).json({
                error: "Fixed charges must be a valid non-negative number."
            });
            return;
        }

        if (
            typeof otherCharges !== "number" ||
            !Number.isFinite(otherCharges) ||
            otherCharges < 0
        ) {
            res.status(400).json({
                error: "Other charges must be a valid non-negative number."
            });
            return;
        }

        const result = calculateBill({
            category: body.category,
            units,
            fixedCharges,
            otherCharges
        });

        res.json({
            status: "success",
            bill: result
        });
    }
);

app.listen(PORT, () => {
    console.log(
        `Electricity Calculator running at http://localhost:${PORT}`
    );
});