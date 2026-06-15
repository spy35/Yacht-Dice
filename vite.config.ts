import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export default defineConfig({
  base: '/Yacht-Dice/', // 배포할 GitHub 리포지토리 이름으로 설정하세요.
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})