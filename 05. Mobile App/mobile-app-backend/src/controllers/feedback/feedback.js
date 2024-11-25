export const feedback = (req, res, next) => {
  console.log("FB");
  const TESTIMONIALS = [
    {
      id: 1,
      name: "Edlin Noar",
      userType: "Bus Owner",
      rating: 4.9,
      note: "Fusce consequat. Nulla nisl. Nunc nisl.",
    },
    {
      id: 2,
      name: "Clyde McGeachey",
      userType: "Employee",
      rating: 3.8,
      note: "Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.\nSuspendisse potenti. Cras in purus eu magna vulputate luctus.\n\nCum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
    },
    {
      id: 3,
      name: "Bengt Wozencroft",
      userType: "Bus Owner",
      rating: 2.6,
      note: "In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.\n\nMaecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.",
    },
    {
      id: 4,
      name: "Marsha Kuhnhardt",
      userType: "Employee",
      rating: 3.5,
      note: "In congue. Etiam justo. Etiam pretium iaculis justo.\n\nIn hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.\n\nNulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.",
    },
    {
      id: 5,
      name: "Martica Folder",
      userType: "Passenger",
      rating: 0.7,
      note: "Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.\n\nMorbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.",
    },
    {
      id: 6,
      name: "Giff Pepperd",
      userType: "Passenger",
      rating: 4.9,
      note: "Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.\n\nPellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.\n\nCum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
    },
    {
      id: 7,
      name: "Nady Bothie",
      userType: "Passenger",
      rating: 2.3,
      note: "Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
    },
    {
      id: 8,
      name: "Kristy McCleary",
      userType: "Passenger",
      rating: 0.7,
      note: "Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.",
    },
    {
      id: 9,
      name: "Sloane Matyushonok",
      userType: "Passenger",
      rating: 4.4,
      note: "Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.\n\nIn quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.\n\nMaecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.",
    },
    {
      id: 10,
      name: "Demetris Preist",
      userType: "Employee",
      rating: 1.0,
      note: "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.\n\nMorbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
    },
  ];

  console.log("Requesting feedbacks");
  res.json(TESTIMONIALS);
};
