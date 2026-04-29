import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const SidebarMenu = ({ menuItems }) => {
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState(location.pathname);
  console.log("menu item active++", activeMenuItem);
  const handleMenuItem = (menuItemUrl) => {
    setActiveMenuItem(menuItemUrl);
  };
  return (
    <div className="list-group mt-5 pl-4">
      {menuItems.map((item, index) => (
        <Link
          key={index}
          to={item.url}
          onClick={() => handleMenuItem(item.url)}
          className={`fw-bold list-group-item list-group-item-action ${activeMenuItem.includes(item.url) ? "active" : ""}`}
          aria-current={activeMenuItem.includes(item.url) ? "active" : ""}
        >
          <i className={`${item.icon}  fa-fw pe-2`}></i> {item.name}
        </Link>
      ))}
    </div>
  );
};

export default SidebarMenu;
