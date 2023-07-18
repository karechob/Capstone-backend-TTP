const db = require("./db");
const { User, Trip, Activity, Hotel, Flight } = require("./db/models");

const seed = async () => {
  try {
    await db.sync();
    const salt = await User.generateSalt();

    const user1 = await User.create({
      name: "John Doe",
      username: "johndoe",
      email: "john@example.com",
      password: "Password11**",
      salt: salt,
    });

    const user2 = await User.create({
      name: "Jane Smith",
      username: "janesmith",
      email: "jane@example.com",
      password: "Password22**",
      salt: salt,
    });

    const user3 = await User.create({
      name: "John Smith",
      username: "johnsmith",
      email: "johnsmith@example.com",
      password: "Password33**",
      salt: salt,
      isAdmin: true,
    });

    const trip1 = await Trip.create({
      origin: "City A",
      destination: "City B",
      budget: 1000,
      isCurrent: true,
      name: "Trip 1",
      weather: "Sunny",
      duration: 7,
      ownerId: 1,
    });
    const trip2 = await Trip.create({
      origin: "City C",
      destination: "City D",
      budget: 2000,
      isCurrent: false,
      name: "Trip 2",
      weather: "Cloudy",
      duration: 5,
      ownerId: 2,
    });

    const activity1 = await Activity.create({
      name: "Activity 1",
      cost: 50,
    });
    const activity2 = await Activity.create({
      name: "Activity 2",
      cost: 100,
    });

    // const flight1 = await FlightDetails.create({
    //   airline: "Airline A",
    //   cost: 200,
    //   link: "https://airlineA.com",
    //   tripId: trip1.id,
    // });
    // const flight2 = await FlightDetails.create({
    //   airline: "Airline B",
    //   cost: 300,
    //   link: "https://airlineB.com",
    //   tripId: trip2.id,
    // });

    // // Create sample hotel details
    // const hotel1 = await HotelDetails.create({
    //   name: "Hotel A",
    //   cost: 100,
    //   link: "https://hotelA.com",
    //   tripId: trip1.id,
    // });
    // const hotel2 = await HotelDetails.create({
    //   name: "Hotel B",
    //   cost: 150,
    //   link: "https://hotelB.com",
    //   tripId: trip2.id,
    // });

    const flight1 = await Flight.create({
      airline: "Airline A",
      cost: 200,
      link: "https://airlineA.com",
    });
    const flight2 = await Flight.create({
      airline: "Airline B",
      cost: 300,
      link: "https://airlineB.com",
    });

    const hotel1 = await Hotel.create({
      name: "Hotel A",
      cost: 100,
      link: "https://hotelA.com",
    });
    const hotel2 = await Hotel.create({
      name: "Hotel B",
      cost: 150,
      link: "https://hotelB.com",
    });

    await trip1.addUser(user1);
    await trip1.addUser(user2);
    await trip2.addUser(user1);
    await trip2.addUser(user3);

    await trip1.addActivity(activity1);
    await trip1.addActivity(activity2);
    await trip2.addActivity(activity2);

    await trip1.setFlight(flight1);
    await trip2.setFlight(flight2);

    await trip1.setHotel(hotel1);
    await trip2.setHotel(hotel2);

    console.log("Seed data created successfully!");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    await db.close();
  }
};

seed();
