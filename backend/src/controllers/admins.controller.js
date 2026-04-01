import Admin from "../models/Admin.js";

const sanitizeAdmin = (admin) => ({
  id: admin._id,
  firstName: admin.firstName,
  lastName: admin.lastName,
  name: `${admin.firstName} ${admin.lastName}`,
  email: admin.email,
  role: "admin"
});

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin || !(await admin.matchPassword(password))) {
      return next(Object.assign(new Error("Invalid email or password."), { status: 401 }));
    }

    req.roleUser = admin;
    return next();
  } catch (error) {
    next(error);
  }
};

export const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find();
    res.status(200).json({ success: true, count: admins.length, data: admins.map(sanitizeAdmin) });
  } catch (error) {
    next(error);
  }
};

export const getAdminById = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return next(Object.assign(new Error("Admin not found."), { status: 404 }));
    }
    res.status(200).json({ success: true, data: sanitizeAdmin(admin) });
  } catch (error) {
    next(error);
  }
};

export const deleteAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return next(Object.assign(new Error("Admin not found."), { status: 404 }));
    }
    res.status(200).json({ success: true, message: "Admin deleted successfully." });
  } catch (error) {
    next(error);
  }
};
