# Hello World Plugin

A demonstration plugin for the Dot X ecosystem. This plugin serves as a reference implementation for building plugins using the Dot X Plugin SDK, showcasing device management, UI integration, and settings configuration.

## Overview

The Hello World plugin helps developers understand the core concepts of the Dot X plugin architecture. It provides functional examples of interacting with connected hardware and creating dynamic settings pages.

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

- [Node.js](https://nodejs.org/) (v20+)
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

This plugin now consumes `@dotmatrixlabs/dotx-plugin-sdk` from npm. It also uses the shared `dotx-plugin` CLI from that package for release validation and `plugin.zip` packaging, so no local `dot-x` checkout or custom packaging scripts are required.

### Building

```bash
npm run build
```

The build process generates the file declared in `manifest.json -> main`, which is currently `main.js`.

### Local Development

```bash
npm start
```

Ensure the Dot X app is running before starting the plugin.

### Packaging For Marketplace Releases

```bash
npm run package
```

This creates `dist/plugin.zip` with:

- `manifest.json`
- the file declared by `manifest.json -> main`
- optional `assets/`, `data/`, and `bin/`
- any extra paths listed in `manifest.json -> packaging.include`

For this example plugin, `hello-world-config.json` is included via:

```json
{
  "packaging": {
    "include": ["hello-world-config.json"]
  }
}
```

### Publishing

Push a version tag such as `v1.0.1` and GitHub Actions will:

- verify the tag matches `package.json` and `manifest.json`
- validate marketplace-required manifest fields
- build the file referenced by `manifest.main`
- generate `dist/plugin.zip`
- upload `plugin.zip` to the GitHub Release

## Project Structure

- `main.ts`: Plugin logic and UI definitions.
- `manifest.json`: Metadata, permissions, and links.
- `hello-world-config.json`: Default configuration.
- `package.json`: npm dependency on `@dotmatrixlabs/dotx-plugin-sdk` plus build/package scripts.

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
