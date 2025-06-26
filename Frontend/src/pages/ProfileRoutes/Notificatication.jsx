import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Bell, Info } from "lucide-react";
import api from "../../api";

const statusStyles = {
  Approved: {
    icon: <CheckCircle className="text-green-600 w-5 h-5" />,
    bg: "bg-green-100",
    text: "text-green-700",
  },
  Declined: {
    icon: <XCircle className="text-red-600 w-5 h-5" />,
    bg: "bg-red-100",
    text: "text-red-700",
  },
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await api.get("applicant/applicant_notification");
      const notificationsData = response.data.notification_data || [];

      // Sort notifications by newest first
      const sortedNotifications = notificationsData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setNotifications(sortedNotifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await api.get("applicant/clear_notification");
      setNotifications([]);
    } catch (error) {
      console.error("Failed to clear notifications:", error);
    }
  };

  return (
    <div className="p-6 max-w-8xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="w-6 h-6" /> Notifications
        </h2>
        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="bg-gray-300 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-400 text-sm"
          >
            Clear All
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">No notifications found.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((note, index) => {
            const style = statusStyles[note.job_status] || {
              icon: <Info className="text-gray-500 w-5 h-5" />,
              bg: "bg-gray-100",
              text: "text-gray-700",
            };

            const isLatest = index === 0;

            return (
              <div
                key={note._id}
                className={`flex items-start gap-4 p-4 rounded-xl ${style.bg} shadow-sm hover:shadow-md transition relative`}
              >
                <div className="mt-1">{style.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`font-medium ${style.text}`}>{note.job_title}</p>
                    {isLatest && (
                      <span className="bg-yellow-300 text-yellow-900 text-xs font-semibold px-2 py-0.5 rounded-full animate-pulse">
                        Latest
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">Status: {note.job_status}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
