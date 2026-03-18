import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useController, ScheduleEntry, VRFMode } from '../context/ControllerContext';
import { useTranslation } from '../context/i18n';
import { ArrowLeft, Plus, Trash2, Edit2, Power, PowerOff, CalendarClock } from 'lucide-react';
import { Switch } from '../components/ui/switch';
import { displayTemp, tempSuffix } from '../utils/temperature';

const DAY_I18N_KEYS = ['day.mon_short', 'day.tue_short', 'day.wed_short', 'day.thu_short', 'day.fri_short', 'day.sat_short', 'day.sun_short'] as const;

interface GroupedEntry extends ScheduleEntry {
  days: number[];
}

const MODE_CSS_VARS: Record<VRFMode, string> = {
  cool: 'var(--mode-cool)',
  heat: 'var(--mode-heat)',
  auto: 'var(--mode-auto)',
  fan: 'var(--mode-fan)',
  dry: 'var(--mode-dry)',
};

/* ─── Reusable Section Header (same as Settings) ─── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold tracking-wide text-app-text-hint px-1 mb-2">
      {children}
    </div>
  );
}

export function Schedule() {
  const { settings, updateSettings, updateSchedule } = useController();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [deleteConfirmEntry, setDeleteConfirmEntry] = useState<GroupedEntry | null>(null);

  const handleAddEntry = () => {
    navigate(`/schedule/entry?day=0`);
  };

  const handleDeleteGroupedEntry = (group: GroupedEntry) => {
    group.days.forEach(dayIndex => {
      const day = settings.schedule[dayIndex];
      updateSchedule(dayIndex, {
        ...day,
        entries: day.entries.filter(e =>
          !(e.time === group.time &&
            e.power === group.power &&
            e.temperature === group.temperature &&
            e.mode === group.mode &&
            e.fanSpeed === group.fanSpeed &&
            e.enabled === group.enabled)
        ),
      });
    });
  };

  const groupedEntries = useMemo((): GroupedEntry[] => {
    const groups: GroupedEntry[] = [];

    settings.schedule.forEach((day, dayIndex) => {
      day.entries.forEach(entry => {
        const existingGroup = groups.find(g =>
          g.time === entry.time &&
          g.power === entry.power &&
          g.temperature === entry.temperature &&
          g.mode === entry.mode &&
          g.fanSpeed === entry.fanSpeed &&
          g.enabled === entry.enabled
        );

        if (existingGroup) {
          if (!existingGroup.days.includes(dayIndex)) {
            existingGroup.days.push(dayIndex);
          }
        } else {
          groups.push({ ...entry, days: [dayIndex] });
        }
      });
    });

    return groups.sort((a, b) => a.time.localeCompare(b.time));
  }, [settings.schedule]);

  const getDayLabel = (dayIndex: number) => t(DAY_I18N_KEYS[dayIndex] as any);

  return (
    <div className="h-full bg-app-bg flex flex-col overflow-hidden relative">
      {/* Header — same as Settings */}
      <div className="flex items-center px-4 h-[50px] bg-app-header border-b border-app-line flex-shrink-0">
        <button
          onClick={() => navigate('/home')}
          className="p-2 -ml-2 hover:bg-app-hover rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-app-text-sub" />
        </button>
        <h1 className="flex-1 text-center text-sm font-semibold text-app-text pr-9">{t('sched.title')}</h1>
      </div>

      {/* Content — Settings-style spacing */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-4 pb-4 min-h-0 space-y-5">

        {/* Enable Toggle — Settings panel card style */}
        <section>
          <SectionLabel>{t('sched.title')}</SectionLabel>
          <div className="bg-app-panel rounded-2xl p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CalendarClock className="w-4 h-4 text-app-text-sub" />
                <div>
                  <div className="text-sm font-medium text-app-text">{t('sched.enable')}</div>
                  <div className="text-xs text-app-text-dim">{t('sched.enable_desc')}</div>
                </div>
              </div>
              <Switch
                checked={settings.schedulingEnabled}
                onCheckedChange={(checked) => updateSettings({ schedulingEnabled: checked })}
              />
            </div>
          </div>
        </section>

        {/* Schedule Entries */}
        <section>
          <div className="space-y-2">
            {groupedEntries.length > 0 ? (
              groupedEntries.map(group => (
                <div
                  key={group.id}
                  className={`bg-app-panel rounded-2xl p-3 transition-all ${
                    !group.enabled ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`flex-1 ${!group.enabled ? 'opacity-50 grayscale' : ''}`}>
                      {/* Time + Power badge */}
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-base font-semibold text-app-text">{group.time}</div>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                            group.power === 'on'
                              ? 'bg-app-success/15 text-app-success'
                              : 'bg-app-danger/15 text-app-danger'
                          }`}
                        >
                          {group.power === 'on'
                            ? <><Power className="w-3 h-3" /> {t('home.on')}</>
                            : <><PowerOff className="w-3 h-3" /> {t('home.off')}</>
                          }
                        </span>
                        {group.mode !== null && (
                          <div className="text-sm font-medium capitalize" style={{ color: MODE_CSS_VARS[group.mode] }}>
                            {t(`mode.${group.mode}` as any)}
                          </div>
                        )}
                      </div>
                      {/* Parameters */}
                      <div className="flex items-center gap-2 text-xs text-app-text-sub flex-wrap">
                        {group.temperature !== null ? (
                          <span>{displayTemp(group.temperature, settings.temperatureUnit)}&deg;{tempSuffix(settings.temperatureUnit)}</span>
                        ) : (
                          <span className="text-amber-400/70 text-xs italic">{t('sched_entry.keep')}</span>
                        )}
                        {group.mode === null && (
                          <span className="text-amber-400/70 text-xs italic">{t('sched_entry.keep')}</span>
                        )}
                        {group.fanSpeed !== null ? (
                          <span>{t('home.fan')}: {t(`fan.${group.fanSpeed}` as any)}</span>
                        ) : (
                          <span className="text-amber-400/70 text-xs italic">{t('sched_entry.keep')}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => navigate(`/schedule/entry?day=${group.days[0]}&entry=${group.id}`)}
                        className="p-2 bg-app-action/10 hover:bg-app-action/20 rounded-xl transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-app-action" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmEntry(group)}
                        className="p-2 bg-app-danger/10 hover:bg-app-danger/20 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-app-danger" />
                      </button>
                    </div>
                  </div>
                  {/* Active Days Pills */}
                  <div className={`mt-2 flex flex-wrap gap-1 ${!group.enabled ? 'opacity-50 grayscale' : ''}`}>
                    {group.days.map(dayIndex => (
                      <span
                        key={dayIndex}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${
                          group.enabled
                            ? 'bg-app-action/15 text-app-action'
                            : 'bg-app-control text-app-text-dim'
                        }`}
                      >
                        {getDayLabel(dayIndex)}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-app-panel rounded-2xl p-6 text-center text-app-text-dim text-sm">
                {t('sched.no_entries')}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Add Entry Button — fixed bottom */}
      <div className="px-4 pb-4 pt-1 flex-shrink-0 flex justify-center">
        <button
          onClick={handleAddEntry}
          className="px-5 py-2 bg-app-action text-white rounded-full text-sm font-medium hover:bg-app-action-hover active:scale-95 transition-all flex items-center gap-2 shadow-md"
        >
          <div className="relative w-5 h-5">
            <CalendarClock className="w-5 h-5" strokeWidth={1.8} />
            <div className="absolute -top-1 -right-1.5 bg-white rounded-full w-2.5 h-2.5 flex items-center justify-center">
              <Plus className="w-2 h-2 text-app-action" strokeWidth={3} />
            </div>
          </div>
          {t('sched.add')}
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmEntry && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50 px-6">
          <div className="bg-app-panel rounded-2xl max-w-sm w-full p-6 border border-app-line">
            <h3 className="text-base font-semibold text-app-text mb-2">{t('sched.delete_title')}</h3>
            <p className="text-sm text-app-text-sub mb-4">
              {t('sched.delete_msg')}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-6">
              {deleteConfirmEntry.days.map(dayIndex => (
                <span key={dayIndex} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-app-danger/15 text-app-danger">
                  {getDayLabel(dayIndex)}
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmEntry(null)}
                className="flex-1 py-2.5 bg-app-control text-app-text-label rounded-xl font-medium hover:bg-app-hover transition-colors"
              >
                {t('dialog.cancel')}
              </button>
              <button
                onClick={() => { handleDeleteGroupedEntry(deleteConfirmEntry); setDeleteConfirmEntry(null); }}
                className="flex-1 py-2.5 bg-app-danger text-white rounded-xl font-medium hover:opacity-90 transition-colors"
              >
                {t('sched.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}