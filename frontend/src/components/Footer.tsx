import { BsGithub } from "react-icons/bs";
import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="bg-gray-50 sm:rounded-t-[100px] rounded-t-3xl border">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">DEVlytics</h3>
          <p className="text-gray-600">
            Track your progress across multiple coding platforms in one place.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/about" className="text-gray-600 hover:text-indigo-600">
                About
              </Link>
            </li>
            <li>
              <a
                href="mailto:prashantsharma4840@icloud.com"
                className="text-gray-600 hover:text-indigo-600"
              >
                Contact
              </a>
            </li>
            <li>
              <Link
                to="/about#privacy"
                className="text-gray-600 hover:text-indigo-600"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Connect</h3>
          <div className="flex space-x-4">
            <a
              href="https://github.com/prashant4840"
              target="_blank"
              className="text-gray-600 hover:text-indigo-600"
            >
              <BsGithub className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-200">
        <p className="text-center text-gray-600">
          © {new Date().getFullYear()} DEVlytics. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);
