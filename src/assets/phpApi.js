const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8090/api";

// 共通fetch。PHPのJSONレスポンスを必ずパースして返す。
export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ?? `Request failed with status ${response.status}`,
    );
  }

  if (data?.success === false) {
    throw new Error(data.message ?? "API request failed");
  }

  return data;
}

// auth
export async function signup(email, password) {
  return apiFetch("/signup.php", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function login(email, password) {
  return apiFetch("/login.php", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logout() {
  return apiFetch("/logout.php", {
    method: "GET",
  });
}

export async function fetchMe() {
  return apiFetch("/me.php", {
    method: "GET",
  });
}

// tasks
export async function fetchTaskList() {
  return apiFetch("/crud/list.php", {
    method: "GET",
  });
}

export async function createTask({
  tag = "",
  task = "",
  deadline = "",
  scheduled_start = "",
  scheduled_end = "",
}) {
  return apiFetch("/crud/create.php", {
    method: "POST",
    body: JSON.stringify({
      tag,
      task,
      deadline,
      scheduled_start,
      scheduled_end,
    }),
  });
}

export async function updateTask({
  id,
  tag,
  task,
  deadline,
  scheduled_start,
  scheduled_end,
}) {
  return apiFetch("/crud/update.php", {
    method: "POST",
    body: JSON.stringify({
      id,
      tag,
      task,
      deadline,
      scheduled_start,
      scheduled_end,
    }),
  });
}

export async function deleteTask(id) {
  return apiFetch("/crud/delete.php", {
    method: "POST",
    body: JSON.stringify({ id }),
  });
}
