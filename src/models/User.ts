import { randomUUID } from "crypto";
import Document from "./Document";

export default class User {
  userId: string;
  userName: string;
  documents: Map<string, Document> = new Map();

  constructor(name: string) {
    this.userId = randomUUID();
    this.userName = name;
  }

  getUserId() {
    return this.userId;
  }
  getUserName() {
    return this.userName;
  }

  setUserName(name: string) {
    this.userName = name;
    return this;
  }

  createDocument(docName: string) {
    if (this.documents.has(docName)) {
      throw new Error('Document with the name ' + docName + ' already exists');
    }

    const doc = new Document(docName, this.userId);
    this.documents.set(docName, doc);
  }

  fetchDocument(docName: string) {
    if (!this.documents.has(docName)) {
      throw new Error('No document found');
    }
    return this.documents.get(docName) as Document;
  }

  grantReadAccess(docName: string, userId: string) {
    const _doc = this.fetchDocument(docName);
    _doc.setReadAccessToUser(userId, this.userId);
  }
  grantWriteAccess(docName: string, userId: string) {
    const _doc = this.fetchDocument(docName);
    _doc.setWriteAccessToUser(userId, this.userId);
  }
  revokeUserAccess(
    docName: string,
    userId: string,
    deleteUsersContent = false
  ) {
    const _doc = this.fetchDocument(docName);
    _doc.revokeUserAccess(userId, this.userId);
    if (deleteUsersContent) {
      this.deleteUsersContent(docName, userId);
    }
  }

  deleteUsersContent(docName: string, userId: string) {
    const _doc = this.fetchDocument(docName);
    _doc.deleteUsersContent(userId, this.userId);
  }
}
