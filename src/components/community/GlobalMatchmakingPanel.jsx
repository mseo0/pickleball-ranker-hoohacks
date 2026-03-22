import FilterSectionLabel from './FilterSectionLabel'
import PoolScopeToggle from './PoolScopeToggle'
import CommunityMultiSelect from './CommunityMultiSelect'
import MatchTypeFilters from './MatchTypeFilters'
import EloRangeSelector from './EloRangeSelector'
import CourtSelector from './CourtSelector'
import TimeSlotSelector from './TimeSlotSelector'
import FindMatchButton from './FindMatchButton'

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
}) {
  const poolLabel =
    poolScope === 'anyone'
      ? 'Anyone on Picklerank'
      : poolScope === 'specific'
        ? `${selectedCommunities.length} communities`
        : 'My communities'

  return (
    <section className="relative flex flex-col gap-[14px] overflow-hidden rounded-[14px] border-2 border-[rgba(200,241,53,0.22)] bg-[var(--card)] px-[20px] py-[18px]">
      <div
        className="pointer-events-none absolute right-[-40px] top-[-40px] h-[180px] w-[180px]"
        style={{
          background: 'radial-gradient(circle, rgba(200,241,53,0.07), transparent 70%)',
        }}
      />

      <div className="relative flex items-start justify-between gap-[14px]">
        <div className="flex flex-col">
          <div className="mb-[3px] text-[9px] uppercase tracking-[0.1em] text-[var(--accent)]">
            Global Matchmaking
          </div>
          <div className="font-display text-[22px] tracking-[0.04em] text-[var(--text)]">
            Find My Match
          </div>
          <div className="mt-[4px] max-w-[420px] text-[11px] leading-[1.5] text-[var(--muted)]">
            Match with any available player on the platform — not just your community.
          </div>
        </div>

        <div className="flex items-center gap-[6px] rounded-[20px] border border-[rgba(74,222,128,0.20)] bg-[rgba(74,222,128,0.10)] px-[10px] py-[4px]">
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
        poolLabel={poolLabel}
        eloRange={rangeDelta}
        courtCount={selectedCourts.length}
        slotCount={selectedSlots.length}
        typeCount={matchTypes.length}
        onClick={onFindMatch}
      />
    </section>
  )
}

export default GlobalMatchmakingPanel
