<template>
  <div class="home">
    <div class="particles">
      <div v-for="n in 20" :key="n" class="particle" :style="particleStyle(n)"></div>
    </div>
    <div class="status-badge" :class="workStatus">
      <span class="status-dot"></span>
      <span>{{ statusText }}</span>
    </div>
    <div class="earnings-section">
      <p class="earnings-label">오늘 번 돈</p>
      <div class="earnings-amount">
        <span class="currency">₩</span>
        <span class="amount">{{ formattedEarnings }}</span>
      </div>
      <p class="earnings-sub" v-if="workStatus === 'working'">초당 <span class="hl">₩{{ formattedPerSecond }}</span> 벌는 중 💸</p>
      <p class="earnings-sub" v-else-if="workStatus === 'lunch'">점심시간 🍚 밥 먹고 오세요!</p>
      <p class="earnings-sub" v-else-if="workStatus === 'before'">출근 전이에요 ☀️</p>
      <p class="earnings-sub" v-else-if="workStatus === 'after'">퇴근 완료! 🎉 오늘 수고했어요!</p>
      <p class="earnings-sub" v-else>주말이에요 🏖️ 푹 쉬세요!</p>
    </div>
    <div class="progress-section">
      <component :is="currentThemeComponent" :progressPercent="progressPercent" />
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-info"><span class="stat-val">{{ workingDaysInMonth }}일</span><span class="stat-lbl">이번 달 근무일</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-info"><span class="stat-val">{{ formattedDailySalary }}</span><span class="stat-lbl">오늘 일당</span></div>
      </div>
      <div class="stat-card" v-if="workStatus === 'working' || workStatus === 'lunch'">
        <div class="stat-icon">⏰</div>
        <div class="stat-info"><span class="stat-val">{{ timeUntilEnd.hours }}시간 {{ timeUntilEnd.minutes }}분</span><span class="stat-lbl">퇴근까지</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">💵</div>
        <div class="stat-info"><span class="stat-val">{{ formattedMonthlySalary }}</span><span class="stat-lbl">월급</span></div>
      </div>
    </div>
    <router-link to="/settings" class="settings-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      <span>설정</span>
    </router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useEarnings } from '../composables/useEarnings'
import ProgressRing from '../components/themes/ProgressRing.vue'
import ProgressTaxi from '../components/themes/ProgressTaxi.vue'
import ProgressSCV from '../components/themes/ProgressSCV.vue'

const { settings, todayEarnings, earningsPerSecond, progressPercent, workingDaysInMonth, dailySalary, monthlySalary, workStatus, timeUntilEnd } = useEarnings()

const currentThemeComponent = computed(() => {
  switch (settings.value.progressTheme) {
    case 'taxi': return ProgressTaxi
    case 'scv': return ProgressSCV
    case 'ring':
    default: return ProgressRing
  }
})
const formattedEarnings = computed(() => Math.floor(todayEarnings.value).toLocaleString('ko-KR'))
const formattedPerSecond = computed(() => earningsPerSecond.value.toFixed(1))
const formattedDailySalary = computed(() => '₩' + Math.floor(dailySalary.value).toLocaleString('ko-KR'))
const formattedMonthlySalary = computed(() => '₩' + Math.floor(monthlySalary.value).toLocaleString('ko-KR'))
const statusText = computed(() => {
  const m = { working: '근무 중', lunch: '점심시간', before: '출근 전', after: '퇴근 완료', off: '주말' }
  return m[workStatus.value] || ''
})
function particleStyle(n) {
  const s = Math.random() * 4 + 2
  return { width: s+'px', height: s+'px', left: (n*5+Math.random()*5)+'%', top: (Math.random()*100)+'%', animationDelay: (Math.random()*5)+'s', animationDuration: (5+Math.random()*10)+'s' }
}
</script>

<style scoped>
.home { min-height:100vh; min-height:100dvh; padding:2rem 1.5rem 6rem; display:flex; flex-direction:column; align-items:center; position:relative; overflow:hidden; }
.particles { position:fixed; inset:0; pointer-events:none; z-index:0; }
.particle { position:absolute; background:rgba(139,92,246,0.3); border-radius:50%; animation:float linear infinite; }
@keyframes float { 0%{transform:translateY(0) rotate(0);opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{transform:translateY(-100vh) rotate(720deg);opacity:0} }
.status-badge { display:flex; align-items:center; gap:8px; padding:8px 20px; border-radius:100px; font-size:0.85rem; font-weight:600; backdrop-filter:blur(10px); margin-bottom:2rem; z-index:1; animation:slideDown 0.5s ease; }
@keyframes slideDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
.status-badge.working { background:rgba(34,197,94,0.15); color:#4ade80; border:1px solid rgba(34,197,94,0.3); }
.status-badge.lunch { background:rgba(251,191,36,0.15); color:#fbbf24; border:1px solid rgba(251,191,36,0.3); }
.status-badge.before { background:rgba(96,165,250,0.15); color:#60a5fa; border:1px solid rgba(96,165,250,0.3); }
.status-badge.after { background:rgba(167,139,250,0.15); color:#a78bfa; border:1px solid rgba(167,139,250,0.3); }
.status-badge.off { background:rgba(251,113,133,0.15); color:#fb7185; border:1px solid rgba(251,113,133,0.3); }
.status-dot { width:8px; height:8px; border-radius:50%; background:currentColor; animation:pulse-dot 2s ease-in-out infinite; }
@keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
.earnings-section { text-align:center; z-index:1; animation:fadeUp 0.6s ease 0.1s both; }
@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
.earnings-label { font-size:1rem; color:var(--text-secondary); font-weight:500; margin-bottom:0.5rem; letter-spacing:0.1em; text-transform:uppercase; }
.earnings-amount { display:flex; align-items:baseline; justify-content:center; gap:4px; margin-bottom:0.75rem; }
.currency { font-family:'Outfit',sans-serif; font-size:2rem; font-weight:700; background:linear-gradient(135deg,#6366f1,#8b5cf6,#d946ef); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.amount { font-family:'Outfit',sans-serif; font-size:3.5rem; font-weight:800; background:linear-gradient(135deg,#6366f1,#8b5cf6,#d946ef); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; letter-spacing:-0.02em; line-height:1; }
.earnings-sub { font-size:0.95rem; color:var(--text-secondary); }
.hl { color:#a78bfa; font-weight:700; }
.progress-section { margin:2rem 0; z-index:1; animation:fadeUp 0.6s ease 0.2s both; width: 100%; display: flex; justify-content: center; }
.stats-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; width:100%; max-width:400px; z-index:1; animation:fadeUp 0.6s ease 0.3s both; }
.stat-card { background:var(--card-bg); border:1px solid var(--card-border); border-radius:16px; padding:16px; display:flex; align-items:center; gap:12px; backdrop-filter:blur(10px); transition:transform 0.2s,border-color 0.2s; }
.stat-card:hover { transform:translateY(-2px); border-color:rgba(139,92,246,0.3); }
.stat-icon { font-size:1.5rem; }
.stat-info { display:flex; flex-direction:column; }
.stat-val { font-family:'Outfit',sans-serif; font-size:0.95rem; font-weight:700; color:var(--text-primary); }
.stat-lbl { font-size:0.72rem; color:var(--text-secondary); margin-top:2px; }
.settings-btn { position:fixed; bottom:2rem; right:2rem; display:flex; align-items:center; gap:8px; padding:12px 24px; background:var(--card-bg); border:1px solid var(--card-border); border-radius:100px; color:var(--text-primary); text-decoration:none; font-weight:600; font-size:0.9rem; backdrop-filter:blur(10px); transition:all 0.3s; z-index:10; }
.settings-btn:hover { background:rgba(139,92,246,0.15); border-color:rgba(139,92,246,0.4); transform:translateY(-2px); box-shadow:0 8px 30px rgba(139,92,246,0.2); }
@media(max-width:480px) { .amount{font-size:2.5rem} .currency{font-size:1.5rem} .stats-grid{gap:8px} .stat-card{padding:12px} }
</style>
