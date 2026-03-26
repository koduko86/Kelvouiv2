import { createBrowserRouter } from "react-router";
import { RootLayout } from "./RootLayout";
import { Home } from "./screens/Home2";
import { Password } from "./screens/Password";
import { ChangePassword } from "./screens/ChangePassword";
import { Settings } from "./screens/Settings";
import { WiFiSetup } from "./screens/WiFiSetup";
import { Schedule } from "./screens/Schedule";
import { ScheduleEntryScreen } from "./screens/ScheduleEntry";
import { MobilePairing } from "./screens/MobilePairing";
import { Parameters } from "./screens/Parameters";
import { Weather } from "./screens/Weather";
import { ScreenSaver } from "./screens/ScreenSaver";
import { BootScreen } from "./screens/BootScreen";
import { FirmwareUpload } from "./screens/FirmwareUpload";
import { DevPanel } from "./screens/DevPanel";
import { UIKit } from "./components/ui-kit/UIKit";

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        path: "/",
        Component: BootScreen,
      },
      {
        path: "/home",
        Component: Home,
      },
      {
        path: "/password",
        Component: Password,
      },
      {
        path: "/change-password",
        Component: ChangePassword,
      },
      {
        path: "/settings",
        Component: Settings,
      },
      {
        path: "/wifi",
        Component: WiFiSetup,
      },
      {
        path: "/schedule",
        Component: Schedule,
      },
      {
        path: "/schedule/entry",
        Component: ScheduleEntryScreen,
      },
      {
        path: "/pairing",
        Component: MobilePairing,
      },
      {
        path: "/parameters",
        Component: Parameters,
      },
      {
        path: "/weather",
        Component: Weather,
      },
      {
        path: "/screensaver",
        Component: ScreenSaver,
      },
      {
        path: "/firmware",
        Component: FirmwareUpload,
      },
      {
        path: "/dev",
        Component: DevPanel,
      },
      {
        path: "/ui-kit",
        Component: UIKit,
      },
    ],
  },
]);