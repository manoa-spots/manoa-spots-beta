/* eslint-disable max-len */
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database');

  // Create spots
  console.log('Creating spots...');
  const spots = await Promise.all([
    prisma.spot.upsert({
      where: { name: 'Hamilton Library' },
      update: {},
      create: {
        name: 'Hamilton Library',
        description: 'Quiet study space with multiple floors',
        imageUrl: 'https://www.hawaii.edu/news/wp-content/uploads/2020/10/manoa-hamilton-library-signs.jpg',
        rating: 4.5,
        numReviews: 125,
        address: '2550 McCarthy Mall, Honolulu, HI 96822',
        latitude: 21.3001,
        longitude: -157.8161,
        hasOutlets: true,
        hasParking: true,
        hasFoodDrinks: false,
        maxGroupSize: 6,
        type: 'LIBRARY',
      },
    }),
    prisma.spot.upsert({
      where: { name: 'Sinclair Library' },
      update: {},
      create: {
        name: 'Sinclair Library',
        description: '24/7 study space with comfortable seating',
        imageUrl: 'https://historichawaii.org/wp-content/uploads/2014/02/Oahu_Honolulu_CampusRoad_2425_photo_byIanClagstone.jpg',
        rating: 3.2,
        numReviews: 89,
        address: '2425 Campus Rd, Honolulu, HI 96822',
        latitude: 21.2999,
        longitude: -157.8190,
        hasOutlets: true,
        hasParking: true,
        hasFoodDrinks: true,
        maxGroupSize: 4,
        type: 'LIBRARY',
      },
    }),
    prisma.spot.upsert({
      where: { name: 'Island Brew Coffee House' },
      update: {},
      create: {
        name: 'Island Brew Coffee House',
        description: 'Good coffee and pastries with indoor seating',
        imageUrl: 'https://www.islandbrewcoffeehouse.com/uploads/1/3/7/0/13708134/ffea10a9-7143-47ff-99aa-3726e676211f_orig.jpeg',
        rating: 5.0,
        numReviews: 20,
        address: '1810 University Ave, Honolulu, HI 96822',
        latitude: 21.2999,
        longitude: -157.8190,
        hasOutlets: true,
        hasParking: false,
        hasFoodDrinks: true,
        maxGroupSize: 4,
        type: 'CAFE',
      },
    }),
  ]);

  console.log('Spots created successfully');

  // Hash password once
  const hashedPassword = await hash('changeme', 10);

  // Create users and profiles
  console.log('Creating users and profiles...');
  const users = [
    {
      email: 'admin@foo.com',
      password: hashedPassword,
      role: 'ADMIN',
      profile: {
        firstName: 'Admin',
        lastName: 'User',
        bio: 'I am the admin',
        picture: 'https://example.com/admin.jpg',
      },
    },
    {
      email: 'john@foo.com',
      password: hashedPassword,
      role: 'USER',
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Regular user',
        picture: 'https://example.com/john.jpg',
      },
    },
  ];

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        password: userData.password,
        role: userData.role,
      },
    });

    await prisma.profile.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        firstName: userData.profile.firstName,
        lastName: userData.profile.lastName,
        bio: userData.profile.bio,
        picture: userData.profile.picture,
      },
    });

    // Create some sample reviews
    if (spots.length > 0) {
      await prisma.review.create({
        data: {
          rating: 4,
          comment: 'Great study spot!',
          userId: user.id,
          spotId: spots[0].id,
        },
      });
    }
  }

  console.log('Seeding completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
