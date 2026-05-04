<template>
  <div class="taxi-theme">
    <div class="meter-display">
      <span class="meter-label">TAXI METER</span>
      <div class="meter-value">
        {{ Math.floor(progressPercent) }}<span class="meter-unit">%</span>
      </div>
    </div>
    
    <div class="track">
      <div class="track-line"></div>
      <div class="horse" :style="{ left: `calc(${progressPercent}% - 15px)` }">
        <span class="horse-emoji" :class="{ running: progressPercent > 0 && progressPercent < 100 }">🐎</span>
        <span class="dust" v-if="progressPercent > 0 && progressPercent < 100">💨</span>
      </div>
      <div class="finish-flag">🏁</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  progressPercent: {
    type: Number,
    required: true
  }
})
</script>

<style scoped>
.taxi-theme {
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.meter-display {
  background: #111;
  border: 4px solid #333;
  border-radius: 12px;
  padding: 16px 24px;
  text-align: right;
  position: relative;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.8), 0 4px 15px rgba(0,0,0,0.3);
}

.meter-display::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(rgba(255,255,255,0.03) 50%, transparent 50%);
  background-size: 100% 4px;
  pointer-events: none;
}

.meter-label {
  position: absolute;
  top: 8px; left: 12px;
  font-family: monospace;
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: bold;
  letter-spacing: 2px;
}

.meter-value {
  font-family: 'Outfit', monospace;
  font-size: 3.5rem;
  font-weight: 900;
  color: #ef4444;
  text-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
  line-height: 1;
  margin-top: 10px;
}

.meter-unit {
  font-size: 1.5rem;
  margin-left: 4px;
}

.track {
  position: relative;
  height: 40px;
  margin-top: 10px;
  padding: 0 15px;
}

.track-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
}

.finish-flag {
  position: absolute;
  right: -5px;
  bottom: 0;
  font-size: 1.5rem;
  transform: translateY(10%);
}

.horse {
  position: absolute;
  bottom: 0;
  transition: left 0.5s linear;
  display: flex;
  align-items: center;
  z-index: 2;
}

.horse-emoji {
  font-size: 2rem;
  display: inline-block;
  transform: scaleX(-1); /* 말이 오른쪽을 보게 반전 */
}

.horse-emoji.running {
  animation: gallop 0.4s infinite alternate;
}

.dust {
  font-size: 1rem;
  position: absolute;
  right: 20px;
  bottom: 0;
  opacity: 0;
  animation: dust-puff 0.8s infinite;
}

@keyframes gallop {
  0% { transform: scaleX(-1) translateY(0) rotate(0deg); }
  100% { transform: scaleX(-1) translateY(-6px) rotate(-10deg); }
}

@keyframes dust-puff {
  0% { opacity: 0.8; transform: translateX(0) scale(0.5); }
  100% { opacity: 0; transform: translateX(-15px) scale(1.5); }
}
</style>
