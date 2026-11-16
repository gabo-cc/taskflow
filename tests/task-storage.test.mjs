import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { readTasks, TASK_STORAGE_KEY, writeTasks } from "../lib/task-storage.ts";

const task = {
  id: "test-task-1",
  title: "Preparar proyecto",
  description: "Revisar los detalles",
  priority: "Alta",
  completed: true,
  createdAt: "2026-11-16T12:30:00.000Z",
};

function mockStorage(raw = null) {
  const entries = new Map(raw === null ? [] : [[TASK_STORAGE_KEY, raw]]);
  const writes = [];
  globalThis.window = {
    localStorage: {
      getItem: (key) => entries.get(key) ?? null,
      setItem: (key, value) => { entries.set(key, value); writes.push([key, value]); },
    },
  };
  return { entries, writes };
}

afterEach(() => { delete globalThis.window; });

test("storage is safe when browser APIs are unavailable", () => {
  assert.deepEqual(readTasks(), { ok: false, reason: "unavailable" });
  assert.deepEqual(writeTasks([task]), { ok: false, reason: "unavailable" });
});

test("a missing key loads an empty list without writing", () => {
  const { writes } = mockStorage();
  assert.deepEqual(readTasks(), { ok: true, tasks: [] });
  assert.equal(writes.length, 0);
});

test("round trips preserve IDs, priorities, dates, text and completion", () => {
  mockStorage();
  const tasks = [task, { ...task, id: "second-task", priority: "Baja", completed: false }];
  assert.deepEqual(writeTasks(tasks), { ok: true });
  assert.deepEqual(readTasks(), { ok: true, tasks });
});

test("the last deletion persists an empty array", () => {
  mockStorage(JSON.stringify([task]));
  assert.deepEqual(writeTasks([]), { ok: true });
  assert.deepEqual(readTasks(), { ok: true, tasks: [] });
});

test("invalid JSON and invalid task models remain untouched", () => {
  const invalidValues = [
    "{broken", "", "null", "{}", '"text"',
    JSON.stringify([null]),
    JSON.stringify([{ ...task, id: " " }]),
    JSON.stringify([{ ...task, title: "  " }]),
    JSON.stringify([{ ...task, priority: "Urgente" }]),
    JSON.stringify([{ ...task, completed: "true" }]),
    JSON.stringify([{ ...task, description: 12 }]),
    JSON.stringify([{ ...task, createdAt: "invalid-date" }]),
    JSON.stringify([{ ...task, createdAt: undefined }]),
    JSON.stringify([task, task]),
    JSON.stringify([task, { id: "incomplete" }]),
  ];
  for (const raw of invalidValues) {
    const { entries, writes } = mockStorage(raw);
    assert.deepEqual(readTasks(), { ok: false, reason: "invalid" }, raw);
    assert.equal(entries.get(TASK_STORAGE_KEY), raw);
    assert.equal(writes.length, 0);
  }
});

test("a blocked localStorage getter is handled", () => {
  globalThis.window = {};
  Object.defineProperty(window, "localStorage", { get() { throw new Error("SecurityError"); } });
  assert.deepEqual(readTasks(), { ok: false, reason: "unavailable" });
  assert.deepEqual(writeTasks([task]), { ok: false, reason: "unavailable" });
});

test("read errors are handled without touching stored data", () => {
  mockStorage();
  window.localStorage.getItem = () => { throw new Error("Read failed"); };
  assert.deepEqual(readTasks(), { ok: false, reason: "unavailable" });
});

test("quota errors preserve the previous saved tasks", () => {
  const raw = JSON.stringify([task]);
  const { entries } = mockStorage(raw);
  window.localStorage.setItem = () => { throw new Error("QuotaExceededError"); };
  assert.deepEqual(writeTasks([]), { ok: false, reason: "unavailable" });
  assert.equal(entries.get(TASK_STORAGE_KEY), raw);
});

test("invalid writes cannot replace existing data", () => {
  const raw = JSON.stringify([task]);
  const { entries, writes } = mockStorage(raw);
  assert.deepEqual(writeTasks([{ ...task, title: " " }]), { ok: false, reason: "invalid" });
  assert.equal(entries.get(TASK_STORAGE_KEY), raw);
  assert.equal(writes.length, 0);
});
