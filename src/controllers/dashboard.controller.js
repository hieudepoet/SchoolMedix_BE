import { query } from "../config/database.js";
import { getProfileOfStudentByUUID } from "../services/index.js";

// Cái này dùng cho tạo record mà không đăng ký tiêm qua campaign
export async function getSummary(req, res) {}

export async function getAccidentStats(req, res) {}

export async function getDiseaseStats(req, res) {}

export async function getHealthStats(req, res) {}

export async function getMedicalPlans(req, res) {}

export async function getHealthStatsByGradeID(req, res) {}
