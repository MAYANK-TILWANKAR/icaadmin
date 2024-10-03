// pages/api/getData.js
import connectToDatabase from "../../lib/mongoose";
import DemoData from "@/models/DemoData";
export default async function GET(req, res) {
  try {
    await connectToDatabase();

    // Fetch the data from a collection
    const data = await DemoData.find({});

    res.status(200).json({ success: true, data });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ success: false, error: "Database connection error" });
  }
}