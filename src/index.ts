import User from "./models/User";

function main() {
  const user1 = new User('Aalind');
  const user2 = new User('Anushree');

  user1.createDocument('doc1');

  const doc1 = user1.fetchDocument('doc1');
  doc1.appendContent('This is initial commit in doc1', user1.getUserId());
  doc1.appendContent('This is commit2 in doc1', user1.getUserId());
  doc1.appendContent('doc1 is working as expected', user1.getUserId());
  doc1.appendContent('Granting access to a new user', user1.getUserId());

  const content1 = doc1.getContent(user1.getUserId());
  console.log(content1);
  user1.grantReadAccess('doc1', user2.getUserId());
  const content2 = doc1.getContent(user2.getUserId());
  console.log(content2);

  user1.grantWriteAccess('doc1', user2.getUserId());
  doc1.appendContent('first commit from a new user', user2.getUserId());
}

main();
