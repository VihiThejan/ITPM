export const ROLE_MAP = {
  STUDENT: "student",
  HOSTELOWNER: "owner",
  ADMIN: "admin"
};

export const normalizeRole = (role) => ROLE_MAP[String(role || "").toUpperCase()] || String(role || "").toLowerCase();

export const getRoleModelByRole = async (role) => {
  const upper = String(role || "").toUpperCase();

  switch (upper) {
    case "STUDENT": {
      const { default: Student } = await import("../models/Student.js");
      return { model: Student, modelName: "Student" };
    }
    case "HOSTELOWNER": {
      const { default: HostelOwner } = await import("../models/HostelOwner.js");
      return { model: HostelOwner, modelName: "HostelOwner" };
    }
    case "ADMIN": {
      const { default: Admin } = await import("../models/Admin.js");
      return { model: Admin, modelName: "Admin" };
    }
    default:
      return { model: null, modelName: null };
  }
};

export const findRoleUserByEmail = async (email) => {
  const { default: Student } = await import("../models/Student.js");
  const { default: HostelOwner } = await import("../models/HostelOwner.js");
  const { default: Admin } = await import("../models/Admin.js");

  const student = await Student.findOne({ email });
  if (student) return { user: student, modelName: "Student" };

  const owner = await HostelOwner.findOne({ email });
  if (owner) return { user: owner, modelName: "HostelOwner" };

  const admin = await Admin.findOne({ email });
  if (admin) return { user: admin, modelName: "Admin" };

  return { user: null, modelName: null };
};
