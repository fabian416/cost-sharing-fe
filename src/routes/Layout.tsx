import WalletConnect from "../components/WalletConnect/WalletConnect";
import styles from "./Layout.module.css";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <main className={styles.applicationBackground}>
      <WalletConnect />
      <Outlet />
    </main>
  );
}
