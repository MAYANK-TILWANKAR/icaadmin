import connectToDatabase from "../../lib/mongoose";
import DemoData from "@/models/DemoData";

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, message: 'ID is required' });
  }

  try {
    await connectToDatabase();

    const deletedEntry = await DemoData.findByIdAndDelete(id);

    if (!deletedEntry) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }

    res.status(200).json({ success: true, message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
