import React from 'react';
import { ChevronDown } from 'lucide-react';
import {
  FILM_DROPDOWN_OPTIONS,
  FILM_LOOKUP,
  type FilmSelection,
  isFilmSelectionComplete,
} from '@/lib/filmOptions';

type FilmProductDropdownProps = {
  label?: string;
  required?: boolean;
  value: FilmSelection;
  onChange: (value: FilmSelection) => void;
};

export default function FilmProductDropdown({
  label = 'TINT TYPE',
  required = false,
  value,
  onChange,
}: FilmProductDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [step, setStep] = React.useState<'product' | 'detail'>('product');
  const [pendingProduct, setPendingProduct] = React.useState<string | null>(null);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);

  const selectionComplete = isFilmSelectionComplete(value);
  const selectedFilm = selectionComplete ? FILM_LOOKUP[value.tintType as keyof typeof FILM_LOOKUP] : null;
  const pendingFilm = pendingProduct ? FILM_LOOKUP[pendingProduct as keyof typeof FILM_LOOKUP] : null;

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (!selectionComplete) {
          setStep('product');
          setPendingProduct(null);
        }
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        if (!selectionComplete) {
          setStep('product');
          setPendingProduct(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [selectionComplete]);

  const handleToggle = () => {
    setIsOpen((open) => {
      const nextOpen = !open;
      setStep('product');
      setPendingProduct(null);
      return nextOpen;
    });
  };

  const handleProductSelect = (product: string) => {
    setPendingProduct(product);
    setStep('detail');
  };

  const handleDetailSelect = (detail: string) => {
    if (!pendingProduct) return;
    onChange({ tintType: pendingProduct, tintDetail: detail });
    setIsOpen(false);
    setStep('product');
    setPendingProduct(null);
  };

  const handleStepBack = () => {
    setStep('product');
    setPendingProduct(null);
  };

  return (
    <div>
      <label className="b-label">
        {label} {required && <span style={{ color: '#0a73ff' }}>*</span>}
      </label>
      <div ref={dropdownRef} style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={handleToggle}
          className="b-select"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textAlign: 'left',
            cursor: 'pointer',
          }}
        >
          <span style={{ color: selectionComplete || pendingProduct ? '#ffffff' : '#94a3b8' }}>
            {selectionComplete
              ? value.tintType
              : pendingProduct && step === 'detail'
                ? pendingProduct
                : 'Select the film products'}
          </span>
          <ChevronDown
            size={18}
            style={{
              color: '#94a3b8',
              flexShrink: 0,
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          />
        </button>

        <div
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 0.35rem)',
            left: 0,
            right: 0,
            zIndex: 20,
            backgroundColor: '#05080d',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '6px',
            overflow: 'hidden',
            maxHeight: isOpen ? '280px' : '0px',
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? 'translateY(0)' : 'translateY(-6px)',
            pointerEvents: isOpen ? 'auto' : 'none',
            transition: 'max-height 0.24s ease, opacity 0.18s ease, transform 0.22s ease',
            boxShadow: isOpen ? '0 10px 30px rgba(0, 0, 0, 0.45)' : 'none',
          }}
        >
          {step === 'product' ? (
            FILM_DROPDOWN_OPTIONS.map((option, index) => {
              const isSelected = selectionComplete && value.tintType === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleProductSelect(option.value)}
                  role="option"
                  aria-selected={isSelected}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.75rem',
                    border: 'none',
                    borderBottom: index < FILM_DROPDOWN_OPTIONS.length - 1 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                    backgroundColor: isSelected ? 'rgba(10, 115, 255, 0.18)' : 'transparent',
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                  }}
                >
                  {option.label}
                </button>
              );
            })
          ) : (
            pendingFilm && (
              <>
                <button
                  type="button"
                  onClick={handleStepBack}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.65rem 0.75rem',
                    border: 'none',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    color: '#94a3b8',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  ← Back to film products
                </button>
                <div
                  style={{
                    padding: '0.65rem 0.75rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#0a73ff',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  {pendingFilm.label}
                </div>
                {pendingFilm.details.map((detail, index) => {
                  const isSelected = value.tintDetail === detail && value.tintType === pendingFilm.value;
                  return (
                    <button
                      key={detail}
                      type="button"
                      onClick={() => handleDetailSelect(detail)}
                      role="option"
                      aria-selected={isSelected}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.75rem',
                        border: 'none',
                        borderBottom: index < pendingFilm.details.length - 1 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                        backgroundColor: isSelected ? 'rgba(10, 115, 255, 0.18)' : 'transparent',
                        color: '#ffffff',
                        fontSize: '0.92rem',
                        cursor: 'pointer',
                      }}
                    >
                      {detail}
                    </button>
                  );
                })}
              </>
            )
          )}
        </div>
      </div>

      {selectionComplete && selectedFilm && (
        <div
          style={{
            marginTop: '0.75rem',
            padding: '0.85rem 1rem',
            borderRadius: '6px',
            backgroundColor: 'rgba(10, 115, 255, 0.08)',
            border: '1px solid rgba(10, 115, 255, 0.2)',
            color: '#cbd5e1',
            fontSize: '0.88rem',
            lineHeight: 1.5,
          }}
        >
          <div style={{ color: '#fff', fontWeight: 700, marginBottom: '0.15rem' }}>
            {selectedFilm.label}
          </div>
          <ul style={{ listStyle: 'disc', margin: '0.25rem 0 0 1.1rem', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
            {selectedFilm.details.map((detail) => (
              <li
                key={detail}
                style={{
                  color: detail === value.tintDetail ? '#ffffff' : '#cbd5e1',
                  fontWeight: detail === value.tintDetail ? 600 : 400,
                }}
              >
                {detail}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
