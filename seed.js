const db = require("./db");
const { User, Trip, Activity, Hotel, Flight } = require("./db/models");
const Collaborator = require("./db/models/collaborator");

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
      startDate: new Date("2023-07-15"),
      endDate: new Date("2023-07-22"),
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
      startDate: new Date("2023-07-20"),
      endDate: new Date("2023-07-25"),
      duration: 5,
      ownerId: 2,
    });

    const trip3 = await Trip.create({
      origin: "City E",
      destination: "City F",
      budget: 3000,
      isCurrent: false,
      name: "Trip 3",
      weather: "Rainy",
      startDate: new Date("2023-07-30"),
      endDate: new Date("2023-08-02"),
      duration: 3,
      ownerId: 3,
    });

    const activity1 = await Activity.create({
      name: "Activity 1",
      cost: 50,
    });
    const activity2 = await Activity.create({
      name: "Activity 2",
      cost: 100,
    });
    const activity3 = await Activity.create({
      name: "Activity 3",
      cost: 150,
    });

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
    const flight3 = await Flight.create({
      airline: "Airline C",
      cost: 400,
      link: "https://airlineC.com",
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
    const hotel3 = await Hotel.create({
      name: "Hotel C",
      cost: 200,
      link: "https://hotelC.com",
    });

    const collaborator1 = await Collaborator.create({
      name: "John Doe",
      username: "johndoe",
      email: "john@example.com",
    });

    const collaborator2 = await Collaborator.create({
      name: "Jane Smith",
      username: "janesmith",
      email: "jane@example.com",
    });
    const collaborator3 = await Collaborator.create({
      name: "John Smith",
      username: "johnsmith",
      email: "johnsmith@example.com",
    });

    await trip1.addCollaborator(collaborator1);
    await trip1.addCollaborator(collaborator2);
    await trip1.addCollaborator(collaborator3);

    await trip2.addCollaborator(collaborator1);
    await trip2.addCollaborator(collaborator2);
    await trip2.addCollaborator(collaborator3);

    await trip3.addCollaborator(collaborator1);
    await trip3.addCollaborator(collaborator2);
    await trip3.addCollaborator(collaborator3);

    await trip1.addActivity(activity1);
    await trip1.addActivity(activity2);
    await trip2.addActivity(activity2);
    await trip3.addActivity(activity3);
    await trip3.addActivity(activity2);
    await trip3.addActivity(activity1);

    await trip1.setFlight(flight1);
    await trip2.setFlight(flight2);
    await trip3.setFlight(flight3);

    await trip1.setHotel(hotel1);
    await trip2.setHotel(hotel2);
    await trip3.setHotel(hotel3);

    console.log("Seed data created successfully!");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    await db.close();
  }
};

seed();
