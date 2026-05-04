<template>
  <div class="scv-theme">
    <div class="mineral-display">
      <span class="mineral-icon">💎</span>
      <span class="mineral-count">{{ Math.floor(progressPercent) }} / 100</span>
    </div>
    
    <div class="mining-area">
      <div class="cc">🏢</div>
      <div class="path"></div>
      <div class="mineral-patch">💎💎</div>
      
      <div class="scv" :class="{ mining: progressPercent > 0 && progressPercent < 100 }">
        🚜
        <div class="spark" v-if="progressPercent > 0 && progressPercent < 100">✨</div>
      </div>
    </div>
    
    <div class="status-text">
      {{ progressPercent >= 100 ? 'Mining Complete!' : (progressPercent <= 0 ? 'Awaiting Orders' : 'Mining Minerals...') }}
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
.scv-theme {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  background: #1a1b26;
  border: 2px solid #414868;
  border-radius: 8px;
  padding: 20px;
  font-family: 'Courier New', Courier, monospace;
}

.mineral-display {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 30px;
}

.mineral-icon {
  font-size: 1.5rem;
}

.mineral-count {
  color: #7aa2f7;
  font-size: 1.5rem;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(122, 162, 247, 0.5);
}

.mining-area {
  position: relative;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 10px;
}

.cc {
  font-size: 2.5rem;
  z-index: 1;
}

.mineral-patch {
  font-size: 2rem;
  z-index: 1;
}

.path {
  position: absolute;
  bottom: 15px;
  left: 30px;
  right: 30px;
  height: 2px;
  border-bottom: 2px dashed #414868;
}

.scv {
  position: absolute;
  bottom: 10px;
  font-size: 1.8rem;
  left: 20px; /* 초기 위치 (커맨드 센터) */
  transition: transform 0.2s;
}

.scv.mining {
  animation: gather 4s infinite linear;
}

.spark {
  position: absolute;
  right: -10px;
  top: -10px;
  font-size: 1rem;
  opacity: 0;
  animation: spark-anim 4s infinite linear;
}

/* 0%: CC, 40%: Patch, 50%: Mining, 90%: CC, 100%: Drop */
@keyframes gather {
  0% { left: 40px; transform: scaleX(1); } /* CC에서 출발 (오른쪽 보기) */
  40% { left: calc(100% - 70px); transform: scaleX(1); } /* 미네랄 도착 */
  50% { left: calc(100% - 70px); transform: scaleX(1) rotate(-15deg); } /* 캐기 동작 */
  51% { left: calc(100% - 70px); transform: scaleX(-1); } /* 뒤돌기 */
  90% { left: 40px; transform: scaleX(-1); } /* CC 도착 */
  100% { left: 40px; transform: scaleX(1); } /* 미네랄 반납 후 다시 앞보기 */
}

@keyframes spark-anim {
  0%, 45% { opacity: 0; }
  46%, 49% { opacity: 1; transform: scale(1.5); }
  50%, 100% { opacity: 0; }
}

.status-text {
  text-align: center;
  color: #a9b1d6;
  font-size: 0.9rem;
  margin-top: 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
