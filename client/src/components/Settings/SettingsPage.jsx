import SettingsView from "./SettingsView.jsx";
/** @typedef {import("../types/pagesProps/settingsPageProps").SettingsPageProps} SettingsPageProps */

/** @param {SettingsPageProps} props */
export default function SettingsPage(props) {
  return <SettingsView {...props} />;
}
