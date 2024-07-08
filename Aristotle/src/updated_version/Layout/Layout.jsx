import React from "react";
import TopBar from "./TopBar";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import SideBar from "./SideBar";
import { ThemeProvider } from "../Context/themeContext";

const Layout = ({ onMenuClick, open }) => {
  return (
    <>
      <ThemeProvider>
        {" "}
        <SideBar open={open} onClose={onMenuClick} />
        <main
          style={{
            marginLeft: open ? 250 : 0,
            transition: "margin 0.3s",
          }}
        >
          <div className="tw-p-2">
            <TopBar onMenuClick={onMenuClick} />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </ThemeProvider>
    </>
  );
};

export default React.memo(Layout);
