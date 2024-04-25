let posts = JSON.stringify({
  sent: [],
  received: [],
});

posts2 = JSON.parse(posts);
posts2.received.push({ asd: "asd", fff: "fff" });
posts = JSON.stringify(posts2);
posts2 = JSON.parse(posts);
posts2.received.push({ asd: "asd", fff: "fff" });
posts = JSON.stringify(posts2);
posts2 = JSON.parse(posts);
posts2.received.push({ asd: "asd", fff: "fff" });
posts = JSON.stringify(posts2);

console.log(posts);
