# Hello World Plugin

A demonstration plugin for the DotX ecosystem. This plugin serves as a reference implementation for building plugins using the DotX Plugin SDK, showcasing device management, UI integration, and settings configuration.

## Overview

The Hello World plugin helps developers understand the core concepts of the DotX plugin architecture. It provides functional examples of interacting with connected hardware and creating dynamic settings pages.

## Features

- **Device Management**: Monitor connected devices with connection and disconnection event handling.
- **Settings UI**: Demonstration of the settings builder:
  - **Input Fields**: Text, Number, and IP Address types.
  - **Selection**: Dropdown menus with custom options.
  - **Switches**: Toggle settings with state-driven visibility.
  - **Badges & Info Banners**: Visual status indicators and messages.
  - **Buttons**: Custom action buttons with callbacks.
- **Action Mapper**: Integration of system utility buttons.
- **Configuration**: Usage of the configuration API for persistent settings.
- **Toasts**: User notifications via the DotX UI.

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [esbuild](https://esbuild.github.io/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dotmatrixlabs/hello-world-plugin.git
   cd hello-world-plugin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Building

```bash
npm run build
```

The build process generates `main.js` in the root directory.

## Project Structure

- `main.ts`: Plugin logic and UI definitions.
- `manifest.json`: Metadata, permissions, and links.
- `hello-world-config.json`: Default configuration.
- `package.json`: Dependencies and scripts.

## API Examples

### Device Monitoring

```typescript
this.device.onConnect((device) => {
  this.ui.showToast({
    message: `${device.name} connected on ${device.port}`,
    type: 'success'
  });
});
```

### Settings Creation

```typescript
await this.settingsPage.addSettings((settings) => {
  const general = settings.addSection('General');
  
  settings.addInput('brokerIP')
    .setLabel('Broker IP')
    .setType('ip_address')
    .onChange((data) => {
      this.config.set('settings.brokerIP', data.value);
    });
});
```

## License

MIT - see [manifest.json](manifest.json) for details.
