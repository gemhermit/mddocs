import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: process.env.BASE_URL || '/',
  // SITE_ 前缀的环境变量会注入到客户端，用于站点规范地址（与 Node 脚本共用同一个变量名）
  envPrefix: ['VITE_', 'SITE_'],
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
