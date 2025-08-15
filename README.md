# 🤖 ChatGPT Auto Confirm

[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Install-blue?logo=google-chrome)](https://chrome.google.com/webstore/detail/chatgpt-auto-confirm/your-extension-id)
[![GitHub stars](https://img.shields.io/github/stars/Kumail786/chatgpt-auto-confirm)](https://github.com/Kumail786/chatgpt-auto-confirm/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Kumail786/chatgpt-auto-confirm)](https://github.com/Kumail786/chatgpt-auto-confirm/network)
[![GitHub issues](https://img.shields.io/github/issues/Kumail786/chatgpt-auto-confirm)](https://github.com/Kumail786/chatgpt-auto-confirm/issues)
[![GitHub license](https://img.shields.io/github/license/Kumail786/chatgpt-auto-confirm)](https://github.com/Kumail786/chatgpt-auto-confirm/blob/main/LICENSE)
[![Contributors](https://img.shields.io/github/contributors/Kumail786/chatgpt-auto-confirm)](https://github.com/Kumail786/chatgpt-auto-confirm/graphs/contributors)

> **Automatically responds "Yes" to ChatGPT confirmation prompts to keep conversations flowing without interruption.**

## ✨ Features

- 🎯 **Smart Detection**: Intelligently detects confirmation prompts using advanced NLP patterns
- ⚡ **Instant Response**: Automatically responds with "Yes" to keep conversations flowing
- 🎛️ **Per-Tab Control**: Each ChatGPT tab can be enabled/disabled independently
- 🔄 **Background Operation**: Works even when you're not actively on ChatGPT
- 🛡️ **Safe & Reliable**: Only responds to actual confirmation prompts, not regular questions
- 🎨 **Beautiful UI**: Modern, intuitive interface with smooth animations
- 📱 **Cross-Platform**: Works on all ChatGPT interfaces (chat.openai.com, chatgpt.com)
- 🔧 **Developer Friendly**: Well-documented, extensible codebase

## 🚀 Quick Start

### Install from Chrome Web Store (Recommended)

1. Visit the [Chrome Web Store](https://chrome.google.com/webstore/detail/chatgpt-auto-confirm/your-extension-id)
2. Click "Add to Chrome"
3. Go to [ChatGPT](https://chat.openai.com) and start chatting!
4. Click the extension icon to enable/disable auto-confirmation

### Install from Source (Development)

```bash
# Clone the repository
git clone https://github.com/Kumail786/chatgpt-auto-confirm.git
cd chatgpt-auto-confirm

# Load in Chrome
# 1. Open chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the chatgpt-auto-confirm folder
```

## 📖 How It Works

### Detection Algorithm

The extension uses a sophisticated multi-layered approach to detect confirmation prompts:

1. **Keyword Analysis**: Identifies confirmation-related words (proceed, continue, confirm, etc.)
2. **Question Detection**: Recognizes yes/no questions and confirmation patterns
3. **Context Validation**: Ensures the prompt is actually asking for confirmation
4. **Negative Filtering**: Avoids responding to negative prompts

### Per-Tab Architecture

- **Independent State**: Each ChatGPT tab maintains its own enabled/disabled state
- **Background Monitoring**: Extension continues working even when tabs are inactive
- **Memory Efficient**: Automatically cleans up when tabs are closed

### Response Mechanism

1. **Wait for Completion**: Ensures ChatGPT has finished typing
2. **Find Input Field**: Locates the ChatGPT input area using multiple selectors
3. **Set Response**: Enters "Yes" in the input field
4. **Send Message**: Automatically clicks the send button

## 🎯 Use Cases

### For Developers
- **Automated Testing**: Streamline ChatGPT-based testing workflows
- **Code Generation**: Keep AI coding sessions flowing without interruptions
- **Documentation**: Maintain conversation flow when generating docs

### For Content Creators
- **Writing Assistance**: Focus on content without confirmation interruptions
- **Research**: Keep research conversations flowing smoothly
- **Brainstorming**: Maintain creative momentum during ideation sessions

### For Business Users
- **Customer Support**: Streamline AI-powered support workflows
- **Data Analysis**: Keep analytical conversations uninterrupted
- **Report Generation**: Maintain flow when generating business reports

## 🛠️ Development

### Prerequisites

- Node.js 16+ (for building)
- Chrome browser
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/Kumail786/chatgpt-auto-confirm.git
cd chatgpt-auto-confirm

# Install dependencies (if any build tools are added)
npm install

# Load extension in Chrome
# 1. Open chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the chatgpt-auto-confirm folder
```

### Project Structure

```
chatgpt-auto-confirm/
├── manifest.json          # Extension configuration
├── background.js          # Background service worker
├── content.js            # Content script (main logic)
├── popup.html           # Extension popup UI
├── popup.js             # Popup functionality
├── icons/               # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── docs/                # Documentation
├── tests/               # Test files
├── README.md           # This file
├── LICENSE             # License file
└── CONTRIBUTING.md     # Contributing guidelines
```

### Building

```bash
# Build for production (if build tools are added)
npm run build

# Build for development
npm run dev
```

### Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Run type checking (if TypeScript is added)
npm run type-check
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📋 Roadmap

### v1.1.0 (Next Release)
- [ ] Custom response messages
- [ ] Keyboard shortcuts
- [ ] Analytics dashboard
- [ ] Export/import settings

### v1.2.0 (Future)
- [ ] Firefox extension
- [ ] Safari extension
- [ ] Mobile support
- [ ] API integrations

### v2.0.0 (Major Release)
- [ ] AI-powered prompt detection
- [ ] Multi-language support
- [ ] Enterprise features
- [ ] Plugin system

## 🐛 Troubleshooting

### Common Issues

**Extension not responding to prompts**
- Ensure the extension is enabled for the current tab
- Check that you're on a supported ChatGPT URL
- Refresh the page and try again

**Toggle not working**
- Reload the extension in chrome://extensions/
- Check the browser console for errors
- Ensure you have the latest version

**False positives**
- The extension only responds to actual confirmation prompts
- Regular questions are ignored for safety
- Check the console logs for detection details

### Debug Mode

Enable debug logging by opening the browser console and looking for messages starting with "ChatGPT Auto Confirm:".

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for ChatGPT
- **Chrome Extensions Team** for the excellent documentation
- **Contributors** who help improve this project
- **Users** who provide feedback and suggestions

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/Kumail786/chatgpt-auto-confirm/issues)
- **Discussions**: [Join the community](https://github.com/Kumail786/chatgpt-auto-confirm/discussions)
- **Email**: support@chatgptautoconfirm.com

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Kumail786/chatgpt-auto-confirm&type=Date)](https://star-history.com/#Kumail786/chatgpt-auto-confirm&Date)

---

**Made with ❤️ by the ChatGPT Auto Confirm Team**

[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?logo=github)](https://github.com/Kumail786)
[![Twitter](https://img.shields.io/badge/Twitter-Follow-blue?logo=twitter)](https://twitter.com/Kumail786)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?logo=linkedin)](https://linkedin.com/in/Kumail786)
