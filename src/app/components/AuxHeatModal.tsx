import { X, Flame, Layers, Zap, Thermometer, Timer, Fan as FanIcon, Wind } from 'lucide-react';
import { useController, DEFAULT_AUX_HEAT, type AuxHeatConfig, type HeatSource, type HeatingMode, type Stage2Trigger, type FanDuringHeating, type CirculateModeFan } from '../context/ControllerContext';
import { useTranslation } from '../context/i18n';

interface Props {
  open: boolean;
  onClose: () => void;
}

interface SegProps<T extends string | number> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  cols?: number;
}

function Seg<T extends string | number>({ options, value, onChange, cols }: SegProps<T>) {
  const n = cols ?? options.length;
  const colsClass =
    n === 2 ? 'grid-cols-2'
    : n === 3 ? 'grid-cols-3'
    : n === 4 ? 'grid-cols-4'
    : n === 6 ? 'grid-cols-6'
    : 'grid-cols-2';
  return (
    <div className={`grid ${colsClass} gap-1.5`}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={String(o.value)}
            onClick={() => onChange(o.value)}
            className={`py-2 px-2 rounded-lg transition-all text-[11px] font-medium ${
              active
                ? 'bg-app-action text-white'
                : 'bg-app-control text-app-text-sub hover:bg-app-hover'
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Row({ icon: Icon, label, children }: { icon: any; label: string; children: React.ReactNode }) {
  return (
    <div className="bg-app-panel rounded-2xl p-3">
      <div className="flex items-center gap-2.5 mb-2.5">
        <Icon className="w-4 h-4 text-app-text-sub" />
        <div className="font-medium text-app-text text-sm">{label}</div>
      </div>
      {children}
    </div>
  );
}

export function AuxHeatModal({ open, onClose }: Props) {
  const { settings, updateSettings } = useController();
  const { t } = useTranslation();
  if (!open) return null;

  const cfg = settings.auxHeat ?? DEFAULT_AUX_HEAT;
  const set = (patch: Partial<AuxHeatConfig>) =>
    updateSettings({ auxHeat: { ...cfg, ...patch } });

  const sources: { value: HeatSource; label: string }[] = [
    { value: 'vrf', label: t('aux.src_vrf' as any) },
    { value: 'relay', label: t('aux.src_relay' as any) },
  ];

  return (
    <div className="absolute inset-0 z-50 bg-app-bg flex flex-col">
      {/* Header */}
      <div className="h-[50px] flex items-center justify-between px-4 border-b border-app-line shrink-0">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-app-action" />
          <div className="font-semibold text-app-text text-sm">{t('aux.title' as any)}</div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-app-hover active:bg-app-hover transition-colors"
        >
          <X className="w-5 h-5 text-app-text-sub" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        <div className="text-[11px] leading-relaxed text-app-text-dim px-1">
          {t('aux.desc' as any)}
        </div>

        <Row icon={Layers} label={t('aux.heating_mode' as any)}>
          <Seg<HeatingMode>
            value={cfg.heatingMode}
            onChange={(v) => set({ heatingMode: v })}
            options={[
              { value: 'single', label: t('aux.single_stage' as any) },
              { value: 'two_stage', label: t('aux.two_stage' as any) },
            ]}
          />
        </Row>

        <Row icon={Zap} label={t('aux.stage1_source' as any)}>
          <Seg<HeatSource>
            value={cfg.stage1Source}
            onChange={(v) => set({ stage1Source: v })}
            options={sources}
          />
        </Row>

        {cfg.heatingMode === 'two_stage' && (
          <>
            <Row icon={Zap} label={t('aux.stage2_source' as any)}>
              <Seg<HeatSource>
                value={cfg.stage2Source}
                onChange={(v) => set({ stage2Source: v })}
                options={sources}
              />
            </Row>

            <Row icon={Flame} label={t('aux.activate_stage2' as any)}>
              <Seg<Stage2Trigger>
                value={cfg.stage2Trigger}
                onChange={(v) => set({ stage2Trigger: v })}
                options={[
                  { value: 'temp_or_time', label: t('aux.trigger_or' as any) },
                  { value: 'temp_and_time', label: t('aux.trigger_and' as any) },
                ]}
              />
            </Row>

            <Row icon={Thermometer} label={t('aux.temp_offset' as any)}>
              <Seg<number>
                cols={6}
                value={cfg.tempOffset}
                onChange={(v) => set({ tempOffset: v })}
                options={[0.5, 1.0, 1.5, 2.0, 2.5, 3.0].map((v) => ({
                  value: v,
                  label: `${v}°`,
                }))}
              />
            </Row>

            <Row icon={Timer} label={t('aux.time_delay' as any)}>
              <Seg<number>
                value={cfg.timeDelayMin}
                onChange={(v) => set({ timeDelayMin: v })}
                options={[5, 10, 15, 30].map((v) => ({
                  value: v,
                  label: `${v} ${t('aux.minutes_short' as any)}`,
                }))}
              />
            </Row>
          </>
        )}

        <Row icon={Timer} label={t('aux.min_on_time' as any)}>
          <Seg<number>
            value={cfg.minOnTimeMin}
            onChange={(v) => set({ minOnTimeMin: v })}
            options={[5, 10, 15, 30].map((v) => ({
              value: v,
              label: `${v} ${t('aux.minutes_short' as any)}`,
            }))}
          />
        </Row>

        <Row icon={FanIcon} label={t('aux.fan_during_heating' as any)}>
          <Seg<FanDuringHeating>
            cols={2}
            value={cfg.fanDuringHeating}
            onChange={(v) => set({ fanDuringHeating: v })}
            options={[
              { value: 'off', label: t('aux.fan_off' as any) },
              { value: 'stage1', label: t('aux.fan_s1' as any) },
              { value: 'stage2', label: t('aux.fan_s2' as any) },
              { value: 'both', label: t('aux.fan_both' as any) },
            ]}
          />
        </Row>

        <Row icon={Timer} label={t('aux.fan_delay_off' as any)}>
          <Seg<number>
            value={cfg.fanDelayOffMin}
            onChange={(v) => set({ fanDelayOffMin: v })}
            options={[
              { value: 0, label: t('aux.fan_off' as any) },
              { value: 5, label: `5 ${t('aux.minutes_short' as any)}` },
              { value: 10, label: `10 ${t('aux.minutes_short' as any)}` },
              { value: 15, label: `15 ${t('aux.minutes_short' as any)}` },
            ]}
          />
        </Row>

        <Row icon={Wind} label={t('aux.circulate_fan' as any)}>
          <Seg<CirculateModeFan>
            value={cfg.circulateModeFan}
            onChange={(v) => set({ circulateModeFan: v })}
            options={[
              { value: 'off', label: t('aux.circulate_off' as any) },
              { value: 'low', label: t('aux.circulate_low' as any) },
            ]}
          />
        </Row>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-app-line shrink-0">
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-app-action text-white text-sm font-medium hover:bg-app-action-hover transition-colors"
        >
          {t('aux.done' as any)}
        </button>
      </div>
    </div>
  );
}
