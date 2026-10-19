"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const calculator_1 = require("./calculator");
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 3000;
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(process.cwd(), "public")));
app.get("/", (_req, res) => {
    res.sendFile(path_1.default.join(process.cwd(), "public", "index.html"));
});
app.get("/api/health", (_req, res) => {
    res.json({
        status: "success",
        message: "Electricity Calculator API is running"
    });
});
app.post("/api/calculate", (req, res) => {
    const body = req.body;
    const validCategories = [
        "domestic",
        "commercial"
    ];
    if (!body.category ||
        !validCategories.includes(body.category)) {
        res.status(400).json({
            error: "Select a valid consumer category."
        });
        return;
    }
    const units = body.units;
    const fixedCharges = body.fixedCharges;
    const otherCharges = body.otherCharges;
    if (typeof units !== "number" ||
        !Number.isFinite(units) ||
        units < 0) {
        res.status(400).json({
            error: "Units must be a valid non-negative number."
        });
        return;
    }
    if (typeof fixedCharges !== "number" ||
        !Number.isFinite(fixedCharges) ||
        fixedCharges < 0) {
        res.status(400).json({
            error: "Fixed charges must be a valid non-negative number."
        });
        return;
    }
    if (typeof otherCharges !== "number" ||
        !Number.isFinite(otherCharges) ||
        otherCharges < 0) {
        res.status(400).json({
            error: "Other charges must be a valid non-negative number."
        });
        return;
    }
    const result = (0, calculator_1.calculateBill)({
        category: body.category,
        units,
        fixedCharges,
        otherCharges
    });
    res.json({
        status: "success",
        bill: result
    });
});
app.listen(PORT, () => {
    console.log(`Electricity Calculator running at http://localhost:${PORT}`);
});
