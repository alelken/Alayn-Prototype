import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.alayn.app',
  appName: 'Alayn',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    Camera: {
      photoQuality: 90
    }
  }
};

export default config;
