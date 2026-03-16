import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// #region agent log
fetch("http://127.0.0.1:7683/ingest/d1ed7b71-be6e-4f7b-88ca-db5fa32ff6c7", {
  method: "POST",
  headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "e75e82" },
  body: JSON.stringify({
    sessionId: "e75e82",
    location: "supabaseClient.ts:init",
    message: "supabase env check",
    data: { hasUrl: !!supabaseUrl, hasKey: !!supabaseAnonKey },
    timestamp: Date.now(),
    hypothesisId: "H1",
  }),
}).catch(() => {});
// #endregion
if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    "Supabase environment variables are not set. Please define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  );
}

export const isSupabaseConfigured =
  typeof supabaseUrl === "string" && !!supabaseUrl && typeof supabaseAnonKey === "string" && !!supabaseAnonKey;

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");
// #region agent log
fetch("http://127.0.0.1:7683/ingest/d1ed7b71-be6e-4f7b-88ca-db5fa32ff6c7", {
  method: "POST",
  headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "e75e82" },
  body: JSON.stringify({
    sessionId: "e75e82",
    location: "supabaseClient.ts:created",
    message: "createClient done",
    data: {},
    timestamp: Date.now(),
    hypothesisId: "H1",
  }),
}).catch(() => {});
// #endregion

