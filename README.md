# Local Market Estimator

An AI-powered tool to estimate the local resale value of items from an image and a zip code. Built with React, TypeScript, and Google's Gemini AI.

## Features

- 📸 Drag & drop image upload with file validation
- 🤖 AI-powered item identification and price estimation
- 📍 Location-based market analysis using zip codes
- 🌙 Dark mode support
- 📱 Fully responsive design
- ⚡ Fast and modern Vite build system

## Run Locally

**Prerequisites:**  
- Node.js (v16 or higher)
- A Google Gemini API key

**Setup Steps:**

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure your API key:**
   - Open the `.env.local` file
   - Replace `PLACEHOLDER_API_KEY` with your actual Gemini API key
   - Get your API key from: https://aistudio.google.com/app/apikey

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Navigate to `http://localhost:5175` (or the port shown in your terminal)
   - Upload an image and enter a zip code to test the app

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. Upload an image of the item you want to price
2. Enter a 5-digit US zip code for local market analysis
3. Click "Get Estimate" to receive AI-powered pricing information
4. View the estimated price, price range, confidence level, and detailed reasoning

## File Size Limits

- Maximum file size: 10MB
- Supported formats: PNG, JPG, WEBP

## Technology Stack

- **Frontend:** React 19 with TypeScript
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS
- **AI Service:** Google Gemini 2.5 Flash
- **Icons:** Custom SVG components

## Project Structure

```
src/
├── App.tsx              # Main application component
├── types.ts             # TypeScript type definitions
├── components/          # Reusable UI components
│   ├── ImageUploader.tsx
│   ├── ResultCard.tsx
│   ├── ErrorBoundary.tsx
│   ├── Spinner.tsx
│   └── Icons.tsx
└── services/
    └── geminiService.ts # Google Gemini AI integration
```

## Error Handling

The app includes comprehensive error handling for:
- Invalid API keys
- Network connectivity issues
- File upload validation
- API quota limits
- Unexpected AI responses

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
