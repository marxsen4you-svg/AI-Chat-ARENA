# AI Chat Arena - OpenRouter Multi-Model Debate

An interactive web application that enables multiple AI models to engage in continuous debates on any topic using the OpenRouter API.

## Features

- **Multi-Model Debates**: Select from various AI models (Claude, GPT-4, Llama, etc.) to participate in debates
- **Custom Personas**: Assign unique personas to each participant for diverse perspectives
- **Real-time Streaming**: Watch the debate unfold in real-time with configurable delays
- **User-Provided API Keys**: Securely use your own OpenRouter API key (stored locally in your browser)
- **Debug Mode**: Built-in debugging tools to diagnose API issues
- **Netlify Ready**: Fully configured for one-click deployment to Netlify

## Quick Start

### Option 1: Deploy to Netlify (Recommended)

1. Fork this repository to your GitHub account
2. Log in to [Netlify](https://app.netlify.com/)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub account and select your forked repository
5. Netlify will auto-detect the settings from `netlify.toml`
6. Click "Deploy site"
7. Once deployed, visit your site and enter your OpenRouter API key

### Option 2: Run Locally

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd AI-Chat-ARENA
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Enter your OpenRouter API key in the UI

## Getting an OpenRouter API Key

1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up for a free account
3. Navigate to [API Keys](https://openrouter.ai/keys)
4. Create a new API key
5. Copy the key (starts with `sk-or-v1-...`)
6. Paste it into the "OpenRouter API Key" field in the application

## Usage

1. **Enter your API key** in the designated field at the top of the sidebar
2. **Choose a debate subject** (e.g., "Is AGI alignment achievable?")
3. **Customize the system prompt** (optional) to guide the debate style
4. **Add participants**:
   - Select AI models from the dropdown
   - Assign unique personas (e.g., "Rationalist", "Skeptic", "Optimist")
   - Add or remove participants as needed
5. **Configure delay** between turns (in milliseconds)
6. **Click "Start Endless Debate"** to begin
7. **Watch the debate** unfold in real-time
8. **Enable debug mode** if you encounter any issues

## How It Works

### Frontend (`public/index.html`)
- Single-file application with inline CSS and JavaScript
- Manages debate state and participant configuration
- Stores API key securely in browser localStorage
- Sends API key with each request via custom header
- Round-robin debate loop with configurable delays
- Real-time message rendering with color-coded participants

### Backend
**Local Development (`server.js`):**
- Express server serving static files
- Proxies requests to OpenRouter API
- Accepts API key from request header or environment variable

**Production (Netlify):**
- Netlify Functions handle API requests serverlessly
- `/api/chat` routes to `netlify/functions/chat.js`
- No environment variables required (users provide their own keys)

## Project Structure

```
AI-Chat-ARENA/
├── public/
│   └── index.html          # Main frontend application
├── netlify/
│   └── functions/
│       └── chat.js         # Netlify serverless function
├── server.js               # Express server (for local development)
├── package.json            # Dependencies and scripts
├── netlify.toml            # Netlify configuration
└── README.md               # This file
```

## Deployment to Netlify

### Automatic Configuration

The project includes `netlify.toml` which automatically configures:
- Build command: `npm install`
- Publish directory: `public`
- Functions directory: `netlify/functions`
- API route redirects (`/api/*` → `/.netlify/functions/*`)
- Security headers

### Manual Steps

1. **Fork or clone this repository**

2. **Connect to Netlify**
   - Log in to [Netlify](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider and select this repository

3. **Deploy**
   - Netlify will detect settings from `netlify.toml`
   - Click "Deploy site"
   - Wait for the build to complete
   - Your site will be live at `https://your-site-name.netlify.app`

### Environment Variables (Optional)

While the app is designed for users to provide their own API keys, you can optionally set a fallback:

1. Go to Site settings → Environment variables
2. Add variable:
   - Key: `OPENROUTER_API_KEY`
   - Value: Your OpenRouter API key

**Note**: User-provided API keys always take precedence over environment variables.

## Technologies Used

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Node.js, Express (local), Netlify Functions (production)
- **API**: OpenRouter API
- **Storage**: Browser localStorage (for API key persistence)
- **Deployment**: Netlify

## Troubleshooting

### "API key required" error
- Make sure you've entered your OpenRouter API key in the UI
- Verify the key starts with `sk-or-v1-`
- Check that the key is valid on [openrouter.ai/keys](https://openrouter.ai/keys)

### "Proxy error 401" or "403"
- Your API key may be invalid or expired
- Generate a new key at [openrouter.ai/keys](https://openrouter.ai/keys)

### "Proxy error 400" or "404"
- The selected model may not be available
- Check the [OpenRouter models page](https://openrouter.ai/models) for valid model IDs
- Enable debug mode to see detailed error messages

### Models not responding
- Check your OpenRouter account credits
- Some models require sufficient credits to use
- Enable debug mode to see API responses
- Try using smaller, free models first

### Netlify deployment issues
- Ensure `netlify.toml` is in the root directory
- Verify the Functions directory is set to `netlify/functions`
- Check the Netlify build logs for errors
- Make sure `node-fetch` is listed in dependencies

### Debug Mode
Enable debug mode in the UI to see:
- HTTP status codes from API calls
- Request/response payloads
- Loop control events
- Common failure diagnostics

## Security

- **API keys** are stored only in browser localStorage
- **No server-side storage** of API keys
- **User data** never leaves their browser except for API calls to OpenRouter
- **HTTPS enforced** on Netlify deployments
- **Security headers** configured in netlify.toml

## Cost Management

To prevent runaway API costs:
- Use the "Stop" button to end debates manually
- Increase the delay between turns (default: 1500ms)
- Monitor your OpenRouter usage at [openrouter.ai/activity](https://openrouter.ai/activity)
- Consider using free or cheaper models for testing
- The app trims conversation history to ~40 turns to control token usage

## Customization

### Change Available Models
Edit the `DEFAULT_MODELS` array in [public/index.html](public/index.html):
```javascript
const DEFAULT_MODELS = [
  "anthropic/claude-3-5-sonnet-20241022",
  "openai/gpt-4.1-mini",
  "meta-llama/llama-3.1-70b-instruct"
];
```

### Adjust Token Limits
Modify the API call parameters in `callProxyChat()` or the serverless function:
```javascript
max_tokens: 512,      // Increase for longer responses
temperature: 0.9      // Adjust for creativity (0.0-2.0)
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for any purpose.

## Acknowledgments

- [OpenRouter](https://openrouter.ai/) for providing the multi-model API
- [Netlify](https://www.netlify.com/) for free hosting and serverless functions
- All the AI model providers accessible through OpenRouter

## Support

If you encounter any issues or have questions:
1. Enable debug mode in the application
2. Check the browser console for errors
3. Review the Netlify function logs (if deployed)
4. Open an issue on GitHub with details

---

Built with ❤️ for the AI community
