'use client'

import { useState } from 'react'
import { Download, X, Check } from 'lucide-react'
import { exportToCsv, CSV_COLUMNS, type CsvColumn } from '@/lib/csv'
import type { Hospital } from '@/types'

interface ExportButtonProps {
  hospitals: Hospital[]
  query?: string
}

export function ExportButton({ hospitals, query = '' }: ExportButtonProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<CsvColumn[]>(
    CSV_COLUMNS.map((c) => c.key)
  )

  const toggle = (key: CsvColumn) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const handleExport = () => {
    exportToCsv(hospitals, selected, query)
    setOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={hospitals.length === 0}
        className="btn-ghost flex items-center gap-2 text-sm border rounded-lg px-3 py-2"
        style={{ borderColor: 'var(--border)' }}
        aria-label="Export results as CSV"
      >
        <Download size={14} />
        Export Results
        <span
          className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
          style={{
            background: 'var(--accent-subtle)',
            color: 'var(--accent)',
          }}
        >
          CSV
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: 'rgba(13,27,42,0.5)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className="font-bold text-base"
                style={{
                  fontFamily: 'Sora, sans-serif',
                  color: 'var(--fg)',
                }}
              >
                Export as CSV
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="btn-ghost p-1.5 rounded-lg"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-sm mb-4" style={{ color: 'var(--fg-muted)' }}>
              Select columns to include ({hospitals.length} hospitals)
            </p>

            <div className="flex flex-col gap-2 mb-5">
              {CSV_COLUMNS.map((col) => {
                const isSelected = selected.includes(col.key)
                return (
                  <button
                    key={col.key}
                    onClick={() => toggle(col.key)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors"
                    style={{
                      background: isSelected
                        ? 'var(--accent-subtle)'
                        : 'var(--bg-soft)',
                      color: isSelected ? 'var(--accent)' : 'var(--fg-muted)',
                      border: `1px solid ${
                        isSelected ? 'var(--accent)' : 'var(--border)'
                      }`,
                    }}
                    aria-pressed={isSelected}
                  >
                    <div
                      className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                      style={{
                        background: isSelected
                          ? 'var(--accent)'
                          : 'transparent',
                        border: `1.5px solid ${
                          isSelected ? 'var(--accent)' : 'var(--border-strong)'
                        }`,
                      }}
                    >
                      {isSelected && (
                        <Check size={10} color="white" strokeWidth={3} />
                      )}
                    </div>
                    {col.label}
                  </button>
                )
              })}
            </div>

            <button
              onClick={handleExport}
              disabled={selected.length === 0}
              className="btn-primary w-full justify-center"
            >
              <Download size={14} />
              Download CSV
            </button>
          </div>
        </div>
      )}
    </>
  )
}
