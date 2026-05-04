<template>
  <div class="progress-ring-wrap">
    <svg class="progress-ring" viewBox="0 0 200 200">
      <defs>
        <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#6366f1"/>
          <stop offset="50%" stop-color="#8b5cf6"/>
          <stop offset="100%" stop-color="#d946ef"/>
        </linearGradient>
      </defs>
      <circle class="ring-bg" cx="100" cy="100" r="85"/>
      <circle class="ring-fill" cx="100" cy="100" r="85" :style="{ strokeDashoffset: progressOffset }"/>
    </svg>
    <div class="ring-inner">
      <span class="ring-pct">{{ Math.floor(progressPercent) }}%</span>
      <span class="ring-lbl">근무 진행률</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  progressPercent: {
    type: Number,
    required: true
  }
})

const circumference = 2 * Math.PI * 85
const progressOffset = computed(() => circumference - (props.progressPercent / 100) * circumference)
</script>

<style scoped>
.progress-ring-wrap { position:relative; width:180px; height:180px; margin: 0 auto; }
.progress-ring { width:100%; height:100%; transform:rotate(-90deg); }
.ring-bg { fill:none; stroke:rgba(255,255,255,0.06); stroke-width:8; }
.ring-fill { fill:none; stroke:url(#pg); stroke-width:8; stroke-linecap:round; stroke-dasharray:534.07; stroke-dashoffset:534.07; transition:stroke-dashoffset 0.5s ease; }
.ring-inner { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; }
.ring-pct { font-family:'Outfit',sans-serif; font-size:2.2rem; font-weight:800; color:var(--text-primary); }
.ring-lbl { font-size:0.75rem; color:var(--text-secondary); margin-top:2px; }
</style>
