<template>
  <div class="settings">
    <div class="settings-header">
      <router-link to="/" class="back-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
      </router-link>
      <h1 class="settings-title">설정</h1>
      <div style="width:40px"></div>
    </div>

    <!-- Salary Section -->
    <div class="section">
      <h2 class="section-title">💰 급여 정보</h2>
      <div class="field">
        <label class="field-label">급여 유형</label>
        <div class="toggle-group">
          <button :class="['toggle-btn', { active: localSettings.salaryType === 'annual' }]" @click="localSettings.salaryType = 'annual'">연봉</button>
          <button :class="['toggle-btn', { active: localSettings.salaryType === 'monthly' }]" @click="localSettings.salaryType = 'monthly'">월급</button>
        </div>
      </div>
      <div class="field">
        <label class="field-label">{{ localSettings.salaryType === 'annual' ? '연봉' : '월급' }} (원)</label>
        <div class="input-wrap">
          <span class="input-prefix">₩</span>
          <input type="text" :value="formattedSalaryInput" @input="handleSalaryInput" class="text-input" placeholder="50,000,000" />
        </div>
        <span class="field-hint" v-if="localSettings.salaryType === 'annual'">세전 연봉을 입력하세요</span>
        <span class="field-hint" v-else>세전 월급을 입력하세요</span>
      </div>
    </div>

    <!-- Work Hours Section -->
    <div class="section">
      <h2 class="section-title">⏰ 근무 시간</h2>
      <div class="time-row">
        <div class="field flex-1">
          <label class="field-label">출근 시간</label>
          <div class="time-picker">
            <select v-model.number="localSettings.workStartHour" class="time-select">
              <option v-for="h in 24" :key="h-1" :value="h-1">{{ String(h-1).padStart(2,'0') }}</option>
            </select>
            <span class="time-sep">:</span>
            <select v-model.number="localSettings.workStartMinute" class="time-select">
              <option v-for="m in [0,15,30,45]" :key="m" :value="m">{{ String(m).padStart(2,'0') }}</option>
            </select>
          </div>
        </div>
        <div class="field flex-1">
          <label class="field-label">퇴근 시간</label>
          <div class="time-picker">
            <select v-model.number="localSettings.workEndHour" class="time-select">
              <option v-for="h in 24" :key="h-1" :value="h-1">{{ String(h-1).padStart(2,'0') }}</option>
            </select>
            <span class="time-sep">:</span>
            <select v-model.number="localSettings.workEndMinute" class="time-select">
              <option v-for="m in [0,15,30,45]" :key="m" :value="m">{{ String(m).padStart(2,'0') }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Lunch Section -->
    <div class="section">
      <h2 class="section-title">🍚 점심시간</h2>
      <div class="field">
        <div class="switch-row">
          <span class="field-label" style="margin-bottom:0">점심시간에도 돈 벌기</span>
          <label class="switch">
            <input type="checkbox" v-model="localSettings.includeLunch" />
            <span class="slider"></span>
          </label>
        </div>
        <span class="field-hint">{{ localSettings.includeLunch ? '점심시간도 근무시간에 포함됩니다' : '점심시간은 근무시간에서 제외됩니다' }}</span>
      </div>
      <div class="time-row" v-if="!localSettings.includeLunch">
        <div class="field flex-1">
          <label class="field-label">점심 시작</label>
          <div class="time-picker">
            <select v-model.number="localSettings.lunchStartHour" class="time-select">
              <option v-for="h in 24" :key="h-1" :value="h-1">{{ String(h-1).padStart(2,'0') }}</option>
            </select>
            <span class="time-sep">:</span>
            <select v-model.number="localSettings.lunchStartMinute" class="time-select">
              <option v-for="m in [0,15,30,45]" :key="m" :value="m">{{ String(m).padStart(2,'0') }}</option>
            </select>
          </div>
        </div>
        <div class="field flex-1">
          <label class="field-label">점심 종료</label>
          <div class="time-picker">
            <select v-model.number="localSettings.lunchEndHour" class="time-select">
              <option v-for="h in 24" :key="h-1" :value="h-1">{{ String(h-1).padStart(2,'0') }}</option>
            </select>
            <span class="time-sep">:</span>
            <select v-model.number="localSettings.lunchEndMinute" class="time-select">
              <option v-for="m in [0,15,30,45]" :key="m" :value="m">{{ String(m).padStart(2,'0') }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Theme Section -->
    <div class="section">
      <h2 class="section-title">🎨 화면 테마</h2>
      <div class="field">
        <label class="field-label">프로그레스 테마</label>
        <div class="theme-grid">
          <div class="theme-card" :class="{ active: localSettings.progressTheme === 'ring' }" @click="localSettings.progressTheme = 'ring'">
            <div class="theme-icon">⭕</div>
            <div class="theme-name">기본 링</div>
          </div>
          <div class="theme-card" :class="{ active: localSettings.progressTheme === 'taxi' }" @click="localSettings.progressTheme = 'taxi'">
            <div class="theme-icon">🚕</div>
            <div class="theme-name">택시 미터기</div>
          </div>
          <div class="theme-card" :class="{ active: localSettings.progressTheme === 'scv' }" @click="localSettings.progressTheme = 'scv'">
            <div class="theme-icon">🚜</div>
            <div class="theme-name">SCV 미네랄</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Section -->
    <div class="section preview">
      <h2 class="section-title">📊 계산 미리보기</h2>
      <div class="preview-grid">
        <div class="preview-item"><span class="preview-lbl">월급</span><span class="preview-val">₩{{ previewMonthlySalary }}</span></div>
        <div class="preview-item"><span class="preview-lbl">이번 달 근무일</span><span class="preview-val">{{ previewWorkDays }}일</span></div>
        <div class="preview-item"><span class="preview-lbl">일당</span><span class="preview-val">₩{{ previewDailySalary }}</span></div>
        <div class="preview-item"><span class="preview-lbl">일 근무시간</span><span class="preview-val">{{ previewWorkHours }}</span></div>
        <div class="preview-item"><span class="preview-lbl">분당 수입</span><span class="preview-val">₩{{ previewPerMinute }}</span></div>
        <div class="preview-item"><span class="preview-lbl">초당 수입</span><span class="preview-val">₩{{ previewPerSecond }}</span></div>
      </div>
    </div>

    <!-- Save Button -->
    <button class="save-btn" @click="handleSave">
      <span>저장하기</span>
    </button>

    <!-- Toast -->
    <Transition name="toast">
      <div class="toast" v-if="showToast">✅ 설정이 저장되었습니다!</div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const STORAGE_KEY = 'earnings-tracker-settings'
const router = useRouter()
const showToast = ref(false)

const defaultSettings = {
  salaryType: 'annual', salary: 50000000,
  workStartHour: 9, workStartMinute: 0,
  workEndHour: 18, workEndMinute: 0,
  lunchStartHour: 12, lunchStartMinute: 0,
  lunchEndHour: 13, lunchEndMinute: 0,
  includeLunch: false, progressTheme: 'ring'
}

function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return { ...defaultSettings, ...JSON.parse(saved) }
  } catch (e) { /* ignore */ }
  return { ...defaultSettings }
}

const localSettings = reactive(loadSettings())

const formattedSalaryInput = computed(() => {
  return localSettings.salary ? localSettings.salary.toLocaleString('ko-KR') : ''
})

function handleSalaryInput(e) {
  const raw = e.target.value.replace(/[^0-9]/g, '')
  localSettings.salary = raw ? parseInt(raw, 10) : 0
}

function getWorkingDays() {
  const now = new Date()
  const y = now.getFullYear(), m = now.getMonth()
  const days = new Date(y, m + 1, 0).getDate()
  let wd = 0
  for (let d = 1; d <= days; d++) {
    const dow = new Date(y, m, d).getDay()
    if (dow !== 0 && dow !== 6) wd++
  }
  return wd
}

const previewWorkDays = computed(() => getWorkingDays())

const previewMonthly = computed(() => {
  return localSettings.salaryType === 'annual' ? localSettings.salary / 12 : localSettings.salary
})

const previewMonthlySalary = computed(() => Math.floor(previewMonthly.value).toLocaleString('ko-KR'))

const previewDaily = computed(() => previewMonthly.value / previewWorkDays.value)
const previewDailySalary = computed(() => Math.floor(previewDaily.value).toLocaleString('ko-KR'))

const previewTotalMin = computed(() => {
  const s = localSettings
  let t = (s.workEndHour * 60 + s.workEndMinute) - (s.workStartHour * 60 + s.workStartMinute)
  if (!s.includeLunch) t -= ((s.lunchEndHour * 60 + s.lunchEndMinute) - (s.lunchStartHour * 60 + s.lunchStartMinute))
  return Math.max(t, 1)
})

const previewWorkHours = computed(() => {
  const h = Math.floor(previewTotalMin.value / 60)
  const m = previewTotalMin.value % 60
  return m > 0 ? `${h}시간 ${m}분` : `${h}시간`
})

const previewPerMin = computed(() => previewDaily.value / previewTotalMin.value)
const previewPerMinute = computed(() => previewPerMin.value.toFixed(1))
const previewPerSecond = computed(() => (previewPerMin.value / 60).toFixed(2))

function handleSave() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...localSettings }))
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
    router.push('/')
  }, 1200)
}
</script>

<style scoped>
.settings { min-height:100vh; padding:1.5rem; max-width:500px; margin:0 auto; }
.settings-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:2rem; }
.back-btn { width:40px; height:40px; display:flex; align-items:center; justify-content:center; background:var(--card-bg); border:1px solid var(--card-border); border-radius:12px; color:var(--text-primary); text-decoration:none; transition:all 0.2s; }
.back-btn:hover { background:rgba(139,92,246,0.15); border-color:rgba(139,92,246,0.4); }
.settings-title { font-family:'Outfit',sans-serif; font-size:1.5rem; font-weight:700; color:var(--text-primary); }
.section { background:var(--card-bg); border:1px solid var(--card-border); border-radius:20px; padding:1.5rem; margin-bottom:1rem; backdrop-filter:blur(10px); }
.section-title { font-size:1.05rem; font-weight:700; color:var(--text-primary); margin-bottom:1.25rem; }
.field { margin-bottom:1rem; }
.field:last-child { margin-bottom:0; }
.field-label { display:block; font-size:0.82rem; font-weight:600; color:var(--text-secondary); margin-bottom:0.5rem; text-transform:uppercase; letter-spacing:0.05em; }
.field-hint { font-size:0.75rem; color:var(--text-muted); margin-top:0.25rem; display:block; }
.toggle-group { display:flex; gap:8px; }
.toggle-btn { flex:1; padding:10px; border-radius:12px; border:1px solid var(--card-border); background:transparent; color:var(--text-secondary); font-weight:600; font-size:0.9rem; cursor:pointer; transition:all 0.2s; font-family:inherit; }
.toggle-btn.active { background:linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.2)); border-color:rgba(139,92,246,0.5); color:#a78bfa; }
.input-wrap { display:flex; align-items:center; background:rgba(255,255,255,0.04); border:1px solid var(--card-border); border-radius:12px; overflow:hidden; transition:border-color 0.2s; }
.input-wrap:focus-within { border-color:rgba(139,92,246,0.5); }
.input-prefix { padding:0 0 0 16px; color:var(--text-secondary); font-weight:600; font-size:1.1rem; }
.text-input { flex:1; background:none; border:none; padding:12px 16px; color:var(--text-primary); font-size:1.1rem; font-weight:600; font-family:'Outfit',sans-serif; outline:none; }
.text-input::placeholder { color:var(--text-muted); }
.time-row { display:flex; gap:12px; }
.flex-1 { flex:1; }
.time-picker { display:flex; align-items:center; gap:4px; }
.time-select { background:rgba(255,255,255,0.04); border:1px solid var(--card-border); border-radius:10px; padding:10px 12px; color:var(--text-primary); font-size:1rem; font-weight:600; font-family:'Outfit',sans-serif; outline:none; cursor:pointer; appearance:none; -webkit-appearance:none; text-align:center; min-width:60px; }
.time-select:focus { border-color:rgba(139,92,246,0.5); }
.time-select option { background:#1a1a2e; color:#fff; }
.time-sep { color:var(--text-secondary); font-size:1.2rem; font-weight:700; }
.switch-row { display:flex; align-items:center; justify-content:space-between; }
.switch { position:relative; width:48px; height:26px; flex-shrink:0; }
.switch input { opacity:0; width:0; height:0; }
.slider { position:absolute; cursor:pointer; inset:0; background:rgba(255,255,255,0.1); border-radius:26px; transition:0.3s; }
.slider::before { content:''; position:absolute; width:20px; height:20px; left:3px; bottom:3px; background:#fff; border-radius:50%; transition:0.3s; }
.switch input:checked+.slider { background:linear-gradient(135deg,#6366f1,#8b5cf6); }
.switch input:checked+.slider::before { transform:translateX(22px); }
.preview { border-color:rgba(139,92,246,0.2); background:rgba(139,92,246,0.05); }
.preview-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.preview-item { display:flex; flex-direction:column; }
.preview-lbl { font-size:0.72rem; color:var(--text-secondary); margin-bottom:2px; }
.preview-val { font-family:'Outfit',sans-serif; font-size:0.95rem; font-weight:700; color:#a78bfa; }
.save-btn { width:100%; padding:16px; border:none; border-radius:16px; background:linear-gradient(135deg,#6366f1,#8b5cf6,#d946ef); color:#fff; font-size:1.05rem; font-weight:700; font-family:inherit; cursor:pointer; transition:all 0.3s; margin-top:0.5rem; }
.save-btn:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(139,92,246,0.3); }
.save-btn:active { transform:translateY(0); }
.toast { position:fixed; bottom:2rem; left:50%; transform:translateX(-50%); background:rgba(34,197,94,0.15); border:1px solid rgba(34,197,94,0.3); color:#4ade80; padding:12px 24px; border-radius:100px; font-weight:600; font-size:0.9rem; backdrop-filter:blur(10px); z-index:100; }
.toast-enter-active,.toast-leave-active { transition:all 0.3s ease; }
.toast-enter-from,.toast-leave-to { opacity:0; transform:translateX(-50%) translateY(20px); }
.theme-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 8px; }
.theme-card { background: rgba(255,255,255,0.04); border: 1px solid var(--card-border); border-radius: 12px; padding: 12px; text-align: center; cursor: pointer; transition: all 0.2s; }
.theme-card:hover { border-color: rgba(139,92,246,0.3); transform: translateY(-2px); }
.theme-card.active { background: linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.1)); border-color: rgba(139,92,246,0.5); }
.theme-icon { font-size: 2rem; margin-bottom: 4px; }
.theme-name { font-size: 0.8rem; font-weight: 600; color: var(--text-primary); }
</style>
