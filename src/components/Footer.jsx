export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-transparent py-8 mt-16">
      <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
          &copy; {currentYear} adricode
        </p>
      </div>
    </footer>
  );
}
