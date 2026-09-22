"use strict";
// import express from 'express';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { authenticateToken } from '../middleware/auth';
// import { z } from 'zod';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const router = express.Router();
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// const chatSchema = z.object({
//   message: z.string().min(1)
// });
// const generateDescriptionSchema = z.object({
//   title: z.string(),
//   category: z.string().optional()
// });
// // AI Chatbot - Restaurant Recommendations
// router.post('/chat', authenticateToken, async (req, res) => {
//   try {
//     const { message } = chatSchema.parse(req.body);
//     const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
//     const prompt = `You are a restaurant recommendation assistant. User asked: "${message}". 
//     Suggest 3-5 restaurants with name, cuisine, location, price range, and why it's recommended. 
//     Format as JSON array. Categories: Italian, Chinese, Indian, Mexican, Japanese, American.`;
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();
//     res.json({
//       success: true,
//       message: 'AI response generated',
//       data: { response: text }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'AI chat failed' });
//   }
// });
// // AI Content Generator - Restaurant Description
// router.post('/generate-description', authenticateToken, async (req, res) => {
//   try {
//     const { title, category } = generateDescriptionSchema.parse(req.body);
//     const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
//     const prompt = `Generate a compelling 100-150 word restaurant description for: "${title}".
//     Category: ${category || 'Restaurant'}. Include ambiance, signature dishes, 
//     unique features, and why customers love it. Make it SEO-friendly and appetizing.`;
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     res.json({
//       success: true,
//       message: 'Description generated successfully',
//       data: { description: response.text() }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Description generation failed' });
//   }
// });
// // AI Review Summary
// router.post('/review-summary', async (req, res) => {
//   try {
//     const { reviews } = req.body;
//     const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
//     const prompt = `Summarize these restaurant reviews in 3-4 sentences highlighting 
//     common praises, complaints, and overall sentiment: ${JSON.stringify(reviews.slice(0, 10))}`;
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     res.json({
//       success: true,
//       message: 'Review summary generated',
//       data: { summary: response.text() }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Review summary failed' });
//   }
// });
// export default router;
// import express from 'express';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { authenticateToken } from '../middleware/auth';
// import { z } from 'zod';
// import dotenv from 'dotenv';
// dotenv.config();
// const router = express.Router();
// // ======================
// // Gemini Setup
// // ======================
// if (!process.env.GEMINI_API_KEY) {
//   throw new Error('GEMINI_API_KEY is missing in .env file');
// }
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// // ======================
// // Validation Schemas
// // ======================
// const chatSchema = z.object({
//   message: z.string().min(1, 'Message is required'),
// });
// const generateDescriptionSchema = z.object({
//   title: z.string().min(1, 'Title is required'),
//   category: z.string().optional(),
// });
// const reviewSummarySchema = z.object({
//   reviews: z.array(z.string()).min(1, 'Reviews are required'),
// });
// // ======================
// // AI Chatbot Route
// // ======================
// router.post('/chat', authenticateToken, async (req, res) => {
//   try {
//     const validatedData = chatSchema.parse(req.body);
//     const { message } = validatedData;
//     const model = genAI.getGenerativeModel({
//       model: 'gemini-1.5-pro-latest',
//     });
//     const prompt = `
// You are a professional restaurant recommendation assistant.
// User Message:
// "${message}"
// Give 3-5 restaurant recommendations.
// For each restaurant provide:
// - Name
// - Cuisine
// - Location
// - Price Range
// - Why Recommended
// Return clean JSON array format only.
// `;
//     const result = await model.generateContent(prompt);
//     const response = result.response;
//     const text = response.text();
//     res.status(200).json({
//       success: true,
//       message: 'AI response generated successfully',
//       data: {
//         response: text,
//       },
//     });
//   } catch (error: any) {
//     console.error('AI CHAT ERROR:', error);
//     res.status(500).json({
//       success: false,
//       message:
//         error?.message || 'Something went wrong while generating AI response',
//     });
//   }
// });
// // ======================
// // AI Restaurant Description Generator
// // ======================
// router.post(
//   '/generate-description',
//   authenticateToken,
//   async (req, res) => {
//     try {
//       const validatedData = generateDescriptionSchema.parse(req.body);
//       const { title, category } = validatedData;
//       const model = genAI.getGenerativeModel({
//         model: 'gemini-1.5-pro-latest',
//       });
//       const prompt = `
// Generate a compelling 100-150 word restaurant description.
// Restaurant Name:
// "${title}"
// Category:
// "${category || 'Restaurant'}"
// Include:
// - Ambiance
// - Signature dishes
// - Unique features
// - Why customers love it
// Make it SEO-friendly and appetizing.
// `;
//       const result = await model.generateContent(prompt);
//       const response = result.response;
//       const text = response.text();
//       res.status(200).json({
//         success: true,
//         message: 'Description generated successfully',
//         data: {
//           description: text,
//         },
//       });
//     } catch (error: any) {
//       console.error('DESCRIPTION GENERATOR ERROR:', error);
//       res.status(500).json({
//         success: false,
//         message:
//           error?.message ||
//           'Something went wrong while generating description',
//       });
//     }
//   }
// );
// // ======================
// // AI Review Summary
// // ======================
// router.post('/review-summary', async (req, res) => {
//   try {
//     const validatedData = reviewSummarySchema.parse(req.body);
//     const { reviews } = validatedData;
//     const model = genAI.getGenerativeModel({
//       model: 'gemini-1.5-pro-latest',
//     });
//     const prompt = `
// Summarize these restaurant reviews in 3-4 sentences.
// Highlight:
// - Common praises
// - Common complaints
// - Overall customer sentiment
// Reviews:
// ${JSON.stringify(reviews.slice(0, 10))}
// `;
//     const result = await model.generateContent(prompt);
//     const response = result.response;
//     const text = response.text();
//     res.status(200).json({
//       success: true,
//       message: 'Review summary generated successfully',
//       data: {
//         summary: text,
//       },
//     });
//   } catch (error: any) {
//     console.error('REVIEW SUMMARY ERROR:', error);
//     res.status(500).json({
//       success: false,
//       message:
//         error?.message ||
//         'Something went wrong while generating review summary',
//     });
//   }
// });
// export default router;
const express_1 = __importDefault(require("express"));
const generative_ai_1 = require("@google/generative-ai");
const auth_1 = require("../middleware/auth");
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
// ======================
// ENV CHECK
// ======================
if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing in .env file');
}
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// ======================
// Schemas
// ======================
const chatSchema = zod_1.z.object({
    message: zod_1.z.string().min(1),
});
const generateDescriptionSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    category: zod_1.z.string().optional(),
});
const reviewSummarySchema = zod_1.z.object({
    reviews: zod_1.z.array(zod_1.z.string()).min(1),
});
// ======================
// SAFE MODEL (IMPORTANT FIX)
// ======================
const getModel = () => {
    return genAI.getGenerativeModel({
        model: 'gemini-2.5-flash', // ✅ stable & working
    });
};
// gemini-2.5-flash
// ======================
// AI CHAT
// ======================
router.post('/chat', auth_1.authenticateToken, async (req, res) => {
    try {
        const { message } = chatSchema.parse(req.body);
        const model = getModel();
        const prompt = `
You are a restaurant recommendation assistant.

User: ${message}

Give 3-5 restaurant suggestions with:
- Name
- Cuisine
- Location
- Price
- Reason

Return JSON format only.
`;
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        res.json({
            success: true,
            data: { response: text },
        });
    }
    catch (error) {
        console.error('AI CHAT ERROR:', error);
        res.status(500).json({
            success: false,
            message: error?.message || 'AI chat failed',
        });
    }
});
// ======================
// DESCRIPTION
// ======================
router.post('/generate-description', auth_1.authenticateToken, async (req, res) => {
    try {
        const { title, category } = generateDescriptionSchema.parse(req.body);
        const model = getModel();
        const prompt = `
Write a 100-150 word restaurant description.

Name: ${title}
Category: ${category || 'Restaurant'}

Include:
- Ambience
- Signature dishes
- Features
- Why people love it
`;
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        res.json({
            success: true,
            data: { description: text },
        });
    }
    catch (error) {
        console.error('DESCRIPTION ERROR:', error);
        res.status(500).json({
            success: false,
            message: error?.message || 'Description failed',
        });
    }
});
// ======================
// REVIEW SUMMARY
// ======================
router.post('/review-summary', async (req, res) => {
    try {
        const { reviews } = reviewSummarySchema.parse(req.body);
        const model = getModel();
        const prompt = `
Summarize these reviews in 3-4 sentences:

${reviews.slice(0, 10).join('\n')}
`;
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        res.json({
            success: true,
            data: { summary: text },
        });
    }
    catch (error) {
        console.error('REVIEW ERROR:', error);
        res.status(500).json({
            success: false,
            message: error?.message || 'Review summary failed',
        });
    }
});
exports.default = router;
//# sourceMappingURL=ai.js.map