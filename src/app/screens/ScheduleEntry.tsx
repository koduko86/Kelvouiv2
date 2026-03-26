import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useController, VRFMode, FanSpeed, ScheduleEntry } from '../context/ControllerContext';
import { useTranslation } from '../context/i18n';
import { ArrowLeft, Power, PowerOff, Clock, CalendarDays, Thermometer, Gauge } from 'lucide-react';
import { Switch } from '../components/ui/switch';
import { FanSpeedIcon } from '../components/FanSpeedIcon';
import { displayTemp, tempSuffix } from '../utils/temperature';
import { SectionLabel } from '../components/SectionLabel';

/** Convert IANA timezone to GMT offset string */
function formatGMTOffset(tz?: string): string {
  try {
    const now = new Date();
    const fmt = new Intl.DateTimeFormat('en-US', { timeZone: tz || undefined, timeZoneName: 'shortOffset' });
    const parts = fmt.formatToParts(now);
    const tzPart = parts.find(p => p.type === 'timeZoneName');
    return tzPart?.value ?? 'GMT';
  } catch {
    return 'GMT';
  }
}

const DAY_I18N_KEYS = ['day.mon_short', 'day.tue_short', 'day.wed_short', 'day.thu_short', 'day.fri_short', 'day.sat_short', 'day.sun_short'] as const;

const modeOptions: { id: VRFMode; labelKey: string; cssVar: string }[] = [
  { id: 'cool', labelKey: 'mode.cool', cssVar: 'var(--mode-cool)' },
  { id: 'heat', labelKey: 'mode.heat', cssVar: 'var(--mode-heat)' },
  { id: 'fan', labelKey: 'mode.fan', cssVar: 'var(--mode-fan)' },
  { id: 'dry', labelKey: 'mode.dry', cssVar: 'var(--mode-dry)' },
  { id: 'auto', labelKey: 'mode.auto', cssVar: 'var(--mode-auto-bg)' },
];

const fanSpeeds: FanSpeed[] = ['off', 'low', 'med', 'high', 'auto'];
const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES_5 = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

/** "Do not change" toggle pill */
function KeepToggle({
  active,
  onToggle,
  label,
}: {
  active: boolean;
  onToggle: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(!active)}
      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all whitespace-nowrap shrink-0 ${
        active
          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
          : 'bg-app-control text-app-text-dim border border-transparent'
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full border-[1.5px] transition-all flex items-center justify-center ${
          active ? 'border-amber-400 bg-amber-400' : 'border-app-text-dim'
        }`}
      >
        {active && <span className="block w-0.5 h-0.5 rounded-full bg-black" />}
      </span>
      {label}
    </button>
  );
}

export function ScheduleEntryScreen() {
  const { settings, updateSchedule } = useController();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const dayIndex = parseInt(searchParams.get('day') || '0');
  const entryId = searchParams.get('entry');

  const daySchedule = settings.schedule[dayIndex];
  const existingEntry = entryId ? daySchedule.entries.find(e => e.id === entryId) : null;

  const [time, setTime] = useState(existingEntry?.time || '08:00');
  const [power, setPower] = useState<'on' | 'off'>(existingEntry?.power || 'on');
  const [temperature, setTemperature] = useState(existingEntry?.temperature ?? 22);
  const [tempSkip, setTempSkip] = useState(existingEntry ? existingEntry.temperature === null : false);
  const [mode, setMode] = useState<VRFMode>(existingEntry?.mode || 'auto');
  const [modeSkip, setModeSkip] = useState(existingEntry ? existingEntry.mode === null : false);
  const [fanSpeed, setFanSpeed] = useState<FanSpeed>(existingEntry?.fanSpeed || 'auto');
  const [fanSkip, setFanSkip] = useState(existingEntry ? existingEntry.fanSpeed === null : false);
  const [enabled, setEnabled] = useState(existingEntry?.enabled ?? true);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempHour, setTempHour] = useState(time.split(':')[0]);
  const [tempMinute, setTempMinute] = useState(time.split(':')[1]);
  const [selectedDays, setSelectedDays] = useState<number[]>([dayIndex]);

  const toggleDay = (index: number) => {
    setSelectedDays(prev =>
      prev.includes(index) ? prev.filter(d => d !== index) : [...prev, index]
    );
  };

  const handleSave = () => {
    const entry: ScheduleEntry = {
      id: entryId || Date.now().toString(),
      time,
      power,
      temperature: tempSkip ? null : temperature,
      mode: modeSkip ? null : mode,
      fanSpeed: fanSkip ? null : fanSpeed,
      enabled,
    };

    if (entryId) {
      updateSchedule(dayIndex, {
        ...daySchedule,
        entries: daySchedule.entries.map(e => e.id === entryId ? entry : e),
      });
    } else {
      selectedDays.forEach((selectedDayIndex) => {
        const targetDay = settings.schedule[selectedDayIndex];
        const newEntry = { ...entry, id: `${Date.now()}-${selectedDayIndex}-${Math.random()}` };
        updateSchedule(selectedDayIndex, {
          ...targetDay,
          entries: [...targetDay.entries, newEntry].sort((a, b) => a.time.localeCompare(b.time)),
        });
      });
    }

    navigate('/schedule');
  };

  const openTimePicker = () => {
    const [h, m] = time.split(':');
    setTempHour(h);
    setTempMinute(m);
    setShowTimePicker(true);
  };

  const confirmTime = () => {
    setTime(`${tempHour}:${tempMinute}`);
    setShowTimePicker(false);
  };

  return (
    <div className="h-full bg-app-bg flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center px-4 h-[50px] bg-app-header border-b border-app-line flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 hover:bg-app-hover rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-app-text-sub" />
        </button>
        <h1 className="flex-1 text-center text-sm font-semibold text-app-text pr-9">
          {entryId ? t('sched_entry.edit') : t('sched_entry.add')}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-4 pb-4 min-h-0 space-y-5">

        {/* Enable + Time row */}
        <section>
          <SectionLabel>{t('sched_entry.time')}</SectionLabel>
          <div className="bg-app-panel rounded-2xl p-3 space-y-3">
            {/* Enable toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CalendarDays className="w-4 h-4 text-app-text-sub" />
                <div>
                  <div className="text-sm font-medium text-app-text">{t('sched_entry.enable_entry')}</div>
                  <div className="text-xs text-app-text-dim">{t('sched_entry.enable_desc')}</div>
                </div>
              </div>
              <Switch checked={enabled} onCheckedChange={setEnabled} />
            </div>

            <div className="h-px bg-app-line" />

            {/* Time picker trigger */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-app-text-sub" />
                <div>
                  <div className="text-sm font-medium text-app-text">{t('sched_entry.time')}</div>
                  <div className="text-xs text-app-text-dim">{formatGMTOffset(settings.timezone)}</div>
                </div>
              </div>
              <button
                onClick={openTimePicker}
                className="px-4 py-1.5 bg-app-control rounded-xl text-sm font-semibold text-app-text hover:bg-app-hover transition-colors"
              >
                {time}
              </button>
            </div>
          </div>
        </section>

        {/* Days */}
        <section>
          <SectionLabel>{t('sched_entry.select_days')}</SectionLabel>
          <div className="bg-app-panel rounded-2xl p-3">
            <div className="text-xs text-app-text-dim mb-2">{t('sched_entry.select_days_desc')}</div>
            <div className="flex gap-1.5">
              {settings.schedule.map((day, index) => (
                <button
                  key={day.day}
                  onClick={() => toggleDay(index)}
                  className={`flex-1 py-2.5 rounded-xl text-[11px] font-semibold transition-all min-w-0 ${
                    selectedDays.includes(index)
                      ? 'bg-app-action text-white'
                      : 'bg-app-control text-app-text-sub'
                  }`}
                >
                  {t(DAY_I18N_KEYS[index] as any)}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Power */}
        <section>
          <SectionLabel>{t('sched_entry.power')}</SectionLabel>
          <div className="bg-app-panel rounded-2xl p-3">
            <div className="text-xs text-app-text-dim mb-2">{t('sched_entry.power_desc')}</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPower('on')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all border ${
                  power === 'on'
                    ? 'bg-app-success text-white border-transparent'
                    : 'bg-app-control text-app-text-dim border-transparent'
                }`}
              >
                <Power className="w-4 h-4" />
                {t('sched_entry.turn_on')}
              </button>
              <button
                onClick={() => setPower('off')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all border ${
                  power === 'off'
                    ? 'bg-app-danger text-white border-transparent'
                    : 'bg-app-control text-app-text-dim border-transparent'
                }`}
              >
                <PowerOff className="w-4 h-4" />
                {t('sched_entry.turn_off')}
              </button>
            </div>
          </div>
        </section>

        {/* Temperature */}
        <section>
          <div className="flex items-center justify-between px-1 mb-2">
            <SectionLabel>
              {t('sched_entry.temperature')}{!tempSkip && <> — {displayTemp(temperature, settings.temperatureUnit)}°{tempSuffix(settings.temperatureUnit)}</>}
            </SectionLabel>
            <KeepToggle active={tempSkip} onToggle={setTempSkip} label={t('sched_entry.keep')} />
          </div>
          <div className={`bg-app-panel rounded-2xl p-3 transition-opacity ${tempSkip ? 'opacity-40 pointer-events-none' : ''}`}>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTemperature(Math.max(16, temperature - 1))}
                className="w-10 h-10 bg-app-control rounded-xl font-semibold text-app-text hover:bg-app-hover transition-colors flex items-center justify-center"
              >
                −
              </button>
              <div className="flex-1">
                <input
                  type="range"
                  min="16"
                  max="32"
                  value={temperature}
                  onChange={(e) => setTemperature(parseInt(e.target.value))}
                  className="w-full accent-[var(--app-action)]"
                />
              </div>
              <button
                onClick={() => setTemperature(Math.min(32, temperature + 1))}
                className="w-10 h-10 bg-app-control rounded-xl font-semibold text-app-text hover:bg-app-hover transition-colors flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        </section>

        {/* Mode */}
        <section>
          <div className="flex items-center justify-between px-1 mb-2">
            <SectionLabel>{t('home.mode')}</SectionLabel>
            <KeepToggle active={modeSkip} onToggle={setModeSkip} label={t('sched_entry.keep')} />
          </div>
          <div className={`bg-app-panel rounded-2xl p-3 transition-opacity ${modeSkip ? 'opacity-40 pointer-events-none' : ''}`}>
            <div className="flex gap-1.5">
              {modeOptions.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`flex-1 py-2.5 rounded-xl font-medium text-[11px] capitalize transition-all min-w-0 leading-tight text-center break-words px-0.5 border ${
                    mode === m.id
                      ? 'text-white border-transparent'
                      : 'bg-app-control text-app-text-sub border-transparent'
                  }`}
                  style={mode === m.id ? { backgroundColor: m.cssVar } : {}}
                >
                  {t(m.labelKey as any)}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Fan Speed */}
        <section>
          <div className="flex items-center justify-between px-1 mb-2">
            <SectionLabel>{t('home.fan')}</SectionLabel>
            <KeepToggle active={fanSkip} onToggle={setFanSkip} label={t('sched_entry.keep')} />
          </div>
          <div className={`bg-app-panel rounded-2xl p-3 transition-opacity ${fanSkip ? 'opacity-40 pointer-events-none' : ''}`}>
            <div className="flex gap-1.5">
              {fanSpeeds.map((speed) => (
                <button
                  key={speed}
                  onClick={() => setFanSpeed(speed)}
                  className={`flex-1 py-2.5 rounded-xl font-medium text-[10px] capitalize transition-all min-w-0 border flex items-center justify-center ${
                    fanSpeed === speed
                      ? 'bg-app-action text-white border-transparent'
                      : 'bg-app-control text-app-text-sub border-transparent'
                  }`}
                >
                  <FanSpeedIcon speed={speed} isActive={fanSpeed === speed} />
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Save Button — compact pill style */}
      <div className="px-4 pb-4 pt-1 flex-shrink-0 flex justify-center">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-app-action text-white rounded-full text-sm font-medium hover:bg-app-action-hover active:scale-95 transition-all shadow-md"
        >
          {entryId ? t('sched_entry.update') : t('sched_entry.add_btn')}
        </button>
      </div>

      {/* Time Picker Modal */}
      {showTimePicker && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50 px-6">
          <div className="bg-app-panel rounded-2xl max-w-sm w-full p-5 border border-app-line">
            <h3 className="text-base font-semibold text-app-text mb-3 text-center">{t('sched_entry.select_time')}</h3>

            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-app-text tracking-wider">{tempHour}:{tempMinute}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[11px] font-semibold text-app-text-hint mb-1.5 text-center uppercase tracking-wide">{t('sched_entry.hour')}</label>
                <div className="bg-app-control rounded-xl p-1.5 max-h-40 overflow-y-auto">
                  {HOURS.map((h) => (
                    <button
                      key={h}
                      onClick={() => setTempHour(h)}
                      className={`w-full py-1.5 px-2 rounded-lg text-sm font-medium transition-all mb-0.5 ${
                        tempHour === h
                          ? 'bg-app-action text-white'
                          : 'text-app-text-label hover:bg-app-hover'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-app-text-hint mb-1.5 text-center uppercase tracking-wide">{t('sched_entry.minute')}</label>
                <div className="bg-app-control rounded-xl p-1.5 max-h-40 overflow-y-auto">
                  {MINUTES_5.map((m) => (
                     <button
                       key={m}
                       onClick={() => setTempMinute(m)}
                       className={`w-full py-1.5 px-2 rounded-lg text-sm font-medium transition-all mb-0.5 ${
                         tempMinute === m
                           ? 'bg-app-action text-white'
                           : 'text-app-text-label hover:bg-app-hover'
                       }`}
                     >
                       {m}
                     </button>
                   ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowTimePicker(false)}
                className="flex-1 py-2 bg-app-control text-app-text-label rounded-xl font-medium hover:bg-app-hover transition-colors"
              >
                {t('dialog.cancel')}
              </button>
              <button
                onClick={confirmTime}
                className="flex-1 py-2 bg-app-action text-white rounded-xl font-medium hover:bg-app-action-hover transition-colors"
              >
                {t('dialog.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}