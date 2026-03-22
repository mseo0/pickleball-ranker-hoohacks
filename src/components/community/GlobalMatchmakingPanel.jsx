import FilterSectionLabel from './FilterSectionLabel'
import PoolScopeToggle from './PoolScopeToggle'
import CommunityMultiSelect from './CommunityMultiSelect'
import MatchTypeFilters from './MatchTypeFilters'
import EloRangeSelector from './EloRangeSelector'
import CourtSelector from './CourtSelector'
import TimeSlotSelector from './TimeSlotSelector'
import FindMatchButton from './FindMatchButton'

const matchTypeLabels = {
  rated: 'Rated',
  unrated: 'Unrated',
  competitive: 'Competitive',
  casual: 'Casual',
  doubles: 'Doubles',
  singles: 'Singles',
}

function GlobalMatchmakingPanel({
  queueCount,
  poolScope,
  setPoolScope,
  communities,
  selectedCommunities,
  toggleCommunity,
  matchTypes,
  toggleMatchType,
  userElo,
  eloMin,
  eloMax,
  rangeDelta,
  isAdjustingRange,
  toggleAdjustRange,
  adjustRange,
  courts,
  selectedCourts,
  toggleCourt,
  selectedSlots,
  toggleSlot,
  onFindMatch,
  isSearching = false,
  searchElapsed = 0,
}) {
  const poolLabel =
    poolScope === 'anyone'
      ? 'Anyone'
      : poolScope === 'specific'
        ? `${selectedCommunities.length} communities`
        : 'My communities'

  const selectedTypeSummary = matchTypes
    .map((type) => matchTypeLabels[type])
    .filter(Boolean)
    .join(' + ')

  const summary = `${poolLabel} · ±${rangeDelta} ELO · ${selectedCourts.length} courts · ${selectedSlots.length} time slots${selectedTypeSummary ? ` · ${selectedTypeSummary}` : ''}`

  return (
    <section
      className="relative flex flex-col gap-[14px] overflow-hidden"
      style={{
        background: '#142014',
        border: '2px solid rgba(200,241,53,0.22)',
        borderRadius: '14px',
        padding: '18px 20px',
      }}
    >
      <div
        className="pointer-events-none absolute right-[-40px] top-[-40px] h-[180px] w-[180px]"
        style={{
          background: 'radial-gradient(circle, rgba(200,241,53,0.07), transparent 70%)',
        }}
      />

      <div className="relative flex items-start justify-between gap-[14px]">
        <div className="flex flex-col">
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '9px',
              fontWeight: 600,
              color: '#C8F135',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: '3px',
              display: 'block',
            }}
          >
            Global Matchmaking
          </span>
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '26px',
              fontWeight: 400,
              color: '#e8f0e8',
              letterSpacing: '0.04em',
              lineHeight: 1,
            }}
          >
            Find My Match
          </div>
          <div className="mt-[4px] max-w-[420px] text-[11px] leading-[1.5] text-[var(--muted)]">
            Match with any available player on the platform — not just your community.
          </div>
        </div>

        <div className="flex items-center gap-[7px] rounded-[20px] border border-[rgba(74,222,128,0.22)] bg-[rgba(74,222,128,0.10)] px-[12px] py-[5px]">
          <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-[#4ade80]" />
          <span className="text-[11px] font-semibold text-[#4ade80]">{queueCount} players queued</span>
        </div>
      </div>

      <div>
        <FilterSectionLabel>Match Pool</FilterSectionLabel>
        <PoolScopeToggle value={poolScope} onChange={setPoolScope} />
      </div>

      {poolScope === 'specific' ? (
        <div>
          <FilterSectionLabel>Communities to include</FilterSectionLabel>
          <CommunityMultiSelect
            communities={communities}
            selectedCommunities={selectedCommunities}
            onToggle={toggleCommunity}
          />
        </div>
      ) : null}

      <div>
        <FilterSectionLabel>Match Type</FilterSectionLabel>
        <MatchTypeFilters value={matchTypes} onToggle={toggleMatchType} />
      </div>

      <div>
        <FilterSectionLabel>ELO Range — auto-set from your score ({userElo})</FilterSectionLabel>
        <EloRangeSelector
          userElo={userElo}
          eloMin={eloMin}
          eloMax={eloMax}
          rangeDelta={rangeDelta}
          isAdjusting={isAdjustingRange}
          onToggleAdjust={toggleAdjustRange}
          onAdjust={adjustRange}
        />
      </div>

      <div>
        <FilterSectionLabel>Courts I can play at today</FilterSectionLabel>
        <CourtSelector courts={courts} selectedCourts={selectedCourts} onToggle={toggleCourt} />
      </div>

      <div>
        <FilterSectionLabel>Times I'm available today</FilterSectionLabel>
        <TimeSlotSelector
          slots={['8am', '10am', '12pm', '2pm', '4pm', '6pm']}
          selectedSlots={selectedSlots}
          onToggle={toggleSlot}
        />
      </div>

      <FindMatchButton
        summary={
          isSearching
            ? `Searching nearby players... ${Math.floor(searchElapsed / 60)}:${String(searchElapsed % 60).padStart(2, '0')}`
            : summary
        }
        onClick={onFindMatch}
      />

      {isSearching ? (
        <div className="rounded-[12px] border border-[rgba(200,241,53,0.14)] bg-[rgba(200,241,53,0.06)] px-[14px] py-[12px]">
          <div className="flex items-center justify-between gap-[10px]">
            <div>
              <div className="text-[12px] font-semibold text-[var(--accent)]">Queueing for a match</div>
              <div className="mt-[2px] text-[11px] text-[var(--muted)]">
                Finding the best nearby player and confirming automatically.
              </div>
            </div>
            <div className="rounded-full bg-[rgba(200,241,53,0.12)] px-[10px] py-[5px] text-[11px] font-semibold text-[var(--accent)]">
              {Math.floor(searchElapsed / 60)}:{String(searchElapsed % 60).padStart(2, '0')}
            </div>
          </div>

          <div className="mt-[10px] h-[6px] overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
            <div className="searching-progress h-full w-[32%] rounded-full bg-[var(--accent)]" />
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default GlobalMatchmakingPanel
