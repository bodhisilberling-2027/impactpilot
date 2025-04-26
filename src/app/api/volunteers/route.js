import { NextResponse } from 'next/server';

// In a real application, this would be a database
let volunteers = [];

export async function GET(req) {
  return NextResponse.json(volunteers);
}

export async function POST(req) {
  try {
    const data = await req.json();
    
    // Validate required fields
    if (!data.name || !data.email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Check for duplicate email
    if (volunteers.some(v => v.email === data.email)) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Add timestamp and ID
    const volunteer = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    volunteers.push(volunteer);
    return NextResponse.json(volunteer);
  } catch (error) {
    console.error('Error creating volunteer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const data = await req.json();
    
    if (!data.id) {
      return NextResponse.json({ error: 'Volunteer ID is required' }, { status: 400 });
    }

    const index = volunteers.findIndex(v => v.id === data.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
    }

    // Update volunteer data
    volunteers[index] = {
      ...volunteers[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(volunteers[index]);
  } catch (error) {
    console.error('Error updating volunteer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Volunteer ID is required' }, { status: 400 });
    }

    const index = volunteers.findIndex(v => v.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
    }

    volunteers = volunteers.filter(v => v.id !== id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting volunteer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 