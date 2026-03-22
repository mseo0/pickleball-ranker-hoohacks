function SectionHeader({ title, link }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-display text-[14px] tracking-[0.06em] text-[var(--text)]">{title}</span>
      {link ? <span className="cursor-pointer text-[11px] text-[var(--accent)]">{link}</span> : null}
    </div>
  )
}

export default SectionHeader
