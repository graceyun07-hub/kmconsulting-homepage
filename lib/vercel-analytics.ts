type AnalyticsCountResponse = {
  data?: {
    pageviews?: number;
    visitors?: number;
  };
};

type AnalyticsAggregateRow = {
  timestamp?: string;
  requestPath?: string;
  pageviews?: number;
  visitors?: number;
};

type AnalyticsAggregateResponse = {
  data?: AnalyticsAggregateRow[];
};

type AnalyticsMetricTotal = {
  visitors: number;
  pageviews: number;
};

type NormalizedDailyRow = AnalyticsMetricTotal & {
  timestamp: string;
};

export type AdminAnalyticsSummary = {
  configured: boolean;
  error?: string;
  totals: {
    visitors: number;
    pageviews: number;
  };
  today: {
    visitors: number;
    pageviews: number;
  };
  last7Days: {
    visitors: number;
    pageviews: number;
  };
  last30Days: {
    visitors: number;
    pageviews: number;
  };
  daily: Array<{
    date: string;
    visitors: number;
    pageviews: number;
  }>;
  topPages: Array<{
    path: string;
    visitors: number;
    pageviews: number;
  }>;
};

const API_BASE = "https://api.vercel.com/v1/query/web-analytics";

function toDateParam(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function sumRows(rows: AnalyticsAggregateRow[]): AnalyticsMetricTotal {
  return rows.reduce<AnalyticsMetricTotal>(
    (total, row) => ({
      visitors: total.visitors + (row.visitors ?? 0),
      pageviews: total.pageviews + (row.pageviews ?? 0),
    }),
    { visitors: 0, pageviews: 0 },
  );
}

function buildDailyRows(rows: AnalyticsAggregateRow[], endDate: Date): NormalizedDailyRow[] {
  const rowsByDate = new Map(rows.map((row) => [row.timestamp?.slice(0, 10), row]));

  return Array.from({ length: 30 }, (_, index) => {
    const date = addDays(endDate, index - 29);
    const key = toDateParam(date);
    const row = rowsByDate.get(key);

    return {
      timestamp: `${key}T00:00:00.000Z`,
      visitors: row?.visitors ?? 0,
      pageviews: row?.pageviews ?? 0,
    };
  });
}

async function queryVercelAnalytics<T>(path: string, params: Record<string, string | number | undefined>) {
  const token = process.env.VERCEL_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;
  const slug = process.env.VERCEL_TEAM_SLUG;

  if (!token || !projectId) {
    throw new Error("missing-configuration");
  }

  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set("projectId", projectId);

  if (teamId) {
    url.searchParams.set("teamId", teamId);
  } else if (slug) {
    url.searchParams.set("slug", slug);
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    throw new Error(`request-failed-${response.status}`);
  }

  return (await response.json()) as T;
}

export async function getAdminAnalyticsSummary(): Promise<AdminAnalyticsSummary> {
  if (!process.env.VERCEL_TOKEN || !process.env.VERCEL_PROJECT_ID) {
    return {
      configured: false,
      error: "missing-configuration",
      totals: { visitors: 0, pageviews: 0 },
      today: { visitors: 0, pageviews: 0 },
      last7Days: { visitors: 0, pageviews: 0 },
      last30Days: { visitors: 0, pageviews: 0 },
      daily: [],
      topPages: [],
    };
  }

  const today = new Date();
  const until = toDateParam(today);
  const since30 = toDateParam(addDays(today, -29));

  try {
    const [totalsResponse, dailyResponse, topPagesResponse] = await Promise.all([
      queryVercelAnalytics<AnalyticsCountResponse>("/visits/count", {}),
      queryVercelAnalytics<AnalyticsAggregateResponse>("/visits/aggregate", {
        since: since30,
        until,
        by: "day",
      }),
      queryVercelAnalytics<AnalyticsAggregateResponse>("/visits/aggregate", {
        since: since30,
        until,
        by: "requestPath",
        limit: 5,
      }),
    ]);

    const dailyRows = buildDailyRows(dailyResponse.data ?? [], today);
    const todayRow = dailyRows.find((row) => row.timestamp?.startsWith(until));
    const last7Rows = dailyRows.slice(-7);
    const last7Days = sumRows(last7Rows);
    const last30Days = sumRows(dailyRows);

    return {
      configured: true,
      totals: {
        visitors: totalsResponse.data?.visitors ?? 0,
        pageviews: totalsResponse.data?.pageviews ?? 0,
      },
      today: {
        visitors: todayRow?.visitors ?? 0,
        pageviews: todayRow?.pageviews ?? 0,
      },
      last7Days,
      last30Days,
      daily: dailyRows.map((row) => ({
        date: row.timestamp ? row.timestamp.slice(5, 10) : "",
        visitors: row.visitors ?? 0,
        pageviews: row.pageviews ?? 0,
      })),
      topPages: (topPagesResponse.data ?? []).map((row) => ({
        path: row.requestPath || "/",
        visitors: row.visitors ?? 0,
        pageviews: row.pageviews ?? 0,
      })),
    };
  } catch (error) {
    return {
      configured: true,
      error: error instanceof Error ? error.message : "unknown-error",
      totals: { visitors: 0, pageviews: 0 },
      today: { visitors: 0, pageviews: 0 },
      last7Days: { visitors: 0, pageviews: 0 },
      last30Days: { visitors: 0, pageviews: 0 },
      daily: [],
      topPages: [],
    };
  }
}
