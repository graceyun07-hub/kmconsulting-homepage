import { Activity, Bell, CheckCircle2, ClipboardList, Eye, Users } from "lucide-react";
import { getAdminAnalyticsSummary } from "../../../lib/vercel-analytics";

const stats = [
  { label: "New requests", value: "12", change: "+4", tone: "green" },
  { label: "Waiting", value: "7", change: "+2", tone: "amber" },
  { label: "In progress", value: "18", change: "+6", tone: "teal" },
  { label: "Completed", value: "43", change: "+11", tone: "coral" },
];

const requests = [
  {
    name: "Client A",
    channel: "KakaoTalk",
    topic: "Sales analysis consultation",
    date: "Today 10:30",
    status: "New",
  },
  {
    name: "Client B",
    channel: "Email",
    topic: "Cash-flow review",
    date: "Today 13:20",
    status: "Review",
  },
  {
    name: "Client C",
    channel: "Phone",
    topic: "Action plan coaching",
    date: "Tomorrow 09:00",
    status: "Booked",
  },
];

const tasks = [
  "Review 3 new consultation requests",
  "Confirm this week's bookings",
  "Update chatbot welcome message",
  "Check homepage external links",
];

function formatNumber(value: number) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

export default async function AdminPage() {
  const analytics = await getAdminAnalyticsSummary();
  const maxVisitors = Math.max(...analytics.daily.map((day) => day.visitors), 1);

  return (
    <>
      <header className="adminTopbar">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Admin Dashboard</h1>
        </div>
        <button className="iconButton" aria-label="Notifications">
          <Bell size={19} />
        </button>
      </header>

      <section className="adminStats" aria-label="Operation summary">
        {stats.map((stat) => (
          <article className={`adminStat ${stat.tone}`} key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            <small>{stat.change} this week</small>
          </article>
        ))}
      </section>

      <section className="adminPanel analyticsPanel" id="analytics">
        <div className="adminPanelHeader">
          <div>
            <p className="eyebrow">Analytics</p>
            <h2>Visitor overview</h2>
          </div>
          <a className="toolButton" href="https://vercel.com/dashboard" rel="noreferrer" target="_blank">
            <Activity size={18} />
            Vercel
          </a>
        </div>

        {analytics.configured && !analytics.error ? (
          <>
            <div className="analyticsStats">
              <article>
                <Users size={19} />
                <span>Today visitors</span>
                <strong>{formatNumber(analytics.today.visitors)}</strong>
                <small>{formatNumber(analytics.today.pageviews)} page views</small>
              </article>
              <article>
                <Users size={19} />
                <span>Last 7 days</span>
                <strong>{formatNumber(analytics.last7Days.visitors)}</strong>
                <small>{formatNumber(analytics.last7Days.pageviews)} page views</small>
              </article>
              <article>
                <Eye size={19} />
                <span>Last 30 days</span>
                <strong>{formatNumber(analytics.last30Days.visitors)}</strong>
                <small>{formatNumber(analytics.last30Days.pageviews)} page views</small>
              </article>
              <article>
                <Eye size={19} />
                <span>Total</span>
                <strong>{formatNumber(analytics.totals.visitors)}</strong>
                <small>{formatNumber(analytics.totals.pageviews)} page views</small>
              </article>
            </div>

            <div className="analyticsGrid">
              <div className="trafficTrend" aria-label="30-day visitor trend">
                {analytics.daily.map((day) => (
                  <div className="trafficDay" key={day.date}>
                    <span style={{ height: `${Math.max(8, (day.visitors / maxVisitors) * 100)}%` }} />
                    <small>{day.date}</small>
                  </div>
                ))}
              </div>

              <div className="topPages">
                <strong>Top pages</strong>
                {analytics.topPages.length > 0 ? (
                  analytics.topPages.map((page) => (
                    <div className="topPageItem" key={page.path}>
                      <span>{page.path}</span>
                      <small>{formatNumber(page.visitors)} visitors</small>
                    </div>
                  ))
                ) : (
                  <p>No page data yet.</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="analyticsEmpty">
            <strong>{analytics.configured ? "Analytics data is not available yet." : "Connect Vercel Analytics API."}</strong>
            <p>
              Add VERCEL_TOKEN and VERCEL_PROJECT_ID to your deployment environment variables, then redeploy.
            </p>
          </div>
        )}
      </section>

      <div className="adminGrid">
        <section className="adminPanel" id="inquiries">
          <div className="adminPanelHeader">
            <div>
              <p className="eyebrow">Inquiries</p>
              <h2>Recent inquiries</h2>
            </div>
            <button className="primarySmall">
              <ClipboardList size={18} />
              View all
            </button>
          </div>

          <div className="requestList">
            {requests.map((request) => (
              <article className="requestItem" key={`${request.name}-${request.date}`}>
                <div>
                  <strong>{request.name}</strong>
                  <p>{request.topic}</p>
                </div>
                <span>{request.channel}</span>
                <span>{request.date}</span>
                <mark>{request.status}</mark>
              </article>
            ))}
          </div>
        </section>

        <aside className="adminPanel adminQuickPanel" id="chatbot">
          <div className="adminPanelHeader">
            <div>
              <p className="eyebrow">Chatbot</p>
              <h2>Chatbot settings</h2>
            </div>
          </div>
          <div className="adminSettingList">
            <span>Welcome message</span>
            <strong>Active</strong>
            <span>Consultation handoff</span>
            <strong>Enabled</strong>
            <span>Office hours response</span>
            <strong>Ready</strong>
          </div>
        </aside>
      </div>

      <div className="adminGrid secondary">
        <section className="adminPanel" id="site-info">
          <div className="adminPanelHeader">
            <div>
              <p className="eyebrow">Site info</p>
              <h2>Site information</h2>
            </div>
          </div>
          <ul className="adminTaskList">
            {tasks.map((task) => (
              <li key={task}>
                <CheckCircle2 size={18} />
                {task}
              </li>
            ))}
          </ul>
        </section>

        <section className="adminPanel adminQuickPanel" id="external-links">
          <div className="adminPanelHeader">
            <div>
              <p className="eyebrow">Links</p>
              <h2>External links</h2>
            </div>
          </div>
          <div className="adminSettingList">
            <span>Naver Blog</span>
            <strong>Connected</strong>
            <span>Instagram</span>
            <strong>Connected</strong>
            <span>Kakao Channel</span>
            <strong>Connected</strong>
          </div>
        </section>
      </div>
    </>
  );
}
