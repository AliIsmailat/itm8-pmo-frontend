import React from "react";
import { MessageSquare } from "lucide-react";

const FORM_URL =
  "https://forms.office.com/pages/responsepage.aspx?id=ZJ5r2fQac0uzMqFG84phRiyYJE93vLZEoGuy5y8Ze5BUNTBSTDNJSzM2R0o5OFc4QzFYNlgwRE9JUy4u&route=shorturl";

const FeedbackButton: React.FC = () => {
  if (!FORM_URL) return null;

  return (
    <a
      href={FORM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lg transition-all hover:shadow-xl hover:scale-105"
      title="Lämna feedback"
    >
      <MessageSquare className="w-4 h-4" />
      Feedback
    </a>
  );
};

export default FeedbackButton;
