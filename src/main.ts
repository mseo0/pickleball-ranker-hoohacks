import './style.css'
import heroImg from './assets/hero.png'

type TabId = 'news' | 'gear' | 'home' | 'health' | 'community'
type ThemeMode = 'light' | 'dark'
type HealthMetricKey = 'steps' | 'heartRate' | 'sleep' | 'activeEnergy' | 'hrv'

type HealthMetric = {
  label: string
  value: string
  detail: string
}

type HealthData = {
  importedAt: string
  sourceFileName: string
  metrics: Record<HealthMetricKey, HealthMetric>
  warnings: string[]
}

const tabs: Array<{ id: TabId; label: string; icon: string }> = [
  { id: 'news', label: 'News', icon: 'N' },
  { id: 'gear', label: 'Gear', icon: 'G' },
  { id: 'home', label: 'Home', icon: 'H' },
  { id: 'health', label: 'Health', icon: 'F' },
  { id: 'community', label: 'Community', icon: 'C' },
]

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('App root not found')
}

const savedTheme = window.localStorage.getItem('pickleball-theme')
const HEALTH_STORAGE_KEY = 'pickleball-health-data'

const loadStoredHealthData = (): HealthData | null => {
  const rawValue = window.localStorage.getItem(HEALTH_STORAGE_KEY)

  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue) as HealthData
  } catch {
    window.localStorage.removeItem(HEALTH_STORAGE_KEY)
    return null
  }
}

const state: {
  activeTab: TabId
  theme: ThemeMode
  courtFill: number
  healthData: HealthData | null
  healthError: string | null
  healthLoading: boolean
} = {
  activeTab: 'home',
  theme: savedTheme === 'dark' ? 'dark' : 'light',
  courtFill: 72,
  healthData: loadStoredHealthData(),
  healthError: null,
  healthLoading: false,
}

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const renderGaugeTone = (fill: number) => {
  if (fill < 35) return 'danger'
  if (fill < 70) return 'warning'
  return 'success'
}

const sanitizeFileName = (value: string) => escapeHtml(value || 'export.xml')

const getMetricSummary = (
  records: Element[],
  type: string,
  options?: { unit?: string; average?: boolean },
) => {
  const matchingRecords = records.filter((record) => record.getAttribute('type') === type)

  if (matchingRecords.length === 0) {
    return null
  }

  const values = matchingRecords
    .map((record) => Number.parseFloat(record.getAttribute('value') || ''))
    .filter((value) => Number.isFinite(value))

  if (values.length === 0) {
    return null
  }

  const computedValue = options?.average
    ? values.reduce((total, value) => total + value, 0) / values.length
    : values.reduce((total, value) => total + value, 0)

  const roundedValue =
    computedValue >= 100 ? Math.round(computedValue).toLocaleString() : computedValue.toFixed(1)

  return {
    count: matchingRecords.length,
    value: options?.unit ? `${roundedValue} ${options.unit}` : roundedValue,
  }
}

const getSleepSummary = (records: Element[]) => {
  const sleepRecords = records.filter(
    (record) =>
      record.getAttribute('type') === 'HKCategoryTypeIdentifierSleepAnalysis' &&
      record.getAttribute('value') !== 'HKCategoryValueSleepAnalysisInBed',
  )

  if (sleepRecords.length === 0) {
    return null
  }

  const totalHours = sleepRecords.reduce((hours, record) => {
    const start = new Date(record.getAttribute('startDate') || '')
    const end = new Date(record.getAttribute('endDate') || '')

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return hours
    }

    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    return duration > 0 ? hours + duration : hours
  }, 0)

  if (totalHours <= 0) {
    return null
  }

  return {
    sessions: sleepRecords.length,
    value: `${totalHours.toFixed(1)} hrs`,
  }
}

const parseAppleHealthExport = async (file: File): Promise<HealthData> => {
  const xmlText = await file.text()

  await new Promise<void>((resolve) => {
    window.setTimeout(() => resolve(), 0)
  })

  const xmlDocument = new DOMParser().parseFromString(xmlText, 'application/xml')
  const parseError = xmlDocument.querySelector('parsererror')

  if (parseError) {
    throw new Error('The uploaded file is not a valid Apple Health export XML file.')
  }

  const records = Array.from(xmlDocument.getElementsByTagName('Record'))
  if (records.length === 0) {
    throw new Error('No Apple Health records were found in this file.')
  }

  const warnings: string[] = []
  const steps = getMetricSummary(records, 'HKQuantityTypeIdentifierStepCount')
  const heartRate = getMetricSummary(records, 'HKQuantityTypeIdentifierHeartRate', {
    unit: 'bpm avg',
    average: true,
  })
  const activeEnergy = getMetricSummary(records, 'HKQuantityTypeIdentifierActiveEnergyBurned', {
    unit: 'kcal',
  })
  const hrv = getMetricSummary(records, 'HKQuantityTypeIdentifierHeartRateVariabilitySDNN', {
    unit: 'ms avg',
    average: true,
  })
  const sleep = getSleepSummary(records)

  if (!steps) warnings.push('Steps were not found in this export.')
  if (!heartRate) warnings.push('Heart rate readings were not found in this export.')
  if (!sleep) warnings.push('Sleep analysis entries were not found in this export.')
  if (!activeEnergy) warnings.push('Active energy burned was not found in this export.')
  if (!hrv) warnings.push('Heart rate variability was not found in this export.')

  const metrics: Record<HealthMetricKey, HealthMetric> = {
    steps: steps
      ? {
          label: 'Steps',
          value: steps.value,
          detail: `${steps.count.toLocaleString()} Apple Health records imported`,
        }
      : {
          label: 'Steps',
          value: 'Unavailable',
          detail: 'This export did not include step count records.',
        },
    heartRate: heartRate
      ? {
          label: 'Heart Rate',
          value: heartRate.value,
          detail: `${heartRate.count.toLocaleString()} readings averaged`,
        }
      : {
          label: 'Heart Rate',
          value: 'Unavailable',
          detail: 'This export did not include heart rate samples.',
        },
    sleep: sleep
      ? {
          label: 'Sleep Analysis',
          value: sleep.value,
          detail: `${sleep.sessions.toLocaleString()} sleep sessions counted`,
        }
      : {
          label: 'Sleep Analysis',
          value: 'Unavailable',
          detail: 'This export did not include usable sleep analysis sessions.',
        },
    activeEnergy: activeEnergy
      ? {
          label: 'Active Energy',
          value: activeEnergy.value,
          detail: `${activeEnergy.count.toLocaleString()} calorie samples imported`,
        }
      : {
          label: 'Active Energy',
          value: 'Unavailable',
          detail: 'This export did not include active energy data.',
        },
    hrv: hrv
      ? {
          label: 'HRV',
          value: hrv.value,
          detail: `${hrv.count.toLocaleString()} HRV readings averaged`,
        }
      : {
          label: 'HRV',
          value: 'Unavailable',
          detail: 'This export did not include heart rate variability data.',
        },
  }

  return {
    importedAt: new Date().toISOString(),
    sourceFileName: file.name,
    metrics,
    warnings,
  }
}

const renderHome = () => {
  const gaugeTone = renderGaugeTone(state.courtFill)
  const gaugeLabel =
    gaugeTone === 'danger'
      ? 'Quiet courts'
      : gaugeTone === 'warning'
        ? 'Building traffic'
        : 'Prime run'

  return `
    <section class="page page-home">
      <div class="hero-card card">
        <div class="hero-copy">
          <p class="eyebrow">DUPR-linked profile</p>
          <h1>Welcome back, Quan</h1>
          <p class="hero-text">
            Your rank is climbing. Queue into nearby courts, track your recent sets, and keep your
            pickleball profile match-ready.
          </p>
          <div class="hero-stats">
            <div>
              <span class="stat-label">Live ELO</span>
              <strong>1486</strong>
            </div>
            <div>
              <span class="stat-label">Win Rate</span>
              <strong>68%</strong>
            </div>
            <div>
              <span class="stat-label">Queue ETA</span>
              <strong>12 min</strong>
            </div>
          </div>
        </div>
        <img src="${heroImg}" alt="Pickleball player illustration" class="hero-image" />
      </div>

      <section class="card">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Nearby courts</p>
            <h2>Court activity gauge</h2>
          </div>
          <span class="badge ${gaugeTone}">${gaugeLabel}</span>
        </div>
        <div class="gauge-card">
          <div class="gauge-shell ${gaugeTone}">
            <div class="gauge-fill" style="width: ${state.courtFill}%"></div>
          </div>
          <div class="gauge-meta">
            <strong>${state.courtFill}% full</strong>
            <span>Red means quiet, yellow means filling up, green means games are ready now.</span>
          </div>
        </div>
        <label class="slider-block" for="court-fill">
          <span>Adjust court activity input</span>
          <input id="court-fill" type="range" min="0" max="100" value="${state.courtFill}" />
        </label>
      </section>

      <section class="grid two-up">
        <article class="card">
          <div class="section-heading">
            <div>
              <p class="eyebrow">Today</p>
              <h2>Queue snapshot</h2>
            </div>
          </div>
          <ul class="list">
            <li><span>CityWest Courts</span><strong>4 waiting</strong></li>
            <li><span>Riverview Rec</span><strong>Open doubles</strong></li>
            <li><span>Hoohacks Pop-Up</span><strong>Starts at 6:30 PM</strong></li>
          </ul>
        </article>

        <article class="card">
          <div class="section-heading">
            <div>
              <p class="eyebrow">Match history</p>
              <h2>Recent sets</h2>
            </div>
          </div>
          <ul class="match-list">
            <li><span>W vs. Alex / Priya</span><strong>11-8, 11-6</strong></li>
            <li><span>L vs. Eastside Smash</span><strong>8-11, 9-11</strong></li>
            <li><span>W ladder challenge</span><strong>11-7, 11-9</strong></li>
          </ul>
        </article>
      </section>
    </section>
  `
}

const renderNews = () => `
  <section class="page">
    <section class="card">
      <div class="section-heading">
        <div>
          <p class="eyebrow">News and marketplace</p>
          <h1>What is moving in pickleball</h1>
        </div>
      </div>
      <div class="grid two-up">
        <article class="mini-card accent">
          <p class="eyebrow">Headline</p>
          <h3>Major city ladders are adding open-play ELO nights.</h3>
          <p>Use this feed for fast updates, club announcements, and partnership drops.</p>
        </article>
        <article class="mini-card">
          <p class="eyebrow">Marketplace</p>
          <h3>Featured paddle: Carbon drive pro</h3>
          <p>List used paddles, ball machines, and court gear inside the same local network.</p>
        </article>
      </div>
    </section>
  </section>
`

const renderGear = () => `
  <section class="page">
    <section class="card">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Personal gear</p>
          <h1>Your bag setup</h1>
        </div>
      </div>
      <div class="grid two-up">
        <article class="mini-card">
          <p class="eyebrow">Primary paddle</p>
          <h3>Selkirk control build</h3>
          <p>Balanced face, fresh overgrip, and a note to recheck edge guard wear next week.</p>
        </article>
        <article class="mini-card accent">
          <p class="eyebrow">Bag checklist</p>
          <h3>Match day essentials</h3>
          <p>Balls, tape, towels, electrolyte mix, and backup shoes all ready to go.</p>
        </article>
      </div>
    </section>
  </section>
`

const renderHealth = () => {
  const healthCards = state.healthData
    ? Object.values(state.healthData.metrics)
        .map(
          (metric, index) => `
            <article class="mini-card ${index === 2 ? 'accent' : ''}">
              <p class="eyebrow">${escapeHtml(metric.label)}</p>
              <h3>${escapeHtml(metric.value)}</h3>
              <p>${escapeHtml(metric.detail)}</p>
            </article>
          `,
        )
        .join('')
    : `
      <article class="mini-card">
        <p class="eyebrow">Apple Health</p>
        <h3>No health data yet</h3>
        <p>Connect an exported Apple Health XML file to replace placeholder fitness data with real metrics.</p>
      </article>
    `

  const importMeta = state.healthData
    ? `
      <div class="import-meta">
        <span>Imported from <strong>${sanitizeFileName(state.healthData.sourceFileName)}</strong></span>
        <span>${escapeHtml(new Date(state.healthData.importedAt).toLocaleString())}</span>
      </div>
    `
    : ''

  const warningBlock =
    state.healthData && state.healthData.warnings.length > 0
      ? `
        <div class="callout warning-callout">
          <strong>Some Apple Health fields were missing.</strong>
          <ul class="callout-list">
            ${state.healthData.warnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join('')}
          </ul>
        </div>
      `
      : ''

  const errorBlock = state.healthError
    ? `
      <div class="callout error-callout">
        <strong>Import failed.</strong>
        <p>${escapeHtml(state.healthError)}</p>
      </div>
    `
    : ''

  return `
    <section class="page">
      <section class="card">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Health and fitness</p>
            <h1>Recovery and readiness</h1>
          </div>
          <button class="connect-button" type="button" id="connect-apple-health">
            ${state.healthLoading ? 'Parsing Apple Health...' : 'Connect Apple Health'}
          </button>
        </div>

        <div class="instruction-card">
          <p class="eyebrow">Companion flow</p>
          <h2>Import Apple Health export.xml</h2>
          <p>
            HealthKit cannot be read directly from a web app, so upload your Apple Health export
            after exporting from Settings -> Health -> Export All Health Data.
          </p>
          <input
            id="apple-health-file"
            class="hidden-file-input"
            type="file"
            accept=".xml,text/xml,application/xml"
          />
        </div>

        ${state.healthLoading ? '<div class="loading-panel">Reading and parsing your Apple Health export...</div>' : ''}
        ${errorBlock}
        ${warningBlock}
        ${importMeta}

        <div class="grid health-grid">
          ${healthCards}
        </div>
      </section>
    </section>
  `
}

const renderCommunity = () => `
  <section class="page">
    <section class="card">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Community</p>
          <h1>Local groups and tournaments</h1>
        </div>
      </div>
      <div class="grid two-up">
        <article class="mini-card accent">
          <p class="eyebrow">Nearby group</p>
          <h3>Charlottesville sunset ladder</h3>
          <p>128 players, mixed skill pods, and open slots for tonight's rotation.</p>
        </article>
        <article class="mini-card">
          <p class="eyebrow">Tournament</p>
          <h3>Spring campus classic</h3>
          <p>Registration closes Friday with beginner, intermediate, and DUPR-open brackets.</p>
        </article>
      </div>
    </section>
  </section>
`

const renderPage = () => {
  if (state.activeTab === 'news') return renderNews()
  if (state.activeTab === 'gear') return renderGear()
  if (state.activeTab === 'health') return renderHealth()
  if (state.activeTab === 'community') return renderCommunity()
  return renderHome()
}

const render = () => {
  document.documentElement.dataset.theme = state.theme
  window.localStorage.setItem('pickleball-theme', state.theme)

  app.innerHTML = `
    <main class="app-shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">Pickleball Ranker</p>
          <strong class="app-title">Queue. Compete. Climb.</strong>
        </div>
        <button class="theme-toggle" type="button" aria-label="Toggle light and dark mode">
          ${state.theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
      </header>

      <section class="content">${renderPage()}</section>

      <nav class="bottom-nav" aria-label="Primary">
        ${tabs
          .map(
            (tab) => `
              <button
                class="nav-item ${tab.id === state.activeTab ? 'active' : ''} ${tab.id === 'home' ? 'home-tab' : ''}"
                type="button"
                data-tab="${tab.id}"
              >
                <span class="nav-icon">${escapeHtml(tab.icon)}</span>
                <span>${escapeHtml(tab.label)}</span>
              </button>
            `,
          )
          .join('')}
      </nav>
    </main>
  `

  app.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      const nextTab = button.dataset.tab as TabId
      state.activeTab = nextTab
      render()
    })
  })

  app.querySelector<HTMLButtonElement>('.theme-toggle')?.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark'
    render()
  })

  app.querySelector<HTMLButtonElement>('#connect-apple-health')?.addEventListener('click', () => {
    if (state.healthLoading) {
      return
    }

    app.querySelector<HTMLInputElement>('#apple-health-file')?.click()
  })

  app.querySelector<HTMLInputElement>('#apple-health-file')?.addEventListener('change', async (event) => {
    const input = event.currentTarget as HTMLInputElement
    const file = input.files?.[0]

    if (!file) {
      state.healthError = 'No file was selected. Please choose your Apple Health export.xml file.'
      render()
      return
    }

    state.healthLoading = true
    state.healthError = null
    render()

    try {
      const parsedData = await parseAppleHealthExport(file)
      state.healthData = parsedData
      window.localStorage.setItem(HEALTH_STORAGE_KEY, JSON.stringify(parsedData))
    } catch (error) {
      state.healthError =
        error instanceof Error
          ? error.message
          : 'Something went wrong while parsing the Apple Health export.'
    } finally {
      state.healthLoading = false
      input.value = ''
      render()
    }
  })

  app.querySelector<HTMLInputElement>('#court-fill')?.addEventListener('input', (event) => {
    const target = event.currentTarget as HTMLInputElement
    state.courtFill = Number(target.value)
    render()
  })
}

render()
