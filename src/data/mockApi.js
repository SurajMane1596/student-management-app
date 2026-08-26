/**
 * Mock API layer
 * ----------------
 * Every function here returns a Promise and simulates network latency,
 * exactly mirroring the shape a real REST/GraphQL client would have.
 *
 * WHY THIS EXISTS:
 * The Project Requirement Document explicitly scopes API contracts as a
 * separate, future document. To keep the front-end fully functional and
 * demonstrable today while remaining "ready for future development", all
 * data access is funnelled through this single module. When the real
 * backend is ready, only this file needs to change (e.g. swap the body of
 * each function for a `fetch(...)` call) — no component or page needs to
 * be touched, because they only ever import from here.
 *
 * Persistence for this mock layer uses localStorage so data survives a
 * page refresh during evaluation/demo.
 */

const LATENCY_MS = 350;

const STORAGE_KEYS = {
  USERS: "sma_users",
  CUSTOMERS: "sma_customers",
  SESSION: "sma_session",
};

const delay = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function seedIfEmpty() {
  const users = read(STORAGE_KEYS.USERS, null);
  if (!users) {
    write(STORAGE_KEYS.USERS, [
      {
        clientId: "DEMO0001",
        mobileNumber: "9619306969",
        password: "Demo@123",
        userName: "Suraj Mane",
        contactNumber: "9619306969",
        emailId: "suraj.mane@example.com",
        clientName: "DEMO0001",
        subscriptionStatus: "Active",
      },
    ]);
  }

  const customers = read(STORAGE_KEYS.CUSTOMERS, null);
  if (!customers) {
    write(STORAGE_KEYS.CUSTOMERS, [
      {
        id: "cust_1001",
        ownerClientId: "DEMO0001",
        studentFirstName: "Aarav",
        studentMiddleName: "Suraj",
        studentLastName: "Mane",
        parentName: "Suraj Mane",
        parentContactNumber: "9619306969",
        studentGender: "MALE",
        age: "9",
        dob: "2017-03-12",
        bloodGroup: "B+",
        medicalHistory: "No known allergies, mild seasonal cold in winter.",
        emergencyContactNumber: "9619306969",
        addressLine1: "Plot 12, Sector 15",
        addressLine2: "Near City Park, Vashi",
        city: "Vashi",
        district: "Thane",
        state: "Maharashtra",
        pincode: "400703",
        schoolName: "Ryan International School",
        standard: "4",
        division: "B",
        groupHouse: "Blue",
        classTeacherName: "Mrs Kavita Rao",
        classTeacherContactNumber: "9820012345",
        schoolInTime: "08:00",
        schoolOutTime: "14:30",
        schoolDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      },
    ]);
  }
}

seedIfEmpty();

// ---------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------

export async function login({ clientId, mobileNumber, password }) {
  const users = read(STORAGE_KEYS.USERS, []);
  const user = users.find(
    (u) =>
      u.clientId === clientId &&
      u.mobileNumber === mobileNumber &&
      u.password === password
  );

  if (!user) {
    return delay({ ok: false, error: "Invalid Client Id, Mobile Number or Password." });
  }

  const session = { clientId: user.clientId, loggedInAt: Date.now() };
  write(STORAGE_KEYS.SESSION, session);
  const { password: _pw, ...safeUser } = user;
  return delay({ ok: true, user: safeUser });
}

export async function logout() {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
  return delay({ ok: true });
}

export async function getSession() {
  const session = read(STORAGE_KEYS.SESSION, null);
  if (!session) return delay({ ok: false });

  const users = read(STORAGE_KEYS.USERS, []);
  const user = users.find((u) => u.clientId === session.clientId);
  if (!user) return delay({ ok: false });

  const { password: _pw, ...safeUser } = user;
  return delay({ ok: true, user: safeUser });
}

// ---------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------

export async function updateProfile(clientId, updates) {
  const users = read(STORAGE_KEYS.USERS, []);
  const idx = users.findIndex((u) => u.clientId === clientId);
  if (idx === -1) return delay({ ok: false, error: "User not found." });

  users[idx] = { ...users[idx], ...updates };
  write(STORAGE_KEYS.USERS, users);
  const { password: _pw, ...safeUser } = users[idx];
  return delay({ ok: true, user: safeUser });
}

// ---------------------------------------------------------------------
// Customers (Students)
// ---------------------------------------------------------------------

export async function listCustomers(ownerClientId) {
  const customers = read(STORAGE_KEYS.CUSTOMERS, []);
  return delay({
    ok: true,
    customers: customers.filter((c) => c.ownerClientId === ownerClientId),
  });
}

export async function getCustomer(id) {
  const customers = read(STORAGE_KEYS.CUSTOMERS, []);
  const customer = customers.find((c) => c.id === id);
  return delay(
    customer ? { ok: true, customer } : { ok: false, error: "Customer not found." }
  );
}

export async function createCustomer(ownerClientId, data) {
  const customers = read(STORAGE_KEYS.CUSTOMERS, []);
  const newCustomer = {
    id: `cust_${Date.now()}`,
    ownerClientId,
    ...data,
  };
  customers.push(newCustomer);
  write(STORAGE_KEYS.CUSTOMERS, customers);
  return delay({ ok: true, customer: newCustomer });
}

export async function updateCustomer(id, data) {
  const customers = read(STORAGE_KEYS.CUSTOMERS, []);
  const idx = customers.findIndex((c) => c.id === id);
  if (idx === -1) return delay({ ok: false, error: "Customer not found." });

  customers[idx] = { ...customers[idx], ...data };
  write(STORAGE_KEYS.CUSTOMERS, customers);
  return delay({ ok: true, customer: customers[idx] });
}
