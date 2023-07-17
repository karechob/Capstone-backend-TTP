const db = require("./db");
const {
  User,
  Trip,
  Activity,
  HotelDetails,
  FlightDetails,
} = require("./db/models");

const seed = async () => {
  try {
    await db.sync({ force: true });

    const user1 = await User.create({
      name: "John Doe",
      username: "johndoe",
      email: "john@example.com",
      password: "Password11**",
    });
      
    const user2 = await User.create({
      name: "Jane Smith",
      username: "janesmith",
      email: "jane@example.com",
      password: "Password22**",
    });

    const trip1 = await Trip.create({
      origin: "City A",
      destination: "City B",
      budget: 1000,
      isCurrent: true,
      name: "Trip 1",
      weather: "Sunny",
      duration: 7,
    });
    const trip2 = await Trip.create({
      origin: "City C",
      destination: "City D",
      budget: 2000,
      isCurrent: false,
      name: "Trip 2",
      weather: "Cloudy",
      duration: 5,
    });

    await trip1.addUser(user1);
    await trip1.addUser(user2);
    await trip2.addUser(user1);

    const activity1 = await Activity.create({
      name: "Activity 1",
      cost: 50,
    });
    const activity2 = await Activity.create({
      name: "Activity 2",
      cost: 100,
    });

    await trip1.addActivity(activity1);
    await trip1.addActivity(activity2);
    await trip2.addActivity(activity2);

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

    const flight1 = await FlightDetails.create({
      airline: "Airline A",
      cost: 200,
      link: "https://airlineA.com",
    });
    const flight2 = await FlightDetails.create({
      airline: "Airline B",
      cost: 300,
      link: "https://airlineB.com",
    });

    await trip1.setFlightDetails(flight1);
    await trip2.setFlightDetails(flight2);

    const hotel1 = await HotelDetails.create({
      name: "Hotel A",
      cost: 100,
      link: "https://hotelA.com",
    });
    const hotel2 = await HotelDetails.create({
      name: "Hotel B",
      cost: 150,
      link: "https://hotelB.com",
    });

    await trip1.setHotelDetails(hotel1);
    await trip2.setHotelDetails(hotel2);

    console.log("Seed data created successfully!");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    await db.close();
  }
};
