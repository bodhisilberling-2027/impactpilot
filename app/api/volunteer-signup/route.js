import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { parse, stringify } from 'csv-parse/sync';

const CSV_FILE = path.join(process.cwd(), 'data', 'volunteers.csv');

// Ensure the data directory exists
async function ensureDirectory() {
  const dir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

// Create CSV if it doesn't exist
async function ensureCSV() {
  try {
    await fs.access(CSV_FILE);
  } catch {
    const headers = ['name', 'email', 'location', 'interests', 'createdAt', 'status'];
    await fs.writeFile(CSV_FILE, headers.join(',') + '\n');
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'location', 'interests'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Ensure directory and CSV file exist
    await ensureDirectory();
    await ensureCSV();

    // Prepare data for CSV
    const newRecord = {
      name: data.name,
      email: data.email,
      location: data.location,
      interests: data.interests,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    // Read existing CSV content
    let content = await fs.readFile(CSV_FILE, 'utf-8');
    
    // Add new record
    content += Object.values(newRecord).map(value => 
      // Escape commas and quotes in the values
      `"${String(value).replace(/"/g, '""')}"`
    ).join(',') + '\n';

    // Write back to file
    await fs.writeFile(CSV_FILE, content);
    
    return NextResponse.json(
      { message: 'Volunteer application submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing volunteer signup:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve all volunteers (optional)
export async function GET() {
  try {
    await ensureDirectory();
    await ensureCSV();

    const content = await fs.readFile(CSV_FILE, 'utf-8');
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error('Error reading volunteers:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve volunteers' },
      { status: 500 }
    );
  }
} 