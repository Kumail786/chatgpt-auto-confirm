# Contributing to ChatGPT Auto Confirm

Thank you for your interest in contributing to ChatGPT Auto Confirm! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title** describing the issue
- **Detailed description** of the problem
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Browser version** and operating system
- **Extension version** (if applicable)
- **Console errors** (if any)

### Suggesting Enhancements

We welcome feature requests! When suggesting enhancements:

- **Describe the feature** clearly
- **Explain the use case** and benefits
- **Provide examples** if possible
- **Consider implementation** complexity

### Code Contributions

#### Prerequisites

- Node.js 16+ (for development)
- Chrome browser
- Git
- Basic knowledge of JavaScript and Chrome Extensions

#### Development Setup

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch
4. **Install** dependencies (if any)
5. **Load** the extension in Chrome for testing

```bash
# Clone your fork
git clone https://github.com/Kumail786/chatgpt-auto-confirm.git
cd chatgpt-auto-confirm

# Create a feature branch
git checkout -b feature/your-feature-name

# Load in Chrome for testing
# 1. Open chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the chatgpt-auto-confirm folder
```

#### Code Style Guidelines

- **JavaScript**: Follow modern ES6+ conventions
- **Comments**: Use clear, descriptive comments
- **Naming**: Use descriptive variable and function names
- **Formatting**: Use consistent indentation (2 spaces)
- **Error Handling**: Include proper error handling and logging

#### Testing

Before submitting a pull request:

- **Test** your changes thoroughly
- **Verify** the extension works on different ChatGPT URLs
- **Check** for console errors
- **Test** edge cases and error scenarios
- **Ensure** the UI remains responsive and user-friendly

#### Commit Guidelines

Use clear, descriptive commit messages:

```
feat: add custom response messages
fix: resolve toggle not working on specific URLs
docs: update README with new features
style: improve popup UI design
refactor: optimize confirmation detection algorithm
test: add unit tests for new functionality
```

#### Pull Request Process

1. **Update** the README if needed
2. **Add** tests for new functionality
3. **Ensure** all tests pass
4. **Update** documentation
5. **Create** a detailed pull request description
6. **Link** to any related issues

## 📁 Project Structure

```
chatgpt-auto-confirm/
├── manifest.json          # Extension configuration
├── background.js          # Background service worker
├── content.js            # Content script (main logic)
├── popup.html           # Extension popup UI
├── popup.js             # Popup functionality
├── icons/               # Extension icons
├── docs/                # Documentation
├── tests/               # Test files
├── README.md           # Main documentation
├── LICENSE             # License file
└── CONTRIBUTING.md     # This file
```

## 🧪 Testing

### Manual Testing

1. **Load** the extension in Chrome
2. **Navigate** to ChatGPT
3. **Test** the toggle functionality
4. **Verify** confirmation prompt detection
5. **Check** per-tab independence
6. **Test** background operation

### Automated Testing

We're working on adding automated tests. For now, please test manually and document your testing process.

## 📝 Documentation

When contributing code, please:

- **Update** relevant documentation
- **Add** comments for complex logic
- **Include** examples for new features
- **Update** the README if needed

## 🐛 Bug Fixes

When fixing bugs:

1. **Identify** the root cause
2. **Create** a minimal reproduction case
3. **Fix** the issue with minimal changes
4. **Test** the fix thoroughly
5. **Add** regression tests if possible

## 🚀 Feature Development

When adding features:

1. **Discuss** the feature in an issue first
2. **Plan** the implementation approach
3. **Implement** with clean, maintainable code
4. **Test** thoroughly
5. **Document** the new functionality

## 📋 Code Review Process

All contributions go through a review process:

1. **Automated checks** (if configured)
2. **Code review** by maintainers
3. **Testing** verification
4. **Documentation** review
5. **Final approval** and merge

## 🎯 Areas for Contribution

### High Priority
- **Bug fixes** and stability improvements
- **Performance optimizations**
- **Better error handling**
- **Enhanced detection algorithms**

### Medium Priority
- **UI/UX improvements**
- **Additional features**
- **Cross-browser compatibility**
- **Analytics and monitoring**

### Low Priority
- **Documentation improvements**
- **Code refactoring**
- **Test coverage**
- **Build system improvements**

## 📞 Getting Help

If you need help with contributions:

- **GitHub Issues**: Create an issue for questions
- **Discussions**: Use GitHub Discussions for general questions
- **Documentation**: Check the README and code comments
- **Community**: Engage with other contributors

## 🙏 Recognition

Contributors will be recognized in:

- **README.md** contributors section
- **GitHub** contributors graph
- **Release notes** for significant contributions
- **Project documentation**

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to ChatGPT Auto Confirm! 🚀
