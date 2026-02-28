import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./app/Home";
import { Donate } from "./app/Donate";
import { Community } from "./app/Community";
import { Rules } from "./app/Rules";
import { Offer } from "./app/Offer";
import { Terms } from "./app/Terms";
import { Privacy } from "./app/Privacy";
import { Success } from "./app/Success";
import { Fail } from "./app/Fail";
import { Page } from "./types";

export default function App() {
  const [page, setPage] = useState<Page>(Page.HOME);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // Optional: auto-detect /success or /fail from URL path on load
  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/success") setPage(Page.SUCCESS);
    else if (path === "/fail") setPage(Page.FAIL);
  }, []);

  const isFullscreen = page === Page.SUCCESS || page === Page.FAIL;

  const render = () => {
    switch (page) {
      case Page.HOME:
        return <Home onNavigate={setPage} />;
      case Page.DONATE:
        return <Donate />;
      case Page.COMMUNITY:
        return <Community />;
      case Page.RULES:
        return <Rules />;
      case Page.OFFER:
        return <Offer />;
      case Page.TERMS:
        return <Terms />;
      case Page.PRIVACY:
        return <Privacy />;
      case Page.SUCCESS:
        return <Success onNavigate={setPage} />;
      case Page.FAIL:
        return <Fail onNavigate={setPage} />;
      default:
        return <Home onNavigate={setPage} />;
    }
  };

  return (
    <>
      {!isFullscreen && <Navbar currentPage={page} onNavigate={setPage} />}
      <main>{render()}</main>
      {!isFullscreen && <Footer onNavigate={setPage} />}
    </>
  );
}
