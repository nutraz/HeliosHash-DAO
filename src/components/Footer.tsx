export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#0b0b0d] to-[#0a0a0c] px-5 py-6 border-white/10 border-t text-[#8f9098] text-xs">
      <div className="flex md:flex-row flex-col flex-wrap justify-between gap-3 mx-auto max-w-[1200px] footer-wrap">
        <div>© {new Date().getFullYear()} HHDAO. All rights reserved.</div>
        <div className="flex flex-wrap gap-4 footer-links">
          <a href="#" className="text-[#a6a6af] no-underline">Terms of Service</a>
          <a href="#" className="text-[#a6a6af] no-underline">Privacy Policy</a>
          <a href="#" className="text-[#a6a6af] no-underline">Contact</a>
          <a href="#" className="text-[#a6a6af] no-underline">Support</a>
        </div>
      </div>
    </footer>
  );
}
