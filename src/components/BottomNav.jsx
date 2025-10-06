// src/components/BottomNav.jsx
import { NavLink } from "react-router-dom";
import { COLORS } from "../constants/colors";

export default function BottomNav() {
  const navItems = [
    { to: "/", label: "Chat", icon: "/icons/chat.svg" },
    { to: "/product", label: "Produk", icon: "/icons/product.svg" },
    { to: "/promo", label: "Promo", icon: "/icons/promo.svg" },
    { to: "/transaksi", label: "Transaksi", icon: "/icons/product.svg" },
    { to: "/account", label: "Akun", icon: "/icons/product.svg" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full border-t border-gray-200 bg-white flex justify-around py-2 z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center text-sm ${isActive ? "text-primary" : "text-gray-700"}`
          }
          style={({ isActive }) => ({
            color: isActive ? COLORS.primary : "#6B7280",
          })}
        >
          <img
            src={item.icon}
            alt={item.label}
            className="h-6 w-6 mb-1"
          />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
