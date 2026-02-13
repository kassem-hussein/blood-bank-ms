import { Link } from "react-router-dom";

const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-gray-500">
        {/* Home link */}
        <li>
          <Link to={"/"} className="flex items-center hover:text-gray-700">
            <i className="fas fa-home mr-1"></i>
            الرئيسية
          </Link>
        </li>

        {/* Dynamic items */}
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center">
            <i className="fas fa-chevron-left mx-2 text-gray-400"></i>
            {idx === items.length - 1 ? (
              <span
                className="font-medium text-gray-900"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="hover:text-gray-700"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;