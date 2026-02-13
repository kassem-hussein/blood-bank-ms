export default function Pagination({ dataInfo, fetchData }) {
  
  const { current_page, last_page, prev_page_url, next_page_url } = dataInfo.data;
  const pages = Array.from({ length: last_page }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      {/* Prev Button */}
      {prev_page_url && (
        <button
          onClick={() => fetchData(current_page - 1)}
          className="px-3 py-1 text-gray-200 rounded hover:text-gray-600"
        >
          السابق
        </button>
      )}

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => fetchData(page)}
          className={`px-3 py-1 rounded ${
            page === current_page
              ? "bg-red-700 mx-2 text-white"
              : "bg-white text-gray-500  border border-gray-400 mx-2 hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      {next_page_url && (
        <button
          onClick={() => fetchData(current_page + 1)}
          className="px-3 py-1 text-gray-200 rounded hover:text-gray-600"
        >
          التالي
        </button>
      )}
    </div>
  );
}