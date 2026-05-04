import { ref, computed, onMounted, onUnmounted } from 'vue'

const STORAGE_KEY = 'earnings-tracker-settings'

// Default settings
const defaultSettings = {
  salaryType: 'annual', // 'annual' or 'monthly'
  salary: 50000000, // 5천만원
  workStartHour: 9,
  workStartMinute: 0,
  workEndHour: 18,
  workEndMinute: 0,
  lunchStartHour: 12,
  lunchStartMinute: 0,
  lunchEndHour: 13,
  lunchEndMinute: 0,
  includeLunch: false, // 점심시간 포함 여부
  progressTheme: 'ring' // 'ring', 'taxi', 'scv'
}

function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return { ...defaultSettings, ...JSON.parse(saved) }
    }
  } catch (e) {
    console.error('Failed to load settings:', e)
  }
  return { ...defaultSettings }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (e) {
    console.error('Failed to save settings:', e)
  }
}

const API_KEY = import.meta.env.VITE_HOLIDAY_API_KEY || 'YOUR_DECODING_API_KEY_HERE'

const holidays = ref([]) // YYYY-MM-DD 형식의 문자열 배열

function isHoliday(year, month, day) {
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return holidays.value.includes(dateStr)
}

/**
 * 현재 월의 근무일수 계산 (토/일 및 공휴일 제외)
 */
function getWorkingDaysInMonth(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  let workingDays = 0
  for (let day = 1; day <= daysInMonth; day++) {
    const dayOfWeek = new Date(year, month, day).getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    if (!isWeekend && !isHoliday(year, month, day)) {
      workingDays++
    }
  }
  return workingDays
}

export function useEarnings() {
  const settings = ref(loadSettings())
  const now = ref(new Date())
  let timer = null

  // 현재 월의 근무일수
  const workingDaysInMonth = computed(() => {
    return getWorkingDaysInMonth(now.value.getFullYear(), now.value.getMonth())
  })

  // 월급 계산
  const monthlySalary = computed(() => {
    if (settings.value.salaryType === 'annual') {
      return settings.value.salary / 12
    }
    return settings.value.salary
  })

  // 일당 계산
  const dailySalary = computed(() => {
    return monthlySalary.value / workingDaysInMonth.value
  })

  // 근무시간 (분 단위)
  const totalWorkMinutes = computed(() => {
    const s = settings.value
    const startMin = s.workStartHour * 60 + s.workStartMinute
    const endMin = s.workEndHour * 60 + s.workEndMinute
    let total = endMin - startMin

    // 점심시간 제외
    if (!s.includeLunch) {
      const lunchStart = s.lunchStartHour * 60 + s.lunchStartMinute
      const lunchEnd = s.lunchEndHour * 60 + s.lunchEndMinute
      total -= (lunchEnd - lunchStart)
    }

    return Math.max(total, 1) // 최소 1분
  })

  // 분당 수입
  const earningsPerMinute = computed(() => {
    return dailySalary.value / totalWorkMinutes.value
  })

  // 초당 수입
  const earningsPerSecond = computed(() => {
    return earningsPerMinute.value / 60
  })

  // 오늘이 근무일인지 체크
  const isWorkDay = computed(() => {
    const day = now.value.getDay()
    const isWeekend = day === 0 || day === 6
    if (isWeekend) return false
    
    return !isHoliday(now.value.getFullYear(), now.value.getMonth(), now.value.getDate())
  })

  // 현재 근무 중인지 체크
  const isWorkingNow = computed(() => {
    if (!isWorkDay.value) return false
    const s = settings.value
    const currentMin = now.value.getHours() * 60 + now.value.getMinutes()
    const startMin = s.workStartHour * 60 + s.workStartMinute
    const endMin = s.workEndHour * 60 + s.workEndMinute
    return currentMin >= startMin && currentMin < endMin
  })

  // 점심시간인지 체크
  const isLunchTime = computed(() => {
    if (settings.value.includeLunch) return false
    const s = settings.value
    const currentMin = now.value.getHours() * 60 + now.value.getMinutes()
    const lunchStart = s.lunchStartHour * 60 + s.lunchStartMinute
    const lunchEnd = s.lunchEndHour * 60 + s.lunchEndMinute
    return currentMin >= lunchStart && currentMin < lunchEnd
  })

  // 오늘 지금까지 실제 근무한 분 수
  const workedMinutesToday = computed(() => {
    const s = settings.value
    const currentMin = now.value.getHours() * 60 + now.value.getMinutes() + now.value.getSeconds() / 60
    const startMin = s.workStartHour * 60 + s.workStartMinute
    const endMin = s.workEndHour * 60 + s.workEndMinute
    const lunchStart = s.lunchStartHour * 60 + s.lunchStartMinute
    const lunchEnd = s.lunchEndHour * 60 + s.lunchEndMinute

    if (!isWorkDay.value) return 0
    if (currentMin <= startMin) return 0
    if (currentMin >= endMin) return totalWorkMinutes.value

    let worked = currentMin - startMin

    // 점심시간 제외
    if (!s.includeLunch) {
      if (currentMin > lunchEnd) {
        worked -= (lunchEnd - lunchStart)
      } else if (currentMin > lunchStart) {
        worked -= (currentMin - lunchStart)
      }
    }

    return Math.max(worked, 0)
  })

  // 오늘 번 돈 (실시간)
  const todayEarnings = computed(() => {
    return workedMinutesToday.value * earningsPerMinute.value
  })

  // 진행률
  const progressPercent = computed(() => {
    return Math.min((workedMinutesToday.value / totalWorkMinutes.value) * 100, 100)
  })

  // 근무 상태
  const workStatus = computed(() => {
    if (!isWorkDay.value) return 'off' // 주말
    const s = settings.value
    const currentMin = now.value.getHours() * 60 + now.value.getMinutes()
    const startMin = s.workStartHour * 60 + s.workStartMinute
    const endMin = s.workEndHour * 60 + s.workEndMinute

    if (currentMin < startMin) return 'before'
    if (currentMin >= endMin) return 'after'
    if (isLunchTime.value) return 'lunch'
    return 'working'
  })

  // 퇴근까지 남은 시간
  const timeUntilEnd = computed(() => {
    const s = settings.value
    const currentMin = now.value.getHours() * 60 + now.value.getMinutes()
    const endMin = s.workEndHour * 60 + s.workEndMinute
    const remaining = endMin - currentMin
    if (remaining <= 0) return { hours: 0, minutes: 0 }
    return {
      hours: Math.floor(remaining / 60),
      minutes: remaining % 60
    }
  })

  function updateSettings(newSettings) {
    settings.value = { ...settings.value, ...newSettings }
    saveSettings(settings.value)
  }

  async function loadHolidays(year) {
    const cacheKey = `holidays_${year}`
    const cached = localStorage.getItem(cacheKey)
    let fetchedHolidays = []

    if (cached) {
      fetchedHolidays = JSON.parse(cached)
    } else {
      if (API_KEY === 'YOUR_DECODING_API_KEY_HERE') {
        console.warn('API Key가 입력되지 않아 공공데이터포털 공휴일을 불러오지 못했습니다.')
      } else {
        try {
          // numOfRows=100을 주어 1년 치를 한 번에 조회 (proxy 설정된 주소 사용)
          const url = `/api/holidays/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?ServiceKey=${encodeURIComponent(API_KEY)}&solYear=${year}&numOfRows=100&_type=json`
          const response = await fetch(url)
          const data = await response.json()
          
          if (data.response?.header?.resultCode === '00') {
            const items = data.response.body.items.item
            if (Array.isArray(items)) {
              fetchedHolidays = items.map(item => {
                const locdate = String(item.locdate)
                return `${locdate.substring(0, 4)}-${locdate.substring(4, 6)}-${locdate.substring(6, 8)}`
              })
            } else if (items) {
              const locdate = String(items.locdate)
              fetchedHolidays = [`${locdate.substring(0, 4)}-${locdate.substring(4, 6)}-${locdate.substring(6, 8)}`]
            }
            localStorage.setItem(cacheKey, JSON.stringify(fetchedHolidays))
          } else {
            console.error('공휴일 API 오류:', data)
          }
        } catch (error) {
          console.error('공휴일 정보 패치 실패:', error)
        }
      }
    }

    holidays.value = fetchedHolidays
  }

  function startTimer() {
    timer = setInterval(() => {
      now.value = new Date()
    }, 100) // 0.1초마다 업데이트로 부드러운 카운터
  }

  function stopTimer() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  onMounted(() => {
    startTimer()
    loadHolidays(now.value.getFullYear())
  })
  onUnmounted(stopTimer)

  return {
    settings,
    now,
    workingDaysInMonth,
    monthlySalary,
    dailySalary,
    totalWorkMinutes,
    earningsPerMinute,
    earningsPerSecond,
    isWorkDay,
    isWorkingNow,
    isLunchTime,
    workedMinutesToday,
    todayEarnings,
    progressPercent,
    workStatus,
    timeUntilEnd,
    updateSettings
  }
}
