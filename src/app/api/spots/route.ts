// src/app/api/spots/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/lib/authOptions';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    const spot = await prisma.spot.create({
      data: {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        hasOutlets: data.hasOutlets,
        hasParking: data.hasParking,
        hasFoodDrinks: data.hasFoodDrinks,
        maxGroupSize: data.maxGroupSize,
        type: data.type,
        rating: 0,
        numReviews: 0,
      },
    });

    return NextResponse.json(spot);
  } catch (error) {
    console.error('Error creating spot:', error);
    return NextResponse.json(
      { error: 'Error creating spot' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const spots = await prisma.spot.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(spots);
  } catch (error) {
    console.error('Error fetching spots:', error);
    return NextResponse.json(
      { error: 'Error fetching spots' },
      { status: 500 }
    );
  }
}
