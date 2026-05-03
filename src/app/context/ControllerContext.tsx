import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';

export type VRFMode = 'cool' | 'heat' | 'auto' | 'fan' | 'dry';
export type FanSpeed = 'off' | 'low' | 'med' | 'high' | 'auto';
export type ProtocolType = 'none' | 'modbus' | 'bacnet' | 'mqtt' | 'openadr';
export type FieldProtocol = 'none' | 'modbus' | 'bacnet';
export type CloudProtocol = 'none' | 'mqtt' | 'openadr';
export type Language = 'en' | 'de' | 'tr' | 'pt' | 'ar' | 'ru' | 'es' | 'it' | 'fr';
export type BackgroundStyle = 'none' | 'aurora' | 'waves' | 'gradient' | 'mesh' | 'circles';
export type SwingSpeed = 'slow' | 'normal' | 'fast';
export type SwingAngle = 0 | 15 | 30 | 45 | 60 | 75 | 90;

export type HeatSource = 'vrf' | 'relay';
export type HeatingMode = 'single' | 'two_stage';
export type Stage2Trigger = 'temp_or_time' | 'temp_and_time';
export type FanDuringHeating = 'off' | 'stage1' | 'stage2' | 'both';
export type CirculateModeFan = 'off' | 'low';

export interface AuxHeatConfig {
  enabled: boolean;
  heatingMode: HeatingMode;
  stage1Source: HeatSource;
  stage2Source: HeatSource;
  stage2Trigger: Stage2Trigger;
  tempOffset: number;       // 0.5 / 1.0 / 1.5 / 2.0 / 2.5 / 3.0 °C
  timeDelayMin: number;     // 5 / 10 / 15 / 30
  minOnTimeMin: number;     // 5 / 10 / 15 / 30 (>= 10 enforced by UI default)
  fanDuringHeating: FanDuringHeating;
  fanDelayOffMin: number;   // 0 / 5 / 10 / 15 (0 = off)
  circulateModeFan: CirculateModeFan;
}

export const DEFAULT_AUX_HEAT: AuxHeatConfig = {
  enabled: false,
  heatingMode: 'single',
  stage1Source: 'vrf',
  stage2Source: 'relay',
  stage2Trigger: 'temp_or_time',
  tempOffset: 1.0,
  timeDelayMin: 10,
  minOnTimeMin: 10,
  fanDuringHeating: 'both',
  fanDelayOffMin: 0,
  circulateModeFan: 'off',
};

export interface ScheduleEntry {
  id: string;
  time: string;
  power: 'on' | 'off';
  temperature: number | null;
  mode: VRFMode | null;
  fanSpeed: FanSpeed | null;
  enabled: boolean;
}

export interface DaySchedule {
  day: string;
  enabled: boolean;
  entries: ScheduleEntry[];
}

export interface MobileDevice {
  id: string;
  name: string;
  pairedAt: string;
}

export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy' | 'stormy' | 'foggy' | 'partly-cloudy';

export interface WeatherData {
  outdoorTemp: number;
  outdoorHumidity: number;
  condition: WeatherCondition;
  windSpeed: number;
  feelsLike: number;
  uvIndex: number;
  pressure: number;
}

export interface ControllerSettings {
  deviceName: string;
  isOn: boolean;
  hasError: boolean;
  errorCode: string;
  isConnected: boolean;
  cloudConnected: boolean;
  wifiConnected: boolean;
  currentTemp: number;
  targetTemp: number;
  mode: VRFMode;
  fanSpeed: FanSpeed;
  enabledFanSpeeds: FanSpeed[]; // which fan speeds are available (configurable in Settings)
  swingEnabled: boolean;
  swingAngle: SwingAngle; // 0 = horizontal, 30/45/60/90 degrees
  swingSpeed: SwingSpeed;
  enabledSwingAngles: SwingAngle[];
  autoVane: boolean;
  darkTheme: boolean;
  screenSaverEnabled: boolean;
  screenTimeout: number;
  radarWakeEnabled: boolean;
  minTemp: number;
  maxTemp: number;
  temperatureUnit: 'celsius' | 'fahrenheit';
  tempStep: 0.5 | 1;
  hysteresis: number;
  auxHeat: AuxHeatConfig;
  schedulingEnabled: boolean;
  schedule: DaySchedule[];
  mobileDevices: MobileDevice[];
  password: string;
  settingsLockEnabled: boolean;
  currentHumidity: number;
  weatherData: WeatherData;
  country: string;
  city: string;
  timezone: string;
  language: Language;
  activeProtocol: ProtocolType;
  activeFieldProtocol: FieldProtocol;
  activeCloudProtocol: CloudProtocol;
  protocolConnected: Record<string, boolean>;
  dhcpEnabled: boolean;
  ipAddress: string;
  subnetMask: string;
  gateway: string;
  dns: string;
  macAddress: string;
  bluetoothEnabled: boolean;
  bluetoothConnected: boolean;
  bmsLicenseValid: boolean;
  /** VOLATILE: resets to false on page reload */
  developerMode: boolean;
  backgroundStyle: BackgroundStyle;
}

interface ControllerContextType {
  settings: ControllerSettings;
  updateSettings: (updates: Partial<ControllerSettings>) => void;
  updateSchedule: (dayIndex: number, schedule: DaySchedule) => void;
  addMobileDevice: (device: MobileDevice) => void;
  removeMobileDevice: (id: string) => void;
}

const defaultSchedule: DaySchedule[] = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
].map((day, index) => ({
  day,
  enabled: index < 5, // Enable weekdays by default
  entries: index < 5 ? [
    {
      id: `${day}-morning`,
      time: '07:00',
      power: 'on',
      temperature: 22,
      mode: 'cool' as VRFMode,
      fanSpeed: 'auto' as FanSpeed,
      enabled: true
    },
    {
      id: `${day}-evening`,
      time: '18:00',
      power: 'on',
      temperature: 24,
      mode: 'cool' as VRFMode,
      fanSpeed: 'med' as FanSpeed,
      enabled: false
    },
  ] : []
}));

const defaultSettings: ControllerSettings = {
    deviceName: 'Airo° Kelvo',
    isOn: true,
    hasError: false,
    errorCode: '',
    isConnected: true,
    cloudConnected: true,
    wifiConnected: true,
    currentTemp: 24,
    targetTemp: 22,
    mode: 'cool' as VRFMode,
    fanSpeed: 'auto',
    enabledFanSpeeds: ['off', 'low', 'med', 'high', 'auto'],
    swingEnabled: false,
    swingAngle: 0,
    swingSpeed: 'normal',
    enabledSwingAngles: [0, 30, 45, 60, 90],
    autoVane: false,
    darkTheme: false,
    screenSaverEnabled: true,
    screenTimeout: 30,
    radarWakeEnabled: true,
    minTemp: 16,
    maxTemp: 32,
    temperatureUnit: 'celsius',
    tempStep: 1,
    hysteresis: 0.5,
    auxHeat: {
      enabled: false,
      heatingMode: 'single',
      stage1Source: 'vrf',
      stage2Source: 'relay',
      stage2Trigger: 'temp_or_time',
      tempOffset: 1.0,
      timeDelayMin: 10,
      minOnTimeMin: 10,
      fanDuringHeating: 'both',
      fanDelayOffMin: 0,
      circulateModeFan: 'off',
    },
    schedulingEnabled: false,
    schedule: defaultSchedule,
    mobileDevices: [
      { id: '1', name: 'iPhone 14 Pro', pairedAt: '2026-02-15T10:30:00Z' },
      { id: '2', name: 'Samsung Galaxy S24', pairedAt: '2026-02-20T14:20:00Z' },
      { id: '3', name: 'iPad Air', pairedAt: '2026-03-01T09:15:00Z' },
    ],
    password: '1234',
    settingsLockEnabled: false,
    currentHumidity: 45,
    weatherData: {
      outdoorTemp: 20,
      outdoorHumidity: 50,
      condition: 'sunny' as WeatherCondition,
      windSpeed: 5,
      feelsLike: 22,
      uvIndex: 3,
      pressure: 1013
    },
    country: 'Singapore',
    city: 'Singapore',
    timezone: 'Asia/Singapore',
    language: 'en',
    activeProtocol: 'none',
    activeFieldProtocol: 'none',
    activeCloudProtocol: 'none',
    protocolConnected: { modbus: false, bacnet: false, mqtt: false, openadr: false },
    dhcpEnabled: true,
    ipAddress: '192.168.1.100',
    subnetMask: '255.255.255.0',
    gateway: '192.168.1.1',
    dns: '8.8.8.8',
    macAddress: '00:1A:2B:3C:4D:5E',
    bluetoothEnabled: true,
    bluetoothConnected: false,
    bmsLicenseValid: false,
    /** VOLATILE: resets to false on page reload */
    developerMode: false,
    backgroundStyle: 'none',
};

const noop = () => {};

const fallbackContext: ControllerContextType = {
  settings: defaultSettings,
  updateSettings: noop as any,
  updateSchedule: noop as any,
  addMobileDevice: noop as any,
  removeMobileDevice: noop as any,
};

export const ControllerContext = createContext<ControllerContextType>(fallbackContext);

export function ControllerProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ControllerSettings>(defaultSettings);

  const updateSettings = useCallback((updates: Partial<ControllerSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const updateSchedule = useCallback((dayIndex: number, schedule: DaySchedule) => {
    setSettings(prev => ({
      ...prev,
      schedule: prev.schedule.map((s, i) => i === dayIndex ? schedule : s)
    }));
  }, []);

  const addMobileDevice = useCallback((device: MobileDevice) => {
    setSettings(prev => ({
      ...prev,
      mobileDevices: [...prev.mobileDevices, device]
    }));
  }, []);

  const removeMobileDevice = useCallback((id: string) => {
    setSettings(prev => ({
      ...prev,
      mobileDevices: prev.mobileDevices.filter(d => d.id !== id)
    }));
  }, []);

  const value = useMemo(() => ({
    settings,
    updateSettings,
    updateSchedule,
    addMobileDevice,
    removeMobileDevice,
  }), [settings, updateSettings, updateSchedule, addMobileDevice, removeMobileDevice]);

  return (
    <ControllerContext.Provider value={value}>
      {children}
    </ControllerContext.Provider>
  );
}

export function useController() {
  return useContext(ControllerContext);
}