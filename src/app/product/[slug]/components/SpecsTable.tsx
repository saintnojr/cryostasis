'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLang } from '@/context/LanguageContext';

const rowVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1], delay: i * 0.04 },
  }),
};

export default function SpecsTable() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-8% 0px' });
  const { t } = useLang();

  const SPECS = [
    { groupKey: 'specs_thermal',     labelKey: 'specs_op_temp',      value: '−196 °C to +4 °C' },
    { groupKey: 'specs_thermal',     labelKey: 'specs_cooling_mode',  value: '003 — Cryogenic' },
    { groupKey: 'specs_thermal',     labelKey: 'specs_stability',     value: '±0.5 °C variance' },
    { groupKey: 'specs_power',       labelKey: 'specs_batt_cap',      value: '37,500 mAh' },
    { groupKey: 'specs_power',       labelKey: 'specs_batt_life',     value: '72 hours continuous' },
    { groupKey: 'specs_power',       labelKey: 'specs_ac',            value: '100–240 V, 50/60 Hz' },
    { groupKey: 'specs_physical',    labelKey: 'specs_dims',          value: '480 × 320 × 280 mm' },
    { groupKey: 'specs_physical',    labelKey: 'specs_volume',        value: '18.4 L' },
    { groupKey: 'specs_physical',    labelKey: 'specs_net_weight',    value: '4.2 kg' },
    { groupKey: 'specs_materials',   labelKey: 'specs_shell',         value: 'ABS polymer' },
    { groupKey: 'specs_materials',   labelKey: 'specs_insulation',    value: 'Expanded polystyrene (EPS)' },
    { groupKey: 'specs_materials',   labelKey: 'specs_inner',         value: 'Medical-grade stainless steel' },
    { groupKey: 'specs_electronics', labelKey: 'specs_display',       value: 'E-ink status panel' },
    { groupKey: 'specs_electronics', labelKey: 'specs_conn',          value: 'BLE 5.0 + GPS tracking' },
    { groupKey: 'specs_electronics', labelKey: 'specs_sensors',       value: 'Temp / Humidity / Shock' },
    { groupKey: 'specs_compliance',  labelKey: 'specs_med_cert',      value: 'ISO 13485:2016' },
    { groupKey: 'specs_compliance',  labelKey: 'specs_transport',     value: 'UN3373 — Category B' },
    { groupKey: 'specs_compliance',  labelKey: 'specs_regulatory',    value: 'CE Marked' },
  ] as const;

  type SpecEntry = typeof SPECS[number];
  const groups = Array.from(new Set(SPECS.map(s => s.groupKey)));

  return (
    <section
      className="relative py-24 md:py-32 bg-cryo-bg-2 border-t border-cryo-border"
      aria-label="Technical specifications"
      ref={ref}
    >
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">
        <motion.div
          className="flex flex-col gap-3 mb-16"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        >
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(240,240,240,0.25)' }}>
            {t('specs_label')}
          </span>
          <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.4rem, 3vw, 2.4rem)', fontWeight: 400, color: 'rgba(240,240,240,0.9)', letterSpacing: '-0.01em' }}>
            {t('specs_heading')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-0">
          {groups.map((group) => {
            const groupSpecs = SPECS.filter(s => s.groupKey === group);
            const globalIndex = SPECS.findIndex(s => s.groupKey === group);
            return (
              <div key={group} className="mb-10">
                <motion.div
                  className="flex items-center gap-4 mb-4"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: globalIndex * 0.04 }}
                >
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '8px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(240,240,240,0.2)' }}>
                    {t(group as Parameters<typeof t>[0])}
                  </span>
                  <div className="flex-1 h-px bg-cryo-fg/[0.07]" />
                </motion.div>
                {groupSpecs.map((spec) => {
                  const absIndex = SPECS.indexOf(spec as SpecEntry);
                  return (
                    <motion.div
                      key={spec.labelKey}
                      custom={absIndex}
                      variants={rowVariants}
                      initial="hidden"
                      animate={isInView ? 'visible' : 'hidden'}
                      className="flex items-baseline justify-between py-3 border-b border-cryo-border"
                    >
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.08em', color: 'rgba(240,240,240,0.4)', textTransform: 'uppercase' }}>
                        {t(spec.labelKey as Parameters<typeof t>[0])}
                      </span>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.05em', color: 'rgba(240,240,240,0.75)' }} className="text-right ml-4">
                        {spec.value}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <motion.p
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.1em', color: 'rgba(240,240,240,0.2)', lineHeight: 1.9, whiteSpace: 'pre-line' }}
        >
          {t('specs_note')}
        </motion.p>
      </div>
    </section>
  );
}
