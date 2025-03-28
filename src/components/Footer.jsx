import React from "react";

const Footer = () => {
  return (
    <footer className="bg-light text-dark text-center py-3 mt-auto">
      <div className="container">
        <p className="mb-1">&copy; {new Date().getFullYear()} Банковская система</p>
        <p className="mb-0">
        </p>
      </div>
    </footer>
  );
};

export default Footer;
